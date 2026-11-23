import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { DISCLAIMER_SHORT, LOADER_BAR_ANIM_MS, LOADER_DURATION_MS } from '../constants/config';
import { VaultBackground } from '../components/VaultBackground';

interface Props {
  onDone: () => void;
  reducedMotion?: boolean;
}

const MOTES = [
  { top: 90, left: 34 },
  { top: 140, left: 268 },
  { top: 182, left: 96 },
  { top: 216, left: 190 },
  { top: 254, left: 48 },
  { top: 288, left: 312 },
  { top: 322, left: 142 },
  { top: 360, left: 236 },
  { top: 402, left: 70 },
  { top: 438, left: 296 },
  { top: 470, left: 170 },
  { top: 506, left: 118 },
];

const RIVETS = [0, 45, 90, 135, 180, 225, 270, 315];
const MEDALLION = 164;
const RIVET_R = MEDALLION / 2 - 11;

/**
 * Brand card, not a menu duplicate: no PLAY button, no stat chips, a 0.88+
 * dark overlay and an 8 s timer-driven hand-off. Never a tap-to-skip.
 */
export function LoaderScreen({ onDone, reducedMotion }: Props) {
  const pop = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pop, { toValue: 1, tension: 150, friction: 11, useNativeDriver: true }),
      Animated.timing(titleIn, {
        toValue: 1,
        duration: 420,
        delay: 240,
        useNativeDriver: true,
      }),
    ]).start();

    // Width is a layout prop -> JS driver on purpose. It runs for 1200 ms and
    // then stops: an 8 s tween would keep the splash window busy for its whole
    // life and `uiautomator dump` would never get an idle frame to read.
    const fill = Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_BAR_ANIM_MS,
      useNativeDriver: false,
    });
    fill.start();
    return () => fill.stop();
  }, [pop, titleIn, bar]);

  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const titleShift = titleIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const barWidth: any = bar.interpolate({ inputRange: [0, 1], outputRange: ['2%', '100%'] });

  return (
    <VaultBackground variant="loader" reducedMotion={reducedMotion}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {MOTES.map((m, i) => (
          <View key={'mote' + i} style={[styles.mote, { top: m.top, left: m.left }]} />
        ))}
      </View>

      <View style={styles.center}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.medallion, { opacity: pop, transform: [{ scale }] }]}>
          <LinearGradient
            colors={theme.gradients.panelWarm as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {RIVETS.map(angle => {
            const rad = (angle * Math.PI) / 180;
            return (
              <View
                key={'r' + angle}
                style={[
                  styles.rivet,
                  {
                    left: MEDALLION / 2 - 2.5 + Math.cos(rad) * RIVET_R,
                    top: MEDALLION / 2 - 2.5 + Math.sin(rad) * RIVET_R,
                  },
                ]}
              />
            );
          })}
          <Image source={assets.logo} resizeMode="contain" style={styles.logo} />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={{ opacity: titleIn, transform: [{ translateY: titleShift }] }}>
          <Text style={styles.title}>GOLDEN VAULT</Text>
          <Text style={styles.title}>EXPEDITION</Text>
          <Text style={styles.subtitle}>DEDUCE THE LOCK · KEEP THE LIGHT</Text>
        </Animated.View>

        <View style={styles.barBlock}>
          <Text style={styles.loading}>LOADING</Text>
          <View style={styles.track}>
            <Animated.View pointerEvents="none" style={[styles.fill, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.bar as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      </View>

      <Text style={styles.disclaimer}>{DISCLAIMER_SHORT}</Text>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mote: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(245,215,122,0.18)',
  },
  medallion: {
    width: MEDALLION,
    height: MEDALLION,
    borderRadius: MEDALLION / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#8A6E2F',
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 26,
    elevation: 14,
    marginBottom: 30,
  },
  rivet: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.rivet,
  },
  logo: {
    width: 104,
    height: 104,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    color: theme.colors.goldLight,
    textShadowColor: 'rgba(212,175,55,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.4,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  barBlock: {
    marginTop: 46,
    alignItems: 'center',
  },
  loading: {
    marginBottom: 10,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.textMuted,
  },
  track: {
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  disclaimer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.textFaint,
  },
});

export default LoaderScreen;
