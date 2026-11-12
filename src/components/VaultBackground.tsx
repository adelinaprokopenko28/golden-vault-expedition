import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type BackdropVariant =
  | 'loader'
  | 'menu'
  | 'map'
  | 'puzzle'
  | 'route'
  | 'resultWin'
  | 'resultLose'
  | 'panel';

interface VariantSpec {
  image: number;
  colors: string[];
  locations: number[];
  blob: string;
}

const VARIANTS: Record<BackdropVariant, VariantSpec> = {
  loader: {
    image: 0.3,
    colors: ['rgba(7,7,10,0.88)', 'rgba(11,11,15,0.96)', 'rgba(4,4,6,0.99)'],
    locations: [0, 0.5, 1],
    blob: 'rgba(201,121,43,0.10)',
  },
  menu: {
    image: 1,
    colors: ['rgba(11,11,15,0.05)', 'rgba(11,11,15,0.35)', '#0B0B0F'],
    locations: [0, 0.42, 0.8],
    blob: 'rgba(212,175,55,0.10)',
  },
  map: {
    image: 0.5,
    colors: ['rgba(11,11,15,0.68)', 'rgba(11,11,15,0.88)'],
    locations: [0, 1],
    blob: 'rgba(201,121,43,0.09)',
  },
  puzzle: {
    image: 0.4,
    colors: ['rgba(11,11,15,0.82)', 'rgba(11,11,15,0.94)'],
    locations: [0, 1],
    blob: 'rgba(201,121,43,0.12)',
  },
  route: {
    image: 0.46,
    colors: ['rgba(26,17,9,0.76)', 'rgba(11,11,15,0.93)'],
    locations: [0, 1],
    blob: 'rgba(212,175,55,0.12)',
  },
  resultWin: {
    image: 0.58,
    colors: ['rgba(58,40,12,0.58)', 'rgba(11,11,15,0.93)'],
    locations: [0, 1],
    blob: 'rgba(245,215,122,0.14)',
  },
  resultLose: {
    image: 0.46,
    colors: ['rgba(20,24,34,0.72)', 'rgba(11,11,15,0.95)'],
    locations: [0, 1],
    blob: 'rgba(224,82,58,0.10)',
  },
  panel: {
    image: 0.34,
    colors: ['rgba(11,11,15,0.86)', 'rgba(11,11,15,0.95)'],
    locations: [0, 1],
    blob: 'rgba(212,175,55,0.08)',
  },
};

interface Props {
  variant: BackdropVariant;
  children?: React.ReactNode;
}

/** bg_game on every screen, told apart by its own gradient wash and bronze blobs. */
export function VaultBackground({variant, children}: Props) {
  const spec = VARIANTS[variant];
  return (
    <View style={styles.root}>
      <ImageBackground
        source={assets.bgGame}
        resizeMode="cover"
        style={styles.fill}
        imageStyle={{opacity: spec.image}}
      />
      <LinearGradient
        colors={spec.colors}
        locations={spec.locations}
        style={styles.fill}
      />
      <View
        pointerEvents="none"
        style={[styles.blobTop, {backgroundColor: spec.blob}]}
      />
      <View
        pointerEvents="none"
        style={[styles.blobBottom, {backgroundColor: spec.blob}]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: theme.colors.bg},
  fill: {...StyleSheet.absoluteFillObject},
  content: {flex: 1},
  blobTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -90,
    right: -70,
  },
  blobBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    bottom: 40,
    left: -80,
  },
});

export default VaultBackground;
