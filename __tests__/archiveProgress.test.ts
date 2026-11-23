import { commitRun, emptySave, countOwned, crackRate } from '../src/game/vaultStore';
import { layerArtifacts, setProgress } from '../src/game/artifacts';
import { LAYERS } from '../src/game/layers';
import { MAX_LAYERS } from '../src/constants/config';

function commit(prev = emptySave()) {
  return commitRun(prev, {
    summary: {
      outcome: 'won',
      layer: 2,
      chamberIndex: 4,
      chambersCracked: 5,
      torchesLeft: 4,
      cleanCracks: 3,
      attempts: 11,
      multiplier: 2,
      carried: layerArtifacts(2).slice(0, 3).map(a => a.id),
      score: 7800,
      setCompleted: null,
    },
    carried: layerArtifacts(2).slice(0, 3).map(a => a.id),
    routeCounts: { safe: 2, rich: 1, deep: 2 },
    torchesBurned: 9,
    attempts: 11,
    cleanCracks: 3,
    chambersCracked: 5,
  });
}

describe('archive and progress', () => {
  it('names every vault layer for the archive sections', () => {
    expect(LAYERS.length).toBe(MAX_LAYERS);
    LAYERS.forEach(layer => expect(layer.name.length).toBeGreaterThan(3));
  });

  it('shows owned against unfound per layer', () => {
    const save = commit();
    expect(setProgress(save.artifacts, 2)).toBe(3);
    expect(setProgress(save.artifacts, 3)).toBe(0);
    expect(countOwned(save)).toBe(3);
  });

  it('accumulates lifetime stats across expeditions', () => {
    const save = commit(commit());
    expect(save.expeditions).toBe(2);
    expect(save.chambersCracked).toBe(10);
    expect(save.attempts).toBe(22);
    expect(save.cleanCracks).toBe(6);
    expect(save.torchesBurned).toBe(18);
    expect(save.bestScore).toBe(7800);
  });

  it('records route habits for the progress screen', () => {
    const save = commit();
    expect(save.routeCounts).toEqual({ safe: 2, rich: 1, deep: 2 });
  });

  it('derives a crack rate from real counters', () => {
    expect(crackRate(commit())).toBeCloseTo(5 / 11);
  });
});
