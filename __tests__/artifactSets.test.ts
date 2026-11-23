import { layerArtifacts, setComplete, setProgress } from '../src/game/artifacts';
import { commitRun, emptySave } from '../src/game/vaultStore';
import { ARTIFACTS_PER_LAYER } from '../src/constants/config';

describe('artifact sets', () => {
  it('builds a set out of exactly five artifacts', () => {
    expect(layerArtifacts(2).length).toBe(ARTIFACTS_PER_LAYER);
  });

  it('completes a set only when every slot is owned', () => {
    const owned: Record<string, boolean> = {};
    layerArtifacts(2).forEach((a, i) => {
      if (i < ARTIFACTS_PER_LAYER - 1) {
        owned[a.id] = true;
      }
    });
    expect(setComplete(owned, 2)).toBe(false);
    owned[layerArtifacts(2)[ARTIFACTS_PER_LAYER - 1].id] = true;
    expect(setComplete(owned, 2)).toBe(true);
  });

  it('collects a set across several expeditions', () => {
    let save = emptySave();
    const ids = layerArtifacts(1).map(a => a.id);
    ids.forEach(id => {
      save = commitRun(save, {
        summary: {
          outcome: 'lost',
          layer: 1,
          chamberIndex: 1,
          chambersCracked: 1,
          torchesLeft: 0,
          cleanCracks: 0,
          attempts: 5,
          multiplier: 1,
          carried: [id],
          score: 300,
          setCompleted: null,
        },
        carried: [id],
        routeCounts: { safe: 0, rich: 1, deep: 0 },
        torchesBurned: 5,
        attempts: 5,
        cleanCracks: 0,
        chambersCracked: 1,
      });
    });
    expect(setProgress(save.artifacts, 1)).toBe(ARTIFACTS_PER_LAYER);
    expect(save.unlockedLayers).toBe(2);
    expect(save.expeditions).toBe(ARTIFACTS_PER_LAYER);
  });
});
