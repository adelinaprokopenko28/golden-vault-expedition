import {useCallback, useRef, useState} from 'react';
import {perksFrom, rollArtifact} from '../game/artifacts';
import {
  advance,
  crackChamber,
  createRun,
  currentChamber,
  enterChamber,
  hasNextChamber,
  spendTorches,
} from '../game/expedition';
import {finishRun} from '../game/progression';
import {chamberSeed, mulberry32} from '../game/rng';
import {applyDoor, generateDoors} from '../game/routes';
import type {Door, Outcome, Run, RunSummary, SetId} from '../game/types';
import type {VaultSaveApi} from './useVaultSave';

export interface CrackResult {
  artifact: SetId | null;
  bonusTorches: number;
  finished: boolean;
}

/**
 * Owns the live run. Every mutation is written through a ref first, so timers
 * and animation callbacks read the current value instead of a stale closure.
 */
export function useExpedition(vault: VaultSaveApi) {
  const [run, setRun] = useState<Run | null>(null);
  const [doors, setDoors] = useState<Door[]>([]);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const runRef = useRef<Run | null>(null);

  const apply = useCallback((next: Run | null) => {
    runRef.current = next;
    setRun(next);
    return next;
  }, []);

  const startRun = useCallback(() => {
    const current = vault.saveRef.current;
    const fresh = createRun(current, perksFrom(current.artifacts));
    setDoors([]);
    setSummary(null);
    return apply(fresh);
  }, [apply, vault]);

  /** Pays the entry cost of the chamber the player is about to open. */
  const enterCurrent = useCallback(() => {
    const current = runRef.current;
    if (!current) {
      return false;
    }
    const next = enterChamber(current);
    if (!next) {
      return false;
    }
    apply(next);
    return true;
  }, [apply]);

  /** Burns torches and returns how many are left. */
  const spendTorch = useCallback(
    (amount: number) => {
      const current = runRef.current;
      if (!current) {
        return 0;
      }
      const next = spendTorches(current, amount);
      apply(next);
      return next.torches;
    },
    [apply],
  );

  const crackCurrent = useCallback(
    (guessesUsed: number): CrackResult | null => {
      const current = runRef.current;
      if (!current) {
        return null;
      }
      const save = vault.saveRef.current;
      const perks = perksFrom(save.artifacts);
      const chamber = currentChamber(current);
      const rng = mulberry32(chamberSeed(current.seed, current.chamberIndex, 77));
      const drop = rollArtifact(
        rng,
        chamber.tier,
        save.artifacts,
        perks,
        save.settings,
      );
      const artifact = drop.kind === 'artifact' ? drop.setId : null;
      const bonusTorches = drop.kind === 'torches' ? drop.amount : 0;

      const next = crackChamber(current, {
        guessesUsed,
        perks,
        artifact,
        bonusTorches,
      });
      apply(next);
      if (artifact) {
        vault.grantPiece(artifact);
      }

      const finished = !hasNextChamber(next);
      if (finished) {
        setDoors([]);
      } else {
        setDoors(
          generateDoors(
            chamberSeed(next.seed, next.chamberIndex, 23),
            chamber.lockLength,
          ),
        );
      }
      return {artifact, bonusTorches, finished};
    },
    [apply, vault],
  );

  /** The chosen door rewrites the next chamber, then the pointer moves onto it. */
  const chooseDoor = useCallback(
    (door: Door) => {
      const current = runRef.current;
      if (!current) {
        return null;
      }
      const next = advance(applyDoor(current, door));
      setDoors([]);
      return apply(next);
    },
    [apply],
  );

  const endRun = useCallback(
    (outcome: Outcome) => {
      const current = runRef.current;
      if (!current) {
        return null;
      }
      const result = finishRun(vault.saveRef.current, current, outcome);
      vault.commit(result.save);
      setSummary(result.summary);
      setDoors([]);
      return result.summary;
    },
    [vault],
  );

  const clearRun = useCallback(() => {
    apply(null);
    setDoors([]);
  }, [apply]);

  return {
    run,
    runRef,
    doors,
    summary,
    startRun,
    enterCurrent,
    spendTorch,
    crackCurrent,
    chooseDoor,
    endRun,
    clearRun,
  };
}

export type ExpeditionApi = ReturnType<typeof useExpedition>;

export default useExpedition;
