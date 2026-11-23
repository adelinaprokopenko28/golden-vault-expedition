export type Rarity = 'common' | 'rare' | 'prime';
export type PipKind = 'exact' | 'close' | 'cold' | 'rust';
export type DialState = 'idle' | 'rusted' | 'revealed';
export type RouteKey = 'safe' | 'rich' | 'deep';
export type NodeState = 'cleared' | 'current' | 'locked';
export type RunStatus = 'map' | 'chamber' | 'cleared' | 'won' | 'lost';

export interface Clue {
  id: string;
  text: string;
}

export interface ChamberSpec {
  layer: number;
  index: number;
  step: number;
  dials: number;
  digitMin: number;
  digitMax: number;
  code: number[];
  clues: Clue[];
  rusted: number[];
  fallback: boolean;
}

export interface Attempt {
  id: number;
  digits: number[];
  pips: PipKind[];
}

export interface RouteOption {
  key: RouteKey;
  name: string;
  torches: number;
  stepDelta: number;
  layerDelta: number;
  multiplierBoost: number;
  rarityBias: Rarity;
  lines: [string, string];
}

export interface Artifact {
  id: string;
  name: string;
  layer: number;
  slot: number;
  rarity: Rarity;
  value: number;
}

export interface LayerSpec {
  index: number;
  name: string;
  title: string;
}

export interface RouteCounts {
  safe: number;
  rich: number;
  deep: number;
}

export interface VaultSave {
  version: number;
  unlockedLayers: number;
  artifacts: Record<string, boolean>;
  bestScore: number;
  deepestLayer: number;
  expeditions: number;
  chambersCracked: number;
  attempts: number;
  cleanCracks: number;
  torchesBurned: number;
  routeCounts: RouteCounts;
  settings: {
    expertLocks: boolean;
    clueRings: boolean;
    reducedMotion: boolean;
    keepRun: boolean;
  };
}

export interface RunSummary {
  outcome: 'won' | 'lost';
  layer: number;
  chamberIndex: number;
  chambersCracked: number;
  torchesLeft: number;
  cleanCracks: number;
  attempts: number;
  multiplier: number;
  carried: string[];
  score: number;
  setCompleted: number | null;
}
