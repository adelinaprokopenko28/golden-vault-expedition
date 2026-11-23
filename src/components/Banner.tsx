import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

export type BannerTone = 'gold' | 'ember';

interface Props {
  text: string | null;
  tone?: BannerTone;
}

/** The SEAL BROKEN / set-complete strip. Slides in on transform only. */
export function Banner({ text, tone = 'gold' }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!text) {
      enter.setValue(0);
      return;
    }
    enter.setValue(0);
    Animated.spring(enter, {
      toValue: 1,
      tension: 180,
      friction: 13,
      useNativeDriver: true,
    }).start();
  }, [text, enter]);

  if (!text) {
    return null;
  }

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.root, { opacity: enter, transform: [{ translateY }] }]}>
      <LinearGradient
        colors={
          (tone === 'ember' ? theme.gradients.ember : theme.gradients.cta) as string[]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <Text numberOfLines={1} style={styles.text}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    minHeight: 34,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 17,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.gold,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: '#1A1409',
  },
});

export default Banner;
