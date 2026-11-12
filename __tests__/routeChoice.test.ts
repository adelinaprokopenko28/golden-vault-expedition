import {generateDoors} from '../src/game/routes';

describe('route choice', () => {
  it('offers two or three doors per junction', () => {
    for (let seed = 1; seed < 40; seed++) {
      const doors = generateDoors(seed, 4);
      expect(doors.length).toBeGreaterThanOrEqual(2);
      expect(doors.length).toBeLessThanOrEqual(3);
    }
  });

  it('gives every door a distinct tier, a cost and an effect', () => {
    const doors = generateDoors(7, 4);
    const tiers = new Set(doors.map(d => d.tier));
    expect(tiers.size).toBe(doors.length);
    doors.forEach(door => {
      expect(door.entryCost).toBeGreaterThanOrEqual(0);
      expect(door.entryCost).toBeLessThanOrEqual(2);
      expect(['cache', 'skip', 'extend']).toContain(door.effect);
      expect(door.lockLength).toBeGreaterThanOrEqual(3);
      expect(door.lockLength).toBeLessThanOrEqual(5);
    });
  });

  it('keeps the safe shaft cheaper than the sealed hall', () => {
    const doors = generateDoors(21, 4);
    const safe = doors.find(d => d.tier === 'safe');
    const sealed = doors.find(d => d.tier === 'sealed');
    if (safe && sealed) {
      expect(safe.entryCost).toBeLessThan(sealed.entryCost);
    }
  });
});
