import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { Clue } from '../game/types';

interface Props {
  clues: Clue[];
  visible: boolean;
}

/** Chip row of plain-ASCII clues. Renders null when empty or switched off. */
export function ClueList({ clues, visible }: Props) {
  if (!visible || clues.length === 0) {
    return null;
  }
  return (
    <View style={styles.row}>
      {clues.map(clue => (
        <View key={clue.id} style={styles.chip}>
          <Text numberOfLines={1} style={styles.text}>
            {clue.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245,215,122,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,215,122,0.22)',
  },
  text: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.goldLight,
  },
});

export default ClueList;
