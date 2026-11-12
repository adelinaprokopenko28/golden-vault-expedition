import {emptyArtifacts, findChance, rollArtifact} from '../src/game/artifacts';
import {mulberry32} from '../src/game/rng';
import {defaultSettings} from '../src/game/storage';
import {perksFrom} from '../src/game/artifacts';

describe('artifact drops', () => {
  const owned = emptyArtifacts();
  const perks = perksFrom(owned);
  const settings = defaultSettings();

  it('scales the chance with the door tier', () => {
    expect(findChance('safe', perks, settings)).toBe(20);
    expect(findChance('unstable', perks, settings)).toBe(40);
    expect(findChance('sealed', perks, settings)).toBe(65);
  });

  it('drops at roughly the declared rate', () => {
    const rng = mulberry32(42);
    let hits = 0;
    for (let i = 0; i < 400; i++) {
      if (rollArtifact(rng, 'sealed', owned, perks, settings).kind === 'artifact') {
        hits += 1;
      }
    }
    expect(hits).toBeGreaterThan(200);
    expect(hits).toBeLessThan(340);
  });

  it('converts the roll into torches once every set is complete', () => {
    const full = {lantern: 3, cipher: 3, crown: 3, relic: 3, keys: 3};
    const rng = mulberry32(1);
    let sawTorches = false;
    for (let i = 0; i < 50; i++) {
      const drop = rollArtifact(rng, 'sealed', full, perksFrom(full), settings);
      if (drop.kind === 'torches') {
        sawTorches = true;
      }
      expect(drop.kind === 'artifact').toBe(false);
    }
    expect(sawTorches).toBe(true);
  });
});
