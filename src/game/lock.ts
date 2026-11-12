import {MAX_LOCK, MIN_LOCK} from '../constants/config';
import {mulberry32, type Rng} from './rng';
import type {Feedback, Mark} from './types';

/** Guaranteed code when 20 generated candidates all fail the guard. */
export const FALLBACK_CODE = [4, 7, 1, 9, 2];

export function clampLockLength(length: number): number {
  return Math.max(MIN_LOCK, Math.min(MAX_LOCK, length));
}

function uniqueDigits(rng: Rng, length: number): number[] {
  const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, length);
}

function monotone(code: number[], dir: number): boolean {
  for (let i = 1; i < code.length; i++) {
    if ((code[i] - code[i - 1]) * dir <= 0) {
      return false;
    }
  }
  return true;
}

export function sameCode(a: number[] | null, b: number[]): boolean {
  if (!a || a.length !== b.length) {
    return false;
  }
  return a.every((d, i) => d === b[i]);
}

/**
 * Usable code: no repeated digit, not a straight ascending or descending run,
 * and not the same code the previous chamber already used.
 */
export function isUsableCode(code: number[], previous: number[] | null): boolean {
  if (code.length < MIN_LOCK) {
    return false;
  }
  if (new Set(code).size !== code.length) {
    return false;
  }
  if (monotone(code, 1) || monotone(code, -1)) {
    return false;
  }
  return !sameCode(previous, code);
}

/**
 * Placement comes from the seed, the solvability guard runs up to 20 times,
 * and only then the fixed FALLBACK is used.
 */
export function generateCode(
  length: number,
  seed: number,
  previous: number[] | null = null,
): number[] {
  const len = clampLockLength(length);
  const rng = mulberry32(seed);
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = uniqueDigits(rng, len);
    if (isUsableCode(candidate, previous)) {
      return candidate;
    }
  }
  return FALLBACK_CODE.slice(0, len);
}

/** Bulls and cows. The code never repeats a digit, so every mark is unambiguous. */
export function evaluateGuess(code: number[], guess: number[]): Feedback {
  const marks: Mark[] = [];
  let exact = 0;
  let present = 0;
  let absent = 0;
  for (let i = 0; i < code.length; i++) {
    const g = guess[i];
    if (g === code[i]) {
      marks.push('E');
      exact += 1;
    } else if (code.indexOf(g) >= 0) {
      marks.push('P');
      present += 1;
    } else {
      marks.push('X');
      absent += 1;
    }
  }
  return {exact, present, absent, marks};
}

/** With ASSIST PIPS off only EXACT readings are reported. */
export function applyAssist(feedback: Feedback, assistPips: boolean): Feedback {
  if (assistPips) {
    return feedback;
  }
  const marks: Mark[] = feedback.marks.map(m => (m === 'E' ? 'E' : 'X'));
  return {
    exact: feedback.exact,
    present: 0,
    absent: feedback.absent + feedback.present,
    marks,
  };
}

export function isCracked(feedback: Feedback, length: number): boolean {
  return feedback.exact === length;
}

/** Efficient-crack refund threshold. */
export function refundThreshold(length: number, relicPerk: boolean): number {
  return Math.ceil(length / 2) + (relicPerk ? 1 : 0);
}

export function earnsRefund(
  guessesUsed: number,
  length: number,
  relicPerk: boolean,
): boolean {
  return guessesUsed <= refundThreshold(length, relicPerk);
}

/** REVEAL hint target: the first wheel that is neither revealed nor already correct. */
export function pickRevealIndex(
  code: number[],
  digits: number[],
  revealed: boolean[],
): number {
  for (let i = 0; i < code.length; i++) {
    if (!revealed[i] && digits[i] !== code[i]) {
      return i;
    }
  }
  for (let i = 0; i < code.length; i++) {
    if (!revealed[i]) {
      return i;
    }
  }
  return -1;
}
