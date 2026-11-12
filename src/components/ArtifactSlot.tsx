import React from 'react';
import {Image, StyleSheet, Text, View, type ImageSourcePropType} from 'react-native';
import {Lock} from 'lucide-react-native';
import theme from '../constants/theme';

const SIZE = 92;

interface Props {
  sprite?: ImageSourcePropType;
  name?: string;
  accent?: string;
  locked: boolean;
}

/** 92 x 92 plate. The sprite is contained, aspect preserved, never masked. */
export function ArtifactSlot({sprite, name, accent = theme.colors.gold, locked}: Props) {
  return (
    <View style={styles.root}>
      <View
        style={[
          styles.plate,
          locked ? styles.plateLocked : {borderColor: accent, backgroundColor: 'rgba(212,175,55,0.08)'},
        ]}>
        {locked || !sprite ? (
          <Lock size={22} strokeWidth={2.4} color="#3A3A44" />
        ) : (
          <Image source={sprite} style={styles.sprite} resizeMode="contain" />
        )}
        {locked ? null : <View style={[styles.rarityDot, {backgroundColor: accent}]} />}
      </View>
      <Text numberOfLines={2} style={[styles.name, locked ? styles.nameLocked : null]}>
        {locked ? 'NOT RECOVERED' : name || ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {width: SIZE, alignItems: 'center'},
  plate: {
    width: SIZE,
    height: SIZE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateLocked: {backgroundColor: 'rgba(10,10,14,0.7)', borderColor: theme.colors.hairline},
  sprite: {width: 60, height: 60},
  rarityDot: {position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4},
  name: {
    marginTop: 6,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  nameLocked: {color: theme.colors.textFaint},
});

export default ArtifactSlot;
