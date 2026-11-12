import {earnsRefund, refundThreshold} from '../src/game/lock';

describe('efficient crack refund', () => {
  it('refunds a crack made within half the lock length', () => {
    expect(refundThreshold(5, false)).toBe(3);
    expect(earnsRefund(3, 5, false)).toBe(true);
    expect(earnsRefund(4, 5, false)).toBe(false);
  });

  it('raises the threshold with the DEEP RELICS perk', () => {
    expect(refundThreshold(5, true)).toBe(4);
    expect(earnsRefund(4, 5, true)).toBe(true);
  });
});
