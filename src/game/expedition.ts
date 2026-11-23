import {
  TORCHES_START,
  TORCH_MAX,
  TORCH_REWARD_CRACK,
  TORCH_REWARD_CLEAN,
  CLEAN_CRACK_ATTEMPTS,
  CHAMBERS_PER_LAYER,
  MAX_ATTEMPT_ROWS,
  MAX_LAYERS,
  GameSettings,
  DEFAULT_SETTINGS,
} from '../constants/config';
import { Rng, makeSeed } from './rng';
import {
  generateChamber,
  evaluate,
  isCracked,
  defaultGuess,
  advanceDigit,
  pickReveal,
} from './lock';
import { rollRoutes, routeByKey } from './routes';
import { rollArtifact, setComplete } from './artifacts';
import { computeScore, stepMultiplier } from './scoring';
import { stepFor } from './layers';
import { clamp } from '../utils/format';
import {
  Attempt,
  ChamberSpec,
  NodeState,
  PipKind,
  RouteCounts,
  RouteKey,
  RouteOption,
  RunStatus,
  RunSummary,
} from './types';

export interface RunState {
  seed: number;
  attemptIndex: number;
  layer: number;
  chamberIndex: number;
  chambersCracked: number;
  torches: number;
  multiplier: number;
  deepBoost: number;
  routeStepDelta: number;
  chamber: ChamberSpec | null;
  guess: number[];
  attempts: Attempt[];
  chamberAttempts: number;
  revealed: number[];
  carried: string[];
  owned: Record<string, boolean>;
  cleanCracks: number;
  totalAttempts: number;
  torchesBurned: number;
  routes: RouteOption[];
  selectedRoute: RouteKey | null;
  routeCounts: RouteCounts;
  status: RunStatus;
  banner: string | null;
  resolving: boolean;
  shakeTick: number;
  crackTick: number;
  setCompleted: number | null;
  summary: RunSummary | null;
  settings: GameSettings;
}

export type RunAction =
  | {
      type: 'START_RUN';
      layer: number;
      attemptIndex: number;
      settings: GameSettings;
      owned: Record<string, boolean>;
    }
  | { type: 'SELECT_ROUTE'; key: RouteKey }
  | { type: 'ENTER_CHAMBER' }
  | { type: 'TAP_DIAL'; slot: number }
  | { type: 'SUBMIT' }
  | { type: 'RESOLVE_DONE' }
  | { type: 'BURN_TORCH' }
  | { type: 'BURN_DOWN' }
  | { type: 'CLEAR_BANNER' };

function mixSeed(base: number, salt: number): number {
  return ((base ^ Math.imul(salt + 1, 2654435761)) >>> 0) || 1;
}

export function nodeStatesFor(chamberIndex: number, cracked: number): NodeState[] {
  const out: NodeState[] = [];
  for (let i = 0; i < CHAMBERS_PER_LAYER; i++) {
    out.push(i < cracked ? 'cleared' : i === chamberIndex ? 'current' : 'locked');
  }
  return out;
}

/** The first chamber of a run needs no route; every later one does. */
export function routeRequired(state: RunState): boolean {
  return state.chamberIndex > 0;
}

export function canEnterChamber(state: RunState): boolean {
  return state.status === 'map' && (!routeRequired(state) || state.selectedRoute !== null);
}

export function effectiveMultiplier(state: RunState): number {
  return state.multiplier * state.deepBoost;
}

export function createRun(
  layer: number,
  attemptIndex: number,
  settings: GameSettings,
  owned: Record<string, boolean>,
): RunState {
  const startLayer = clamp(layer, 1, MAX_LAYERS);
  const seed = makeSeed(startLayer, attemptIndex);
  return {
    seed,
    attemptIndex,
    layer: startLayer,
    chamberIndex: 0,
    chambersCracked: 0,
    torches: TORCHES_START,
    multiplier: 1,
    deepBoost: 1,
    routeStepDelta: 0,
    chamber: null,
    guess: [],
    attempts: [],
    chamberAttempts: 0,
    revealed: [],
    carried: [],
    owned: Object.assign({}, owned),
    cleanCracks: 0,
    totalAttempts: 0,
    torchesBurned: 0,
    routes: rollRoutes(new Rng(mixSeed(seed, 100))),
    selectedRoute: null,
    routeCounts: { safe: 0, rich: 0, deep: 0 },
    status: 'map',
    banner: null,
    resolving: false,
    shakeTick: 0,
    crackTick: 0,
    setCompleted: null,
    summary: null,
    settings,
  };
}

