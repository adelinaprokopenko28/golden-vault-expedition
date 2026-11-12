import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import theme from '../constants/theme';
import {BOARD_FRAME, BOARD_GAP, boardWidth, wheelSize} from '../utils/layout';
import DigitWheel from './DigitWheel';
import MetalPanel from './MetalPanel';

interface Props {
  length: number;
  digits: number[];
  lockedMask: boolean[];
  disabled: boolean;
  flash: Animated.Value;
  onStep: (index: number, delta: number) => void;
}

/**
 * The vault door plate. Wheel size is derived from the frame formula, so even a
 * five-digit lock stays inside BOARD_MAX_W with zero overflow.
 */
export function LockBoard({length, digits, lockedMask, disabled, flash, onStep}: Props) {
  const width = wheelSize(length);
  const total = boardWidth(length);

  return (
    <MetalPanel tone="warm" radius={theme.radius.xl} rivets style={[styles.board, {width: total}]}>
      <View style={styles.inner}>
        {digits.map((value, index) => (
          <View key={index} style={index > 0 ? styles.gap : null}>
            <DigitWheel
              index={index}
              value={value}
              width={width}
              locked={lockedMask[index] === true}
              disabled={disabled}
              onStep={onStep}
            />
          </View>
        ))}
      </View>
      <Animated.View pointerEvents="none" style={[styles.flash, {opacity: flash}]} />
    </MetalPanel>
  );
}

const styles = StyleSheet.create({
  board: {alignSelf: 'center'},
  inner: {flexDirection: 'row', padding: BOARD_FRAME - 2, alignItems: 'center'},
  gap: {marginLeft: BOARD_GAP},
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.goldLight,
  },
});

export default LockBoard;
