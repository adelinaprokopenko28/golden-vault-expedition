import { useCallback, useEffect, useRef, useState } from 'react';
import { VaultSave } from '../game/types';
import { GameSettings } from '../constants/config';
import {
  CommitInput,
  commitRun,
  emptySave,
  loadSave,
  save as persist,
  saveNow,
  wipe,
} from '../game/vaultStore';

/**
 * Single owner of the persisted vault. Screens never touch storage directly;
 * they get values and three callbacks.
 */
export function useVaultStore() {
  const [vault, setVault] = useState<VaultSave>(emptySave);
  const [ready, setReady] = useState(false);
  const vaultRef = useRef(vault);
  vaultRef.current = vault;

  useEffect(() => {
    let alive = true;
    loadSave()
      .then(loaded => {
        if (alive) {
          setVault(loaded);
          setReady(true);
        }
      })
      .catch(() => {
        if (alive) {
          setReady(true);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setVault(prev => {
      const next: VaultSave = Object.assign({}, prev, {
        settings: Object.assign({}, prev.settings, patch),
      });
      persist(next);
      return next;
    });
  }, []);

  const commit = useCallback((input: CommitInput) => {
    setVault(prev => {
      const next = commitRun(prev, input);
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    wipe()
      .then(fresh => setVault(fresh))
      .catch(() => setVault(emptySave()));
  }, []);

  const flush = useCallback(() => {
    saveNow(vaultRef.current).catch(() => undefined);
  }, []);

  return { vault, ready, updateSettings, commit, reset, flush };
}

export default useVaultStore;
