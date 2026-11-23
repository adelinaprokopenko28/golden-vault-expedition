import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  title: string;
  right?: string;
}

/** Engraved uppercase label plus a brass hairline - one look for every section. */
export function SectionHeader({ title, right }: Props) {
  return (
    <View style={styles.root}>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <View style={styles.rule} />
      {right ? (
        <Text numberOfLines={1} style={styles.right}>
          {right}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textSecondary,
    textShadowColor: 'rgba(0,0,0,0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(245,215,122,0.18)',
  },
  right: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.gold,
    fontVariant: ['tabular-nums'],
  },
});

export default SectionHeader;
