import {pickRevealIndex} from '../src/game/lock';
import {REVEAL_COST, REVEAL_COST_CIPHER} from '../src/constants/config';

describe('reveal hint', () => {
  const code = [4, 7, 1];

  it('targets the first wheel that is neither revealed nor already correct', () => {
    expect(pickRevealIndex(code, [4, 0, 0], [false, false, false])).toBe(1);
    expect(pickRevealIndex(code, [4, 7, 0], [true, false, false])).toBe(2);
  });

  it('returns -1 when every wheel is already revealed', () => {
    expect(pickRevealIndex(code, [4, 7, 1], [true, true, true])).toBe(-1);
  });

  it('costs less with the CIPHER perk', () => {
    expect(REVEAL_COST).toBe(2);
    expect(REVEAL_COST_CIPHER).toBe(1);
    expect(REVEAL_COST_CIPHER).toBeLessThan(REVEAL_COST);
  });
});
