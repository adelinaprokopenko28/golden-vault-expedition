import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Diamond } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface Props {
  value: string | number;
  label: string;
  accentColor?: string;
  compact?: boolean;
}

/**
 * ONE stat component for Menu, the game strip, Result and Progress.
 *
 * Every pill in a row uses the SAME marker icon and differs only by colour,
 * value and label - three different sprites in one row never size alike.
 * Renders null when there is nothing to show, so no empty rounded box ever
 * reaches the screen.
 */
export function StatCard({ value, label, accentColor = theme.colors.gold, compact }: Props) {
  const empty =
    value === 0 || value === '0' || value === '' || value === null || value === undefined;
  if (empty) {
    return null;
  }

  if (compact) {
    return (
      <View style={styles.compactCard}>
        <View style={[styles.compactDot, { backgroundColor: accentColor }]} />
        <Text numberOfLines={1} style={[styles.compactValue, { color: accentColor }]}>
          {value}
        </Text>
        <Text numberOfLines={1} style={styles.compactLabel}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}>
        <Diamond size={28} color={accentColor} strokeWidth={2.4} />
      </View>
      <Text numberOfLines={1} style={[styles.value, { color: accentColor }]}>
        {value}
      </Text>
      <Text numberOfLines={2} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // width:'100%' and NOT flex:1 - the row slot owns the flex, the card owns the height.
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: theme.colors.hairlineSoft,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  compactCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  compactDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  compactValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  compactLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
});

export default StatCard;
