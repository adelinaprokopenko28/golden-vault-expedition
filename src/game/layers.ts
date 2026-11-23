import { DIFFICULTY, MAX_STEP, MAX_LAYERS, DifficultyStep } from '../constants/config';
import { LayerSpec } from './types';
import { clamp } from '../utils/format';

export const LAYERS: LayerSpec[] = [
  { index: 1, name: 'THE COUNTING FLOOR', title: 'LAYER 1 - THE COUNTING FLOOR' },
  { index: 2, name: 'THE ASSAY LINE', title: 'LAYER 2 - THE ASSAY LINE' },
  { index: 3, name: 'THE BULLION CAGE', title: 'LAYER 3 - THE BULLION CAGE' },
  { index: 4, name: 'THE DROWNED LEDGER', title: 'LAYER 4 - THE DROWNED LEDGER' },
  { index: 5, name: "THE FOUNDER'S CELL", title: "LAYER 5 - THE FOUNDER'S CELL" },
];

export function layerSpec(layer: number): LayerSpec {
  return LAYERS[clamp(layer, 1, MAX_LAYERS) - 1];
}

/** step = clamp(layer - 1 + routeStepDelta + (expertLocks ? 1 : 0), 0, 4) */
export function stepFor(layer: number, routeStepDelta: number, expertLocks: boolean): number {
  return clamp(layer - 1 + routeStepDelta + (expertLocks ? 1 : 0), 0, MAX_STEP);
}

export function difficultyFor(step: number): DifficultyStep {
  return DIFFICULTY[clamp(step, 0, MAX_STEP)];
}
