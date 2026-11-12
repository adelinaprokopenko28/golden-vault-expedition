import {buildChambers, chambersForLayer, createRun, currentChamber} from '../src/game/expedition';
import {defaultSave} from '../src/game/storage';
import {perksFrom} from '../src/game/artifacts';

describe('expedition map', () => {
  const save = defaultSave();
  const perks = perksFrom(save.artifacts);

  it('builds the chamber chain of the layer', () => {
    const run = createRun(save, perks);
    expect(run.chambers).toHaveLength(chambersForLayer(1));
    expect(run.chambers[0].state).toBe('current');
    expect(run.chambers.slice(1).every(c => c.state === 'locked')).toBe(true);
  });

  it('opens the first chamber for free and names every chamber', () => {
    const run = createRun(save, perks);
    expect(currentChamber(run).entryCost).toBe(0);
    expect(run.chambers.every(c => c.name.length > 0)).toBe(true);
  });

  it('places chambers from the seed, so two seeds differ', () => {
    const a = buildChambers(3, 11).map(c => c.name + c.lockLength).join('|');
    const b = buildChambers(3, 99).map(c => c.name + c.lockLength).join('|');
    expect(a === b).toBe(false);
  });
});
