import { DEFAULT_SETTINGS, MAX_LAYERS } from '../constants/config';
import { RunSummary, VaultSave, RouteCounts } from './types';
import { setComplete } from './artifacts';
import { clamp } from '../utils/format';

export const SAVE_KEY = 'gve.vault.v1';
export const SAVE_VERSION = 1;

/**
 * The ONLY module that touches storage.
 *
 * The pipeline allows no native storage module in this project, so the default
 * backend is an in-process map that keeps the vault alive for the whole app
 * session. `setStorageBackend()` is the single swap point: handing it any
 * async key/value store (AsyncStorage, MMKV, a file writer) makes the save
 * survive a force-stop without touching another line of this app. Every call is
 * wrapped in try/catch, so a failing backend can never crash the game.
 */
export interface StorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const memory = new Map<string, string>();

const memoryBackend: StorageBackend = {
  getItem: key => Promise.resolve(memory.has(key) ? (memory.get(key) as string) : null),
  setItem: (key, value) => {
    memory.set(key, value);
    return Promise.resolve();
  },
  removeItem: key => {
    memory.delete(key);
    return Promise.resolve();
  },
};

let backend: StorageBackend = memoryBackend;

export function setStorageBackend(next: StorageBackend | null): void {
  backend = next || memoryBackend;
}

export function emptySave(): VaultSave {
  return {
    version: SAVE_VERSION,
    unlockedLayers: 1,
    artifacts: {},
    bestScore: 0,
    deepestLayer: 1,
    expeditions: 0,
    chambersCracked: 0,
    attempts: 0,
    cleanCracks: 0,
    torchesBurned: 0,
    routeCounts: { safe: 0, rich: 0, deep: 0 },
    settings: Object.assign({}, DEFAULT_SETTINGS),
  };
}

/** Never trusts the stored blob - every field is coerced back into range. */
export function normaliseSave(raw: unknown): VaultSave {
  const base = emptySave();
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const input = raw as Partial<VaultSave>;
  const counts = (input.routeCounts || {}) as Partial<RouteCounts>;
  const settings = (input.settings || {}) as Partial<VaultSave['settings']>;

  return {
    version: SAVE_VERSION,
    unlockedLayers: clamp(Number(input.unlockedLayers) || 1, 1, MAX_LAYERS),
    artifacts:
      input.artifacts && typeof input.artifacts === 'object'
        ? Object.assign({}, input.artifacts)
        : {},
    bestScore: Math.max(0, Number(input.bestScore) || 0),
    deepestLayer: clamp(Number(input.deepestLayer) || 1, 1, MAX_LAYERS),
    expeditions: Math.max(0, Number(input.expeditions) || 0),
    chambersCracked: Math.max(0, Number(input.chambersCracked) || 0),
    attempts: Math.max(0, Number(input.attempts) || 0),
    cleanCracks: Math.max(0, Number(input.cleanCracks) || 0),
    torchesBurned: Math.max(0, Number(input.torchesBurned) || 0),
    routeCounts: {
      safe: Math.max(0, Number(counts.safe) || 0),
      rich: Math.max(0, Number(counts.rich) || 0),
      deep: Math.max(0, Number(counts.deep) || 0),
    },
    settings: {
      expertLocks: settings.expertLocks === true,
      clueRings: settings.clueRings !== false,
      reducedMotion: settings.reducedMotion === true,
      keepRun: settings.keepRun !== false,
    },
  };
}

export async function loadSave(): Promise<VaultSave> {
  try {
    const raw = await backend.getItem(SAVE_KEY);
    if (!raw) {
      return emptySave();
    }
    return normaliseSave(JSON.parse(raw));
  } catch (err) {
    return emptySave();
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pending: VaultSave | null = null;

async function flush(): Promise<void> {
  const payload = pending;
  pending = null;
  saveTimer = null;
  if (!payload) {
    return;
  }
  try {
    await backend.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch (err) {
    // storage must never take the game down
  }
}

/** Debounced 300 ms so a burst of progress events costs one write. */
export function save(next: VaultSave): void {
  pending = next;
  if (saveTimer) {
    clearTimeout(saveTimer);
  }
  saveTimer = setTimeout(flush, 300);
}

export function saveNow(next: VaultSave): Promise<void> {
  pending = next;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  return flush();
}

export async function wipe(): Promise<VaultSave> {
  pending = null;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  try {
    await backend.removeItem(SAVE_KEY);
  } catch (err) {
    // ignore
  }
  return emptySave();
}

export interface CommitInput {
  summary: RunSummary;
  carried: string[];
  routeCounts: RouteCounts;
  torchesBurned: number;
  attempts: number;
  cleanCracks: number;
  chambersCracked: number;
}

/**
 * Commits one finished expedition into the vault: artifacts, lifetime counters,
 * best score and - when a layer's five-artifact set is complete - the next layer.
 */
export function commitRun(prev: VaultSave, input: CommitInput): VaultSave {
  const artifacts = Object.assign({}, prev.artifacts);
  input.carried.forEach(id => {
    artifacts[id] = true;
  });

  let unlockedLayers = prev.unlockedLayers;
  for (let layer = 1; layer <= MAX_LAYERS; layer++) {
    if (setComplete(artifacts, layer) && unlockedLayers < layer + 1) {
      unlockedLayers = Math.min(MAX_LAYERS, layer + 1);
    }
  }

  return {
    version: SAVE_VERSION,
    unlockedLayers,
    artifacts,
    bestScore: Math.max(prev.bestScore, input.summary.score),
    deepestLayer: clamp(Math.max(prev.deepestLayer, input.summary.layer), 1, MAX_LAYERS),
    expeditions: prev.expeditions + 1,
    chambersCracked: prev.chambersCracked + input.chambersCracked,
    attempts: prev.attempts + input.attempts,
    cleanCracks: prev.cleanCracks + input.cleanCracks,
    torchesBurned: prev.torchesBurned + input.torchesBurned,
    routeCounts: {
      safe: prev.routeCounts.safe + input.routeCounts.safe,
      rich: prev.routeCounts.rich + input.routeCounts.rich,
      deep: prev.routeCounts.deep + input.routeCounts.deep,
    },
    settings: Object.assign({}, prev.settings),
  };
}

export function countOwned(save_: VaultSave): number {
  return Object.keys(save_.artifacts).filter(k => save_.artifacts[k]).length;
}

export function crackRate(save_: VaultSave): number {
  return save_.attempts > 0 ? save_.chambersCracked / save_.attempts : 0;
}
