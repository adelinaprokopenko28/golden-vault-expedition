import {createRun} from '../src/game/expedition';
import {perksFrom} from '../src/game/artifacts';
import {finishRun, layerLadder, unlockAfter} from '../src/game/progression';
import {defaultSave} from '../src/game/storage';
import {MAX_LAYER} from '../src/constants/config';

describe('layer progression', () => {
  const save = defaultSave();
  const perks = perksFrom(save.artifacts);

  it('unlocks the next layer only on a cleared run at the deepest layer', () => {
    const run = createRun(save, perks);
    expect(unlockAfter(save, run, 'cleared')).toBe(2);
    expect(unlockAfter(save, run, 'torches_out')).toBeNull();
    expect(unlockAfter(save, run, 'abandoned')).toBeNull();
  });

  it('never unlocks past the deepest designed layer', () => {
    const deep = {...save, deepestLayer: MAX_LAYER};
    const run = createRun(deep, perks);
    expect(unlockAfter(deep, run, 'cleared')).toBeNull();
  });

  it('writes the unlock into the save on a clear', () => {
    const run = createRun(save, perks);
    const result = finishRun(save, run, 'cleared');
    expect(result.save.deepestLayer).toBe(2);
    expect(result.summary.layerUnlocked).toBe(2);
    expect(result.save.runCount).toBe(1);
  });

  it('reports every layer in the ladder with its state', () => {
    const rows = layerLadder({...save, deepestLayer: 2});
    expect(rows).toHaveLength(MAX_LAYER);
    expect(rows[0].state).toBe('cleared');
    expect(rows[1].state).toBe('open');
    expect(rows[2].state).toBe('sealed');
    expect(rows[1].current).toBe(true);
  });
});
