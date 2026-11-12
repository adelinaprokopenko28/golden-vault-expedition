import {CHAMBER_NAMES, TIER_LABEL} from '../constants/config';
import {clampLockLength} from './lock';
import {mulberry32, randInt, type Rng} from './rng';
import type {Chamber, Door, DoorEffect, Run, Tier} from './types';

const TIERS: Tier[] = ['safe', 'unstable', 'sealed'];

const TIER_EFFECT: Record<Tier, DoorEffect> = {
  safe: 'cache',
  unstable: 'skip',
  sealed: 'extend',
};

const TIER_RARITY_BIAS: Record<Tier, number> = {
  safe: 0,
  unstable: 5,
  sealed: 10,
};

export function effectLabel(door: Door): string {
  if (door.effect === 'cache') {
    return '+' + door.cache + ' TORCH CACHE';
  }
  if (door.effect === 'skip') {
    return 'SKIPS ONE CHAMBER';
  }
  return 'ADDS ONE CHAMBER · +' + door.cache + ' TORCH CACHE';
}

export function chamberName(rng: Rng, index: number): string {
  const offset = randInt(rng, 0, CHAMBER_NAMES.length - 1);
  return CHAMBER_NAMES[(index + offset) % CHAMBER_NAMES.length];
}

/**
 * 2-3 doors per junction, generated from the chamber stream. Every door shifts
 * the next chamber: lock length, entry cost, rarity and the path length itself.
 */
export function generateDoors(seed: number, currentLockLength: number): Door[] {
  const rng = mulberry32(seed);
  const count = randInt(rng, 2, 3);
  const tiers = TIERS.slice(0, count);
  return tiers.map((tier, i) => {
    const deltaByTier = tier === 'safe' ? -1 : tier === 'unstable' ? 0 : 1;
    const lockLength = clampLockLength(currentLockLength + deltaByTier);
    const entryCost = tier === 'safe' ? 0 : tier === 'unstable' ? 1 : 2;
    const cache = tier === 'safe' ? randInt(rng, 1, 2) : tier === 'sealed' ? 1 : 0;
    return {
      id: 'door-' + i + '-' + tier,
      tier,
      name: TIER_LABEL[tier],
      lockLength,
      entryCost,
      effect: TIER_EFFECT[tier],
      cache,
      rarityBias: TIER_RARITY_BIAS[tier],
    };
  });
}

function makeChamber(index: number, door: Door, name: string): Chamber {
  return {
    index,
    name,
    lockLength: door.lockLength,
    entryCost: door.entryCost,
    tier: door.tier,
    state: 'locked',
    artifact: null,
  };
}

/**
 * Applies the chosen door to the run: the next chamber is rewritten, torches
 * from the cache are added, and `skip` / `extend` change the remaining path.
 */
export function applyDoor(run: Run, door: Door): Run {
  const chambers = run.chambers.map(c => ({...c}));
  const next = run.chamberIndex + 1;
  const rng = mulberry32(
    (run.seed ^ (door.lockLength * 7919) ^ (next * 104729)) >>> 0,
  );

  if (door.effect === 'skip' && next < chambers.length - 1) {
    chambers[next].state = 'skipped';
  }

  if (door.effect === 'extend') {
    const appended = makeChamber(
      chambers.length,
      door,
      chamberName(rng, chambers.length),
    );
    chambers.push(appended);
  }

  const target = chambers.findIndex(
    (c, i) => i >= next && c.state === 'locked',
  );
  if (target >= 0) {
    chambers[target] = {
      ...chambers[target],
      lockLength: door.lockLength,
      entryCost: door.entryCost,
      tier: door.tier,
    };
  }

  return {
    ...run,
    chambers,
    torches: run.torches + door.cache,
    maxTorches: Math.max(run.maxTorches, run.torches + door.cache),
    doors: [],
  };
}

/** Index of the next chamber that is still playable, or -1 when the layer is finished. */
export function nextPlayableIndex(run: Run): number {
  for (let i = run.chamberIndex; i < run.chambers.length; i++) {
    if (run.chambers[i].state === 'locked' || run.chambers[i].state === 'current') {
      return i;
    }
  }
  return -1;
}
