/**
 * Seeded LCG - one seed per expedition attempt, so any bug is reproducible.
 * Never the global Math.random for run content.
 */
export function makeSeed(layerIndex: number, attemptIndex: number): number {
  const a = (layerIndex * 7919) >>> 0;
  const b = (attemptIndex * 104729) >>> 0;
  const seed = (a ^ b) >>> 0;
  return seed === 0 ? 2463534242 : seed;
}

export class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = (seed >>> 0) || 2463534242;
  }

  get seed(): number {
    return this.state;
  }

  next(): number {
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state / 4294967296;
  }

  /** inclusive on both ends */
  int(min: number, max: number): number {
    if (max <= min) {
      return min;
    }
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)];
  }

  shuffle<T>(items: readonly T[]): T[] {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }
}
