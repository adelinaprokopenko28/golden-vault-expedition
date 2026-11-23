import { Rng } from './rng';
import { buildClues, cluesHold } from './clues';
import { difficultyFor } from './layers';
import { ChamberSpec, PipKind, Attempt } from './types';
import { MAX_GENERATION_TRIES } from '../constants/config';

/** The permanent vault rule: a code never repeats a digit. */
export function generateCode(rng: Rng, dials: number, min: number, max: number): number[] {
  const pool: number[] = [];
  for (let d = min; d <= max; d++) {
    pool.push(d);
  }
  return rng.shuffle(pool).slice(0, dials);
}

export function hasNoRepeats(code: number[]): boolean {
  return new Set(code).size === code.length;
}

/** Position-ordered feedback - this is what makes the lock a deduction puzzle. */
export function evaluate(guess: number[], code: number[], rusted: number[] = []): PipKind[] {
  return guess.map((digit, slot) => {
    if (digit === code[slot]) {
      return 'exact';
    }
    if (rusted.indexOf(slot) >= 0) {
      return 'rust';
    }
    return code.indexOf(digit) >= 0 ? 'close' : 'cold';
  });
}

export function isCracked(pips: PipKind[]): boolean {
  return pips.length > 0 && pips.every(p => p === 'exact');
}

/**
 * Burning a torch reveals the dial with the least information so far:
 * a rusted slot first, then a slot that has never come back EXACT.
 */
export function pickReveal(
  spec: ChamberSpec,
  revealed: number[],
  attempts: Attempt[],
): number {
  const open: number[] = [];
  for (let i = 0; i < spec.dials; i++) {
    if (revealed.indexOf(i) < 0) {
      open.push(i);
    }
  }
  if (open.length === 0) {
    return -1;
  }
  const rusty = open.filter(i => spec.rusted.indexOf(i) >= 0);
  const pool = rusty.length > 0 ? rusty : open;
  let best = pool[0];
  let bestInfo = Infinity;
  pool.forEach(slot => {
    const info = attempts.reduce(
      (acc, a) => acc + (a.pips[slot] === 'exact' ? 2 : a.pips[slot] === 'close' ? 1 : 0),
      0,
    );
    if (info < bestInfo) {
      bestInfo = info;
      best = slot;
    }
  });
  return best;
}

const FALLBACK_CODE = [1, 2, 3];

/**
 * Generated content, never a constant: code, clue set and rust slots come from
 * the run seed. Validated for solvability, with a guaranteed fallback.
 */
export function generateChamber(
  rng: Rng,
  layer: number,
  index: number,
  step: number,
): ChamberSpec {
  const d = difficultyFor(step);

  for (let attempt = 0; attempt < MAX_GENERATION_TRIES; attempt++) {
    const code = generateCode(rng, d.dials, d.digitMin, d.digitMax);
    const clues = buildClues(code, d.clues, rng);
    if (code.length === d.dials && hasNoRepeats(code) && cluesHold(clues, code)) {
      const slots: number[] = [];
      for (let i = 0; i < d.dials; i++) {
        slots.push(i);
      }
      const rusted = rng.shuffle(slots).slice(0, Math.min(d.rusted, d.dials - 1));
      return {
        layer,
        index,
        step,
        dials: d.dials,
        digitMin: d.digitMin,
        digitMax: d.digitMax,
        code,
        clues,
        rusted,
        fallback: false,
      };
    }
  }

  return {
    layer,
    index,
    step,
    dials: 3,
    digitMin: 1,
    digitMax: 6,
    code: FALLBACK_CODE.slice(),
    clues: [
      { id: 'noRepeats', text: 'NO REPEATS' },
      { id: 'sum', text: 'SUM IS 6' },
    ],
    rusted: [],
    fallback: true,
  };
}

/** The dials the player starts a chamber with - always the lowest legal digits. */
export function defaultGuess(spec: ChamberSpec): number[] {
  const guess: number[] = [];
  for (let i = 0; i < spec.dials; i++) {
    guess.push(spec.digitMin);
  }
  return guess;
}

/** One tap advances a dial, wrapping inside the layer's digit range. */
export function advanceDigit(digit: number, min: number, max: number): number {
  return digit >= max ? min : digit + 1;
}
