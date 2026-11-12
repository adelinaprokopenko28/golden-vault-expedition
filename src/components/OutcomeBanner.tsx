import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';
import {OUTCOME_COPY} from '../game/progression';
import type {Outcome} from '../game/types';
import MetalPanel from './MetalPanel';

interface Props {
  outcome: Outcome;
}

const COLOR: Record<Outcome, string> = {
  cleared: theme.colors.goldLight,
  torches_out: theme.colors.danger,
  abandoned: theme.colors.bronzeLight,
};

/** The result headline in the game's own words — never "You win" / "Game over". */
export function OutcomeBanner({outcome}: Props) {
  const pop = useRef(new Animated.Value(0.8)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const copy = OUTCOME_COPY[outcome];

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.spring(pop, {
        toValue: 1,
        tension: 140,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {toValue: 1, duration: 240, useNativeDriver: true}),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [fade, pop]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{opacity: fade, transform: [{scale: pop}]}}>
      <MetalPanel tone="warm" radius={theme.radius.xl} rivets style={styles.panel}>
        <View style={styles.inner}>
          <Text style={[styles.title, {color: COLOR[outcome]}]}>{copy.title}</Text>
          <View style={[styles.sweep, {backgroundColor: COLOR[outcome]}]} />
          <Text style={styles.sub}>{copy.sub}</Text>
        </View>
      </MetalPanel>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {width: '100%'},
  inner: {paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center'},
  title: {fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: 2, textAlign: 'center'},
  sweep: {width: 64, height: 2, borderRadius: 1, marginVertical: 10, opacity: 0.75},
  sub: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default OutcomeBanner;
