import {createRun} from '../src/game/expedition';
import {perksFrom} from '../src/game/artifacts';
import {applyDoor, generateDoors} from '../src/game/routes';
import {defaultSave} from '../src/game/storage';

describe('route modifiers', () => {
  const base = {...defaultSave(), deepestLayer: 3};
  const perks = perksFrom(base.artifacts);

  it('rewrites the next chamber with the chosen door spec', () => {
    const run = createRun(base, perks);
    const door = generateDoors(5, 5).find(d => d.effect === 'cache');
    expect(door).toBeDefined();
    const next = applyDoor(run, door!);
    const target = next.chambers[run.chamberIndex + 1];
    expect(target.lockLength).toBe(door!.lockLength);
    expect(target.entryCost).toBe(door!.entryCost);
    expect(target.tier).toBe(door!.tier);
  });

  it('shortens the path on SKIP and lengthens it on EXTEND', () => {
    const run = createRun(base, perks);
    const doors = generateDoors(5, 5);
    const skip = doors.find(d => d.effect === 'skip');
    const extend = doors.find(d => d.effect === 'extend');
    if (skip) {
      const after = applyDoor(run, skip);
      expect(after.chambers.filter(c => c.state === 'skipped').length).toBe(1);
    }
    if (extend) {
      const after = applyDoor(run, extend);
      expect(after.chambers.length).toBe(run.chambers.length + 1);
    }
  });

  it('produces a different next chamber for a different door', () => {
    const run = createRun(base, perks);
    const doors = generateDoors(5, 5);
    const a = applyDoor(run, doors[0]).chambers[1];
    const b = applyDoor(run, doors[doors.length - 1]).chambers[1];
    expect(a.tier === b.tier && a.entryCost === b.entryCost).toBe(false);
  });
});
