import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { TIMING } from '../constants/config';
import { PipKind } from '../game/types';

const PIP_COLOR: Record<PipKind, string> = {
  exact: theme.colors.gold,
  close: theme.colors.steel,
  cold: theme.colors.cold,
  rust: 'transparent',
};

function Pip({ kind, index }: { kind: PipKind; index: number }) {
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(pop, {
        toValue: 1,
        tension: 220,
        friction: 11,
        useNativeDriver: true,
      }).start();
    }, index * TIMING.pipStagger);
    return () => clearTimeout(timer);
  }, [pop, index]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pip,
        {
          backgroundColor: PIP_COLOR[kind],
          borderColor: kind === 'rust' ? theme.colors.rust : 'rgba(0,0,0,0.5)',
          borderWidth: kind === 'rust' ? 2 : 1,
          transform: [{ scale: pop }],
        },
      ]}
    />
  );
}

interface Props {
  index: number;
  digits: number[];
  pips: PipKind[];
}

/** One past attempt: the submitted digits plus the position-ordered pip set. */
export function AttemptRow({ index, digits, pips }: Props) {
  return (
    <View style={[styles.row, index === 0 ? styles.rowLatest : null]}>
      <Text style={styles.index}>{'#' + (index + 1)}</Text>
      <Text style={styles.digits}>{digits.join('  ')}</Text>
      <View style={styles.pipRow}>
        {pips.map((kind, i) => (
          <Pip key={'p' + i} kind={kind} index={i} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  rowLatest: {
    backgroundColor: 'rgba(212,175,55,0.10)',
    borderColor: 'rgba(245,215,122,0.26)',
  },
  index: {
    width: 26,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  digits: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  pipRow: {
    flexDirection: 'row',
    gap: 4,
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default AttemptRow;