export const EMPTY_RUN: RunState = createRun(1, 0, DEFAULT_SETTINGS, {});

function summarise(state: RunState, outcome: 'won' | 'lost'): RunSummary {
  return {
    outcome,
    layer: state.layer,
    chamberIndex: state.chamberIndex,
    chambersCracked: state.chambersCracked,
    torchesLeft: Math.max(0, state.torches),
    cleanCracks: state.cleanCracks,
    attempts: state.totalAttempts,
    multiplier: effectiveMultiplier(state),
    carried: state.carried.slice(),
    score: computeScore({
      carried: state.carried,
      chambersCracked: state.chambersCracked,
      torchesLeft: Math.max(0, state.torches),
      multiplier: effectiveMultiplier(state),
      settings: state.settings,
    }),
    setCompleted: state.setCompleted,
  };
}

function finish(state: RunState, outcome: 'won' | 'lost'): RunState {
  return Object.assign({}, state, {
    status: outcome,
    resolving: false,
    banner: null,
    summary: summarise(state, outcome),
  });
}

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'START_RUN':
      return createRun(action.layer, action.attemptIndex, action.settings, action.owned);

    case 'SELECT_ROUTE': {
      if (state.status !== 'map') {
        return state;
      }
      return Object.assign({}, state, { selectedRoute: action.key });
    }

    case 'ENTER_CHAMBER': {
      if (!canEnterChamber(state)) {
        return state;
      }
      const route = routeByKey(state.routes, state.selectedRoute);
      let torches = state.torches;
      let layer = state.layer;
      let stepDelta = state.routeStepDelta;
      let deepBoost = state.deepBoost;
      const counts = Object.assign({}, state.routeCounts);

      if (route) {
        torches = clamp(torches + route.torches, 0, TORCH_MAX);
        layer = clamp(layer + route.layerDelta, 1, MAX_LAYERS);
        stepDelta = stepDelta + route.stepDelta;
        deepBoost = deepBoost * route.multiplierBoost;
        counts[route.key] = counts[route.key] + 1;
      }

      const step = stepFor(layer, stepDelta, state.settings.expertLocks);
      const rng = new Rng(mixSeed(state.seed, layer * 17 + state.chamberIndex));
      const chamber = generateChamber(rng, layer, state.chamberIndex, step);

      const next = Object.assign({}, state, {
        torches,
        layer,
        routeStepDelta: stepDelta,
        deepBoost,
        routeCounts: counts,
        chamber,
        guess: defaultGuess(chamber),
        attempts: [],
        chamberAttempts: 0,
        revealed: [],
        status: 'chamber' as RunStatus,
        banner: null,
        resolving: false,
      });

      return torches <= 0 ? finish(next, 'lost') : next;
    }

    case 'TAP_DIAL': {
      if (state.status !== 'chamber' || state.resolving || !state.chamber) {
        return state;
      }
      if (state.revealed.indexOf(action.slot) >= 0) {
        return state;
      }
      const guess = state.guess.slice();
      guess[action.slot] = advanceDigit(
        guess[action.slot],
        state.chamber.digitMin,
        state.chamber.digitMax,
      );
      return Object.assign({}, state, { guess });
    }

    case 'SUBMIT': {
      const chamber = state.chamber;
      if (state.status !== 'chamber' || state.resolving || !chamber) {
        return state;
      }
      const pips: PipKind[] = evaluate(state.guess, chamber.code, chamber.rusted);
      const attempt: Attempt = {
        id: state.totalAttempts + 1,
        digits: state.guess.slice(),
        pips,
      };
      const attempts = [attempt].concat(state.attempts).slice(0, MAX_ATTEMPT_ROWS);
      const chamberAttempts = state.chamberAttempts + 1;
      const torches = state.torches - 1;

      const base = Object.assign({}, state, {
        attempts,
        chamberAttempts,
        totalAttempts: state.totalAttempts + 1,
        torchesBurned: state.torchesBurned + 1,
        torches,
        resolving: true,
      });

      if (!isCracked(pips)) {
        const missed = Object.assign({}, base, {
          shakeTick: state.shakeTick + 1,
          banner: null,
        });
        return torches <= 0 ? finish(missed, 'lost') : missed;
      }

      const clean = chamberAttempts <= CLEAN_CRACK_ATTEMPTS;
      const rng = new Rng(mixSeed(state.seed, 400 + state.chamberIndex * 7 + state.layer));
      const route = routeByKey(state.routes, state.selectedRoute);
      const artifact = rollArtifact(
        rng,
        state.layer,
        route ? route.rarityBias : 'common',
        state.owned,
      );
      const owned = Object.assign({}, state.owned);
      owned[artifact.id] = true;

      return Object.assign({}, base, {
        torches: clamp(
          torches + (clean ? TORCH_REWARD_CLEAN : TORCH_REWARD_CRACK),
          0,
          TORCH_MAX,
        ),
        chambersCracked: state.chambersCracked + 1,
        cleanCracks: state.cleanCracks + (clean ? 1 : 0),
        multiplier: stepMultiplier(state.multiplier, clean),
        carried: state.carried.concat([artifact.id]),
        owned,
        setCompleted: setComplete(owned, state.layer) ? state.layer : state.setCompleted,
        status: 'cleared' as RunStatus,
        banner: clean ? 'CLEAN CRACK · SEAL BROKEN' : 'SEAL BROKEN',
        crackTick: state.crackTick + 1,
      });
    }

    case 'RESOLVE_DONE':
      return state.resolving ? Object.assign({}, state, { resolving: false }) : state;

    case 'BURN_TORCH': {
      const chamber = state.chamber;
      if (state.status !== 'chamber' || state.resolving || !chamber) {
        return state;
      }
      if (state.torches <= 1) {
        return state;
      }
      const slot = pickReveal(chamber, state.revealed, state.attempts);
      if (slot < 0) {
        return state;
      }
      const guess = state.guess.slice();
      guess[slot] = chamber.code[slot];
      return Object.assign({}, state, {
        guess,
        revealed: state.revealed.concat([slot]),
        torches: state.torches - 1,
        torchesBurned: state.torchesBurned + 1,
        banner: 'DIAL ' + (slot + 1) + ' REVEALED',
      });
    }

    case 'BURN_DOWN': {
      if (state.status !== 'chamber') {
        return state;
      }
      const torches = state.torches - 1;
      const burned = Object.assign({}, state, {
        torches,
        torchesBurned: state.torchesBurned + 1,
        banner: 'A TORCH BURNED OUT',
      });
      return torches <= 0 ? finish(burned, 'lost') : burned;
    }

    case 'CLEAR_BANNER': {
      if (state.status !== 'cleared') {
        return state.banner ? Object.assign({}, state, { banner: null }) : state;
      }
      if (state.chambersCracked >= CHAMBERS_PER_LAYER) {
        return finish(state, 'won');
      }
      const nextIndex = state.chamberIndex + 1;
      return Object.assign({}, state, {
        chamberIndex: nextIndex,
        chamber: null,
        guess: [],
        attempts: [],
        chamberAttempts: 0,
        revealed: [],
        selectedRoute: null,
        routes: rollRoutes(new Rng(mixSeed(state.seed, 100 + nextIndex * 13))),
        status: 'map' as RunStatus,
        banner: null,
        resolving: false,
      });
    }

    default:
      return state;
  }
}
