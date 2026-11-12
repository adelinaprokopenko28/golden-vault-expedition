import {
  ASSIST_OFF_BONUS,
  BASE_CHANCE,
  CROWN_SEALED_BONUS,
  INTEL_OFF_BONUS,
  SET_ORDER,
  SET_PIECES,
} from '../constants/config';
import {weightedIndex, type Rng} from './rng';
import type {Perks, SetId, Settings, Tier} from './types';

export interface SetDef {
  id: SetId;
  name: string;
  spriteIndex: number;
  weight: number;
  perk: string;
  pieces: string[];
}

export const SETS: SetDef[] = [
  {
    id: 'lantern',
    name: 'LANTERN KEEPERS',
    spriteIndex: 0,
    weight: 30,
    perk: '+1 STARTING TORCH',
    pieces: ['BRASS WICK', 'OIL RESERVOIR', 'KEEPERS GLASS'],
  },
  {
    id: 'cipher',
    name: 'CIPHER TABLETS',
    spriteIndex: 1,
    weight: 25,
    perk: 'FIRST REVEAL OF A RUN COSTS 1 TORCH',
    pieces: ['NOTCHED SLATE', 'COUNTING ROD', 'WARDENS KEY CARD'],
  },
  {
    id: 'crown',
    name: 'CROWN FRAGMENTS',
    spriteIndex: 2,
    weight: 20,
    perk: '+10 PP FIND CHANCE ON SEALED HALLS',
    pieces: ['GOLD BAND', 'SET STONE', 'FILIGREE ARCH'],
  },
  {
    id: 'relic',
    name: 'DEEP RELICS',
    spriteIndex: 3,
    weight: 15,
    perk: 'REFUND THRESHOLD +1 GUESS',
    pieces: ['SALT IDOL', 'FOSSIL SEAL', 'DEEP CORE'],
  },
  {
    id: 'keys',
    name: 'MASTER KEYS',
    spriteIndex: 4,
    weight: 10,
    perk: 'ONE WHEEL PRE-SET ON THE FIRST CHAMBER',
    pieces: ['WARD BLANK', 'TOOTHED BIT', 'MASTER BOW'],
  },
];

export const SET_BY_ID: Record<SetId, SetDef> = SETS.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {} as Record<SetId, SetDef>);

export function emptyArtifacts(): Record<SetId, number> {
  return {lantern: 0, cipher: 0, crown: 0, relic: 0, keys: 0};
}

export function totalArtifacts(owned: Record<SetId, number>): number {
  return SET_ORDER.reduce((sum, id) => sum + (owned[id] || 0), 0);
}

export function completedSets(owned: Record<SetId, number>): SetId[] {
  return SET_ORDER.filter(id => (owned[id] || 0) >= SET_PIECES);
}

export function perksFrom(owned: Record<SetId, number>): Perks {
  return {
    lantern: (owned.lantern || 0) >= SET_PIECES,
    cipher: (owned.cipher || 0) >= SET_PIECES,
    crown: (owned.crown || 0) >= SET_PIECES,
    relic: (owned.relic || 0) >= SET_PIECES,
    keys: (owned.keys || 0) >= SET_PIECES,
  };
}

/** Find chance in percent for a crack made in a chamber of this tier. */
export function findChance(
  tier: Tier,
  perks: Perks,
  settings: Settings,
  rarityBias: number = 0,
): number {
  let chance = BASE_CHANCE[tier] + rarityBias;
  if (tier === 'sealed' && perks.crown) {
    chance += CROWN_SEALED_BONUS;
  }
  if (!settings.routeIntel) {
    chance += INTEL_OFF_BONUS;
  }
  if (!settings.assistPips) {
    chance += ASSIST_OFF_BONUS;
  }
  return Math.max(0, Math.min(100, chance));
}

export type DropResult =
  | {kind: 'artifact'; setId: SetId}
  | {kind: 'torches'; amount: number}
  | {kind: 'none'};

/**
 * On a hit the set is picked by weight; a complete set falls through to the next
 * incomplete one, and when everything is complete the roll becomes torches.
 */
export function rollArtifact(
  rng: Rng,
  tier: Tier,
  owned: Record<SetId, number>,
  perks: Perks,
  settings: Settings,
  rarityBias: number = 0,
): DropResult {
  const chance = findChance(tier, perks, settings, rarityBias);
  if (rng() * 100 >= chance) {
    return {kind: 'none'};
  }
  const weights = SETS.map(s => ((owned[s.id] || 0) < SET_PIECES ? s.weight : 0));
  const index = weightedIndex(rng, weights);
  if (index < 0) {
    return {kind: 'torches', amount: 2};
  }
  return {kind: 'artifact', setId: SETS[index].id};
}

export function pieceName(setId: SetId, ownedCount: number): string {
  const def = SET_BY_ID[setId];
  const idx = Math.max(0, Math.min(def.pieces.length - 1, ownedCount));
  return def.pieces[idx];
}

export function grantArtifact(
  owned: Record<SetId, number>,
  setId: SetId,
): Record<SetId, number> {
  const next = {...owned};
  next[setId] = Math.min(SET_PIECES, (next[setId] || 0) + 1);
  return next;
}
