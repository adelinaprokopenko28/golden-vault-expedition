import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { TIMING } from '../constants/config';

export type BackgroundVariant =
  | 'loader'
  | 'menu'
  | 'map'
  | 'game'
  | 'result-win'
  | 'result-lose'
  | 'plain';

const OVERLAYS: Record<BackgroundVariant, readonly string[]> = {
  loader: theme.overlays.loader,
  menu: theme.overlays.menu,
  map: theme.overlays.map,
  game: theme.overlays.game,
  'result-win': theme.overlays.resultWin,
  'result-lose': theme.overlays.resultLose,
  plain: theme.overlays.plain,
};

const GLOWS: Record<BackgroundVariant, [string, string]> = {
  loader: [theme.colors.ember, theme.colors.gold],
  menu: [theme.colors.gold, theme.colors.ember],
  map: [theme.colors.gold, theme.colors.steel],
  game: [theme.colors.ember, theme.colors.gold],
  'result-win': [theme.colors.goldLight, theme.colors.gold],
  'result-lose': [theme.colors.danger, theme.colors.ember],
  plain: [theme.colors.gold, theme.colors.goldDeep],
};

interface Props {
  variant: BackgroundVariant;
  reducedMotion?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * The single source of background difference between screens: one shared art
 * file, a per-variant gradient overlay and two torch-glow blobs.
 */
export function VaultBackground({ variant, reducedMotion, children, style }: Props) {
  const flicker = useRef(new Animated.Value(0)).current;
  const [glowA, glowB] = GLOWS[variant];

  useEffect(() => {
    if (reducedMotion) {
      flicker.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, {
          toValue: 1,
          duration: TIMING.flickerLoop,
          useNativeDriver: true,
        }),
        Animated.timing(flicker, {
          toValue: 0,
          duration: TIMING.flickerLoop,
          useNativeDriver: true,
        }),
      ]),
      // Bounded on purpose: an endless loop keeps the window non-idle and
      // wedges `uiautomator dump` on EVERY screen (this background is shared).
      { iterations: 4 },
    );
    loop.start();
    return () => loop.stop();
  }, [flicker, reducedMotion]);

  const emberOpacity = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.17] });
  const goldOpacity = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.09, 0.05] });

  return (
    <ImageBackground source={assets.bgGame} resizeMode="cover" style={[styles.root, style]}>
      <LinearGradient
        colors={OVERLAYS[variant] as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          styles.glowTop,
          { backgroundColor: glowA, opacity: emberOpacity },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          styles.glowBottom,
          { backgroundColor: glowB, opacity: goldOpacity },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  glowTop: {
    top: -56,
    left: -70,
  },
  glowBottom: {
    bottom: 30,
    right: -60,
  },
});

export default VaultBackground;
