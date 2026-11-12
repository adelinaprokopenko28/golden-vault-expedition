import {evaluateGuess} from '../src/game/lock';
import {defaultSettings, normalizeSave} from '../src/game/storage';

describe('LETTER MARKS setting', () => {
  it('is off by default', () => {
    expect(defaultSettings().letterMarks).toBe(false);
  });

  it('survives a save round trip when turned on', () => {
    const save = normalizeSave({settings: {...defaultSettings(), letterMarks: true}});
    expect(save.settings.letterMarks).toBe(true);
  });

  it('reads the pip letters straight off the feedback marks', () => {
    const feedback = evaluateGuess([4, 7, 1], [4, 1, 0]);
    expect(feedback.marks).toEqual(['E', 'P', 'X']);
    expect(feedback.marks.every(m => ['E', 'P', 'X'].includes(m))).toBe(true);
  });
});
