import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import { TIMING } from '../constants/config';
import { ChamberSpec, DialState } from '../game/types';
import { LockDial } from './LockDial';

interface Props {
  spec: ChamberSpec;
  guess: number[];
  revealed: number[];
  boardWidth: number;
  disabled?: boolean;
  shakeTick: number;
  crackTick: number;
  onDialPress: (slot: number) => void;
}

const PAD = 10;
const BORDER = 2;
export const BOARD_FRAME = PAD + BORDER;
export const DIAL_GAP = 10;
export const MAX_DIAL = 88;

/** The parent's padding AND border are both accounted for - the dials never overflow. */
export function dialSize(boardMaxWidth: number, dials: number): number {
  const raw = Math.floor((boardMaxWidth - 2 * BOARD_FRAME - (dials - 1) * DIAL_GAP) / dials);
  return Math.max(52, Math.min(MAX_DIAL, raw));
}

export function boardWidthFor(boardMaxWidth: number, dials: number): number {
  const dial = dialSize(boardMaxWidth, dials);
  return dial * dials + (dials - 1) * DIAL_GAP + 2 * BOARD_FRAME;
}

export function LockPanel({
  spec,
  guess,
  revealed,
  boardWidth,
  disabled,
  shakeTick,
  crackTick,
  onDialPress,
}: Props) {
  const shake = useRef(new Animated.Value(0)).current;
  const open = useRef(new Animated.Value(0)).current;
  const size = dialSize(boardWidth, spec.dials);

  useEffect(() => {
    if (shakeTick <= 0) {
      return;
    }
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0.7, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: TIMING.shake - 240, useNativeDriver: true }),
    ]).start();
  }, [shakeTick, shake]);

  useEffect(() => {
    if (crackTick <= 0) {
      return;
    }
    open.setValue(0);
    Animated.spring(open, {
      toValue: 1,
      tension: 160,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [crackTick, open]);

  const translateX = shake.interpolate({ inputRange: [-1, 0, 1], outputRange: [-8, 0, 8] });
  const rotate = open.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '8deg'] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.plate,
        { width: boardWidthFor(boardWidth, spec.dials), transform: [{ translateX }, { rotate }] },
      ]}>
      <LinearGradient
        colors={theme.gradients.plate as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.topLight} />
      <View pointerEvents="none" style={[styles.rivet, styles.rTL]} />
      <View pointerEvents="none" style={[styles.rivet, styles.rTR]} />
      <View pointerEvents="none" style={[styles.rivet, styles.rBL]} />
      <View pointerEvents="none" style={[styles.rivet, styles.rBR]} />
      <View style={styles.row}>
        {guess.map((digit, slot) => {
          const state: DialState =
            revealed.indexOf(slot) >= 0
              ? 'revealed'
              : spec.rusted.indexOf(slot) >= 0
              ? 'rusted'
              : 'idle';
          return (
            <LockDial
              key={'dial' + slot}
              slot={slot}
              digit={digit}
              size={size}
              state={state}
              disabled={disabled}
              onPress={onDialPress}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  plate: {
    padding: PAD,
    borderWidth: BORDER,
    borderColor: '#5A4A24',
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    ...theme.shadow.panel,
  },
  topLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.topHighlight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: DIAL_GAP,
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.rivet,
  },
  rTL: { top: 4, left: 4 },
  rTR: { top: 4, right: 4 },
  rBL: { bottom: 4, left: 4 },
  rBR: { bottom: 4, right: 4 },
});

export default LockPanel;
