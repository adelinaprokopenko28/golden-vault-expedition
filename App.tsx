import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import ScreenFade from './src/components/ScreenFade';
import theme from './src/constants/theme';
import {currentChamber, layerFinished, startingTorches} from './src/game/expedition';
import {chamberSeed} from './src/game/rng';
import type {Door, Settings} from './src/game/types';
import useExpedition from './src/hooks/useExpedition';
import useVaultSave from './src/hooks/useVaultSave';
import ArtifactArchiveScreen from './src/screens/ArtifactArchiveScreen';
import ChamberPuzzleScreen from './src/screens/ChamberPuzzleScreen';
import ExpeditionMapScreen from './src/screens/ExpeditionMapScreen';
import ExpeditionResultsScreen from './src/screens/ExpeditionResultsScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import RouteChoiceScreen from './src/screens/RouteChoiceScreen';
import SettingsScreen from './src/screens/SettingsScreen';

/** The result / game-over screen of this game, named for what it is in the flow. */
const GameOverScreen = ExpeditionResultsScreen;

type Screen =
  | 'loader'
  | 'menu'
  | 'map'
  | 'puzzle'
  | 'route'
  | 'gameover'
  | 'archive'
  | 'progress'
  | 'settings';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const vault = useVaultSave();
  const expedition = useExpedition(vault);

  const {startRun, enterCurrent, spendTorch, crackCurrent, chooseDoor, endRun, clearRun} =
    expedition;

  const goMenu = useCallback(() => {
    clearRun();
    setScreen('menu');
  }, [clearRun]);

  const beginExpedition = useCallback(() => {
    startRun();
    setScreen('map');
  }, [startRun]);

  const finish = useCallback(
    (outcome: 'cleared' | 'torches_out' | 'abandoned') => {
      endRun(outcome);
      setScreen('gameover');
    },
    [endRun],
  );

  const handleDescend = useCallback(() => {
    const run = expedition.runRef.current;
    if (!run) {
      goMenu();
      return;
    }
    if (layerFinished(run)) {
      finish('cleared');
      return;
    }
    if (!enterCurrent()) {
      finish('torches_out');
      return;
    }
    setScreen('puzzle');
  }, [enterCurrent, expedition.runRef, finish, goMenu]);

  const handleCracked = useCallback(
    (guessesUsed: number) => {
      const result = crackCurrent(guessesUsed);
      if (!result || result.finished) {
        finish('cleared');
        return;
      }
      setScreen('route');
    },
    [crackCurrent, finish],
  );

  const handleChooseDoor = useCallback(
    (door: Door) => {
      chooseDoor(door);
      setScreen('map');
    },
    [chooseDoor],
  );

  const handleToggle = useCallback(
    (key: keyof Settings, value: boolean) => {
      vault.setSetting(key, value);
    },
    [vault],
  );

  const handleReset = useCallback(() => {
    vault.resetProgress();
    clearRun();
    setScreen('menu');
  }, [clearRun, vault]);

  /* System Back follows the flow; Back on Menu closes the app, the Loader is never on the stack. */
  useEffect(() => {
    const onBack = () => {
      if (screen === 'menu') {
        return false;
      }
      if (screen === 'loader' || screen === 'route') {
        return true;
      }
      if (screen === 'puzzle') {
        setScreen('map');
        return true;
      }
      goMenu();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [goMenu, screen]);

  const run = expedition.run;
  const summary = expedition.summary;

  let content: React.ReactNode = null;

  if (screen === 'loader') {
    content = <LoaderScreen onDone={() => setScreen('menu')} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        deepestLayer={vault.save.deepestLayer}
        artifactCount={vault.artifactCount}
        startTorches={startingTorches(vault.save.deepestLayer, vault.perks)}
        onPlay={beginExpedition}
        onArchive={() => setScreen('archive')}
        onProgress={() => setScreen('progress')}
        onSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'map' && run) {
    content = (
      <ExpeditionMapScreen
        run={run}
        onDescend={handleDescend}
        onAbandon={() => finish('abandoned')}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'puzzle' && run) {
    const chamber = currentChamber(run);
    content = (
      <ChamberPuzzleScreen
        key={'chamber-' + run.layer + '-' + run.chamberIndex}
        chamber={chamber}
        chamberNumber={run.chamberIndex + 1}
        totalChambers={run.chambers.length}
        seed={chamberSeed(run.seed, run.chamberIndex, 5)}
        torches={run.torches}
        settings={vault.settings}
        perks={vault.perks}
        firstChamber={run.chamberIndex === 0}
        onSpend={spendTorch}
        onCracked={handleCracked}
        onGameOver={() => finish('torches_out')}
        onAbandon={() => finish('abandoned')}
      />
    );
  } else if (screen === 'route' && run) {
    content = (
      <RouteChoiceScreen
        doors={expedition.doors}
        torches={run.torches}
        routeIntel={vault.settings.routeIntel}
        onChoose={handleChooseDoor}
      />
    );
  } else if (screen === 'gameover' && summary) {
    content = (
      <GameOverScreen
        summary={summary}
        onAgain={beginExpedition}
        onMenu={goMenu}
        onArchive={() => setScreen('archive')}
      />
    );
  } else if (screen === 'archive') {
    content = (
      <ArtifactArchiveScreen
        artifacts={vault.save.artifacts}
        artifactCount={vault.artifactCount}
        onMenu={goMenu}
        onPlay={beginExpedition}
      />
    );
  } else if (screen === 'progress') {
    content = (
      <ProgressScreen save={vault.save} onMenu={goMenu} onPlay={beginExpedition} />
    );
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        settings={vault.settings}
        onToggle={handleToggle}
        onReset={handleReset}
        onMenu={goMenu}
      />
    );
  } else {
    content = (
      <MenuScreen
        deepestLayer={vault.save.deepestLayer}
        artifactCount={vault.artifactCount}
        startTorches={startingTorches(vault.save.deepestLayer, vault.perks)}
        onPlay={beginExpedition}
        onArchive={() => setScreen('archive')}
        onProgress={() => setScreen('progress')}
        onSettings={() => setScreen('settings')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.bg} />
      <ScreenFade screenKey={screen}>{content}</ScreenFade>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
});

export default App;
