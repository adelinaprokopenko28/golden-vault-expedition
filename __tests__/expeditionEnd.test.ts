import { createRun, runReducer, RunState } from '../src/game/expedition';
import { DEFAULT_SETTINGS, CHAMBERS_PER_LAYER, TORCHES_START } from '../src/constants/config';

function solve(state: RunState): RunState {
  let s = state;
  const code = (s.chamber as any).code as number[];
  for (let i = 0; i < code.length; i++) {
    let guard = 0;
    while (s.guess[i] !== code[i] && guard < 20) {
      s = runReducer(s, { type: 'TAP_DIAL', slot: i });
      guard++;
    }
  }
  return runReducer(s, { type: 'SUBMIT' });
}

function playThrough(): RunState {
  let s = createRun(1, 13, DEFAULT_SETTINGS, {});
  for (let chamber = 0; chamber < CHAMBERS_PER_LAYER; chamber++) {
    if (s.status === 'map' && s.chamberIndex > 0) {
      s = runReducer(s, { type: 'SELECT_ROUTE', key: 'safe' });
    }
    s = runReducer(s, { type: 'ENTER_CHAMBER' });
    s = solve(s);
    s = runReducer(s, { type: 'CLEAR_BANNER' });
  }
  return s;
}

describe('expedition end', () => {
  it('closes with a win once every chamber of the layer is cracked', () => {
    const done = playThrough();
    expect(done.status).toBe('won');
    expect(done.chambersCracked).toBe(CHAMBERS_PER_LAYER);
  });

  it('writes a summary the result screen can render', () => {
    const done = playThrough();
    const summary = done.summary as any;
    expect(summary).not.toBeNull();
    expect(summary.outcome).toBe('won');
    expect(summary.score).toBeGreaterThan(0);
    expect(summary.carried.length).toBe(CHAMBERS_PER_LAYER);
  });

  it('closes with a loss when the torches run out', () => {
    let s = runReducer(createRun(1, 13, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
    for (let i = 0; i < TORCHES_START + 2 && s.status === 'chamber'; i++) {
      s = runReducer({ ...s, resolving: false }, { type: 'SUBMIT' });
    }
    expect(s.status).toBe('lost');
    expect((s.summary as any).outcome).toBe('lost');
  });

  it('returns to the route panel between chambers', () => {
    let s = runReducer(createRun(1, 13, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
    s = runReducer(solve(s), { type: 'CLEAR_BANNER' });
    expect(s.status).toBe('map');
    expect(s.chamberIndex).toBe(1);
    expect(s.selectedRoute).toBeNull();
    expect(s.routes.length).toBe(3);
  });
});
