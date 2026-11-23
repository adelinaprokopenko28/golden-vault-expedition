import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { GlyphIcon } from './PrimaryButton';

interface Props {
  Icon: GlyphIcon;
  title: string;
  hint?: string;
}

/** Every list that can be empty gets this - never a blank area. */
export function EmptyState({ Icon, title, hint }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.ring}>
        <Icon size={28} color={theme.colors.lockedIcon} strokeWidth={2.2} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.lockedBorder,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 14,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  hint: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
});

export default EmptyState;
