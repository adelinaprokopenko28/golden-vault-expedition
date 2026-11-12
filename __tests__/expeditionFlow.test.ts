import {
  advance,
  crackChamber,
  createRun,
  currentChamber,
  hasNextChamber,
  layerFinished,
  resolveOutcome,
  spendTorches,
} from '../src/game/expedition';
import {perksFrom} from '../src/game/artifacts';
import {finishRun, OUTCOME_COPY} from '../src/game/progression';
import {defaultSave} from '../src/game/storage';

describe('expedition flow', () => {
  const save = defaultSave();
  const perks = perksFrom(save.artifacts);

  function clearEverything() {
    let run = createRun(save, perks);
    while (!layerFinished(run)) {
      run = crackChamber(run, {guessesUsed: 1, perks, artifact: null, bonusTorches: 0});
      run = advance(run);
    }
    return run;
  }

  it('reaches a cleared layer by cracking every chamber', () => {
    const run = clearEverything();
    expect(hasNextChamber(run)).toBe(false);
    expect(resolveOutcome(run)).toBe('cleared');
    expect(run.locksCracked).toBe(run.chambers.length);
  });

  it('ends the run when the last torch is spent', () => {
    let run = createRun(save, perks);
    while (run.torches > 0) {
      run = spendTorches(run, 1);
    }
    expect(run.torches).toBe(0);
    expect(resolveOutcome(run)).toBe('torches_out');
  });

  it('keeps the haul on an abandoned run', () => {
    let run = createRun(save, perks);
    run = crackChamber(run, {guessesUsed: 1, perks, artifact: 'crown', bonusTorches: 0});
    const result = finishRun(save, run, 'abandoned');
    expect(result.summary.haul).toEqual(['crown']);
    expect(result.summary.outcome).toBe('abandoned');
  });

  it('names every outcome in the words of this game', () => {
    expect(OUTCOME_COPY.cleared.title).toBe('LAYER CLEARED');
    expect(OUTCOME_COPY.torches_out.title).toBe('TORCHES OUT');
    expect(OUTCOME_COPY.abandoned.title).toBe('RETREAT LOGGED');
  });

  it('advances the pointer onto the next chamber', () => {
    let run = createRun(save, perks);
    run = crackChamber(run, {guessesUsed: 1, perks, artifact: null, bonusTorches: 0});
    run = advance(run);
    expect(run.chamberIndex).toBe(1);
    expect(currentChamber(run).state).toBe('current');
  });
});
