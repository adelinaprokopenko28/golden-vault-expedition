import {
  BASE_TORCHES,
  CHAMBERS_PER_LAYER,
  DEPTH_STEP_M,
  LOCK_LENGTH_BY_LAYER,
  MAX_LAYER,
  MAX_START_TORCHES,
} from '../constants/config';
import {clampLockLength, earnsRefund} from './lock';
import {chamberName, nextPlayableIndex} from './routes';
import {chamberSeed, mulberry32, randInt, runSeed} from './rng';
import type {
  Chamber,
  Outcome,
  Perks,
  Run,
  SetId,
  Tier,
  VaultSave,
} from './types';

export function layerIndex(layer: number): number {
  return Math.max(0, Math.min(MAX_LAYER - 1, layer - 1));
}

export function chambersForLayer(layer: number): number {
  return CHAMBERS_PER_LAYER[layerIndex(layer)];
}

export function lockLengthForLayer(layer: number): number {
  return LOCK_LENGTH_BY_LAYER[layerIndex(layer)];
}

export function startingTorches(layer: number, perks: Perks): number {
  const base = Math.min(MAX_START_TORCHES, BASE_TORCHES + (layer - 1));
  return base + (perks.lantern ? 1 : 0);
}

const ENTRY_TIERS: Tier[] = ['safe', 'unstable', 'sealed'];

/** Builds the chamber chain of a layer. Placement comes from the seed. */
export function buildChambers(layer: number, seed: number): Chamber[] {
  const count = chambersForLayer(layer);
  const baseLock = lockLengthForLayer(layer);
  const chambers: Chamber[] = [];
  for (let i = 0; i < count; i++) {
    const rng = mulberry32(chamberSeed(seed, i, 11));
    const tier: Tier = i === 0 ? 'safe' : ENTRY_TIERS[randInt(rng, 0, 2)];
    const drift = i === 0 ? 0 : randInt(rng, -1, 1);
    chambers.push({
      index: i,
      name: chamberName(rng, i),
      lockLength: clampLockLength(baseLock + drift),
      entryCost: i === 0 ? 0 : tier === 'safe' ? 0 : tier === 'unstable' ? 1 : 2,
      tier,
      state: i === 0 ? 'current' : 'locked',
      artifact: null,
    });
  }
  return chambers;
}

export function createRun(save: VaultSave, perks: Perks): Run {
  const layer = Math.max(1, Math.min(MAX_LAYER, save.deepestLayer));
  const seed = runSeed(layer, save.runCount);
  const torches = startingTorches(layer, perks);
  return {
    layer,
    seed,
    torches,
    maxTorches: torches,
    chambers: buildChambers(layer, seed),
    chamberIndex: 0,
    haul: [],
    locksCracked: 0,
    firstTryCracks: 0,
    torchesSpent: 0,
    doors: [],
    outcome: null,
  };
}

export function currentChamber(run: Run): Chamber {
  const idx = Math.max(0, Math.min(run.chambers.length - 1, run.chamberIndex));
  return run.chambers[idx];
}

export function clearedCount(run: Run): number {
  return run.chambers.filter(c => c.state === 'cleared').length;
}

export function depthMetres(run: Run): number {
  return (clearedCount(run) + 1) * DEPTH_STEP_M;
}

export function layerFinished(run: Run): boolean {
  return nextPlayableIndex(run) < 0;
}

/** True while a chamber below the current one is still locked. */
export function hasNextChamber(run: Run): boolean {
  return run.chambers.some((c, i) => i > run.chamberIndex && c.state === 'locked');
}

export function spendTorches(run: Run, amount: number): Run {
  const spent = Math.max(0, Math.min(run.torches, amount));
  return {
    ...run,
    torches: run.torches - spent,
    torchesSpent: run.torchesSpent + spent,
  };
}

export function addTorches(run: Run, amount: number): Run {
  const torches = run.torches + amount;
  return {...run, torches, maxTorches: Math.max(run.maxTorches, torches)};
}

/** Pays the entry cost. Returns null unless at least one torch survives the entry. */
export function enterChamber(run: Run): Run | null {
  const chamber = currentChamber(run);
  if (run.torches - chamber.entryCost < 1) {
    return null;
  }
  return spendTorches(run, chamber.entryCost);
}

export interface CrackOptions {
  guessesUsed: number;
  perks: Perks;
  artifact: SetId | null;
  bonusTorches: number;
}

/** Marks the current chamber cracked, applies the refund and the drop. */
export function crackChamber(run: Run, options: CrackOptions): Run {
  const chambers = run.chambers.map(c => ({...c}));
  const idx = Math.max(0, Math.min(chambers.length - 1, run.chamberIndex));
  chambers[idx].state = 'cleared';
  chambers[idx].artifact = options.artifact;

  const efficient = earnsRefund(
    options.guessesUsed,
    chambers[idx].lockLength,
    options.perks.relic,
  );

  let next: Run = {
    ...run,
    chambers,
    locksCracked: run.locksCracked + 1,
    firstTryCracks: run.firstTryCracks + (efficient ? 1 : 0),
    haul: options.artifact ? run.haul.concat(options.artifact) : run.haul,
  };
  if (efficient) {
    next = addTorches(next, 1);
  }
  if (options.bonusTorches > 0) {
    next = addTorches(next, options.bonusTorches);
  }
  return next;
}

/** Moves the pointer to the next playable chamber. */
export function advance(run: Run): Run {
  const idx = nextPlayableIndex({...run, chamberIndex: run.chamberIndex + 1});
  if (idx < 0) {
    return {...run, chamberIndex: run.chambers.length};
  }
  const chambers = run.chambers.map((c, i) =>
    i === idx ? {...c, state: 'current' as const} : c,
  );
  return {...run, chambers, chamberIndex: idx};
}

export function resolveOutcome(run: Run): Outcome | null {
  if (layerFinished(run)) {
    return 'cleared';
  }
  if (run.torches <= 0) {
    return 'torches_out';
  }
  return null;
}
