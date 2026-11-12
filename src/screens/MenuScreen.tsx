import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ArrowDown, DoorOpen, Flame, Gem} from 'lucide-react-native';
import BrandMark from '../components/BrandMark';
import PrimaryPlateButton from '../components/PrimaryPlateButton';
import SecondaryButton from '../components/SecondaryButton';
import VaultBackground from '../components/VaultBackground';
import {TOTAL_ARTIFACTS} from '../constants/config';
import theme, {DISCLAIMER} from '../constants/theme';

interface Props {
  deepestLayer: number;
  artifactCount: number;
  startTorches: number;
  onPlay: () => void;
  onArchive: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

interface ChipProps {
  label: string;
  icon: React.ReactNode;
}

function Chip({label, icon}: ChipProps) {
  return (
    <View style={styles.chip}>
      <View style={styles.chipIcon}>{icon}</View>
      <Text numberOfLines={1} style={styles.chipLabel}>
        {label}
      </Text>
    </View>
  );
}

export function MenuScreen({
  deepestLayer,
  artifactCount,
  startTorches,
  onPlay,
  onArchive,
  onProgress,
  onSettings,
}: Props) {
  return (
    <VaultBackground variant="menu">
      <View style={styles.topBadges}>
        <Text style={styles.layerBadge}>{'LAYER ' + deepestLayer}</Text>
        <View style={styles.torchPill}>
          <View style={styles.chipIcon}>
            <Flame size={18} strokeWidth={2.4} color={theme.colors.bronze} />
          </View>
          <Text style={styles.torchValue}>{String(startTorches)}</Text>
        </View>
      </View>

      <View style={styles.art}>
        <BrandMark size={96} float />
      </View>

      <View style={styles.sheet}>
        <Text style={styles.title}>GOLDEN VAULT EXPEDITION</Text>
        <Text style={styles.subtitle}>CRACK THE LOCKS {'·'} CHOOSE THE ROUTE</Text>

        <View style={styles.chipRow}>
          <Chip
            label={'DEEPEST L' + deepestLayer}
            icon={<ArrowDown size={18} strokeWidth={2.6} color={theme.colors.gold} />}
          />
          <Chip
            label={'ARTIFACTS ' + artifactCount + '/' + TOTAL_ARTIFACTS}
            icon={<Gem size={18} strokeWidth={2.6} color={theme.colors.goldLight} />}
          />
        </View>

        <PrimaryPlateButton
          label="START EXPEDITION"
          Icon={DoorOpen}
          onPress={onPlay}
          height={62}
          style={styles.cta}
        />

        <View style={styles.routeRow}>
          <SecondaryButton label="ARCHIVE" onPress={onArchive} style={styles.routeButton} />
          <SecondaryButton label="PROGRESS" onPress={onProgress} style={styles.routeButton} />
          <SecondaryButton label="SETTINGS" onPress={onSettings} style={styles.routeButton} />
        </View>

        <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
      </View>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  topBadges: {
    paddingTop: theme.headerTop,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  layerBadge: {fontSize: 11, fontWeight: '700', letterSpacing: 1.6, color: theme.colors.textSecondary},
  torchPill: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(11,11,15,0.65)',
    borderWidth: 1,
    borderColor: theme.border.gold,
  },
  torchValue: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  art: {flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 120},
  sheet: {
    backgroundColor: 'rgba(20,20,24,0.96)',
    borderTopLeftRadius: theme.radius.sheet,
    borderTopRightRadius: theme.radius.sheet,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.28)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: -10},
    elevation: 16,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  chipRow: {flexDirection: 'row', gap: 10, marginBottom: 16},
  chip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.22)',
  },
  chipIcon: {width: 18, height: 18, alignItems: 'center', justifyContent: 'center'},
  chipLabel: {
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.textPrimary,
  },
  cta: {marginBottom: 12},
  routeRow: {flexDirection: 'row', gap: 8},
  routeButton: {flex: 1},
  disclaimer: {
    marginTop: 16,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    color: theme.colors.textFaint,
    textAlign: 'center',
  },
});

export default MenuScreen;
