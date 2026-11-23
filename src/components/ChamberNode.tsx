import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Key, Lock } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { NodeState } from '../game/types';
import { HIT_SLOP } from './PrimaryButton';

interface Props {
  index: number;
  state: NodeState;
  offset: number;
  reducedMotion?: boolean;
  onPress: (index: number) => void;
}

const SIZE = 58;

/** One chamber on the expedition chain. Zig-zagged so the tunnel reads as a path. */
export function ChamberNode({ index, state, offset, reducedMotion, onPress }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== 'current' || reducedMotion) {
      pulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
      // Bounded: the current-node pulse must not keep the screen busy forever.
      { iterations: 8 },
    );
    loop.start();
    return () => loop.stop();
  }, [state, reducedMotion, pulse]);

  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] });
  const haloOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'CHAMBER ' + (index + 1) + ' ' + state.toUpperCase()}
      hitSlop={HIT_SLOP}
      disabled={state !== 'current'}
      onPress={() => onPress(index)}
      style={[styles.press, { marginLeft: offset }]}>
      {state === 'current' ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.halo, { opacity: haloOpacity, transform: [{ scale: haloScale }] }]}
        />
      ) : null}
      <View
        style={[
          styles.node,
          state === 'cleared' ? styles.nodeCleared : null,
          state === 'current' ? styles.nodeCurrent : null,
          state === 'locked' ? styles.nodeLocked : null,
        ]}>
        {state === 'cleared' ? (
          <LinearGradient
            colors={theme.gradients.brass as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        {state === 'cleared' ? (
          <Key size={24} color="#1A1409" strokeWidth={2.6} />
        ) : (
          <Lock
            size={24}
            color={state === 'current' ? theme.colors.goldLight : theme.colors.lockedIcon}
            strokeWidth={2.4}
          />
        )}
      </View>
      <Text
        style={[
          styles.caption,
          state === 'locked' ? styles.captionLocked : null,
        ]}>
        {String(index + 1)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: SIZE,
    height: SIZE + 18,
    alignItems: 'center',
  },
  halo: {
    position: 'absolute',
    top: 0,
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    backgroundColor: theme.colors.gold,
  },
  node: {
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  nodeCleared: {
    backgroundColor: theme.colors.gold,
  },
  nodeCurrent: {
    backgroundColor: theme.colors.surfaceWarm,
    borderWidth: 2,
    borderColor: theme.colors.goldLight,
  },
  nodeLocked: {
    backgroundColor: theme.colors.lockedPlate,
    borderWidth: 1,
    borderColor: theme.colors.lockedBorder,
  },
  caption: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  captionLocked: {
    color: theme.colors.lockedIcon,
  },
});

export default ChamberNode;
