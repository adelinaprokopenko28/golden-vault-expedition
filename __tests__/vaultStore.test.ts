import {
  defaultSave,
  loadSave,
  normalizeSave,
  saveNow,
  setSaveAdapter,
} from '../src/game/storage';

function memoryAdapter() {
  let cell: string | null = null;
  return {
    read: () => cell,
    write: (blob: string) => {
      cell = blob;
    },
    clear: () => {
      cell = null;
    },
  };
}

describe('vault store', () => {
  beforeEach(() => {
    setSaveAdapter(memoryAdapter());
  });

  it('returns defaults on a fresh install', () => {
    const save = loadSave();
    expect(save.deepestLayer).toBe(1);
    expect(save.runCount).toBe(0);
    expect(save.settings.assistPips).toBe(true);
  });

  it('writes through and reads back', () => {
    const next = {...defaultSave(), deepestLayer: 3, runCount: 7};
    next.artifacts.crown = 2;
    saveNow(next);
    const loaded = loadSave();
    expect(loaded.deepestLayer).toBe(3);
    expect(loaded.runCount).toBe(7);
    expect(loaded.artifacts.crown).toBe(2);
  });

  it('degrades a corrupted blob to defaults instead of crashing', () => {
    expect(normalizeSave(null).deepestLayer).toBe(1);
    expect(normalizeSave({deepestLayer: 99}).deepestLayer).toBe(4);
    expect(normalizeSave({artifacts: {crown: 99}}).artifacts.crown).toBe(3);
  });
});
