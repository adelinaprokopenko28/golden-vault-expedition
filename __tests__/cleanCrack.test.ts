import { createRun, runReducer, RunState } from '../src/game/expedition';
import { stepMultiplier } from '../src/game/scoring';
import { DEFAULT_SETTINGS, MULTIPLIER_LADDER } from '../src/constants/config';

function enter(): RunState {
  return runReducer(createRun(1, 11, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
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

describe('clean crack streak', () => {
  it('steps the multiplier up the ladder on a clean crack', () => {
    expect(stepMultiplier(1, true)).toBe(MULTIPLIER_LADDER[1]);
    expect(stepMultiplier(MULTIPLIER_LADDER[1], true)).toBe(MULTIPLIER_LADDER[2]);
  });

  it('caps the ladder at the top step', () => {
    expect(stepMultiplier(MULTIPLIER_LADDER[2], true)).toBe(MULTIPLIER_LADDER[2]);
  });

  it('resets the multiplier after a sloppy chamber', () => {
    expect(stepMultiplier(MULTIPLIER_LADDER[2], false)).toBe(MULTIPLIER_LADDER[0]);
  });

  it('counts a chamber cracked within two attempts as clean', () => {
    const cracked = solve(enter());
    expect(cracked.cleanCracks).toBe(1);
    expect(cracked.multiplier).toBe(MULTIPLIER_LADDER[1]);
  });

  it('does not count a chamber that took three attempts', () => {
    let s = enter();
    s = runReducer({ ...s, resolving: false }, { type: 'SUBMIT' });
    s = runReducer({ ...s, resolving: false }, { type: 'SUBMIT' });
    s = solve({ ...s, resolving: false });
    expect(s.cleanCracks).toBe(0);
    expect(s.multiplier).toBe(MULTIPLIER_LADDER[0]);
  });
});
