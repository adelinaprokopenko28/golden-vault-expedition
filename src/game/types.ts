export type Tier = 'safe' | 'unstable' | 'sealed';
export type SetId = 'lantern' | 'cipher' | 'crown' | 'relic' | 'keys';
export type Outcome = 'cleared' | 'torches_out' | 'abandoned';
export type DoorEffect = 'cache' | 'skip' | 'extend';
export type ChamberState = 'cleared' | 'current' | 'locked' | 'skipped';
export type Mark = 'E' | 'P' | 'X';

export interface Chamber {
  index: number;
  name: string;
  lockLength: number;
  entryCost: number;
  tier: Tier;
  state: ChamberState;
  artifact: SetId | null;
}

export interface Door {
  id: string;
  tier: Tier;
  name: string;
  lockLength: number;
  entryCost: number;
  effect: DoorEffect;
  cache: number;
  rarityBias: number;
}

export interface Feedback {
  exact: number;
  present: number;
  absent: number;
  marks: Mark[];
}

export interface Guess {
  id: number;
  digits: number[];
  feedback: Feedback;
}

export interface Perks {
  lantern: boolean;
  cipher: boolean;
  crown: boolean;
  relic: boolean;
  keys: boolean;
}

export interface Settings {
  assistPips: boolean;
  routeIntel: boolean;
  letterMarks: boolean;
}

export interface VaultStats {
  expeditions: number;
  locksCracked: number;
  firstTryCracks: number;
  torchesSpent: number;
  bestHaul: number;
}

export interface VaultSave {
  deepestLayer: number;
  artifacts: Record<SetId, number>;
  stats: VaultStats;
  settings: Settings;
  runCount: number;
}

export interface Run {
  layer: number;
  seed: number;
  torches: number;
  maxTorches: number;
  chambers: Chamber[];
  chamberIndex: number;
  haul: SetId[];
  locksCracked: number;
  firstTryCracks: number;
  torchesSpent: number;
  doors: Door[];
  outcome: Outcome | null;
}

export interface RunSummary {
  outcome: Outcome;
  layer: number;
  depth: number;
  total: number;
  locksCracked: number;
  firstTryCracks: number;
  torchesLeft: number;
  haul: SetId[];
  completedSets: SetId[];
  layerUnlocked: number | null;
}
