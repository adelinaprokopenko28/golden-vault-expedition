import { createRun, runReducer, RunState } from '../src/game/expedition';
import { DEFAULT_SETTINGS, TORCH_BURN_MS, TORCHES_START } from '../src/constants/config';

function enter(): RunState {
  return runReducer(createRun(1, 7, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
}

describe('torch burn-down', () => {
  it('burns one torch per tick spent inside a chamber', () => {
    const burned = runReducer(enter(), { type: 'BURN_DOWN' });
    expect(burned.torches).toBe(TORCHES_START - 1);
    expect(burned.torchesBurned).toBe(1);
    expect(burned.banner).toBe('A TORCH BURNED OUT');
  });

  it('never ends the round in under a minute when the player does nothing wrong', () => {
    expect(TORCHES_START * TORCH_BURN_MS).toBeGreaterThanOrEqual(60000);
  });

  it('ends the expedition when the burn-down takes the last torch', () => {
    let s = enter();
    for (let i = 0; i < TORCHES_START && s.status === 'chamber'; i++) {
      s = runReducer(s, { type: 'BURN_DOWN' });
    }
    expect(s.status).toBe('lost');
  });

  it('does not burn anything outside a chamber', () => {
    const onMap = createRun(1, 7, DEFAULT_SETTINGS, {});
    expect(runReducer(onMap, { type: 'BURN_DOWN' })).toBe(onMap);
  });
});
