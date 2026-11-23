import { Rng } from './rng';
import { Artifact, Rarity } from './types';
import { ARTIFACT_VALUE, ARTIFACTS_PER_LAYER, MAX_LAYERS } from '../constants/config';

const NAMES: string[][] = [
  ['TALLY CROWN', 'COUNTING SIGIL', 'CLERK LANTERN', 'WORN TOKEN', 'LEDGER KEY'],
  ['ASSAY CROWN', 'MELT SIGIL', 'FURNACE LAMP', 'SLAG COIN', 'ASSAY KEY'],
  ['CAGE CROWN', 'BULLION SIGIL', 'CAGE LANTERN', 'BAR COIN', 'CAGE KEY'],
  ['DROWNED CROWN', 'TIDE SIGIL', 'SUNKEN LAMP', 'SILT COIN', 'DROWNED KEY'],
  ["FOUNDER'S CROWN", 'FIRST SIGIL', 'FOUNDER LAMP', 'SEAL COIN', "FOUNDER'S KEY"],
];

/** Slot 0-1 common, 2-3 rare, 4 prime - the sprite index equals the slot. */
export function rarityForSlot(slot: number): Rarity {
  if (slot >= 4) {
    return 'prime';
  }
  return slot >= 2 ? 'rare' : 'common';
}

export function artifactId(layer: number, slot: number): string {
  return 'L' + layer + '_A' + (slot + 1);
}

export function artifactAt(layer: number, slot: number): Artifact {
  const rarity = rarityForSlot(slot);
  return {
    id: artifactId(layer, slot),
    name: NAMES[Math.min(layer, MAX_LAYERS) - 1][slot],
    layer,
    slot,
    rarity,
    value: ARTIFACT_VALUE[rarity],
  };
}

export function layerArtifacts(layer: number): Artifact[] {
  const out: Artifact[] = [];
  for (let slot = 0; slot < ARTIFACTS_PER_LAYER; slot++) {
    out.push(artifactAt(layer, slot));
  }
  return out;
}

export const ALL_ARTIFACTS: Artifact[] = (() => {
  const out: Artifact[] = [];
  for (let layer = 1; layer <= MAX_LAYERS; layer++) {
    out.push.apply(out, layerArtifacts(layer));
  }
  return out;
})();

export function artifactById(id: string): Artifact | null {
  return ALL_ARTIFACTS.find(a => a.id === id) || null;
}

const BIAS_WEIGHT: Record<Rarity, Record<Rarity, number>> = {
  common: { common: 6, rare: 3, prime: 1 },
  rare: { common: 2, rare: 6, prime: 2 },
  prime: { common: 1, rare: 3, prime: 6 },
};

/** Rolled from the active route's rarity table, unowned artifacts first. */
export function rollArtifact(
  rng: Rng,
  layer: number,
  bias: Rarity,
  owned: Record<string, boolean>,
): Artifact {
  const pool = layerArtifacts(layer);
  const fresh = pool.filter(a => !owned[a.id]);
  const candidates = fresh.length > 0 ? fresh : pool;

  const weights = candidates.map(a => BIAS_WEIGHT[bias][a.rarity]);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng.next() * total;
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      return candidates[i];
    }
  }
  return candidates[candidates.length - 1];
}

export function setComplete(owned: Record<string, boolean>, layer: number): boolean {
  return layerArtifacts(layer).every(a => !!owned[a.id]);
}

export function setProgress(owned: Record<string, boolean>, layer: number): number {
  return layerArtifacts(layer).filter(a => !!owned[a.id]).length;
}
