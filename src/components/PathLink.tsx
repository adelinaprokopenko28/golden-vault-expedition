import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';

interface Props {
  cleared: boolean;
  depthLabel: string;
}

/** The rail between two chamber plates, with its depth tick. */
export function PathLink({cleared, depthLabel}: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.depth}>{depthLabel}</Text>
      <View
        style={[
          styles.rail,
          {backgroundColor: cleared ? theme.colors.gold : theme.colors.rail},
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {height: 34, alignItems: 'center', justifyContent: 'center'},
  rail: {width: 4, height: 22, borderRadius: 2},
  depth: {
    position: 'absolute',
    left: 8,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textFaint,
    fontVariant: ['tabular-nums'],
  },
});

export default PathLink;
