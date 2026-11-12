import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MetalPanel from './MetalPanel';
import theme from '../constants/theme';

export interface StatItem {
  key: string;
  value: string | number;
  label: string;
  accent: string;
  allowZero?: boolean;
}

/** A card with nothing to show is not rendered at all — never an empty box. */
export function hasValue(item: StatItem): boolean {
  if (typeof item.value === 'number') {
    return item.allowZero === true || item.value !== 0;
  }
  return item.value !== '' && item.value != null;
}

export function visibleStats(items: StatItem[]): StatItem[] {
  return items.filter(hasValue);
}

interface Props {
  value: string | number;
  label: string;
  accent: string;
}

export function StatCard({value, label, accent}: Props) {
  return (
    <MetalPanel radius={theme.radius.md} style={styles.card}>
      <View style={styles.inner}>
        <View style={[styles.dot, {backgroundColor: accent}]} />
        <Text numberOfLines={1} style={[styles.value, {color: accent}]}>
          {String(value)}
        </Text>
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
      </View>
    </MetalPanel>
  );
}

const styles = StyleSheet.create({
  /* width 100% — never flex:1 inside a flex:1 slot, that collapses the text. */
  card: {width: '100%'},
  inner: {width: '100%', paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center'},
  dot: {width: 8, height: 8, borderRadius: 4, marginBottom: 6},
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default StatCard;
