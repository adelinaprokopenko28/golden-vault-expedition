import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

/**
 * Press feedback the only way that survives Android release on this stack:
 * Pressable is the PARENT and owns the touch, the Animated.View is a CHILD.
 * Native driver on transform only.
 */
export function usePressScale(disabled?: boolean, to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (disabled) {
      return;
    }
    Animated.spring(scale, {
      toValue: to,
      tension: theme.anim.press.tension,
      friction: theme.anim.press.friction,
      useNativeDriver: true,
    }).start();
  }, [disabled, scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.anim.press.tension,
      friction: theme.anim.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
