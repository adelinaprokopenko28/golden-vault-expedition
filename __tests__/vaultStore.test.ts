import { commitRun, emptySave, normaliseSave, loadSave, save, saveNow, wipe, setStorageBackend, countOwned, crackRate, SAVE_KEY } from '../src/game/vaultStore';
import { layerArtifacts } from '../src/game/artifacts';

function memoryBackend() {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k: string) => Promise.resolve(map.has(k) ? (map.get(k) as string) : null),
    setItem: (k: string, v: string) => {
      map.set(k, v);
      return Promise.resolve();
    },
    removeItem: (k: string) => {
      map.delete(k);
      return Promise.resolve();
    },
  };
}

const summary = {
  outcome: 'won' as const,
  layer: 1,
  chamberIndex: 4,
  chambersCracked: 5,
  torchesLeft: 3,
  cleanCracks: 2,
  attempts: 9,
  multiplier: 1.5,
  carried: layerArtifacts(1).map(a => a.id),
  score: 4200,
  setCompleted: 1,
};

afterEach(() => setStorageBackend(null));

describe('vault store', () => {
  it('starts from a clean, in-range save', () => {
    const fresh = emptySave();
    expect(fresh.unlockedLayers).toBe(1);
    expect(fresh.bestScore).toBe(0);
    expect(fresh.settings.clueRings).toBe(true);
  });

  it('coerces a corrupted blob back into range', () => {
    const fixed = normaliseSave({ unlockedLayers: 99, bestScore: -5, settings: { clueRings: false } });
    expect(fixed.unlockedLayers).toBe(5);
    expect(fixed.bestScore).toBe(0);
    expect(fixed.settings.clueRings).toBe(false);
  });

  it('never throws on an unreadable save', async () => {
    setStorageBackend({
      getItem: () => Promise.reject(new Error('no storage')),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    });
    await expect(loadSave()).resolves.toEqual(emptySave());
  });

  it('writes and reads the run back through the backend', async () => {
    const backend = memoryBackend();
    setStorageBackend(backend);
    const next = commitRun(emptySave(), {
      summary,
      carried: summary.carried,
      routeCounts: { safe: 2, rich: 1, deep: 1 },
      torchesBurned: 7,
      attempts: 9,
      cleanCracks: 2,
      chambersCracked: 5,
    });
    await saveNow(next);
    expect(backend.map.has(SAVE_KEY)).toBe(true);
    const loaded = await loadSave();
    expect(loaded.bestScore).toBe(4200);
    expect(countOwned(loaded)).toBe(5);
  });

  it('accepts a debounced save without blocking', () => {
    setStorageBackend(memoryBackend());
    expect(() => save(emptySave())).not.toThrow();
  });

  it('wipes the vault back to empty', async () => {
    const backend = memoryBackend();
    setStorageBackend(backend);
    await saveNow(emptySave());
    const fresh = await wipe();
    expect(backend.map.has(SAVE_KEY)).toBe(false);
    expect(fresh).toEqual(emptySave());
  });

  it('reports a crack rate only when there were attempts', () => {
    expect(crackRate(emptySave())).toBe(0);
    expect(crackRate({ ...emptySave(), attempts: 10, chambersCracked: 4 })).toBeCloseTo(0.4);
  });
});
