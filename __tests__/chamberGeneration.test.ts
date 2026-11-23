import { generateChamber } from '../src/game/lock';
import { cluesHold } from '../src/game/clues';
import { Rng } from '../src/game/rng';
import { difficultyFor } from '../src/game/layers';

describe('chamber generation', () => {
  it('generates a code that satisfies every clue it is shown with', () => {
    for (let seed = 1; seed < 60; seed++) {
      const spec = generateChamber(new Rng(seed * 7919), 2, 0, seed % 5);
      expect(cluesHold(spec.clues, spec.code)).toBe(true);
    }
  });

  it('matches the difficulty table for its step', () => {
    for (let step = 0; step <= 4; step++) {
      const d = difficultyFor(step);
      const spec = generateChamber(new Rng(999 + step), 1, 0, step);
      expect(spec.dials).toBe(d.dials);
      expect(spec.code.length).toBe(d.dials);
      expect(spec.clues.length).toBe(d.clues);
      expect(spec.rusted.length).toBe(Math.min(d.rusted, d.dials - 1));
      spec.code.forEach(digit => {
        expect(digit).toBeGreaterThanOrEqual(d.digitMin);
        expect(digit).toBeLessThanOrEqual(d.digitMax);
      });
    }
  });

  it('never needs the fallback for a normal seed', () => {
    expect(generateChamber(new Rng(4242), 3, 2, 3).fallback).toBe(false);
  });

  it('produces different content for different seeds', () => {
    const a = generateChamber(new Rng(11), 1, 0, 1);
    const b = generateChamber(new Rng(22), 1, 0, 1);
    expect(a.code.join('') === b.code.join('') && a.clues[0].text === b.clues[0].text).toBe(false);
  });

  it('is reproducible from its seed', () => {
    const a = generateChamber(new Rng(777), 2, 1, 2);
    const b = generateChamber(new Rng(777), 2, 1, 2);
    expect(a.code).toEqual(b.code);
  });
});
