import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lock } from 'lucide-react-native';
import { SPRITES } from '../assets';
import { theme } from '../constants/theme';
import { Artifact, Rarity } from '../game/types';

const RARITY_RING: Record<Rarity, string> = {
  common: theme.colors.steel,
  rare: theme.colors.gold,
  prime: theme.colors.goldLight,
};

interface Props {
  artifact: Artifact;
  owned: boolean;
  size: number;
  dim?: boolean;
  showName?: boolean;
}

/**
 * The artifact sprite sits INSIDE the plate with positive padding on every
 * side and resizeMode "contain", so it can never peek out of a rounded corner
 * and is never stretched.
 */
export function ArtifactTile({ artifact, owned, size, dim, showName = true }: Props) {
  const ring = owned ? RARITY_RING[artifact.rarity] : theme.colors.lockedBorder;
  const art = SPRITES[artifact.slot % SPRITES.length];

  return (
    <View style={{ width: size }}>
      <View
        style={[
          styles.plate,
          {
            width: size,
            height: size,
            borderColor: ring,
            opacity: dim ? 0.6 : 1,
          },
        ]}>
        <LinearGradient
          colors={owned ? (theme.gradients.panelWarm as string[]) : ['#15151A', '#101014']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Image
          source={art}
          resizeMode="contain"
          style={[styles.sprite, { opacity: owned ? 1 : 0.3 }]}
        />
        {owned ? null : (
          <View style={styles.lockBadge}>
            <Lock size={20} color={theme.colors.lockedIcon} strokeWidth={2.4} />
          </View>
        )}
      </View>
      {showName ? (
        <Text numberOfLines={2} style={[styles.name, owned ? null : styles.nameLocked]}>
          {owned ? artifact.name : 'UNFOUND'}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    borderRadius: theme.radius.md,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    ...theme.shadow.card,
  },
  sprite: {
    width: '100%',
    height: '100%',
  },
  lockBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  name: {
    marginTop: 5,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  nameLocked: {
    color: theme.colors.lockedIcon,
  },
});

export default ArtifactTile;
