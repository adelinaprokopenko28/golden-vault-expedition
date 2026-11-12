import {emptyArtifacts, findChance, perksFrom} from '../src/game/artifacts';
import {startingTorches} from '../src/game/expedition';
import {refundThreshold} from '../src/game/lock';
import {REVEAL_COST, REVEAL_COST_CIPHER} from '../src/constants/config';
import {defaultSettings} from '../src/game/storage';

describe('artifact set perks', () => {
  const none = perksFrom(emptyArtifacts());
  const all = perksFrom({lantern: 3, cipher: 3, crown: 3, relic: 3, keys: 3});
  const settings = defaultSettings();

  it('LANTERN KEEPERS adds a starting torch', () => {
    expect(startingTorches(1, all)).toBe(startingTorches(1, none) + 1);
  });

  it('CIPHER TABLETS makes the reveal cheaper', () => {
    const cost = all.cipher ? REVEAL_COST_CIPHER : REVEAL_COST;
    expect(cost).toBe(1);
  });

  it('CROWN FRAGMENTS only boost SEALED halls', () => {
    expect(findChance('sealed', all, settings)).toBe(findChance('sealed', none, settings) + 10);
    expect(findChance('safe', all, settings)).toBe(findChance('safe', none, settings));
  });

  it('DEEP RELICS raise the refund threshold', () => {
    expect(refundThreshold(4, all.relic)).toBe(refundThreshold(4, false) + 1);
  });

  it('MASTER KEYS are a run modifier, not a free win', () => {
    expect(all.keys).toBe(true);
    expect(none.keys).toBe(false);
  });
});
