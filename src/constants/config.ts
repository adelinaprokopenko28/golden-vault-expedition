import type {SetId, Tier} from '../game/types';

/**
 * Loader hold. Product contract: exactly 8000 ms, timer driven, no early exit.
 * A shorter value races the QA capture window.
 */
export const LOADER_DURATION_MS = 8000;

export const SCREEN_FADE_MS = 240;

/** Torch economy */
export const BASE_TORCHES = 5;
export const MAX_START_TORCHES = 8;
export const GUESS_COST = 1;
export const REVEAL_COST = 2;
export const REVEAL_COST_CIPHER = 1;
export const TORCH_METER_SLOTS = 8;

/** Layers */
export const MAX_LAYER = 4;
export const CHAMBERS_PER_LAYER = [3, 4, 5, 5];
export const LOCK_LENGTH_BY_LAYER = [3, 4, 5, 5];
export const MIN_LOCK = 3;
export const MAX_LOCK = 5;

/** Artifact chance by door tier, in percent */
export const BASE_CHANCE: Record<Tier, number> = {
  safe: 20,
  unstable: 40,
  sealed: 65,
};

export const ASSIST_OFF_BONUS = 5;
export const INTEL_OFF_BONUS = 10;
export const CROWN_SEALED_BONUS = 10;

export const SET_PIECES = 3;
export const TOTAL_ARTIFACTS = 15;

export const TIER_LABEL: Record<Tier, string> = {
  safe: 'SAFE SHAFT',
  unstable: 'UNSTABLE GALLERY',
  sealed: 'SEALED HALL',
};

export const RARITY_LABEL: Record<Tier, string> = {
  safe: 'COMMON FIND',
  unstable: 'RARE FIND',
  sealed: 'PRIZED FIND',
};

export const SET_ORDER: SetId[] = ['lantern', 'cipher', 'crown', 'relic', 'keys'];

export const CHAMBER_NAMES = [
  'ORE SHAFT',
  'ASSAY ROOM',
  'BRONZE GALLERY',
  'COLLAPSED STAIR',
  'TALLY VAULT',
  'DRIP CISTERN',
  'KEEPERS CELL',
  'DEEP STRONGROOM',
];

/** Depth ruler step, in metres, per chamber. */
export const DEPTH_STEP_M = 20;
