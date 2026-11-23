import React from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { HIT_SLOP } from './PrimaryButton';

interface IconButtonProps {
  source: ImageSourcePropType;
  label: string;
  onPress: () => void;
}

/** 44x44 round plate with a 24x24 generated glyph - used by every header. */
export function HeaderIconButton({ source, label, onPress }: IconButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.iconPress}>
      <Animated.View pointerEvents="box-none" style={[styles.iconPlate, { transform: [{ scale }] }]}>
        <Image source={assets.buttonRound} resizeMode="cover" style={styles.plateArt} />
        <Image source={source} resizeMode="contain" style={styles.glyph} />
      </Animated.View>
    </Pressable>
  );
}

interface Props {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  backIcon?: ImageSourcePropType;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

/**
 * ONE header for every screen. Screens differ only by leftSlot / title /
 * rightSlot, so the chrome can never drift between Menu, Map, Game and Result.
 */
export function ScreenHeader({ title, onBack, backLabel, backIcon, right, left }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.side}>
        {left
          ? left
          : onBack
          ? (
            <HeaderIconButton
              source={backIcon || assets.iconHome}
              label={backLabel || 'BACK'}
              onPress={onBack}
            />
          )
          : null}
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      <View style={styles.sideRight}>{right ? right : null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 44,
    paddingBottom: 10,
    paddingHorizontal: 16,
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.34)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,215,122,0.14)',
  },
  side: {
    width: 76,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    width: 76,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textPrimary,
    textShadowColor: 'rgba(0,0,0,0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconPress: {
    width: 44,
    height: 44,
  },
  iconPlate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(212,175,55,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(245,215,122,0.26)',
  },
  plateArt: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    opacity: 0.18,
  },
  glyph: {
    width: 24,
    height: 24,
  },
});

export default ScreenHeader;
