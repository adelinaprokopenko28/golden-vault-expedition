import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';
import type {Mark} from '../game/types';

const PIP_STYLE: Record<Mark, {bg: string; border: string; text: string}> = {
  E: {bg: theme.colors.goldLight, border: theme.colors.goldLight, text: theme.colors.onGold},
  P: {bg: 'transparent', border: theme.colors.bronze, text: theme.colors.bronze},
  X: {bg: 'transparent', border: '#3A3A44', text: '#3A3A44'},
};

interface Props {
  marks: Mark[];
  letterMarks: boolean;
  animate?: boolean;
}

/** Gold = exact, bronze ring = present, gunmetal = absent. Optional E / P / X letters. */
export function FeedbackPips({marks, letterMarks, animate = false}: Props) {
  const reveal = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (!animate) {
      reveal.setValue(1);
      return;
    }
    reveal.setValue(0);
    const anim = Animated.timing(reveal, {
      toValue: 1,
      duration: 60 * Math.max(1, marks.length),
      useNativeDriver: true,
    });
    anim.start();
    return () => {
      anim.stop();
    };
  }, [animate, marks.length, reveal]);

  return (
    <Animated.View pointerEvents="none" style={[styles.row, {opacity: reveal}]}>
      {marks.map((mark, i) => {
        const spec = PIP_STYLE[mark];
        return (
          <View
            key={i}
            style={[styles.pip, {backgroundColor: spec.bg, borderColor: spec.border}]}>
            {letterMarks ? (
              <Text style={[styles.letter, {color: spec.text}]}>{mark}</Text>
            ) : null}
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 5},
  pip: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {fontSize: 9, lineHeight: 11, fontWeight: '800'},
});

export default FeedbackPips;
