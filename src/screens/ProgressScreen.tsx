import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DoorOpen, Lock} from 'lucide-react-native';
import assets from '../assets';
import EmptyState from '../components/EmptyState';
import MetalPanel from '../components/MetalPanel';
import PrimaryPlateButton from '../components/PrimaryPlateButton';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import StatRow from '../components/StatRow';
import VaultBackground from '../components/VaultBackground';
import theme from '../constants/theme';
import {layerLadder} from '../game/progression';
import type {VaultSave} from '../game/types';

interface Props {
  save: VaultSave;
  onMenu: () => void;
  onPlay: () => void;
}

const STATE_COLOR = {
  cleared: theme.colors.gold,
  open: theme.colors.bronzeLight,
  sealed: theme.colors.textFaint,
};

export function ProgressScreen({save, onMenu, onPlay}: Props) {
  const rows = layerLadder(save);
  const stats = save.stats;
  const items = [
    {key: 'layer', value: save.deepestLayer, label: 'DEEPEST LAYER', accent: theme.colors.gold},
    {key: 'runs', value: stats.expeditions, label: 'EXPEDITIONS', accent: theme.colors.goldLight},
    {key: 'locks', value: stats.locksCracked, label: 'LOCKS CRACKED', accent: theme.colors.bronze},
    {
      key: 'first',
      value: stats.firstTryCracks,
      label: 'EFFICIENT CRACKS',
      accent: theme.colors.safe,
    },
    {key: 'spent', value: stats.torchesSpent, label: 'TORCHES SPENT', accent: theme.colors.danger},
    {key: 'haul', value: stats.bestHaul, label: 'BEST HAUL', accent: theme.colors.bronzeLight},
  ];
  const logged = stats.expeditions > 0;

  return (
    <VaultBackground variant="panel">
      <ScreenHeader
        title="PROGRESS"
        subtitle="VAULT RECORD"
        leftSlot={<RoundIconButton asset={assets.iconHome} label="MENU" onPress={onMenu} />}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {logged ? (
          <StatRow columns={2} items={items} style={styles.stats} />
        ) : (
          <EmptyState
            title="NO EXPEDITION LOGGED YET"
            hint="CLEAR A CHAMBER AND THE RECORD FILLS UP"
          />
        )}

        <Text style={styles.sectionTitle}>LAYER LADDER</Text>
        {rows.map(row => (
          <MetalPanel key={row.layer} radius={theme.radius.md} style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowTitle}>{'LAYER ' + row.layer}</Text>
                <Text style={styles.rowSpec}>
                  {row.chambers + ' CHAMBERS · ' + row.lockLength + '-DIGIT LOCKS'}
                </Text>
              </View>
              {row.current ? <Text style={styles.tag}>CONTINUE HERE</Text> : null}
              {row.state === 'sealed' ? (
                <View style={styles.iconBox}>
                  <Lock size={24} strokeWidth={2.4} color={theme.colors.textFaint} />
                </View>
              ) : null}
              <Text style={[styles.state, {color: STATE_COLOR[row.state]}]}>
                {row.state.toUpperCase()}
              </Text>
            </View>
          </MetalPanel>
        ))}

        <PrimaryPlateButton
          label="START EXPEDITION"
          Icon={DoorOpen}
          onPress={onPlay}
          height={56}
          style={styles.cta}
        />
      </ScrollView>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  bodyContent: {paddingHorizontal: 14, paddingTop: 14, paddingBottom: 28},
  stats: {marginBottom: 8},
  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
  row: {width: '100%', marginBottom: 10},
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  rowLeft: {flex: 1},
  rowTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textPrimary,
  },
  rowSpec: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  iconBox: {width: 24, height: 24, alignItems: 'center', justifyContent: 'center'},
  tag: {
    fontSize: 8,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.onGold,
    backgroundColor: theme.colors.gold,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  state: {fontSize: 10, lineHeight: 14, fontWeight: '800', letterSpacing: 1},
  cta: {marginTop: 6},
});

export default ProgressScreen;
