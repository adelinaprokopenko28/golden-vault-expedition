import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Eye, Key} from 'lucide-react-native';
import assets from '../assets';
import ConfirmPanel from '../components/ConfirmPanel';
import EmptyState from '../components/EmptyState';
import GuessRow from '../components/GuessRow';
import LockBoard from '../components/LockBoard';
import MetalPanel from '../components/MetalPanel';
import PrimaryPlateButton from '../components/PrimaryPlateButton';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import TorchMeter from '../components/TorchMeter';
import VaultBackground from '../components/VaultBackground';
import {REVEAL_COST, REVEAL_COST_CIPHER} from '../constants/config';
import theme from '../constants/theme';
import type {Chamber, Perks, Settings} from '../game/types';
import {useLockPuzzle} from '../hooks/useLockPuzzle';

const CRACK_HOLD_MS = 900;

interface Props {
  chamber: Chamber;
  chamberNumber: number;
  totalChambers: number;
  seed: number;
  torches: number;
  settings: Settings;
  perks: Perks;
  firstChamber: boolean;
  onSpend: (amount: number) => number;
  onCracked: (guessesUsed: number) => void;
  onGameOver: () => void;
  onAbandon: () => void;
}

export function ChamberPuzzleScreen({
  chamber,
  chamberNumber,
  totalChambers,
  seed,
  torches,
  settings,
  perks,
  firstChamber,
  onSpend,
  onCracked,
  onGameOver,
  onAbandon,
}: Props) {
  const [paused, setPaused] = useState(false);
  const flash = useRef(new Animated.Value(0)).current;
  const crackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crackedRef = useRef(onCracked);
  const overRef = useRef(onGameOver);
  crackedRef.current = onCracked;
  overRef.current = onGameOver;

  useEffect(() => {
    return () => {
      if (crackTimer.current) {
        clearTimeout(crackTimer.current);
        crackTimer.current = null;
      }
      flash.stopAnimation();
    };
  }, [flash]);

  const handleCracked = useCallback(
    (guessesUsed: number) => {
      Animated.sequence([
        Animated.timing(flash, {toValue: 0.7, duration: 180, useNativeDriver: true}),
        Animated.timing(flash, {toValue: 0, duration: 240, useNativeDriver: true}),
      ]).start();
      crackTimer.current = setTimeout(() => {
        crackTimer.current = null;
        crackedRef.current(guessesUsed);
      }, CRACK_HOLD_MS);
    },
    [flash],
  );

  const handleOutOfTorches = useCallback(() => {
    overRef.current();
  }, []);

  const revealCost = perks.cipher ? REVEAL_COST_CIPHER : REVEAL_COST;

  const puzzle = useLockPuzzle({
    lockLength: chamber.lockLength,
    seed,
    assistPips: settings.assistPips,
    masterKeyPreset: perks.keys && firstChamber,
    revealCost,
    torches,
    onSpend,
    onCracked: handleCracked,
    onOutOfTorches: handleOutOfTorches,
  });

  const busy = puzzle.phase !== 'idle';
  const noTorches = torches <= 0;
  const revealLabel = puzzle.hintUsed
    ? 'HINT USED'
    : torches < revealCost
    ? 'NOT ENOUGH TORCHES'
    : 'REVEAL DIGIT (' + revealCost + ' TORCHES)';

  return (
    <VaultBackground variant="puzzle">
      <ScreenHeader
        title={chamber.name}
        subtitle={'CHAMBER ' + chamberNumber + '/' + totalChambers}
        leftSlot={
          <RoundIconButton
            asset={assets.iconPause}
            label="PAUSE"
            onPress={() => setPaused(true)}
          />
        }
        rightSlot={<TorchMeter torches={torches} />}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <LockBoard
          length={chamber.lockLength}
          digits={puzzle.digits}
          lockedMask={puzzle.revealed}
          disabled={busy || noTorches}
          flash={flash}
          onStep={puzzle.step}
        />

        <Text style={styles.hint}>
          SET THE CODE, THEN GO {'·'} NO DIGIT REPEATS
        </Text>

        <View style={styles.history}>
          {puzzle.history.length === 0 ? (
            <EmptyState title={'NO READINGS YET — BURN A TORCH TO TEST A CODE'} />
          ) : (
            puzzle.history.map((guess, i) => (
              <GuessRow
                key={guess.id}
                guess={guess}
                letterMarks={settings.letterMarks}
                fresh={i === 0}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.strip}>
        <Text style={styles.stripCell}>{'TORCHES ' + torches}</Text>
        <View style={styles.stripDivider} />
        <Text style={styles.stripCell}>{'GUESS ' + puzzle.guessesUsed}</Text>
        <View style={styles.stripDivider} />
        <Text style={styles.stripCell}>{'LOCK ' + chamber.lockLength + '-DIGIT'}</Text>
      </View>

      <MetalPanel tone="cold" radius={theme.radius.xxl} style={styles.controls}>
        <View style={styles.controlsInner}>
          <PrimaryPlateButton
            label={noTorches ? 'NO TORCHES' : 'GO'}
            Icon={Key}
            onPress={puzzle.submit}
            disabled={busy || noTorches}
            height={62}
          />
          <SecondaryButton
            label={revealLabel}
            Icon={Eye}
            tone="bronze"
            height={48}
            disabled={!puzzle.canReveal}
            onPress={puzzle.reveal}
          />
        </View>
      </MetalPanel>

      {paused ? (
        <ConfirmPanel
          title="EXPEDITION PAUSED"
          message="THE TORCHES KEEP BURNING ONLY WHEN YOU PRESS GO."
          confirmLabel="ABANDON RUN"
          cancelLabel="RESUME"
          onConfirm={() => {
            setPaused(false);
            onAbandon();
          }}
          onCancel={() => setPaused(false)}
        />
      ) : null}
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  bodyContent: {paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12},
  hint: {
    marginTop: 12,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  history: {marginTop: 12},
  strip: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.recess,
    borderTopWidth: 1,
    borderTopColor: theme.colors.rail,
  },
  stripCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  stripDivider: {width: 1, height: 20, backgroundColor: theme.colors.rail},
  controls: {borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
  controlsInner: {paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18, gap: 10},
});

export default ChamberPuzzleScreen;
