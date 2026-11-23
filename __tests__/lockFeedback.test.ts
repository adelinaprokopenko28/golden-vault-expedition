import { evaluate, isCracked, generateCode, hasNoRepeats, advanceDigit } from '../src/game/lock';
import { Rng } from '../src/game/rng';

describe('lock feedback', () => {
  it('returns an EXACT pip for the right digit in the right slot', () => {
    expect(evaluate([1, 2, 3], [1, 5, 6])).toEqual(['exact', 'cold', 'cold']);
  });

  it('returns a CLOSE pip for a digit that lives in another slot', () => {
    expect(evaluate([3, 2, 1], [1, 2, 3])).toEqual(['close', 'exact', 'close']);
  });

  it('returns a COLD pip for a digit that is not in the code', () => {
    expect(evaluate([7, 8, 9], [1, 2, 3])).toEqual(['cold', 'cold', 'cold']);
  });

  it('is cracked only when every pip is EXACT', () => {
    expect(isCracked(evaluate([1, 2, 3], [1, 2, 3]))).toBe(true);
    expect(isCracked(evaluate([1, 2, 4], [1, 2, 3]))).toBe(false);
  });

  it('never generates a code with a repeated digit', () => {
    const rng = new Rng(12345);
    for (let i = 0; i < 50; i++) {
      expect(hasNoRepeats(generateCode(rng, 4, 1, 9))).toBe(true);
    }
  });

  it('wraps a dial inside the layer digit range', () => {
    expect(advanceDigit(1, 1, 6)).toBe(2);
    expect(advanceDigit(6, 1, 6)).toBe(1);
  });
});
