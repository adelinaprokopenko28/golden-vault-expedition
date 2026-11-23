import { Rng } from './rng';
import { RouteOption, RouteKey } from './types';

export const ROUTE_ORDER: RouteKey[] = ['safe', 'rich', 'deep'];

export const ROUTE_LABELS: Record<RouteKey, string> = {
  safe: 'SAFE PASSAGE',
  rich: 'RICH SEAM',
  deep: 'DEEP DESCENT',
};

/**
 * Always one card of each family, with varying numeric effects, so the panel is
 * generated content rather than three constants.
 */
export function rollRoutes(rng: Rng): RouteOption[] {
  const safeTorches = rng.int(1, 3);
  const deepBoost = rng.next() < 0.5 ? 1.5 : 2;

  return [
    {
      key: 'safe',
      name: ROUTE_LABELS.safe,
      torches: safeTorches,
      stepDelta: -1,
      layerDelta: 0,
      multiplierBoost: 1,
      rarityBias: 'common',
      lines: ['+' + safeTorches + ' TORCHES', 'EASIER LOCK'],
    },
    {
      key: 'rich',
      name: ROUTE_LABELS.rich,
      torches: 0,
      stepDelta: 0,
      layerDelta: 0,
      multiplierBoost: 1,
      rarityBias: 'rare',
      lines: ['RARE ARTIFACT', 'SAME LOCK'],
    },
    {
      key: 'deep',
      name: ROUTE_LABELS.deep,
      torches: -1,
      stepDelta: 1,
      layerDelta: 1,
      multiplierBoost: deepBoost,
      rarityBias: 'prime',
      lines: ['-1 TORCH · HARDER', 'SCORE x' + deepBoost],
    },
  ];
}

export function routeByKey(routes: RouteOption[], key: RouteKey | null): RouteOption | null {
  if (!key) {
    return null;
  }
  return routes.find(r => r.key === key) || null;
}
