import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { TIMING } from '../constants/config';
import { usePressScale } from '../hooks/usePressScale';

export type GlyphIcon = React.ComponentType<any>;

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
/** Every button icon in this app is exactly this box. Never a decimal size. */
export const ICON_BOX = 24;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: GlyphIcon;
  disabled?: boolean;
  pulse?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * The gold CTA. Pressable is the PARENT (it owns the touch), the Animated.View
 * scale wrapper is a CHILD - the only press pattern that keeps onPress alive in
 * Android release on this stack.
 */
export function PrimaryButton({
  label,
  onPress,
  Icon,
  disabled,
  pulse,
  height = 62,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(disabled);
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!pulse || disabled) {
      glow.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: TIMING.ctaPulse / 2,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: TIMING.ctaPulse / 2,
          useNativeDriver: true,
        }),
      ]),
      // Bounded: the CTA breathes a few times, then the screen reaches idle.
      { iterations: 3 },
    );
    loop.start();
    return () => loop.stop();
  }, [glow, pulse, disabled]);

  const haloOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.42] });

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
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.body, { height, transform: [{ scale }] }, disabled ? null : theme.shadow.gold]}>
        <LinearGradient
          colors={
            (disabled ? theme.gradients.ctaDisabled : theme.gradients.cta) as string[]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={assets.buttonRect}
          resizeMode="cover"
          style={styles.plate}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.halo, { opacity: disabled ? 0 : haloOpacity }]}
        />
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON_BOX} color={disabled ? '#6E6E78' : '#1A1409'} strokeWidth={2.4} />
            </View>
          ) : null}
          <Text numberOfLines={1} style={[styles.label, disabled ? styles.labelOff : null]}>
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
    minHeight: 48,
  },
  body: {
    width: '100%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.18,
  },
  halo: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: theme.radius.lg - 1,
    borderWidth: 1,
    borderColor: '#FFF3C9',
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
    fontSize: 17,
    lineHeight: ICON_BOX,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: '#1A1409',
  },
  labelOff: {
    color: '#6E6E78',
  },
});

export default PrimaryButton;
