import React from 'react';
import {
  StyleSheet,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import StatCard, {visibleStats, type StatItem} from './StatCard';

interface Props {
  items: StatItem[];
  columns?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders a row of identical pills, or nothing at all. Fewer than two cards with
 * a real value would read as a broken skeleton, so the row is dropped instead.
 */
export function StatRow({items, columns = 3, style}: Props) {
  const shown = visibleStats(items);
  if (shown.length < 2) {
    return null;
  }
  const cols = Math.max(1, Math.min(columns, shown.length));
  const width = `${100 / cols}%` as DimensionValue;
  return (
    <View style={[styles.row, style]}>
      {shown.map(item => (
        <View key={item.key} style={[styles.slot, {width}]}>
          <StatCard value={item.value} label={item.label} accent={item.accent} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch'},
  slot: {paddingHorizontal: 4, paddingBottom: 8},
});

export default StatRow;
