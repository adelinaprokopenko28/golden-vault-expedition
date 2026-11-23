import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { HIT_SLOP } from './PrimaryButton';

interface Props {
  label: string;
  hint: string;
  value: boolean;
  onToggle: (next: boolean) => void;
}

const TRACK_W = 52;
const KNOB = 24;

/** 64px settings row with a brass switch. Every switch changes real behaviour. */
export function ToggleRow({ label, hint, value, onToggle }: Props) {
  const slide = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: value ? 1 : 0,
      tension: 220,
      friction: 16,
      useNativeDriver: true,
    }).start();
  }, [value, slide]);

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={HIT_SLOP}
      onPress={() => onToggle(!value)}
      style={styles.row}>
      <View style={styles.texts}>
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        <Text numberOfLines={2} style={styles.hint}>
          {hint}
        </Text>
      </View>
      <View
        style={[
          styles.track,
          value ? styles.trackOn : styles.trackOff,
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.knob,
            { backgroundColor: value ? theme.colors.goldLight : '#6A6A74' },
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,215,122,0.10)',
  },
  texts: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textPrimary,
  },
  hint: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.textMuted,
  },
  track: {
    width: TRACK_W,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    borderWidth: 1,
  },
  trackOn: {
    backgroundColor: 'rgba(212,175,55,0.28)',
    borderColor: theme.colors.gold,
  },
  trackOff: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: theme.colors.lockedBorder,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
  },
});

export default ToggleRow;
