import { commitRun, emptySave } from '../src/game/vaultStore';
import { layerArtifacts } from '../src/game/artifacts';
import { MAX_LAYERS } from '../src/constants/config';

const base = {
  outcome: 'won' as const,
  layer: 1,
  chamberIndex: 4,
  chambersCracked: 5,
  torchesLeft: 2,
  cleanCracks: 1,
  attempts: 8,
  multiplier: 1,
  carried: [] as string[],
  score: 1000,
  setCompleted: null,
};

function commit(prev = emptySave(), carried: string[] = [], layer = 1) {
  return commitRun(prev, {
    summary: { ...base, layer, carried },
    carried,
    routeCounts: { safe: 1, rich: 0, deep: 0 },
    torchesBurned: 4,
    attempts: 8,
    cleanCracks: 1,
    chambersCracked: 5,
  });
}

describe('vault layers', () => {
  it('keeps layer 1 as the only unlocked layer until a set is complete', () => {
    const save = commit(emptySave(), layerArtifacts(1).slice(0, 4).map(a => a.id));
    expect(save.unlockedLayers).toBe(1);
  });

  it('unlocks the next layer when a five-artifact set is complete', () => {
    const save = commit(emptySave(), layerArtifacts(1).map(a => a.id));
    expect(save.unlockedLayers).toBe(2);
  });

  it('never unlocks past the deepest layer', () => {
    let save = emptySave();
    for (let layer = 1; layer <= MAX_LAYERS; layer++) {
      save = commit(save, layerArtifacts(layer).map(a => a.id), layer);
    }
    expect(save.unlockedLayers).toBe(MAX_LAYERS);
  });

  it('records the deepest layer reached', () => {
    const save = commit(emptySave(), [], 4);
    expect(save.deepestLayer).toBe(4);
  });
});
