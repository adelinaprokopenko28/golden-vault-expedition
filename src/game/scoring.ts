import {
  SCORE_PER_CHAMBER,
  SCORE_PER_TORCH,
  BONUS_EXPERT,
  BONUS_NO_CLUES,
  MULTIPLIER_LADDER,
  GameSettings,
} from '../constants/config';
import { artifactById } from './artifacts';

export function settingsBonus(settings: GameSettings): number {
  return (settings.expertLocks ? BONUS_EXPERT : 1) * (settings.clueRings ? 1 : BONUS_NO_CLUES);
}

export function artifactValueOf(ids: string[]): number {
  return ids.reduce((acc, id) => {
    const artifact = artifactById(id);
    return acc + (artifact ? artifact.value : 0);
  }, 0);
}

export interface ScoreInput {
  carried: string[];
  chambersCracked: number;
  torchesLeft: number;
  multiplier: number;
  settings: GameSettings;
}

export function computeScore(input: ScoreInput): number {
  const base =
    artifactValueOf(input.carried) +
    SCORE_PER_CHAMBER * input.chambersCracked +
    SCORE_PER_TORCH * Math.max(0, input.torchesLeft);
  return Math.round(base * input.multiplier * settingsBonus(input.settings));
}

/** A Clean Crack steps the ladder up; a sloppy chamber drops back to x1. */
export function stepMultiplier(current: number, cleanCrack: boolean): number {
  if (!cleanCrack) {
    return MULTIPLIER_LADDER[0];
  }
  const i = MULTIPLIER_LADDER.indexOf(current);
  const next = i < 0 ? 1 : Math.min(i + 1, MULTIPLIER_LADDER.length - 1);
  return MULTIPLIER_LADDER[next];
}
