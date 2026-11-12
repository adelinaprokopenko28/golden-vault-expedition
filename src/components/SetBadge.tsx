import React from 'react';
import {Image, StyleSheet, Text, View, type ImageSourcePropType} from 'react-native';
import {Medal} from 'lucide-react-native';
import {SET_PIECES} from '../constants/config';
import theme from '../constants/theme';

const MARK = 28;

interface Props {
  setName: string;
  sprite: ImageSourcePropType;
  owned: number;
  perkText: string;
  complete: boolean;
}

export function SetBadge({setName, sprite, owned, perkText, complete}: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.titleRow}>
        <View style={styles.markBox}>
          <Image source={sprite} style={styles.mark} resizeMode="contain" />
        </View>
        <Text numberOfLines={1} style={styles.name}>
          {setName}
        </Text>
        {complete ? (
          <View style={styles.medalBox}>
            <Medal size={MARK} strokeWidth={2.4} color={theme.colors.goldLight} />
          </View>
        ) : null}
        <Text style={[styles.count, complete ? styles.countComplete : null]}>
          {owned + '/' + SET_PIECES}
        </Text>
      </View>
      <Text numberOfLines={2} style={[styles.perk, complete ? styles.perkOn : null]}>
        {(complete ? 'PERK ACTIVE · ' : 'PERK LOCKED · ') + perkText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {marginBottom: 10},
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  markBox: {width: MARK, height: MARK, alignItems: 'center', justifyContent: 'center'},
  mark: {width: MARK, height: MARK},
  medalBox: {width: MARK, height: MARK, alignItems: 'center', justifyContent: 'center'},
  name: {
    flex: 1,
    fontSize: 13,
    lineHeight: MARK,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.goldLight,
  },
  count: {
    fontSize: 12,
    lineHeight: MARK,
    fontWeight: '700',
    color: theme.colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  countComplete: {color: theme.colors.gold},
  perk: {
    marginTop: 4,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textFaint,
  },
  perkOn: {color: theme.colors.goldLight},
});

export default SetBadge;
