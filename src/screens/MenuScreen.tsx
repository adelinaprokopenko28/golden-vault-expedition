import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Compass, Flame, Layers, Lock, Settings, TrendingUp } from 'lucide-react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { TORCHES_START, MAX_LAYERS } from '../constants/config';
import { groupNumber } from '../utils/format';
import { VaultBackground } from '../components/VaultBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { BrassPanel } from '../components/BrassPanel';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatRow } from '../components/StatRow';

interface Props {
  bestScore: number;
  deepestLayer: number;
  artifactsOwned: number;
  unlockedLayers: number;
  reducedMotion: boolean;
  onPlay: () => void;
  onArchive: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

function Badge({
  Icon,
  text,
  tint,
}: {
  Icon: typeof Flame;
  text: string;
  tint: string;
}) {
  return (
    <View style={[styles.badge, { borderColor: tint + '55', backgroundColor: tint + '1A' }]}>
      <Icon size={18} color={tint} strokeWidth={2.4} />
      <Text numberOfLines={1} style={[styles.badgeText, { color: tint }]}>
        {text}
      </Text>
    </View>
  );
}

export function MenuScreen({
  bestScore,
  deepestLayer,
  artifactsOwned,
  unlockedLayers,
  reducedMotion,
  onPlay,
  onArchive,
  onProgress,
  onSettings,
}: Props) {
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    rise.setValue(0);
    Animated.spring(rise, {
      toValue: 1,
      tension: 170,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [rise]);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <VaultBackground variant="menu" reducedMotion={reducedMotion}>
      <ScreenHeader
        title="VAULT ACCESS TERMINAL"
        left={<Badge Icon={Flame} text={'x' + TORCHES_START} tint={theme.colors.ember} />}
        right={
          <Badge
            Icon={Lock}
            text={unlockedLayers + '/' + MAX_LAYERS}
            tint={theme.colors.goldLight}
          />
        }
      />

      <View style={styles.art}>
        <Image source={assets.logo} resizeMode="contain" style={styles.logo} />
        <LinearGradient
          colors={['transparent', 'rgba(11,11,15,0.55)', '#0B0B0F']}
          style={styles.artFade}
          pointerEvents="none"
        />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={{ opacity: rise, transform: [{ translateY }] }}>
        <BrassPanel topOnly radius={28} style={styles.sheet}>
          <LinearGradient
            colors={theme.gradients.hairline as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.hairline}
            pointerEvents="none"
          />

          <Text style={styles.title}>GOLDEN VAULT</Text>
          <Text style={styles.title}>EXPEDITION</Text>
          <Text style={styles.tagline}>CRACK THE LOCKS · SPEND THE LIGHT</Text>

          <View style={styles.statWrap}>
            <StatRow
              items={[
                {
                  key: 'best',
                  value: groupNumber(bestScore),
                  label: 'BEST SCORE',
                  color: theme.colors.goldLight,
                },
                {
                  key: 'deep',
                  value: deepestLayer,
                  label: 'DEEPEST LAYER',
                  color: theme.colors.ember,
                },
                {
                  key: 'art',
                  value: artifactsOwned,
                  label: 'ARTIFACTS',
                  color: theme.colors.steel,
                },
              ]}
            />
          </View>

          <Text style={styles.hint}>ONE TAP SETS A DIAL · PIPS TELL YOU WHAT IS RIGHT</Text>

          <PrimaryButton
            label="START EXPEDITION"
            Icon={Compass}
            onPress={onPlay}
            pulse={!reducedMotion}
          />

          <View style={styles.row}>
            <View style={styles.slot}>
              <SecondaryButton label="ARTIFACT COLLECTION" Icon={Layers} onPress={onArchive} />
            </View>
            <View style={styles.slot}>
              <SecondaryButton label="PROGRESS" Icon={TrendingUp} onPress={onProgress} />
            </View>
          </View>

          <View style={styles.rowSingle}>
            <SecondaryButton label="SETTINGS" Icon={Settings} tone="steel" onPress={onSettings} />
          </View>
        </BrassPanel>
      </Animated.View>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  art: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  logo: {
    width: 128,
    height: 128,
  },
  artFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 26,
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  title: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.goldLight,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.8,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  statWrap: {
    marginTop: 16,
  },
  hint: {
    marginTop: 16,
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  rowSingle: {
    marginTop: 10,
  },
  slot: {
    flex: 1,
  },
  badge: {
    height: 36,
    minWidth: 62,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

export default MenuScreen;
