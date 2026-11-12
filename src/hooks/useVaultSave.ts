import {useCallback, useMemo, useRef, useState} from 'react';
import {grantArtifact, perksFrom, totalArtifacts} from '../game/artifacts';
import {loadSave, saveNow, wipeSave} from '../game/storage';
import type {SetId, Settings, VaultSave} from '../game/types';

/**
 * The save blob plus its write-through. Every mutation goes through `commit`,
 * which writes immediately — after every chamber, every run end and every
 * settings change — and keeps a ref so animation callbacks never read a stale
 * copy of the state.
 */
export function useVaultSave() {
  const [save, setSave] = useState<VaultSave>(() => loadSave());
  const saveRef = useRef<VaultSave>(save);

  const commit = useCallback((next: VaultSave) => {
    saveRef.current = next;
    saveNow(next);
    setSave(next);
    return next;
  }, []);

  const update = useCallback(
    (fn: (current: VaultSave) => VaultSave) => commit(fn(saveRef.current)),
    [commit],
  );

  const setSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) =>
      update(current => ({
        ...current,
        settings: {...current.settings, [key]: value},
      })),
    [update],
  );

  const grantPiece = useCallback(
    (setId: SetId) =>
      update(current => ({
        ...current,
        artifacts: grantArtifact(current.artifacts, setId),
      })),
    [update],
  );

  const resetProgress = useCallback(() => {
    const fresh = wipeSave();
    saveRef.current = fresh;
    setSave(fresh);
    return fresh;
  }, []);

  const perks = useMemo(() => perksFrom(save.artifacts), [save.artifacts]);
  const artifactCount = useMemo(() => totalArtifacts(save.artifacts), [save.artifacts]);

  return {
    save,
    saveRef,
    perks,
    artifactCount,
    settings: save.settings,
    commit,
    update,
    setSetting,
    grantPiece,
    resetProgress,
  };
}

export type VaultSaveApi = ReturnType<typeof useVaultSave>;

export default useVaultSave;
