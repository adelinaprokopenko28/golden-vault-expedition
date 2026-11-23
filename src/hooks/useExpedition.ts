import { useCallback, useEffect, useReducer, useRef } from 'react';
import { EMPTY_RUN, RunState, runReducer } from '../game/expedition';
import { RouteKey } from '../game/types';
import { GameSettings, TIMING } from '../constants/config';

/**
 * Owns the whole run state machine plus the three timers that drive it.
 * Every timer is cleared on unmount and every callback reads live values from a
 * ref, never from a stale closure.
 */
export function useExpedition(onRunEnd: (run: RunState) => void) {
  const [run, dispatch] = useReducer(runReducer, EMPTY_RUN);
  const runRef = useRef(run);
  runRef.current = run;
  const endedRef = useRef<RunState | null>(null);
  const onRunEndRef = useRef(onRunEnd);
  onRunEndRef.current = onRunEnd;

  // The 420 ms open / shake lockout - both buttons are dimmed meanwhile.
  useEffect(() => {
    if (!run.resolving) {
      return undefined;
    }
    const timer = setTimeout(() => dispatch({ type: 'RESOLVE_DONE' }), TIMING.resolveLockout);
    return () => clearTimeout(timer);
  }, [run.resolving, run.shakeTick, run.crackTick]);

  // SEAL BROKEN banner, then straight back to the route panel.
  useEffect(() => {
    if (run.status !== 'cleared') {
      return undefined;
    }
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_BANNER' }), TIMING.bannerHold);
    return () => clearTimeout(timer);
  }, [run.status, run.crackTick]);

  // Transient in-chamber banners (reveal, burn-down) fade on their own.
  useEffect(() => {
    if (run.status !== 'chamber' || !run.banner) {
      return undefined;
    }
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_BANNER' }), 1400);
    return () => clearTimeout(timer);
  }, [run.status, run.banner]);

  // Exactly one hand-off to the result screen per finished expedition.
  useEffect(() => {
    if (run.status !== 'won' && run.status !== 'lost') {
      endedRef.current = null;
      return;
    }
    if (endedRef.current === run) {
      return;
    }
    endedRef.current = run;
    onRunEndRef.current(run);
  }, [run]);

  const startRun = useCallback(
    (layer: number, attemptIndex: number, settings: GameSettings, owned: Record<string, boolean>) =>
      dispatch({ type: 'START_RUN', layer, attemptIndex, settings, owned }),
    [],
  );
  const selectRoute = useCallback((key: RouteKey) => dispatch({ type: 'SELECT_ROUTE', key }), []);
  const enterChamber = useCallback(() => dispatch({ type: 'ENTER_CHAMBER' }), []);
  const tapDial = useCallback((slot: number) => dispatch({ type: 'TAP_DIAL', slot }), []);
  const submit = useCallback(() => dispatch({ type: 'SUBMIT' }), []);
  const burnTorch = useCallback(() => dispatch({ type: 'BURN_TORCH' }), []);
  const burnDown = useCallback(() => dispatch({ type: 'BURN_DOWN' }), []);

  return {
    run,
    runRef,
    startRun,
    selectRoute,
    enterChamber,
    tapDial,
    submit,
    burnTorch,
    burnDown,
  };
}

export default useExpedition;
