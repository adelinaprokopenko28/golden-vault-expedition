import React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const SIZE = 48;

interface Props {
  asset: ImageSourcePropType;
  onPress: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
}

/** 48 x 48 round plate with a 24 x 24 contained PNG glyph. */
export function RoundIconButton({asset, onPress, label, style}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.92);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.anim, {transform: [{scale}]}]}>
        <Image source={assets.buttonRound} style={styles.plate} resizeMode="contain" />
        <View style={styles.glyphBox}>
          <Image source={asset} style={styles.glyph} resizeMode="contain" />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: SIZE, height: SIZE},
  anim: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.border.goldStrong,
  },
  plate: {...StyleSheet.absoluteFillObject, width: SIZE, height: SIZE, opacity: 0.65},
  glyphBox: {width: 24, height: 24, alignItems: 'center', justifyContent: 'center'},
  glyph: {width: 24, height: 24},
});

export default RoundIconButton;
