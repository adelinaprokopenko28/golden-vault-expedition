import {emptyArtifacts, findChance, perksFrom} from '../src/game/artifacts';
import {defaultSettings} from '../src/game/storage';

describe('ROUTE INTEL setting', () => {
  const perks = perksFrom(emptyArtifacts());

  it('is on by default', () => {
    expect(defaultSettings().routeIntel).toBe(true);
  });

  it('pays ten extra points of find chance when turned off', () => {
    const on = {...defaultSettings(), routeIntel: true};
    const off = {...defaultSettings(), routeIntel: false};
    expect(findChance('unstable', perks, off)).toBe(findChance('unstable', perks, on) + 10);
  });

  it('stacks with ASSIST PIPS off and never passes 100', () => {
    const both = {assistPips: false, routeIntel: false, letterMarks: false};
    expect(findChance('safe', perks, both)).toBe(35);
    expect(findChance('sealed', perks, both)).toBeLessThanOrEqual(100);
  });
});
