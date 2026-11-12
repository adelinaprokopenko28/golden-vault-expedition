import {defaultSave, loadSave, saveNow, setSaveAdapter, wipeSave} from '../src/game/storage';

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

describe('reset vault progress', () => {
  beforeEach(() => {
    setSaveAdapter(memoryAdapter());
  });

  it('wipes layers, artifacts, stats and settings back to defaults', () => {
    const dirty = {...defaultSave(), deepestLayer: 4, runCount: 12};
    dirty.artifacts.keys = 3;
    dirty.stats.locksCracked = 40;
    dirty.settings.letterMarks = true;
    saveNow(dirty);

    const fresh = wipeSave();
    expect(fresh).toEqual(defaultSave());
    expect(loadSave()).toEqual(defaultSave());
  });
});
