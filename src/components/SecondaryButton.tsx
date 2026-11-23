import React from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { GlyphIcon, HIT_SLOP, ICON_BOX } from './PrimaryButton';

export type Tone = 'gold' | 'ember' | 'danger' | 'steel';

const TONES: Record<Tone, { fill: string; border: string; text: string }> = {
  gold: { fill: 'rgba(212,175,55,0.08)', border: 'rgba(245,215,122,0.28)', text: theme.colors.gold },
  ember: { fill: 'rgba(224,122,47,0.10)', border: theme.colors.ember, text: theme.colors.ember },
  danger: { fill: 'rgba(181,69,47,0.10)', border: theme.colors.danger, text: theme.colors.danger },
  steel: { fill: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.14)', text: theme.colors.textPrimary },
};

interface Props {
  label: string;
  onPress: () => void;
  Icon?: GlyphIcon;
  tone?: Tone;
  disabled?: boolean;
  sublabel?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Secondary action. Same icon box (24) and same gap (10) as the primary CTA so
 * no screen ever mixes two icon sizes.
 */
export function SecondaryButton({
  label,
  onPress,
  Icon,
  tone = 'gold',
  disabled,
  sublabel,
  height = 48,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(disabled);
  const palette = TONES[tone];
  const h = sublabel ? Math.max(height, 56) : height;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={HIT_SLOP}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height: h }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          {
            height: h,
            backgroundColor: palette.fill,
            borderColor: palette.border,
            opacity: disabled ? 0.42 : 1,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON_BOX} color={palette.text} strokeWidth={2.4} />
            </View>
          ) : null}
          <Text numberOfLines={1} style={[styles.label, { color: palette.text }]}>
            {label}
          </Text>
        </View>
        {sublabel ? (
          <Text numberOfLines={1} style={styles.sublabel}>
            {sublabel}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    minHeight: 48,
  },
  body: {
    width: '100%',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    lineHeight: ICON_BOX,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  sublabel: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
});

export default SecondaryButton;
