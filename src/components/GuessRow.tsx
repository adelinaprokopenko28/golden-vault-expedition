import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';
import type {Guess} from '../game/types';
import FeedbackPips from './FeedbackPips';

interface Props {
  guess: Guess;
  letterMarks: boolean;
  fresh: boolean;
}

/** One reading of the lock: the digits that were tried, and what came back. */
export const GuessRow = React.memo(function GuessRow({guess, letterMarks, fresh}: Props) {
  return (
    <View style={[styles.row, fresh ? styles.rowFresh : null]}>
      <Text style={styles.index}>{'#' + guess.id}</Text>
      <View style={styles.digits}>
        {guess.digits.map((d, i) => (
          <View key={i} style={styles.slot}>
            <Text style={styles.digit}>{String(d)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.pips}>
        <FeedbackPips marks={guess.feedback.marks} letterMarks={letterMarks} animate={fresh} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: theme.colors.rail,
    marginBottom: 6,
  },
  rowFresh: {borderColor: theme.border.goldStrong, backgroundColor: 'rgba(212,175,55,0.07)'},
  index: {
    width: 24,
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textFaint,
    fontVariant: ['tabular-nums'],
  },
  digits: {flexDirection: 'row', flex: 1, gap: 4},
  slot: {
    width: 22,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(10,10,14,0.85)',
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  pips: {marginLeft: 8},
});

export default GuessRow;
