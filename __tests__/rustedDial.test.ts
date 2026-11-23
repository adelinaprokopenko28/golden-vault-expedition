import { evaluate } from '../src/game/lock';

describe('rusted dial', () => {
  it('returns no pip until the rusted slot is actually correct', () => {
    const pips = evaluate([9, 2, 3], [1, 2, 3], [0]);
    expect(pips[0]).toBe('rust');
  });

  it('hides a CLOSE result behind the rust', () => {
    expect(evaluate([3, 2, 1], [1, 2, 3], [0])[0]).toBe('rust');
  });

  it('shows EXACT once the rusted slot is right', () => {
    expect(evaluate([1, 2, 3], [1, 2, 3], [0])[0]).toBe('exact');
  });
});
