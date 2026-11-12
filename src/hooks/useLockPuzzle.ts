import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {applyAssist, evaluateGuess, generateCode, isCracked, pickRevealIndex} from '../game/lock';
import type {Guess} from '../game/types';

export type PuzzlePhase = 'idle' | 'guessing' | 'cracked';

export interface LockPuzzleOptions {
  lockLength: number;
  seed: number;
  assistPips: boolean;
  masterKeyPreset: boolean;
  revealCost: number;
  torches: number;
  onSpend: (amount: number) => number;
  onCracked: (guessesUsed: number) => void;
  onOutOfTorches: () => void;
}

const GUESS_REVEAL_MS = 240;
const HISTORY_LIMIT = 4;

/**
 * Wheels, guess history and the REVEAL hint for one chamber. All deferred work
 * reads live values through refs and every timer is cleared on unmount.
 */
export function useLockPuzzle(options: LockPuzzleOptions) {
  const {
    lockLength,
    seed,
    assistPips,
    masterKeyPreset,
    revealCost,
    torches,
    onSpend,
    onCracked,
    onOutOfTorches,
  } = options;

  const code = useMemo(
    () => generateCode(lockLength, seed, null),
    [lockLength, seed],
  );

  const [digits, setDigits] = useState<number[]>(() => {
    const start = new Array(lockLength).fill(0);
    if (masterKeyPreset) {
      start[0] = code[0];
    }
    return start;
  });
  const [revealed, setRevealed] = useState<boolean[]>(() => {
    const mask = new Array(lockLength).fill(false);
    if (masterKeyPreset) {
      mask[0] = true;
    }
    return mask;
  });
  const [history, setHistory] = useState<Guess[]>([]);
  const [phase, setPhase] = useState<PuzzlePhase>('idle');
  const [hintUsed, setHintUsed] = useState(false);
  const [guessesUsed, setGuessesUsed] = useState(0);

  const digitsRef = useRef(digits);
  const revealedRef = useRef(revealed);
  const guessCountRef = useRef(0);
  const busyRef = useRef(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  digitsRef.current = digits;
  revealedRef.current = revealed;

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      busyRef.current = false;
    };
  }, []);

  const step = useCallback(
    (index: number, delta: number) => {
      if (busyRef.current || revealedRef.current[index]) {
        return;
      }
      setDigits(current => {
        const next = current.slice();
        next[index] = (next[index] + delta + 10) % 10;
        return next;
      });
    },
    [],
  );

  const submit = useCallback(() => {
    if (busyRef.current || phase === 'cracked' || torches <= 0) {
      return;
    }
    busyRef.current = true;
    setPhase('guessing');

    const guessDigits = digitsRef.current.slice();
    const raw = evaluateGuess(code, guessDigits);
    const feedback = applyAssist(raw, assistPips);
    const count = guessCountRef.current + 1;
    guessCountRef.current = count;
    setGuessesUsed(count);

    setHistory(current =>
      [{id: count, digits: guessDigits, feedback}].concat(current).slice(0, HISTORY_LIMIT),
    );

    const torchesLeft = onSpend(1);
    const cracked = isCracked(raw, code.length);

    later(() => {
      busyRef.current = false;
      if (cracked) {
        setPhase('cracked');
        onCracked(count);
        return;
      }
      setPhase('idle');
      if (torchesLeft <= 0) {
        onOutOfTorches();
      }
    }, GUESS_REVEAL_MS);
  }, [assistPips, code, later, onCracked, onOutOfTorches, onSpend, phase, torches]);

  const canReveal = !hintUsed && torches >= revealCost && phase === 'idle';

  const reveal = useCallback(() => {
    if (busyRef.current || hintUsed || torches < revealCost || phase !== 'idle') {
      return;
    }
    const index = pickRevealIndex(code, digitsRef.current, revealedRef.current);
    if (index < 0) {
      return;
    }
    setHintUsed(true);
    onSpend(revealCost);
    setDigits(current => {
      const next = current.slice();
      next[index] = code[index];
      return next;
    });
    setRevealed(current => {
      const next = current.slice();
      next[index] = true;
      return next;
    });
  }, [code, hintUsed, onSpend, phase, revealCost, torches]);

  return {
    code,
    digits,
    revealed,
    history,
    phase,
    hintUsed,
    canReveal,
    guessesUsed,
    step,
    submit,
    reveal,
  };
}

export default useLockPuzzle;
