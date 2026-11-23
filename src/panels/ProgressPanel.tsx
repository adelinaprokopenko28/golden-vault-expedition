import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Home, Key, Lock, TrendingUp } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { MAX_LAYERS } from '../constants/config';
import { LAYERS } from '../game/layers';
import { VaultSave } from '../game/types';
import { crackRate } from '../game/vaultStore';
import { groupNumber, pct, percentLabel } from '../utils/format';
import { VaultBackground } from '../components/VaultBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { BrassPanel } from '../components/BrassPanel';
import { SectionHeader } from '../components/SectionHeader';
import { StatRow } from '../components/StatRow';
import { EmptyState } from '../components/EmptyState';
import { SecondaryButton } from '../components/SecondaryButton';

interface Props {
  vault: VaultSave;
  reducedMotion: boolean;
  onMenu: () => void;
}

const ROUTE_ROWS: { key: 'safe' | 'rich' | 'deep'; label: string; color: string }[] = [
  { key: 'safe', label: 'SAFE PASSAGE', color: theme.colors.steel },
  { key: 'rich', label: 'RICH SEAM', color: theme.colors.goldLight },
  { key: 'deep', label: 'DEEP DESCENT', color: theme.colors.ember },
];

export function ProgressPanel({ vault, reducedMotion, onMenu }: Props) {
  const routeTotal =
    vault.routeCounts.safe + vault.routeCounts.rich + vault.routeCounts.deep;

  return (
    <VaultBackground variant="plain" reducedMotion={reducedMotion}>
      <ScreenHeader title="PROGRESS" onBack={onMenu} backLabel="MENU" />

      {vault.expeditions > 0 ? (
        <View style={styles.body}>
          <BrassPanel radius={theme.radius.lg} style={styles.card}>
            <SectionHeader title="VAULT DEPTH" right={vault.deepestLayer + ' / ' + MAX_LAYERS} />
            {LAYERS.map(layer => {
              const unlocked = layer.index <= vault.unlockedLayers;
              const deepest = layer.index === vault.deepestLayer;
              return (
                <View key={'l' + layer.index} style={styles.ladderRow}>
                  <View
                    style={[
                      styles.ladderDot,
                      unlocked ? styles.ladderDotOn : styles.ladderDotOff,
                    ]}>
                    {unlocked ? (
                      <Key size={14} color="#1A1409" strokeWidth={2.6} />
                    ) : (
                      <Lock size={14} color={theme.colors.lockedIcon} strokeWidth={2.4} />
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[styles.ladderText, unlocked ? null : styles.ladderTextOff]}>
                    {layer.name}
                  </Text>
                  {deepest ? (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>DEEPEST REACHED</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </BrassPanel>

          <BrassPanel radius={theme.radius.lg} style={styles.card}>
            <SectionHeader title="LIFETIME" />
            <StatRow
              compact
              items={[
                {
                  key: 'exp',
                  value: vault.expeditions,
                  label: 'EXPEDITIONS',
                  color: theme.colors.goldLight,
                },
                {
                  key: 'cracked',
                  value: vault.chambersCracked,
                  label: 'CHAMBERS',
                  color: theme.colors.gold,
                },
                {
                  key: 'best',
                  value: groupNumber(vault.bestScore),
                  label: 'BEST SCORE',
                  color: theme.colors.ember,
                },
              ]}
            />
            <View style={styles.statGap} />
            <StatRow
              compact
              items={[
                {
                  key: 'clean',
                  value: vault.cleanCracks,
                  label: 'CLEAN CRACKS',
                  color: theme.colors.goldLight,
                },
                {
                  key: 'burn',
                  value: vault.torchesBurned,
                  label: 'TORCHES BURNED',
                  color: theme.colors.ember,
                },
                {
                  key: 'rate',
                  value: percentLabel(crackRate(vault)),
                  label: 'CRACK RATE',
                  color: theme.colors.steel,
                },
              ]}
            />
          </BrassPanel>

          <BrassPanel radius={theme.radius.lg} style={styles.card}>
            <SectionHeader title="ROUTE HABITS" right={routeTotal + ' FORKS'} />
            {ROUTE_ROWS.map(row => {
              const count = vault.routeCounts[row.key];
              const ratio = routeTotal > 0 ? count / routeTotal : 0;
              return (
                <View key={row.key} style={styles.habitRow}>
                  <Text numberOfLines={1} style={styles.habitLabel}>
                    {row.label}
                  </Text>
                  <View style={styles.habitTrack}>
                    <View style={{ width: pct(ratio) }}>
                      <LinearGradient
                        colors={[row.color, row.color + '55']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.habitFill}
                      />
                    </View>
                  </View>
                  <Text style={[styles.habitValue, { color: row.color }]}>{count}</Text>
                </View>
              );
            })}
          </BrassPanel>
        </View>
      ) : (
        <View style={styles.body}>
          <EmptyState
            Icon={TrendingUp}
            title="NO EXPEDITION ON RECORD"
            hint="START AN EXPEDITION FROM THE MENU AND THE VAULT WILL REMEMBER IT"
          />
        </View>
      )}

      <View style={styles.footer}>
        <SecondaryButton label="MENU" Icon={Home} tone="steel" onPress={onMenu} />
      </View>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    padding: 14,
    marginBottom: 12,
  },
  ladderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    gap: 10,
  },
  ladderDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ladderDotOn: {
    backgroundColor: theme.colors.gold,
    borderColor: theme.colors.goldLight,
  },
  ladderDotOff: {
    backgroundColor: theme.colors.lockedPlate,
    borderColor: theme.colors.lockedBorder,
  },
  ladderText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textPrimary,
  },
  ladderTextOff: {
    color: theme.colors.lockedIcon,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9,
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,215,122,0.42)',
  },
  tagText: {
    fontSize: 8,
    lineHeight: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.goldLight,
  },
  statGap: {
    height: 10,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    gap: 10,
  },
  habitLabel: {
    width: 96,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  habitTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  habitFill: {
    height: 8,
    borderRadius: 4,
  },
  habitValue: {
    width: 22,
    textAlign: 'right',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 6,
  },
});

export default ProgressPanel;
