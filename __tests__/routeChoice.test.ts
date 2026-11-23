import { rollRoutes, routeByKey, ROUTE_ORDER } from '../src/game/routes';
import { Rng } from '../src/game/rng';

describe('route choice', () => {
  it('always offers one card of each family', () => {
    for (let seed = 1; seed < 30; seed++) {
      const routes = rollRoutes(new Rng(seed * 131));
      expect(routes.map(r => r.key)).toEqual(ROUTE_ORDER);
    }
  });

  it('gives SAFE PASSAGE torches and an easier lock', () => {
    const safe = routeByKey(rollRoutes(new Rng(31)), 'safe');
    expect(safe).not.toBeNull();
    expect((safe as any).torches).toBeGreaterThan(0);
    expect((safe as any).stepDelta).toBe(-1);
  });

  it('gives RICH SEAM a rare bias at the same difficulty', () => {
    const rich = routeByKey(rollRoutes(new Rng(32)), 'rich');
    expect((rich as any).rarityBias).toBe('rare');
    expect((rich as any).stepDelta).toBe(0);
  });

  it('makes DEEP DESCENT cost a torch and raise the step and the layer', () => {
    const deep = routeByKey(rollRoutes(new Rng(33)), 'deep');
    expect((deep as any).torches).toBe(-1);
    expect((deep as any).stepDelta).toBe(1);
    expect((deep as any).layerDelta).toBe(1);
    expect((deep as any).multiplierBoost).toBeGreaterThan(1);
  });

  it('varies the numbers between runs', () => {
    const values = [];
    for (let seed = 1; seed < 40; seed++) {
      const safe = routeByKey(rollRoutes(new Rng(seed * 977)), 'safe');
      values.push((safe as any).torches);
    }
    expect(new Set(values).size).toBeGreaterThan(1);
  });

  it('returns null when nothing is selected', () => {
    expect(routeByKey(rollRoutes(new Rng(1)), null)).toBeNull();
  });
});
