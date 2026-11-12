import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';
import MetalPanel from './MetalPanel';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const TRACK_W = 52;
const TRACK_H = 30;
const KNOB = 24;

interface Props {
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
}

export function ToggleRow({label, description, value, onChange}: Props) {
  const slide = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    const anim = Animated.spring(slide, {
      toValue: value ? 1 : 0,
      tension: 160,
      friction: 12,
      useNativeDriver: true,
    });
    anim.start();
    return () => {
      anim.stop();
    };
  }, [slide, value]);

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{checked: value}}
      hitSlop={HIT}
      onPress={() => onChange(!value)}
      style={styles.press}>
      <MetalPanel radius={theme.radius.md} style={styles.panel}>
        <View style={styles.row}>
          <View style={styles.texts}>
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
            <Text numberOfLines={2} style={styles.description}>
              {description}
            </Text>
          </View>
          <View
            style={[
              styles.track,
              {backgroundColor: value ? theme.colors.gold : theme.colors.rail},
            ]}>
            <Animated.View
              pointerEvents="none"
              style={[styles.knob, {transform: [{translateX}]}]}
            />
          </View>
        </View>
      </MetalPanel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: '100%', height: 72, marginBottom: 10},
  panel: {width: '100%', height: 72},
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  texts: {flex: 1},
  label: {fontSize: 13, lineHeight: 18, fontWeight: '700', letterSpacing: 1.2, color: theme.colors.textPrimary},
  description: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border.gold,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: theme.colors.goldLight,
  },
});

export default ToggleRow;
