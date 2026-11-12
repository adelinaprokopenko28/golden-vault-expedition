import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type {LucideIcon} from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 24;

interface Props {
  label: string;
  Icon?: LucideIcon;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * The gold plate CTA. Pressable is the PARENT, the Animated.View is its child,
 * so a tap can never be eaten by the animated wrapper.
 */
export function PrimaryPlateButton({
  label,
  Icon,
  onPress,
  disabled = false,
  height = 60,
  style,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.96);
  const colors = disabled ? theme.gradients.goldDim : theme.gradients.gold;
  const labelColor = disabled ? theme.colors.textMuted : theme.colors.onGold;

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
        style={[styles.anim, {transform: [{scale}]}]}>
        <Image
          source={assets.buttonRect}
          style={styles.texture}
          resizeMode="cover"
        />
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}
        />
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON} color={labelColor} strokeWidth={2.4} />
            </View>
          ) : null}
          <Text numberOfLines={1} style={[styles.label, {color: labelColor}]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 18,
    ...theme.shadow.gold,
  },
  dim: {opacity: 0.5, shadowOpacity: 0},
  anim: {
    flex: 1,
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texture: {...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.5},
  gradient: {...StyleSheet.absoluteFillObject, opacity: 0.92},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  iconBox: {
    width: ICON,
    height: ICON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 2,
  },
});

export default PrimaryPlateButton;
