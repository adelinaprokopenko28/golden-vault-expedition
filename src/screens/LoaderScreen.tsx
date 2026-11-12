import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BrandMark from '../components/BrandMark';
import VaultBackground from '../components/VaultBackground';
import {LOADER_DURATION_MS} from '../constants/config';
import theme, {DISCLAIMER} from '../constants/theme';

interface Props {
  onDone: () => void;
}

const BAR_W = 190;

/**
 * Brand card only: no PLAY button, no stat chips, no touch handler anywhere.
 * The hand-off to Menu is driven by the timer and nothing else.
 */
export function LoaderScreen({onDone}: Props) {
  const title = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timer = setTimeout(() => {
      doneRef.current();
    }, LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intro = Animated.timing(title, {
      toValue: 1,
      duration: 420,
      delay: 260,
      useNativeDriver: true,
    });
    intro.start();
    return () => {
      intro.stop();
    };
  }, [title]);

  useEffect(() => {
    /* Width cannot run on the native driver — this bar is the single exception. */
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    });
    bar.start();
    return () => {
      bar.stop();
    };
  }, [progress]);

  const titleShift = title.interpolate({inputRange: [0, 1], outputRange: [14, 0]});
  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <VaultBackground variant="loader">
      <View pointerEvents="none" style={styles.frame} />
      <View style={styles.root}>
        <BrandMark size={148} spin />
        <Animated.View
          pointerEvents="none"
          style={[styles.titleBlock, {opacity: title, transform: [{translateY: titleShift}]}]}>
          <Text style={styles.titleTop}>GOLDEN VAULT</Text>
          <Text style={styles.titleBottom}>EXPEDITION</Text>
          <Text style={styles.subtitle}>DESCEND {'·'} DEDUCE {'·'} RECOVER</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View
            pointerEvents="none"
            style={[styles.barFillBox, {width: fillWidth}]}>
            <LinearGradient
              colors={theme.gradients.progress}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING{'…'}</Text>
      </View>
      <Text style={styles.footer}>{DISCLAIMER}</Text>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    borderRadius: 20,
  },
  root: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32},
  titleBlock: {alignItems: 'center', marginTop: 26},
  titleTop: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.goldLight,
    textShadowColor: 'rgba(212,175,55,0.35)',
    textShadowRadius: 12,
  },
  titleBottom: {
    marginTop: 2,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 6,
    color: theme.colors.gold,
    textShadowColor: 'rgba(212,175,55,0.35)',
    textShadowRadius: 12,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: theme.colors.textSecondary,
  },
  barTrack: {
    marginTop: 34,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1C1C24',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.20)',
    overflow: 'hidden',
  },
  barFillBox: {height: '100%'},
  barFill: {flex: 1},
  loading: {
    marginTop: 10,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.textMuted,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    textAlign: 'center',
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    color: theme.colors.textFaint,
  },
});

export default LoaderScreen;
