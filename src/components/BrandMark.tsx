import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, View} from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';

interface Props {
  size: number;
  spin?: boolean;
  float?: boolean;
}

/** The emblem on its round brushed plate, with the slowly turning dashed ring. */
export function BrandMark({size, spin = false, float = false}: Props) {
  const plate = Math.round(size * 1.24);
  const rotate = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0.82)).current;

  useEffect(() => {
    const anim = Animated.spring(enter, {
      toValue: 1,
      tension: 150,
      friction: 10,
      useNativeDriver: true,
    });
    anim.start();
    return () => {
      anim.stop();
    };
  }, [enter]);

  useEffect(() => {
    if (!spin) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [rotate, spin]);

  useEffect(() => {
    if (!float) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {toValue: 1, duration: 1600, useNativeDriver: true}),
        Animated.timing(bob, {toValue: 0, duration: 1600, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [bob, float]);

  const spinDeg = rotate.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});
  const translateY = bob.interpolate({inputRange: [0, 1], outputRange: [6, -6]});

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.root,
        {width: plate, height: plate, transform: [{scale: enter}, {translateY}]},
      ]}>
      <Image source={assets.buttonRound} style={{width: plate, height: plate}} resizeMode="contain" />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ring,
          {
            width: plate - 8,
            height: plate - 8,
            borderRadius: (plate - 8) / 2,
            transform: [{rotate: spinDeg}],
          },
        ]}
      />
      <View style={styles.center}>
        <Image source={assets.logo} style={{width: size, height: size}} resizeMode="contain" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {alignItems: 'center', justifyContent: 'center'},
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.border.goldStrong,
    borderStyle: 'dashed',
  },
  center: {...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center'},
});

export default BrandMark;
