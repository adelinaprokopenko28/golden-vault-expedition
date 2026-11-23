import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Compass, Gem, Shield } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { RouteOption, RouteKey } from '../game/types';
import { usePressScale } from '../hooks/usePressScale';
import { GlyphIcon, HIT_SLOP } from './PrimaryButton';

const ROUTE_ICON: Record<RouteKey, GlyphIcon> = {
  safe: Shield,
  rich: Gem,
  deep: Compass,
};

const ROUTE_COLOR: Record<RouteKey, string> = {
  safe: theme.colors.steel,
  rich: theme.colors.goldLight,
  deep: theme.colors.ember,
};

interface Props {
  route: RouteOption;
  selected: boolean;
  onPress: (key: RouteKey) => void;
}

/** One fork of the tunnel. The choice literally reshapes the next chamber. */
export function RouteCard({ route, selected, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const Icon = ROUTE_ICON[route.key];
  const tint = ROUTE_COLOR[route.key];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={route.name}
      accessibilityState={{ selected }}
      hitSlop={HIT_SLOP}
      onPress={() => onPress(route.key)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          selected ? { borderColor: theme.colors.gold, borderWidth: 2, ...theme.shadow.gold } : null,
          { transform: [{ scale }] },
        ]}>
        <LinearGradient
          colors={['#1F1F28', '#16161C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.iconWrap, { backgroundColor: tint + '22', borderColor: tint + '55' }]}>
          <Icon size={24} color={tint} strokeWidth={2.4} />
        </View>
        <Text numberOfLines={2} style={styles.name}>
          {route.name}
        </Text>
        <Text numberOfLines={1} style={styles.line}>
          {route.lines[0]}
        </Text>
        <Text numberOfLines={1} style={styles.line}>
          {route.lines[1]}
        </Text>
        {selected ? (
          <View style={styles.checkStrip}>
            <Text style={styles.checkText}>{'✓ CHOSEN'}</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    flex: 1,
    height: 140,
  },
  card: {
    width: '100%',
    height: 140,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 6,
    ...theme.shadow.card,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'center',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  line: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  checkStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.22)',
  },
  checkText: {
    fontSize: 8,
    lineHeight: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.goldLight,
  },
});

export default RouteCard;
