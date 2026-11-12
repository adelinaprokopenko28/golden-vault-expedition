import {
  addTorches,
  createRun,
  enterChamber,
  spendTorches,
  startingTorches,
} from '../src/game/expedition';
import {perksFrom} from '../src/game/artifacts';
import {BASE_TORCHES, GUESS_COST, MAX_START_TORCHES} from '../src/constants/config';
import {defaultSave} from '../src/game/storage';

describe('torch economy', () => {
  const save = defaultSave();
  const perks = perksFrom(save.artifacts);

  it('starts with the base reserve and grows with the layer', () => {
    expect(startingTorches(1, perks)).toBe(BASE_TORCHES);
    expect(startingTorches(4, perks)).toBe(BASE_TORCHES + 3);
    expect(startingTorches(9, perks)).toBeLessThanOrEqual(MAX_START_TORCHES + 1);
  });

  it('spends a torch per guess and records it', () => {
    const run = createRun(save, perks);
    const after = spendTorches(run, GUESS_COST);
    expect(after.torches).toBe(run.torches - 1);
    expect(after.torchesSpent).toBe(1);
  });

  it('never spends below zero', () => {
    const run = {...createRun(save, perks), torches: 1};
    expect(spendTorches(run, 5).torches).toBe(0);
  });

  it('refuses a chamber that would leave no light to guess with', () => {
    const run = createRun(save, perks);
    const poor = {
      ...run,
      torches: 2,
      chambers: run.chambers.map(c => ({...c, entryCost: 2})),
    };
    expect(enterChamber(poor)).toBeNull();
  });

  it('raises the ceiling when torches are added', () => {
    const run = createRun(save, perks);
    const richer = addTorches(run, 3);
    expect(richer.torches).toBe(run.torches + 3);
    expect(richer.maxTorches).toBeGreaterThanOrEqual(richer.torches);
  });
});
