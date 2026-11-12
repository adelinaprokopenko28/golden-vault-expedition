import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

/**
 * The one header every screen uses. Different slots per screen, identical
 * geometry everywhere, so the screens cannot drift apart visually.
 */
export function ScreenHeader({title, subtitle, leftSlot, rightSlot}: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: theme.headerTop,
    paddingBottom: 10,
    paddingHorizontal: 14,
    minHeight: 72 + theme.headerTop,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderBottomWidth: 1,
    borderBottomColor: theme.border.gold,
  },
  side: {minWidth: 64, justifyContent: 'center', alignItems: 'flex-start'},
  sideRight: {alignItems: 'flex-end'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6},
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.goldLight,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
});

export default ScreenHeader;
