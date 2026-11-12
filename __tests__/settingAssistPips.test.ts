import {applyAssist, evaluateGuess} from '../src/game/lock';
import {emptyArtifacts, findChance, perksFrom} from '../src/game/artifacts';
import {defaultSettings} from '../src/game/storage';

describe('ASSIST PIPS setting', () => {
  const perks = perksFrom(emptyArtifacts());

  it('is on by default', () => {
    expect(defaultSettings().assistPips).toBe(true);
  });

  it('hides PRESENT readings when turned off', () => {
    const raw = evaluateGuess([4, 7, 1], [7, 0, 0]);
    expect(applyAssist(raw, true).present).toBe(1);
    expect(applyAssist(raw, false).present).toBe(0);
  });

  it('pays five extra points of find chance when turned off', () => {
    const on = {...defaultSettings(), assistPips: true};
    const off = {...defaultSettings(), assistPips: false};
    expect(findChance('safe', perks, off)).toBe(findChance('safe', perks, on) + 5);
  });
});
