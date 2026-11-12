import React from 'react';
import {StyleSheet, Text, View, type StyleProp, type ViewStyle} from 'react-native';
import type {LucideIcon} from 'lucide-react-native';
import theme from '../constants/theme';

interface Props {
  title: string;
  hint?: string;
  Icon?: LucideIcon;
  style?: StyleProp<ViewStyle>;
}

/** A themed line, never a blank area. */
export function EmptyState({title, hint, Icon, style}: Props) {
  return (
    <View style={[styles.root, style]}>
      {Icon ? (
        <View style={styles.iconBox}>
          <Icon size={28} color={theme.colors.textFaint} strokeWidth={2} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {alignItems: 'center', justifyContent: 'center', paddingVertical: 22, paddingHorizontal: 20},
  iconBox: {width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 10},
  title: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textFaint,
    textAlign: 'center',
  },
  hint: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default EmptyState;
