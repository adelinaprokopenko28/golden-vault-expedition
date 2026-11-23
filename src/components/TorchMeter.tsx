import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Flame } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { TORCHES_START } from '../constants/config';

interface Props {
  torches: number;
  max?: number;
  compact?: boolean;
  /** 0 -> full torch, 1 -> about to burn out. Plain number, ticked at 2 Hz. */
  burn?: number;
}

/** Ember pip row plus the burn-down countdown bar. */
export function TorchMeter({ torches, max = TORCHES_START, compact, burn }: Props) {
  const shown = Math.max(max, torches);
  const pips: React.ReactElement[] = [];
  for (let i = 0; i < shown; i++) {
    pips.push(
      <View
        key={'pip' + i}
        style={[styles.pip, i < torches ? styles.pipLit : styles.pipDark]}
      />,
    );
  }

  if (compact) {
    return (
      <View style={styles.compact}>
        <Flame size={18} color={theme.colors.ember} strokeWidth={2.4} />
        <Text style={styles.compactValue}>{'x' + torches}</Text>
      </View>
    );
  }

  // A plain percentage repainted on the hook's 2 Hz tick - no per-frame tween,
  // so the game window still reaches idle for `uiautomator dump`.
  const left = burn === undefined ? 1 : Math.max(0, Math.min(1, 1 - burn));
  const width: any = Math.round(left * 100) + '%';

  return (
    <View style={styles.root}>
      <View style={styles.pipRow}>{pips}</View>
      <View style={styles.track}>
        <View pointerEvents="none" style={[styles.fill, { width }]}>
          <LinearGradient
            colors={theme.gradients.ember as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  pipRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 5,
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  pipLit: {
    backgroundColor: theme.colors.ember,
    borderColor: '#F7B07A',
  },
  pipDark: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.cold,
  },
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(224,122,47,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(224,122,47,0.35)',
  },
  compactValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});

export default TorchMeter;
