import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {SCREEN_FADE_MS} from '../constants/config';

interface Props {
  screenKey: string;
  children: React.ReactNode;
}

/**
 * Screen changes are animated, never an instant swap. Only opacity and
 * transform are driven, so the native driver is safe, and the wrapper is
 * box-none so it can never swallow a tap meant for a button inside it.
 */
export function ScreenFade({screenKey, children}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    const run = Animated.timing(anim, {
      toValue: 1,
      duration: SCREEN_FADE_MS,
      useNativeDriver: true,
    });
    run.start();
    return () => {
      run.stop();
    };
  }, [anim, screenKey]);

  const translateY = anim.interpolate({inputRange: [0, 1], outputRange: [12, 0]});

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.root, {opacity: anim, transform: [{translateY}]}]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});

export default ScreenFade;
