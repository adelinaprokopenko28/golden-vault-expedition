import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Key } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { SLOT_LABELS, TIMING } from '../constants/config';
import { DialState } from '../game/types';
import { HIT_SLOP } from './PrimaryButton';

interface Props {
  digit: number;
  slot: number;
  size: number;
  state: DialState;
  disabled?: boolean;
  onPress: (slot: number) => void;
}

const NOTCHES = 10;

function Knurl({ size, color }: { size: number; color: string }) {
  const r = size / 2;
  const lines: React.ReactElement[] = [];
  for (let i = 0; i < NOTCHES; i++) {
    const angle = (i / NOTCHES) * Math.PI * 2;
    const outer = r - 2;
    const inner = r - 8;
    lines.push(
      <Line
        key={'n' + i}
        x1={r + Math.cos(angle) * inner}
        y1={r + Math.sin(angle) * inner}
        x2={r + Math.cos(angle) * outer}
        y2={r + Math.sin(angle) * outer}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Circle cx={r} cy={r} r={r - 5} stroke={color} strokeWidth={1} fill="none" opacity={0.5} />
      {lines}
    </Svg>
  );
}

/**
 * One knurled dial. Tapping advances the digit; a revealed dial is locked gold
 * and no longer tappable; a rusted dial is tinted and captioned.
 */
export function LockDial({ digit, slot, size, state, disabled, onPress }: Props) {
  const roll = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    roll.setValue(0);
    Animated.timing(roll, {
      toValue: 1,
      duration: TIMING.dialRoll,
      useNativeDriver: true,
    }).start();
  }, [digit, roll]);

  const locked = state === 'revealed' || disabled;

  const handleIn = () => {
    if (locked) {
      return;
    }
    Animated.spring(scale, { toValue: 0.94, tension: 300, friction: 12, useNativeDriver: true }).start();
  };
  const handleOut = () => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  };

  const rotateX = roll.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['14deg', '7deg', '0deg'] });
  const digitOpacity = roll.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0.35, 0.7, 1] });

  const ringColor =
    state === 'revealed'
      ? theme.colors.goldLight
      : state === 'rusted'
      ? theme.colors.rust
      : theme.colors.rivet;
  const faceColor =
    state === 'revealed' ? 'rgba(212,175,55,0.20)' : state === 'rusted' ? 'rgba(74,58,36,0.42)' : '#171720';
  const digitColor = state === 'rusted' ? '#C9A86A' : theme.colors.goldLight;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'DIAL ' + (slot + 1) + ' VALUE ' + digit}
      hitSlop={HIT_SLOP}
      disabled={locked}
      onPress={() => onPress(slot)}
      onPressIn={handleIn}
      onPressOut={handleOut}
      style={{ width: size, height: size + 22 }}>
      <Animated.View pointerEvents="box-none" style={{ transform: [{ scale }] }}>
        <View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: ringColor,
              backgroundColor: faceColor,
            },
          ]}>
          <Knurl size={size} color={ringColor} />
          <Animated.Text
            style={[
              styles.digit,
              { color: digitColor, opacity: digitOpacity, transform: [{ rotateX }] },
            ]}>
            {digit}
          </Animated.Text>
          {state === 'revealed' ? (
            <View style={styles.badge}>
              <Key size={14} color="#1A1409" strokeWidth={2.6} />
            </View>
          ) : null}
        </View>
        <Text style={[styles.slotLabel, state === 'rusted' ? styles.slotRust : null]}>
          {state === 'rusted' ? 'RUSTED' : SLOT_LABELS[slot] || String(slot + 1)}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  digit: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  badge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
  slotRust: {
    color: '#9A7B46',
  },
});

export default LockDial;
