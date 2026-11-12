import {applyAssist, evaluateGuess, isCracked} from '../src/game/lock';

describe('lock feedback', () => {
  const code = [4, 7, 1, 9];

  it('marks exact, present and absent positions', () => {
    const fb = evaluateGuess(code, [4, 1, 2, 3]);
    expect(fb.marks).toEqual(['E', 'P', 'X', 'X']);
    expect(fb.exact).toBe(1);
    expect(fb.present).toBe(1);
    expect(fb.absent).toBe(2);
  });

  it('reports a crack only on a full match', () => {
    expect(isCracked(evaluateGuess(code, [4, 7, 1, 9]), 4)).toBe(true);
    expect(isCracked(evaluateGuess(code, [4, 7, 9, 1]), 4)).toBe(false);
  });

  it('hides PRESENT readings when assist pips are off', () => {
    const raw = evaluateGuess(code, [4, 1, 2, 3]);
    const hidden = applyAssist(raw, false);
    expect(hidden.present).toBe(0);
    expect(hidden.marks).toEqual(['E', 'X', 'X', 'X']);
    expect(hidden.exact).toBe(raw.exact);
  });
});
