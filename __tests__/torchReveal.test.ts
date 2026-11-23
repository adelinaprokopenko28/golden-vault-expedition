import { createRun, runReducer, RunState } from '../src/game/expedition';
import { pickReveal } from '../src/game/lock';
import { DEFAULT_SETTINGS } from '../src/constants/config';

function enter(layer: number): RunState {
  return runReducer(createRun(layer, 9, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
}

describe('burn a torch to reveal a dial', () => {
  it('spends a torch and locks one dial to its correct digit', () => {
    const start = enter(1);
    const after = runReducer(start, { type: 'BURN_TORCH' });
    expect(after.torches).toBe(start.torches - 1);
    expect(after.revealed.length).toBe(1);
    const slot = after.revealed[0];
    expect(after.guess[slot]).toBe((after.chamber as any).code[slot]);
  });

  it('refuses to reveal when it would leave the player in the dark', () => {
    const start = { ...enter(1), torches: 1 };
    expect(runReducer(start, { type: 'BURN_TORCH' })).toBe(start);
  });

  it('does not let a revealed dial be tapped again', () => {
    const after = runReducer(enter(1), { type: 'BURN_TORCH' });
    const slot = after.revealed[0];
    expect(runReducer(after, { type: 'TAP_DIAL', slot })).toBe(after);
  });

  it('reveals a rusted slot first', () => {
    const start = enter(3);
    const spec = start.chamber as any;
    if (spec.rusted.length > 0) {
      expect(spec.rusted).toContain(pickReveal(spec, [], []));
    }
    expect(pickReveal(spec, [0, 1, 2, 3].slice(0, spec.dials), [])).toBe(-1);
  });
});
