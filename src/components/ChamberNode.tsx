import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {Check, Lock} from 'lucide-react-native';
import {SPRITES} from '../assets';
import theme from '../constants/theme';
import {SET_BY_ID} from '../game/artifacts';
import type {Chamber} from '../game/types';

const SIZE = 72;

interface Props {
  chamber: Chamber;
}

/** One chamber plate on the descending chain. */
export function ChamberNode({chamber}: Props) {
  const glow = useRef(new Animated.Value(1)).current;
  const loop = useRef<Animated.CompositeAnimation | null>(null);
  const isCurrent = chamber.state === 'current';

  useEffect(() => {
    loop.current?.stop();
    if (!isCurrent) {
      glow.setValue(1);
      return;
    }
    loop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {toValue: 1.06, duration: 700, useNativeDriver: true}),
        Animated.timing(glow, {toValue: 1, duration: 700, useNativeDriver: true}),
      ]),
    );
    loop.current.start();
    return () => {
      loop.current?.stop();
    };
  }, [glow, isCurrent]);

  const sprite =
    chamber.artifact !== null ? SPRITES[SET_BY_ID[chamber.artifact].spriteIndex] : null;

  const borderColor =
    chamber.state === 'cleared'
      ? theme.colors.gold
      : chamber.state === 'current'
      ? theme.colors.bronze
      : chamber.state === 'skipped'
      ? theme.colors.textFaint
      : theme.colors.hairline;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.root, {transform: [{scale: glow}]}]}>
      <View style={[styles.plate, {borderColor}]}>
        {chamber.state === 'cleared' ? (
          sprite ? (
            <Image source={sprite} style={styles.sprite} resizeMode="contain" />
          ) : (
            <Check size={24} strokeWidth={3} color={theme.colors.goldLight} />
          )
        ) : null}
        {chamber.state === 'current' ? (
          <Text style={styles.currentLabel}>{chamber.lockLength + '-DIGIT'}</Text>
        ) : null}
        {chamber.state === 'locked' ? (
          <Lock size={22} strokeWidth={2.4} color={theme.colors.textFaint} />
        ) : null}
        {chamber.state === 'skipped' ? <Text style={styles.skipped}>SKIP</Text> : null}
      </View>
      <Text numberOfLines={1} style={styles.caption}>
        {chamber.name}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {width: 104, alignItems: 'center'},
  plate: {
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {width: 40, height: 40},
  currentLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.bronzeLight,
  },
  skipped: {fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.colors.textFaint},
  caption: {
    marginTop: 6,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default ChamberNode;
