import {FALLBACK_CODE, generateCode, isUsableCode, clampLockLength} from '../src/game/lock';

describe('lock generator', () => {
  it('produces unique digits of the requested length', () => {
    for (let seed = 1; seed < 60; seed++) {
      const code = generateCode(4, seed);
      expect(code).toHaveLength(4);
      expect(new Set(code).size).toBe(4);
    }
  });

  it('rejects straight runs and repeats of the previous chamber', () => {
    expect(isUsableCode([1, 2, 3], null)).toBe(false);
    expect(isUsableCode([9, 8, 7], null)).toBe(false);
    expect(isUsableCode([4, 1, 7], [4, 1, 7])).toBe(false);
    expect(isUsableCode([4, 1, 7], null)).toBe(true);
  });

  it('clamps the lock length into the playable range', () => {
    expect(clampLockLength(1)).toBe(3);
    expect(clampLockLength(9)).toBe(5);
  });

  it('keeps a fixed fallback available', () => {
    expect(FALLBACK_CODE.slice(0, 3)).toEqual([4, 7, 1]);
  });

  it('is deterministic for one seed and varies between seeds', () => {
    expect(generateCode(5, 123)).toEqual(generateCode(5, 123));
    const a = generateCode(5, 1).join('');
    const b = generateCode(5, 2).join('');
    expect(a === b).toBe(false);
  });
});
