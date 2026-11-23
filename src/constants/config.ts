/**
 * Every tunable number of Golden Vault Expedition.
 * Fictional points only - no betting, no stakes, no payouts, no purchases.
 */

/** Splash hold, timer driven. EXACTLY 8000 ms (product rule - never shorten). */
export const LOADER_DURATION_MS = 8000;
/**
 * The loader progress bar fills in 1200 ms and then STOPS - it is deliberately
 * NOT tied to LOADER_DURATION_MS. A width tween is a layout prop, so it runs on
 * the JS driver; running one for the splash's whole 8 s life keeps the window
 * non-idle and wedges `uiautomator dump` on the very first capture.
 */
export const LOADER_BAR_ANIM_MS = 1200;
/** The torch burn bar is repainted on a 2 Hz tick, never on a per-frame tween. */
export const TORCH_TICK_MS = 500;

/** Torch economy. */
export const TORCHES_START = 5;
export const TORCH_MAX = 9;
export const TORCH_COST_ATTEMPT = 1;
export const TORCH_COST_REVEAL = 1;
export const TORCH_REWARD_CRACK = 1;
export const TORCH_REWARD_CLEAN = 3;
/** A torch burns out every 25 s spent inside a chamber. */
export const TORCH_BURN_MS = 25000;
/** A chamber cracked in <= 2 attempts is a Clean Crack. */
export const CLEAN_CRACK_ATTEMPTS = 2;

/** Run shape. */
export const CHAMBERS_PER_LAYER = 5;
export const ARTIFACTS_PER_LAYER = 5;
export const MAX_LAYERS = 5;
export const MAX_ATTEMPT_ROWS = 5;

/** Score multiplier ladder, stepped by Clean Cracks, reset by a sloppy chamber. */
export const MULTIPLIER_LADDER = [1, 1.5, 2];

/** Scoring weights. */
export const SCORE_PER_CHAMBER = 120;
export const SCORE_PER_TORCH = 40;
export const ARTIFACT_VALUE = { common: 150, rare: 400, prime: 900 } as const;
export const BONUS_EXPERT = 1.25;
export const BONUS_NO_CLUES = 1.15;

/** Difficulty table, step is clamped to 0..4. */
export interface DifficultyStep {
  dials: number;
  digitMin: number;
  digitMax: number;
  clues: number;
  rusted: number;
}
export const DIFFICULTY: DifficultyStep[] = [
  { dials: 3, digitMin: 1, digitMax: 6, clues: 3, rusted: 0 },
  { dials: 3, digitMin: 1, digitMax: 8, clues: 2, rusted: 1 },
  { dials: 4, digitMin: 1, digitMax: 8, clues: 2, rusted: 1 },
  { dials: 4, digitMin: 1, digitMax: 9, clues: 1, rusted: 1 },
  { dials: 4, digitMin: 1, digitMax: 9, clues: 1, rusted: 2 },
];
export const MAX_STEP = DIFFICULTY.length - 1;

/** Generation safety net. */
export const MAX_GENERATION_TRIES = 20;

/** Animation timings (ms). */
export const TIMING = {
  fade: 280,
  screenEnter: 300,
  dialRoll: 180,
  pipStagger: 90,
  shake: 320,
  unlockBurst: 420,
  resolveLockout: 420,
  bannerHold: 900,
  flickerLoop: 1400,
  ctaPulse: 2600,
  statCountUp: 700,
} as const;

/** The legal strip - 18+ is a visual style only. */
export const DISCLAIMER_SHORT = '18+ · FICTIONAL OFFLINE GAME · NO REAL MONEY';
export const DISCLAIMER_LONG =
  '18+ · FICTIONAL OFFLINE GAME · NO BETTING, NO CASINO MECHANICS, NO REAL-MONEY REWARDS';

/** Roman slot labels - plain ASCII, never a special glyph. */
export const SLOT_LABELS = ['I', 'II', 'III', 'IV'];

export const DEFAULT_SETTINGS = {
  expertLocks: false,
  clueRings: true,
  reducedMotion: false,
  keepRun: true,
};
export type GameSettings = typeof DEFAULT_SETTINGS;
