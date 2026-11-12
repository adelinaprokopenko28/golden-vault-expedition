import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type {LucideIcon} from 'lucide-react-native';
import theme from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 24;

export type ButtonTone = 'gold' | 'bronze' | 'danger' | 'neutral';

const TONES: Record<ButtonTone, {fill: string; border: string; text: string}> = {
  gold: {fill: theme.fill.goldSoft, border: 'rgba(212,175,55,0.24)', text: theme.colors.goldLight},
  bronze: {fill: theme.fill.bronzeSoft, border: theme.border.bronze, text: theme.colors.bronzeLight},
  danger: {fill: theme.fill.dangerSoft, border: theme.border.danger, text: theme.colors.danger},
  neutral: {fill: 'rgba(255,255,255,0.05)', border: theme.colors.hairline, text: theme.colors.textSecondary},
};

interface Props {
  label: string;
  Icon?: LucideIcon;
  onPress: () => void;
  tone?: ButtonTone;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function SecondaryButton({
  label,
  Icon,
  onPress,
  tone = 'gold',
  disabled = false,
  height = 48,
  style,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.96);
  const spec = TONES[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled}}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, {height}, disabled ? styles.dim : null, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.anim,
          {backgroundColor: spec.fill, borderColor: spec.border, transform: [{scale}]},
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON} color={spec.text} strokeWidth={2.4} />
            </View>
          ) : null}
          <Text numberOfLines={1} style={[styles.label, {color: spec.text}]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: '100%', borderRadius: 14},
  dim: {opacity: 0.45},
  anim: {
    flex: 1,
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  iconBox: {width: ICON, height: ICON, alignItems: 'center', justifyContent: 'center'},
  label: {fontSize: 13, lineHeight: ICON, fontWeight: '700', letterSpacing: 1.4},
});

export default SecondaryButton;
