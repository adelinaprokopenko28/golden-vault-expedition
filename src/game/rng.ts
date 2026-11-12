/**
 * Seeded streams. Run content is generated, never written out as constants,
 * and every run stays reproducible from its seed.
 */
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One seed per attempt, derived and stored with the run. */
export function runSeed(layer: number, runCount: number): number {
  return ((layer * 7919) ^ ((runCount + 1) * 104729)) >>> 0;
}

/** Per-chamber stream, so one chamber cannot disturb the next. */
export function chamberSeed(seed: number, chamberIndex: number, salt: number = 0): number {
  return (
    (seed ^ Math.imul(chamberIndex + 1, 2654435761) ^ Math.imul(salt + 1, 40503)) >>> 0
  );
}

export function randInt(rng: Rng, minInclusive: number, maxInclusive: number): number {
  const span = maxInclusive - minInclusive + 1;
  return minInclusive + Math.floor(rng() * span);
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[randInt(rng, 0, list.length - 1)];
}

/** Weighted pick. Returns -1 when every weight is zero. */
export function weightedIndex(rng: Rng, weights: readonly number[]): number {
  const total = weights.reduce((a, b) => a + (b > 0 ? b : 0), 0);
  if (total <= 0) {
    return -1;
  }
  let roll = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i] > 0 ? weights[i] : 0;
    if (roll < w) {
      return i;
    }
    roll -= w;
  }
  return weights.length - 1;
}
