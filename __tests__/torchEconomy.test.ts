import { createRun, runReducer, RunState } from '../src/game/expedition';
import { DEFAULT_SETTINGS, TORCHES_START, TORCH_MAX, TORCH_REWARD_CLEAN } from '../src/constants/config';

function enter(): RunState {
  return runReducer(createRun(1, 3, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
}

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

describe('torch economy', () => {
  it('starts the expedition with the documented torch pool', () => {
    expect(enter().torches).toBe(TORCHES_START);
  });

  it('spends one torch on every pull of the handle', () => {
    const start = enter();
    const wrong = runReducer(start, { type: 'SUBMIT' });
    expect(wrong.torches).toBe(start.torches - 1);
    expect(wrong.torchesBurned).toBe(1);
  });

  it('refunds torches on a clean crack and never exceeds the cap', () => {
    const cracked = solve(enter());
    expect(cracked.status).toBe('cleared');
    expect(cracked.torches).toBe(TORCHES_START - 1 + TORCH_REWARD_CLEAN);
    expect(cracked.torches).toBeLessThanOrEqual(TORCH_MAX);
  });

  it('ends the expedition when the last torch is spent', () => {
    let s = enter();
    for (let i = 0; i < TORCHES_START + 2 && s.status === 'chamber'; i++) {
      s = runReducer({ ...s, resolving: false }, { type: 'SUBMIT' });
    }
    expect(s.status).toBe('lost');
    expect(s.torches).toBeLessThanOrEqual(0);
  });
});
