import {Dimensions} from 'react-native';

const window = Dimensions.get('window');

export const SCREEN_W = window.width;
export const SCREEN_H = window.height;

/** Lock board geometry — derived so the widest lock (5 wheels) can never overflow. */
export const BOARD_PAD = 10;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const BOARD_GAP = 8;
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);

export function wheelSize(length: number): number {
  const inner = BOARD_MAX_W - 2 * BOARD_FRAME - (length - 1) * BOARD_GAP;
  return Math.max(44, Math.floor(inner / length));
}

export function boardWidth(length: number): number {
  return wheelSize(length) * length + (length - 1) * BOARD_GAP + 2 * BOARD_FRAME;
}
