import React from 'react';
import {StyleSheet, View, type StyleProp, type ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

interface Props {
  tone?: 'cold' | 'warm' | 'recess';
  radius?: number;
  rivets?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const TONES = {
  cold: theme.gradients.metal,
  warm: theme.gradients.metalWarm,
  recess: theme.gradients.recess,
};

/** The skeuomorphic plate: gradient, top highlight, gold hairline, outer shadow. */
export function MetalPanel({
  tone = 'cold',
  radius = theme.radius.lg,
  rivets = false,
  style,
  children,
}: Props) {
  return (
    <View style={[styles.shadow, {borderRadius: radius}, style]}>
      <LinearGradient
        colors={TONES[tone]}
        style={[styles.plate, {borderRadius: radius}]}>
        <View
          pointerEvents="none"
          style={[styles.highlight, {borderTopLeftRadius: radius, borderTopRightRadius: radius}]}
        />
        {rivets ? (
          <View pointerEvents="none" style={styles.rivets}>
            <View style={[styles.rivet, styles.rivetTL]} />
            <View style={[styles.rivet, styles.rivetTR]} />
            <View style={[styles.rivet, styles.rivetBL]} />
            <View style={[styles.rivet, styles.rivetBR]} />
          </View>
        ) : null}
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {...theme.shadow.plate},
  plate: {
    borderWidth: 1,
    borderColor: theme.border.gold,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.border.highlight,
  },
  rivets: {...StyleSheet.absoluteFillObject},
  rivet: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(212,175,55,0.30)',
  },
  rivetTL: {top: 7, left: 7},
  rivetTR: {top: 7, right: 7},
  rivetBL: {bottom: 7, left: 7},
  rivetBR: {bottom: 7, right: 7},
});

export default MetalPanel;
