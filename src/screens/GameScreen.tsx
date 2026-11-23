import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Flame, Lock } from 'lucide-react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { CHAMBERS_PER_LAYER, TORCHES_START } from '../constants/config';
import { multiplierLabel } from '../utils/format';
import { Attempt, ChamberSpec } from '../game/types';
import { useTorchBurn } from '../hooks/useTorchBurn';
import { VaultBackground } from '../components/VaultBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { BrassPanel } from '../components/BrassPanel';
import { ClueList } from '../components/ClueList';
import { LockPanel } from '../components/LockPanel';
import { AttemptRow } from '../components/AttemptRow';
import { Banner } from '../components/Banner';
import { TorchMeter } from '../components/TorchMeter';
import { StatRow } from '../components/StatRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { PauseOverlay } from '../components/PauseOverlay';

interface Props {
  spec: ChamberSpec;
  guess: number[];
  revealed: number[];
  attempts: Attempt[];
  torches: number;
  multiplier: number;
  chamberIndex: number;
  layer: number;
  resolving: boolean;
  banner: string | null;
  shakeTick: number;
  crackTick: number;
  clueRings: boolean;
  reducedMotion: boolean;
  onDialPress: (slot: number) => void;
  onSubmit: () => void;
  onBurnTorch: () => void;
  onBurnDown: () => void;
  onMenu: () => void;
}

export function GameScreen({
  spec,
  guess,
  revealed,
  attempts,
  torches,
  multiplier,
  chamberIndex,
  layer,
  resolving,
  banner,
  shakeTick,
  crackTick,
  clueRings,
  reducedMotion,
  onDialPress,
  onSubmit,
  onBurnTorch,
  onBurnDown,
  onMenu,
}: Props) {
  const { width } = useWindowDimensions();
  const [paused, setPaused] = useState(false);
  const boardMaxWidth = Math.min(width - 32, 380);

  const burn = useTorchBurn({
    active: true,
    paused: paused || resolving,
    resetKey: chamberIndex + layer * 10,
    onBurn: onBurnDown,
  });

  const allRevealed = revealed.length >= spec.dials;
  const canBurn = torches > 1 && !allRevealed && !resolving;

  const handlePause = useCallback(() => setPaused(true), []);
  const handleResume = useCallback(() => setPaused(false), []);
  const handleMenu = useCallback(() => {
    setPaused(false);
    onMenu();
  }, [onMenu]);

  return (
    <VaultBackground variant="game" reducedMotion={reducedMotion}>
      <ScreenHeader
        title={'CHAMBER ' + (chamberIndex + 1) + ' OF ' + CHAMBERS_PER_LAYER + ' · LAYER ' + layer}
        onBack={handlePause}
        backLabel="PAUSE"
        backIcon={assets.iconPause}
        right={<TorchMeter torches={torches} compact />}
      />

      <View style={styles.board}>
        <View style={styles.clueStrip}>
          <ClueList clues={spec.clues} visible={clueRings} />
        </View>

        <LockPanel
          spec={spec}
          guess={guess}
          revealed={revealed}
          boardWidth={boardMaxWidth}
          disabled={resolving}
          shakeTick={shakeTick}
          crackTick={crackTick}
          onDialPress={onDialPress}
        />

        <View style={styles.bannerSlot}>
          <Banner text={banner} tone={crackTick > 0 && banner ? 'gold' : 'ember'} />
        </View>

        <View style={styles.history}>
          {attempts.length > 0 ? (
            attempts.map((attempt, i) => (
              <AttemptRow key={'a' + attempt.id} index={i} digits={attempt.digits} pips={attempt.pips} />
            ))
          ) : (
            <Text style={styles.noAttempts}>NO PULL YET · A LIT PIP MEANS RIGHT DIGIT, RIGHT SLOT</Text>
          )}
        </View>

        <Text style={styles.controlHint}>TAP A DIAL TO CHANGE ITS DIGIT</Text>
      </View>

      <View style={styles.strip}>
        <View style={styles.burnBarTrack}>
          <TorchMeter torches={torches} max={TORCHES_START} burn={burn} />
        </View>
        <StatRow
          compact
          items={[
            { key: 'torch', value: torches, label: 'TORCHES', color: theme.colors.ember },
            {
              key: 'multi',
              value: multiplierLabel(multiplier),
              label: 'MULTIPLIER',
              color: theme.colors.goldLight,
            },
            {
              key: 'step',
              value: 'S' + spec.step,
              label: 'LOCK GRADE',
              color: theme.colors.steel,
            },
          ]}
        />
      </View>

      <BrassPanel topOnly radius={24} rivets style={styles.controls}>
        <LinearGradient
          colors={theme.gradients.hairline as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.hairline}
          pointerEvents="none"
        />
        {/* Caption sits ABOVE the CTA - a button shadow would clip it below. */}
        <Text style={styles.ctaCaption}>SUBMIT THE COMBINATION · COSTS 1 TORCH</Text>
        <PrimaryButton label="GO" Icon={Lock} disabled={resolving} onPress={onSubmit} />
        <View style={styles.gap} />
        <SecondaryButton
          label="BURN TORCH"
          sublabel="REVEAL ONE DIAL · COSTS 1"
          Icon={Flame}
          tone="ember"
          disabled={!canBurn}
          onPress={onBurnTorch}
        />
      </BrassPanel>

      <PauseOverlay visible={paused} onResume={handleResume} onMenu={handleMenu} />
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  board: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  clueStrip: {
    minHeight: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },
  bannerSlot: {
    height: 42,
    justifyContent: 'center',
  },
  history: {
    width: '100%',
    maxWidth: 380,
    minHeight: 44,
  },
  noAttempts: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    paddingVertical: 12,
  },
  controlHint: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textSecondary,
  },
  strip: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  burnBarTrack: {
    marginBottom: 6,
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  gap: {
    height: 10,
  },
  ctaCaption: {
    marginBottom: 8,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
});

export default GameScreen;
