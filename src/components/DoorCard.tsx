import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {AlertTriangle, KeyRound, ShieldCheck} from 'lucide-react-native';
import {RARITY_LABEL} from '../constants/config';
import theme from '../constants/theme';
import {effectLabel} from '../game/routes';
import type {Door, Tier} from '../game/types';
import {usePressScale} from '../hooks/usePressScale';
import MetalPanel from './MetalPanel';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 24;

const TIER_COLOR: Record<Tier, string> = {
  safe: theme.colors.safe,
  unstable: theme.colors.gold,
  sealed: theme.colors.danger,
};

const TIER_ICON = {
  safe: ShieldCheck,
  unstable: AlertTriangle,
  sealed: KeyRound,
};

interface Props {
  door: Door;
  intel: boolean;
  onPress: (door: Door) => void;
}

export function DoorCard({door, intel, onPress}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.97);
  const color = TIER_COLOR[door.tier];
  const Icon = TIER_ICON[door.tier];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={door.name}
      hitSlop={HIT}
      onPress={() => onPress(door)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View pointerEvents="box-none" style={{transform: [{scale}]}}>
        <MetalPanel radius={theme.radius.xl} style={styles.panel}>
          <View style={styles.body}>
            <View style={[styles.rail, {backgroundColor: color}]} />
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <View style={styles.iconBox}>
                  <Icon size={ICON} strokeWidth={2.4} color={color} />
                </View>
                <Text numberOfLines={1} style={styles.name}>
                  {door.name}
                </Text>
              </View>
              {intel ? (
                <Text numberOfLines={2} style={styles.spec}>
                  {door.lockLength +
                    '-DIGIT LOCK · ENTRY ' +
                    door.entryCost +
                    ' TORCH · ' +
                    RARITY_LABEL[door.tier]}
                </Text>
              ) : (
                <Text numberOfLines={2} style={styles.spec}>
                  UNREAD PASSAGE {'—'} RISK UNKNOWN
                </Text>
              )}
              <Text numberOfLines={1} style={[styles.effect, {color}]}>
                {effectLabel(door)}
              </Text>
            </View>
          </View>
        </MetalPanel>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: '100%', height: 128, marginBottom: 12},
  panel: {width: '100%', height: 128},
  body: {flexDirection: 'row', height: '100%'},
  rail: {width: 10, height: '100%'},
  content: {flex: 1, paddingHorizontal: 14, paddingVertical: 14, justifyContent: 'center'},
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  iconBox: {width: ICON, height: ICON, alignItems: 'center', justifyContent: 'center'},
  name: {
    flex: 1,
    fontSize: 15,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.goldLight,
  },
  spec: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
  },
  effect: {marginTop: 8, fontSize: 10, lineHeight: 13, fontWeight: '700', letterSpacing: 1.2},
});

export default DoorCard;
