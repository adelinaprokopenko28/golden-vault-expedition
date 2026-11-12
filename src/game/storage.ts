import {MAX_LAYER, SET_PIECES} from '../constants/config';
import {emptyArtifacts} from './artifacts';
import type {SetId, Settings, VaultSave} from './types';

/**
 * Single persistence seam. The factory dependency whitelist carries no key-value
 * native module, so the default adapter keeps the blob for the lifetime of the
 * process; a real KV adapter can be installed here with `setSaveAdapter` without
 * touching a single screen or game module.
 */
export interface SaveAdapter {
  read(): string | null;
  write(blob: string): void;
  clear(): void;
}

function createMemoryAdapter(): SaveAdapter {
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

let adapter: SaveAdapter = createMemoryAdapter();

export function setSaveAdapter(next: SaveAdapter): void {
  adapter = next;
}

export const SAVE_VERSION = 1;

export function defaultSettings(): Settings {
  return {assistPips: true, routeIntel: true, letterMarks: false};
}

export function defaultSave(): VaultSave {
  return {
    deepestLayer: 1,
    artifacts: emptyArtifacts(),
    stats: {
      expeditions: 0,
      locksCracked: 0,
      firstTryCracks: 0,
      torchesSpent: 0,
      bestHaul: 0,
    },
    settings: defaultSettings(),
    runCount: 0,
  };
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' && isFinite(value) ? Math.floor(value) : fallback;
  return Math.max(min, Math.min(max, n));
}

/** Never trusts the blob: a corrupted save degrades to defaults instead of crashing. */
export function normalizeSave(raw: unknown): VaultSave {
  const base = defaultSave();
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const input = raw as Partial<VaultSave>;
  const artifacts = {...base.artifacts};
  const rawArtifacts = (input.artifacts || {}) as Record<string, unknown>;
  (Object.keys(artifacts) as SetId[]).forEach(id => {
    artifacts[id] = clampInt(rawArtifacts[id], 0, SET_PIECES, 0);
  });
  const rawStats = input.stats || base.stats;
  const rawSettings = input.settings || base.settings;
  return {
    deepestLayer: clampInt(input.deepestLayer, 1, MAX_LAYER, 1),
    artifacts,
    stats: {
      expeditions: clampInt(rawStats.expeditions, 0, 1e9, 0),
      locksCracked: clampInt(rawStats.locksCracked, 0, 1e9, 0),
      firstTryCracks: clampInt(rawStats.firstTryCracks, 0, 1e9, 0),
      torchesSpent: clampInt(rawStats.torchesSpent, 0, 1e9, 0),
      bestHaul: clampInt(rawStats.bestHaul, 0, 15, 0),
    },
    settings: {
      assistPips: rawSettings.assistPips !== false,
      routeIntel: rawSettings.routeIntel !== false,
      letterMarks: rawSettings.letterMarks === true,
    },
    runCount: clampInt(input.runCount, 0, 1e9, 0),
  };
}

export function loadSave(): VaultSave {
  try {
    const blob = adapter.read();
    if (!blob) {
      return defaultSave();
    }
    return normalizeSave(JSON.parse(blob));
  } catch (err) {
    return defaultSave();
  }
}

export function saveNow(save: VaultSave): VaultSave {
  try {
    adapter.write(JSON.stringify({version: SAVE_VERSION, ...save}));
  } catch (err) {
    // A failed write must never take the run down with it.
  }
  return save;
}

export function wipeSave(): VaultSave {
  try {
    adapter.clear();
  } catch (err) {
    // ignored on purpose
  }
  return saveNow(defaultSave());
}
