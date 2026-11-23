import { stepFor, difficultyFor } from '../src/game/layers';
import { DIFFICULTY, MAX_STEP } from '../src/constants/config';

describe('difficulty curve', () => {
  it('starts layer 1 at step 0', () => {
    expect(stepFor(1, 0, false)).toBe(0);
  });

  it('raises the step with depth, the route and expert locks', () => {
    expect(stepFor(2, 0, false)).toBe(1);
    expect(stepFor(2, 1, false)).toBe(2);
    expect(stepFor(2, 0, true)).toBe(2);
  });

  it('clamps the step to the table', () => {
    expect(stepFor(5, 4, true)).toBe(MAX_STEP);
    expect(stepFor(1, -4, false)).toBe(0);
  });

  it('raises dials 3 to 4 and digits 1-6 to 1-9 as the step grows', () => {
    expect(difficultyFor(0).dials).toBe(3);
    expect(difficultyFor(0).digitMax).toBe(6);
    expect(difficultyFor(MAX_STEP).dials).toBe(4);
    expect(difficultyFor(MAX_STEP).digitMax).toBe(9);
  });

  it('lowers the clue count as the step grows', () => {
    expect(DIFFICULTY[0].clues).toBeGreaterThan(DIFFICULTY[MAX_STEP].clues);
  });
});
