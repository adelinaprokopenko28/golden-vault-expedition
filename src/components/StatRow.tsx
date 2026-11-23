import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatCard } from './StatCard';

export interface StatItem {
  key: string;
  value: string | number;
  label: string;
  color?: string;
}

interface Props {
  items: StatItem[];
  compact?: boolean;
  /** a row left with fewer than this many visible pills is not rendered at all */
  minVisible?: number;
}

function isEmpty(value: string | number): boolean {
  return value === 0 || value === '0' || value === '';
}

/**
 * Equal-width slots own the flex; the cards inside use width:'100%' so a card
 * can never collapse to a 0px-tall strip (the "floating icon" bug).
 */
export function StatRow({ items, compact, minVisible = 2 }: Props) {
  const visible = items.filter(item => !isEmpty(item.value));
  if (visible.length < minVisible) {
    return null;
  }
  return (
    <View style={[styles.row, compact ? styles.rowCompact : null]}>
      {visible.map((item, index) => (
        <View key={item.key} style={styles.slot}>
          {index > 0 && compact ? <View style={styles.divider} /> : null}
          <StatCard value={item.value} label={item.label} accentColor={item.color} compact={compact} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  rowCompact: {
    gap: 0,
  },
  slot: {
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});

export default StatRow;
