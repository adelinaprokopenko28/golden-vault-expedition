import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

interface Props {
  radius?: number;
  topOnly?: boolean;
  rivets?: boolean;
  warm?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Brushed-metal surface: 2-3 stop gradient, 1px top highlight, bottom shade
 * line and optional corner rivets. Every panel in the game is one of these,
 * so the surfaces never drift between screens.
 */
export function BrassPanel({ radius = theme.radius.xl, topOnly, rivets, warm, style, children }: Props) {
  const corners: ViewStyle = topOnly
    ? { borderTopLeftRadius: radius, borderTopRightRadius: radius }
    : { borderRadius: radius };

  return (
    <View style={[styles.wrap, corners, style]}>
      <LinearGradient
        colors={(warm ? theme.gradients.panelWarm : theme.gradients.panel) as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={[StyleSheet.absoluteFill, corners]}
      />
      <View pointerEvents="none" style={[styles.highlight, corners]} />
      <View pointerEvents="none" style={styles.shade} />
      {rivets ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={[styles.rivet, styles.rivetTL]} />
          <View style={[styles.rivet, styles.rivetTR]} />
          <View style={[styles.rivet, styles.rivetBL]} />
          <View style={[styles.rivet, styles.rivetBR]} />
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,215,122,0.22)',
    ...theme.shadow.panel,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.topHighlight,
  },
  shade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.bottomShade,
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.rivet,
    borderWidth: 1,
    borderColor: theme.colors.rivetRing,
  },
  rivetTL: { top: 10, left: 10 },
  rivetTR: { top: 10, right: 10 },
  rivetBL: { bottom: 10, left: 10 },
  rivetBR: { bottom: 10, right: 10 },
});

export default BrassPanel;
