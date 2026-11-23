import { createRun, runReducer } from '../src/game/expedition';
import { stepFor } from '../src/game/layers';
import { computeScore, settingsBonus } from '../src/game/scoring';
import { DEFAULT_SETTINGS, BONUS_EXPERT, BONUS_NO_CLUES } from '../src/constants/config';
import { emptySave, wipe, setStorageBackend } from '../src/game/vaultStore';

describe('settings', () => {
  it('ships the documented defaults', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      expertLocks: false,
      clueRings: true,
      reducedMotion: false,
      keepRun: true,
    });
  });

  it('EXPERT LOCKS raises every chamber one grade and pays more', () => {
    expect(stepFor(2, 0, true)).toBe(stepFor(2, 0, false) + 1);
    expect(settingsBonus({ ...DEFAULT_SETTINGS, expertLocks: true })).toBeCloseTo(BONUS_EXPERT);
    const expert = runReducer(
      createRun(2, 21, { ...DEFAULT_SETTINGS, expertLocks: true }, {}),
      { type: 'ENTER_CHAMBER' },
    );
    const normal = runReducer(createRun(2, 21, DEFAULT_SETTINGS, {}), { type: 'ENTER_CHAMBER' });
    expect((expert.chamber as any).step).toBeGreaterThan((normal.chamber as any).step);
  });

  it('CLUE RINGS off pays a deduction bonus', () => {
    expect(settingsBonus({ ...DEFAULT_SETTINGS, clueRings: false })).toBeCloseTo(BONUS_NO_CLUES);
  });

  it('applies the settings bonus to the final score', () => {
    const input = {
      carried: [],
      chambersCracked: 2,
      torchesLeft: 3,
      multiplier: 1,
      settings: DEFAULT_SETTINGS,
    };
    const plain = computeScore(input);
    const expert = computeScore({ ...input, settings: { ...DEFAULT_SETTINGS, expertLocks: true } });
    expect(expert).toBeGreaterThan(plain);
  });

  it('RESET VAULT wipes the save back to empty', async () => {
    setStorageBackend(null);
    await expect(wipe()).resolves.toEqual(emptySave());
  });
});
