import {createRun} from '../src/game/expedition';
import {perksFrom} from '../src/game/artifacts';
import {applyDoor, effectLabel, generateDoors} from '../src/game/routes';
import {defaultSave} from '../src/game/storage';

describe('torch caches on route cards', () => {
  const save = defaultSave();
  const perks = perksFrom(save.artifacts);

  it('adds the cache torches on entry', () => {
    const run = createRun(save, perks);
    const door = generateDoors(13, 3).find(d => d.cache > 0);
    expect(door).toBeDefined();
    const after = applyDoor(run, door!);
    expect(after.torches).toBe(run.torches + door!.cache);
  });

  it('never loses torches by taking a door', () => {
    const run = createRun(save, perks);
    generateDoors(31, 3).forEach(door => {
      expect(applyDoor(run, door).torches).toBeGreaterThanOrEqual(run.torches);
    });
  });

  it('labels the cache in words the player can read', () => {
    const door = generateDoors(13, 3).find(d => d.effect === 'cache');
    expect(effectLabel(door!)).toContain('TORCH CACHE');
  });
});
