import { createRun, runReducer, RunState } from '../src/game/expedition';
import { DEFAULT_SETTINGS, TORCHES_START } from '../src/constants/config';

function lose(): RunState {
  let s = runReducer(createRun(2, 17, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
  for (let i = 0; i < TORCHES_START + 2 && s.status === 'chamber'; i++) {
    s = runReducer({ ...s, resolving: false }, { type: 'SUBMIT' });
  }
  return s;
}

describe('win and lose states', () => {
  it('always produces a summary for the result screen', () => {
    const s = lose();
    expect(s.status).toBe('lost');
    expect(s.summary).not.toBeNull();
  });

  it('reports the layer and the chamber the run died in', () => {
    const summary = lose().summary as any;
    expect(summary.layer).toBeGreaterThanOrEqual(1);
    expect(summary.chamberIndex).toBeGreaterThanOrEqual(0);
    expect(summary.torchesLeft).toBe(0);
  });

  it('never dead-ends: a fresh run always starts with a full torch pool', () => {
    const again = createRun(lose().layer, 18, DEFAULT_SETTINGS, {});
    expect(again.torches).toBe(TORCHES_START);
    expect(again.status).toBe('map');
  });

  it('keeps the two outcomes distinct', () => {
    expect(lose().summary?.outcome).toBe('lost');
  });
});
