/**
 * Golden Vault Expedition
 * Navigation is a state machine - one Screen union, conditional render,
 * no navigation library anywhere.
 *
 * Four *Screen.tsx files (Loader / Menu / Game / GameOver) and four full-screen
 * panels in src/panels. The panels are real screens for the player; they stay
 * out of the src/screens glob on purpose (see the design doc).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, AppState, BackHandler, StatusBar, StyleSheet, View } from 'react-native';

import { theme } from './src/constants/theme';
import { TIMING } from './src/constants/config';
import { RunState, nodeStatesFor, routeRequired, effectiveMultiplier } from './src/game/expedition';
import { RunSummary, RouteKey } from './src/game/types';
import { countOwned } from './src/game/vaultStore';
import { useExpedition } from './src/hooks/useExpedition';
import { useVaultStore } from './src/hooks/useVaultStore';

import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { ExpeditionMapPanel } from './src/panels/ExpeditionMapPanel';
import { ArtifactArchivePanel } from './src/panels/ArtifactArchivePanel';
import { ProgressPanel } from './src/panels/ProgressPanel';
import { SettingsPanel } from './src/panels/SettingsPanel';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'archive' | 'progress' | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const screenRef = useRef<Screen>(screen);
  screenRef.current = screen;
  const originRef = useRef<Screen>('menu');
  const attemptRef = useRef(0);

  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [burnedInRun, setBurnedInRun] = useState(0);

  const { vault, updateSettings, commit, reset, flush } = useVaultStore();
  const vaultRef = useRef(vault);
  vaultRef.current = vault;

  const handleRunEnd = useCallback(
    (finished: RunState) => {
      if (!finished.summary) {
        return;
      }
      commit({
        summary: finished.summary,
        carried: finished.carried,
        routeCounts: finished.routeCounts,
        torchesBurned: finished.torchesBurned,
        attempts: finished.totalAttempts,
        cleanCracks: finished.cleanCracks,
        chambersCracked: finished.chambersCracked,
      });
      setSummary(finished.summary);
      setBurnedInRun(finished.torchesBurned);
      setScreen('gameover');
    },
    [commit],
  );

  const {
    run,
    startRun,
    selectRoute,
    enterChamber,
    tapDial,
    submit,
    burnTorch,
    burnDown,
  } = useExpedition(handleRunEnd);

  // Screen transition: fade + lift, transform/opacity only.
  const fade = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fade.setValue(0);
    lift.setValue(18);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: TIMING.screenEnter,
        useNativeDriver: true,
      }),
      Animated.spring(lift, {
        toValue: 0,
        tension: 170,
        friction: 14,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screen, fade, lift]);

  /**
   * START EXPEDITION lands on real gameplay in ONE tap: the first chamber of a
   * layer needs no route, so the run is created and entered in the same tick.
   * Route choice is a phase INSIDE the game screen, between chambers.
   */
  const startExpedition = useCallback(() => {
    attemptRef.current += 1;
    const save = vaultRef.current;
    startRun(save.unlockedLayers, attemptRef.current, save.settings, save.artifacts);
    enterChamber();
    setScreen('game');
  }, [startRun, enterChamber]);

  const openSub = useCallback((next: Screen) => {
    originRef.current = screenRef.current;
    setScreen(next);
  }, []);

  const closeSub = useCallback(() => {
    setScreen(originRef.current === 'gameover' ? 'gameover' : 'menu');
  }, []);

  const goMenu = useCallback(() => {
    flush();
    setScreen('menu');
  }, [flush]);

  // Android hardware Back: never lands on the loader, exits the app from Menu.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = screenRef.current;
      if (current === 'loader') {
        return true;
      }
      if (current === 'menu') {
        return false;
      }
      if (current === 'archive' || current === 'progress' || current === 'settings') {
        closeSub();
        return true;
      }
      setScreen('menu');
      return true;
    });
    return () => sub.remove();
  }, [closeSub]);

  // KEEP RUN ON EXIT: off drops the in-flight expedition when backgrounded.
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (next !== 'background') {
        return;
      }
      flush();
      if (!vaultRef.current.settings.keepRun && screenRef.current === 'game') {
        setScreen('menu');
      }
    });
    return () => sub.remove();
  }, [flush]);

  const reducedMotion = vault.settings.reducedMotion;

  const menuView = (
    <MenuScreen
      bestScore={vault.bestScore}
      deepestLayer={vault.deepestLayer}
      artifactsOwned={countOwned(vault)}
      unlockedLayers={vault.unlockedLayers}
      reducedMotion={reducedMotion}
      onPlay={startExpedition}
      onArchive={() => openSub('archive')}
      onProgress={() => openSub('progress')}
      onSettings={() => openSub('settings')}
    />
  );

  let content: React.ReactNode = null;

  if (screen === 'loader') {
    content = <LoaderScreen onDone={() => setScreen('menu')} reducedMotion={reducedMotion} />;
  } else if (screen === 'menu') {
    content = menuView;
  } else if (screen === 'game' && run.chamber) {
    content = (
      <GameScreen
        spec={run.chamber}
        guess={run.guess}
        revealed={run.revealed}
        attempts={run.attempts}
        torches={run.torches}
        multiplier={effectiveMultiplier(run)}
        chamberIndex={run.chamberIndex}
        layer={run.layer}
        resolving={run.resolving}
        banner={run.banner}
        shakeTick={run.shakeTick}
        crackTick={run.crackTick}
        clueRings={vault.settings.clueRings}
        reducedMotion={reducedMotion}
        onDialPress={tapDial}
        onSubmit={submit}
        onBurnTorch={burnTorch}
        onBurnDown={burnDown}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'game') {
    // Between two chambers the run holds no chamber spec: the route phase of the
    // game screen, never a flash of the menu.
    content = (
      <ExpeditionMapPanel
        layer={run.layer}
        chamberIndex={run.chamberIndex}
        chambersCracked={run.chambersCracked}
        torches={run.torches}
        nodes={nodeStatesFor(run.chamberIndex, run.chambersCracked)}
        routes={run.routes}
        selectedRoute={run.selectedRoute}
        needsRoute={routeRequired(run)}
        reducedMotion={reducedMotion}
        onSelectRoute={(key: RouteKey) => selectRoute(key)}
        onEnter={enterChamber}
        onBack={goMenu}
      />
    );
  } else if (screen === 'gameover' && summary) {
    content = (
      <GameOverScreen
        summary={summary}
        torchesBurned={burnedInRun}
        reducedMotion={reducedMotion}
        onAgain={startExpedition}
        onArchive={() => openSub('archive')}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'archive') {
    content = (
      <ArtifactArchivePanel
        artifacts={vault.artifacts}
        unlockedLayers={vault.unlockedLayers}
        reducedMotion={reducedMotion}
        onMenu={closeSub}
      />
    );
  } else if (screen === 'progress') {
    content = <ProgressPanel vault={vault} reducedMotion={reducedMotion} onMenu={closeSub} />;
  } else if (screen === 'settings') {
    content = (
      <SettingsPanel
        settings={vault.settings}
        reducedMotion={reducedMotion}
        onChange={updateSettings}
        onReset={reset}
        onMenu={closeSub}
      />
    );
  } else {
    content = menuView;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.screen, { opacity: fade, transform: [{ translateY: lift }] }]}>
        {content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  screen: {
    flex: 1,
  },
});

export default App;
