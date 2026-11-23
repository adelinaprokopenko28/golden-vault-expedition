import { Rng } from './rng';
import { Clue } from './types';

type ClueBuilder = {
  id: string;
  build: (code: number[], rng: Rng) => Clue | null;
  test: (clue: Clue, code: number[]) => boolean;
};

const sum = (code: number[]) => code.reduce((a, b) => a + b, 0);

/**
 * Every clue is plain ASCII text plus a predicate, so a generated code can be
 * validated against the exact clue set the player will be shown.
 */
const BUILDERS: ClueBuilder[] = [
  {
    id: 'noRepeats',
    build: () => ({ id: 'noRepeats', text: 'NO REPEATS' }),
    test: (_c, code) => new Set(code).size === code.length,
  },
  {
    id: 'sum',
    build: code => ({ id: 'sum', text: 'SUM IS ' + sum(code) }),
    test: (clue, code) => clue.text === 'SUM IS ' + sum(code),
  },
  {
    id: 'parity',
    build: (code, rng) => {
      const slot = rng.int(0, code.length - 1);
      const even = code[slot] % 2 === 0;
      return {
        id: 'parity:' + slot,
        text: 'SLOT ' + (slot + 1) + ' IS ' + (even ? 'EVEN' : 'ODD'),
      };
    },
    test: (clue, code) => {
      const slot = Number(clue.id.split(':')[1]);
      const even = code[slot] % 2 === 0;
      return clue.text === 'SLOT ' + (slot + 1) + ' IS ' + (even ? 'EVEN' : 'ODD');
    },
  },
  {
    id: 'order',
    build: code => {
      const max = Math.max.apply(null, code);
      return code[code.length - 1] === max
        ? { id: 'order', text: 'HIGHEST IS LAST' }
        : { id: 'orderLow', text: 'LOWEST IS NOT LAST' };
    },
    test: (clue, code) => {
      const max = Math.max.apply(null, code);
      const min = Math.min.apply(null, code);
      return clue.id === 'order'
        ? code[code.length - 1] === max
        : code[code.length - 1] !== min;
    },
  },
  {
    id: 'contains',
    build: (code, rng) => {
      const digit = code[rng.int(0, code.length - 1)];
      return { id: 'contains:' + digit, text: 'CONTAINS ' + digit };
    },
    test: (clue, code) => code.indexOf(Number(clue.id.split(':')[1])) >= 0,
  },
  {
    id: 'above',
    build: (code, rng) => {
      const slot = rng.int(0, code.length - 1);
      const bound = Math.max(1, code[slot] - 1);
      return {
        id: 'above:' + slot + ':' + bound,
        text: 'SLOT ' + (slot + 1) + ' IS ABOVE ' + (bound - 1),
      };
    },
    test: (clue, code) => {
      const parts = clue.id.split(':');
      const slot = Number(parts[1]);
      const bound = Number(parts[2]);
      return code[slot] > bound - 1;
    },
  },
];

/** Builds `count` distinct clues that describe this code. `NO REPEATS` is always first. */
export function buildClues(code: number[], count: number, rng: Rng): Clue[] {
  if (count <= 0) {
    return [];
  }
  const clues: Clue[] = [BUILDERS[0].build(code, rng) as Clue];
  const pool = rng.shuffle(BUILDERS.slice(1));
  for (let i = 0; i < pool.length && clues.length < count; i++) {
    const clue = pool[i].build(code, rng);
    if (clue && !clues.some(c => c.id === clue.id)) {
      clues.push(clue);
    }
  }
  return clues.slice(0, count);
}

/** Solvability check: the code must satisfy every clue it will be shown with. */
export function cluesHold(clues: Clue[], code: number[]): boolean {
  return clues.every(clue => {
    const builder = BUILDERS.find(b => clue.id === b.id || clue.id.indexOf(b.id + ':') === 0);
    if (!builder) {
      return clue.id === 'orderLow'
        ? code[code.length - 1] !== Math.min.apply(null, code)
        : true;
    }
    return builder.test(clue, code);
  });
}
