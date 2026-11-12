import {
  SETS,
  completedSets,
  emptyArtifacts,
  grantArtifact,
  perksFrom,
  pieceName,
  totalArtifacts,
} from '../src/game/artifacts';
import {SET_PIECES, TOTAL_ARTIFACTS} from '../src/constants/config';

describe('artifact sets', () => {
  it('declares five sets of three pieces', () => {
    expect(SETS).toHaveLength(5);
    expect(SETS.every(s => s.pieces.length === SET_PIECES)).toBe(true);
    expect(SETS.length * SET_PIECES).toBe(TOTAL_ARTIFACTS);
  });

  it('grants the next missing piece and caps the set', () => {
    let owned = emptyArtifacts();
    for (let i = 0; i < 5; i++) {
      owned = grantArtifact(owned, 'crown');
    }
    expect(owned.crown).toBe(SET_PIECES);
    expect(totalArtifacts(owned)).toBe(SET_PIECES);
  });

  it('flips the perk on when the set is complete', () => {
    let owned = emptyArtifacts();
    expect(perksFrom(owned).lantern).toBe(false);
    owned = grantArtifact(grantArtifact(grantArtifact(owned, 'lantern'), 'lantern'), 'lantern');
    expect(perksFrom(owned).lantern).toBe(true);
    expect(completedSets(owned)).toEqual(['lantern']);
  });

  it('names every piece with themed copy', () => {
    expect(pieceName('keys', 0)).toBe('WARD BLANK');
    expect(pieceName('keys', 9)).toBe('MASTER BOW');
  });
});
