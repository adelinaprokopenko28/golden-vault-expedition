import React, {useEffect, useRef} from 'react';
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Lock, Minus, Plus} from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const STEPPER = 48;
const WINDOW_MAX = 72;

interface StepperProps {
  direction: 1 | -1;
  disabled: boolean;
  onPress: () => void;
  label: string;
}

function Stepper({direction, disabled, onPress, label}: StepperProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      tension: 180,
      friction: 12,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled}}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => press(0.9)}
      onPressOut={() => press(1)}
      style={[styles.stepperPress, disabled ? styles.dim : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.stepperPlate, {transform: [{scale}]}]}>
        <Image source={assets.buttonRound} style={styles.stepperTexture} resizeMode="contain" />
        <View style={styles.stepperIconBox}>
          {direction > 0 ? (
            <Plus size={24} strokeWidth={3} color={theme.colors.goldLight} />
          ) : (
            <Minus size={24} strokeWidth={3} color={theme.colors.goldLight} />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

interface Props {
  index: number;
  value: number;
  width: number;
  locked: boolean;
  disabled: boolean;
  onStep: (index: number, delta: number) => void;
}

export function DigitWheel({index, value, width, locked, disabled, onStep}: Props) {
  const roll = useRef(new Animated.Value(0)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    roll.setValue(0);
    Animated.timing(roll, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [value, roll]);

  const translateY = roll.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });
  const opacity = roll.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0.25, 0.8, 1],
  });

  const windowH = Math.min(width, WINDOW_MAX);
  const blocked = locked || disabled;

  return (
    <View style={[styles.root, {width}]}>
      <Stepper
        direction={1}
        disabled={blocked}
        label={'INCREASE WHEEL ' + (index + 1)}
        onPress={() => onStep(index, 1)}
      />
      <LinearGradient
        colors={theme.gradients.recess}
        style={[
          styles.window,
          {width, height: windowH},
          locked ? styles.windowLocked : null,
        ]}>
        <View pointerEvents="none" style={styles.innerShadow} />
        <Animated.View
          pointerEvents="none"
          style={{transform: [{translateY}], opacity}}>
          <Text style={styles.digit}>{String(value)}</Text>
        </Animated.View>
        {locked ? (
          <View pointerEvents="none" style={styles.lockBadge}>
            <Lock size={12} strokeWidth={2.6} color={theme.colors.gold} />
          </View>
        ) : null}
      </LinearGradient>
      <Stepper
        direction={-1}
        disabled={blocked}
        label={'DECREASE WHEEL ' + (index + 1)}
        onPress={() => onStep(index, -1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {alignItems: 'center', gap: 6},
  stepperPress: {width: STEPPER, height: STEPPER},
  dim: {opacity: 0.4},
  stepperPlate: {
    width: STEPPER,
    height: STEPPER,
    borderRadius: STEPPER / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.border.goldStrong,
  },
  stepperTexture: {
    ...StyleSheet.absoluteFillObject,
    width: STEPPER,
    height: STEPPER,
    opacity: 0.55,
  },
  stepperIconBox: {width: 24, height: 24, alignItems: 'center', justifyContent: 'center'},
  window: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  windowLocked: {backgroundColor: 'rgba(212,175,55,0.18)', borderColor: theme.colors.gold},
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  digit: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  lockBadge: {position: 'absolute', top: 4, right: 4},
});

export default DigitWheel;
