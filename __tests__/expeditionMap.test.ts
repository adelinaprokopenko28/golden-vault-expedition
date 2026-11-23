import { createRun, runReducer, nodeStatesFor, canEnterChamber, routeRequired } from '../src/game/expedition';
import { DEFAULT_SETTINGS, CHAMBERS_PER_LAYER } from '../src/constants/config';

const run0 = () => createRun(1, 1, DEFAULT_SETTINGS, {});

describe('expedition map', () => {
  it('opens on the map with a full chain and the first chamber current', () => {
    const run = run0();
    expect(run.status).toBe('map');
    const nodes = nodeStatesFor(run.chamberIndex, run.chambersCracked);
    expect(nodes.length).toBe(CHAMBERS_PER_LAYER);
    expect(nodes[0]).toBe('current');
    expect(nodes[1]).toBe('locked');
  });

  it('needs no route for the first chamber and one for every later chamber', () => {
    const run = run0();
    expect(routeRequired(run)).toBe(false);
    expect(canEnterChamber(run)).toBe(true);
    expect(routeRequired({ ...run, chamberIndex: 1 })).toBe(true);
    expect(canEnterChamber({ ...run, chamberIndex: 1 })).toBe(false);
  });

  it('opens the generated chamber when the player walks in', () => {
    const run = runReducer(run0(), { type: 'ENTER_CHAMBER' });
    expect(run.status).toBe('chamber');
    expect(run.chamber).not.toBeNull();
    expect(run.guess.length).toBe((run.chamber as any).dials);
  });

  it('marks cracked chambers as cleared on the chain', () => {
    const nodes = nodeStatesFor(2, 2);
    expect(nodes[0]).toBe('cleared');
    expect(nodes[1]).toBe('cleared');
    expect(nodes[2]).toBe('current');
  });
});
