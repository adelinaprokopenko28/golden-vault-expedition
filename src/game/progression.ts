import {CHAMBERS_PER_LAYER, LOCK_LENGTH_BY_LAYER, MAX_LAYER} from '../constants/config';
import {completedSets} from './artifacts';
import {clearedCount} from './expedition';
import type {Outcome, Run, RunSummary, VaultSave} from './types';

export type LayerState = 'cleared' | 'open' | 'sealed';

export interface LayerRow {
  layer: number;
  chambers: number;
  lockLength: number;
  state: LayerState;
  current: boolean;
}

export function layerLadder(save: VaultSave): LayerRow[] {
  const rows: LayerRow[] = [];
  for (let layer = 1; layer <= MAX_LAYER; layer++) {
    const state: LayerState =
      layer < save.deepestLayer ? 'cleared' : layer === save.deepestLayer ? 'open' : 'sealed';
    rows.push({
      layer,
      chambers: CHAMBERS_PER_LAYER[layer - 1],
      lockLength: LOCK_LENGTH_BY_LAYER[layer - 1],
      state,
      current: layer === save.deepestLayer,
    });
  }
  return rows;
}

export function unlockAfter(save: VaultSave, run: Run, outcome: Outcome): number | null {
  if (outcome !== 'cleared') {
    return null;
  }
  if (run.layer !== save.deepestLayer) {
    return null;
  }
  if (save.deepestLayer >= MAX_LAYER) {
    return null;
  }
  return save.deepestLayer + 1;
}

/** Folds a finished run into the save and produces the summary the Results screen reads. */
export function finishRun(
  save: VaultSave,
  run: Run,
  outcome: Outcome,
): {save: VaultSave; summary: RunSummary} {
  const unlocked = unlockAfter(save, run, outcome);
  const nextSave: VaultSave = {
    ...save,
    deepestLayer: unlocked !== null ? unlocked : save.deepestLayer,
    runCount: save.runCount + 1,
    stats: {
      expeditions: save.stats.expeditions + 1,
      locksCracked: save.stats.locksCracked + run.locksCracked,
      firstTryCracks: save.stats.firstTryCracks + run.firstTryCracks,
      torchesSpent: save.stats.torchesSpent + run.torchesSpent,
      bestHaul: Math.max(save.stats.bestHaul, run.haul.length),
    },
  };
  const summary: RunSummary = {
    outcome,
    layer: run.layer,
    depth: clearedCount(run),
    total: run.chambers.length,
    locksCracked: run.locksCracked,
    firstTryCracks: run.firstTryCracks,
    torchesLeft: run.torches,
    haul: run.haul.slice(),
    completedSets: completedSets(nextSave.artifacts),
    layerUnlocked: unlocked,
  };
  return {save: nextSave, summary};
}

export const OUTCOME_COPY: Record<Outcome, {title: string; sub: string}> = {
  cleared: {title: 'LAYER CLEARED', sub: 'THE VAULT SEALS BEHIND YOU'},
  torches_out: {title: 'TORCHES OUT', sub: 'HAULED BACK TO THE SURFACE'},
  abandoned: {title: 'RETREAT LOGGED', sub: 'YOU KEPT WHAT YOU CARRIED'},
};
