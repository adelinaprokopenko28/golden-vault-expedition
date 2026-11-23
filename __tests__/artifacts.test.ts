import { ALL_ARTIFACTS, artifactAt, artifactById, layerArtifacts, rarityForSlot, rollArtifact, setComplete, setProgress } from '../src/game/artifacts';
import { Rng } from '../src/game/rng';
import { ARTIFACT_VALUE, ARTIFACTS_PER_LAYER, MAX_LAYERS } from '../src/constants/config';

describe('artifacts', () => {
  it('holds five artifacts per layer with unique ids', () => {
    expect(ALL_ARTIFACTS.length).toBe(MAX_LAYERS * ARTIFACTS_PER_LAYER);
    expect(new Set(ALL_ARTIFACTS.map(a => a.id)).size).toBe(ALL_ARTIFACTS.length);
  });

  it('maps rarity to the documented point value', () => {
    expect(artifactAt(1, 0).value).toBe(ARTIFACT_VALUE[rarityForSlot(0)]);
    expect(artifactAt(1, 4).rarity).toBe('prime');
    expect(artifactAt(1, 4).value).toBe(ARTIFACT_VALUE.prime);
  });

  it('rolls an artifact of the asked layer and prefers unowned ones', () => {
    const owned: Record<string, boolean> = {};
    layerArtifacts(2).slice(0, 4).forEach(a => {
      owned[a.id] = true;
    });
    const rolled = rollArtifact(new Rng(5150), 2, 'rare', owned);
    expect(rolled.layer).toBe(2);
    expect(owned[rolled.id]).toBeUndefined();
  });

  it('reports set progress and completion', () => {
    const owned: Record<string, boolean> = {};
    expect(setProgress(owned, 1)).toBe(0);
    layerArtifacts(1).forEach(a => {
      owned[a.id] = true;
    });
    expect(setProgress(owned, 1)).toBe(ARTIFACTS_PER_LAYER);
    expect(setComplete(owned, 1)).toBe(true);
    expect(setComplete(owned, 2)).toBe(false);
  });

  it('resolves an artifact back from its id', () => {
    expect(artifactById('L3_A5')).not.toBeNull();
    expect(artifactById('NOPE')).toBeNull();
  });
});
