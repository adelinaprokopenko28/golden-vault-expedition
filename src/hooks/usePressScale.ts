import {useCallback, useEffect, useRef} from 'react';
import {Animated} from 'react-native';

/**
 * Shared press feedback. The Pressable stays the PARENT and the Animated.View
 * lives inside it, so the animated wrapper can never swallow the tap.
 * Only `transform` is animated, so the native driver is safe.
 */
export function usePressScale(pressed: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      scale.stopAnimation();
    };
  }, [scale]);

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressed,
      tension: 180,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale, pressed]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 180,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}

export default usePressScale;
