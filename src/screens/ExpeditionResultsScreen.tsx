import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RotateCcw} from 'lucide-react-native';
import assets, {SPRITES} from '../assets';
import EmptyState from '../components/EmptyState';
import MetalPanel from '../components/MetalPanel';
import OutcomeBanner from '../components/OutcomeBanner';
import PrimaryPlateButton from '../components/PrimaryPlateButton';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatRow from '../components/StatRow';
import VaultBackground from '../components/VaultBackground';
import theme from '../constants/theme';
import {SET_BY_ID} from '../game/artifacts';
import type {RunSummary} from '../game/types';

interface Props {
  summary: RunSummary;
  onAgain: () => void;
  onMenu: () => void;
  onArchive: () => void;
}

/** The discrete game-over / result screen. Three exits, never a dead end. */
export function ExpeditionResultsScreen({summary, onAgain, onMenu, onArchive}: Props) {
  const won = summary.outcome === 'cleared';
  const setPerk =
    summary.completedSets.length > 0
      ? SET_BY_ID[summary.completedSets[summary.completedSets.length - 1]]
      : null;

  return (
    <VaultBackground variant={won ? 'resultWin' : 'resultLose'}>
      <ScreenHeader
        title="EXPEDITION LOG"
        subtitle={'VAULT LAYER ' + summary.layer}
        leftSlot={<RoundIconButton asset={assets.iconHome} label="MENU" onPress={onMenu} />}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <OutcomeBanner outcome={summary.outcome} />

        <StatRow
          columns={2}
          style={styles.stats}
          items={[
            {
              key: 'depth',
              value: summary.depth + '/' + summary.total,
              label: 'DEPTH REACHED',
              accent: theme.colors.gold,
            },
            {
              key: 'locks',
              value: summary.locksCracked,
              label: 'LOCKS CRACKED',
              accent: theme.colors.goldLight,
              allowZero: true,
            },
            {
              key: 'torches',
              value: summary.torchesLeft,
              label: 'TORCHES LEFT',
              accent: theme.colors.bronze,
              allowZero: true,
            },
            {
              key: 'efficient',
              value: summary.firstTryCracks,
              label: 'EFFICIENT CRACKS',
              accent: theme.colors.safe,
              allowZero: true,
            },
          ]}
        />

        <MetalPanel tone="warm" radius={theme.radius.xl} style={styles.haul}>
          <View style={styles.haulInner}>
            <Text style={styles.haulTitle}>HAUL</Text>
            {summary.haul.length === 0 ? (
              <EmptyState title={'NOTHING RECOVERED — THE DEEP KEPT IT'} />
            ) : (
              <View style={styles.haulRow}>
                {summary.haul.map((setId, i) => (
                  <View key={setId + '-' + i} style={styles.haulTile}>
                    <Image
                      source={SPRITES[SET_BY_ID[setId].spriteIndex]}
                      style={styles.haulSprite}
                      resizeMode="contain"
                    />
                    <Text numberOfLines={2} style={styles.haulName}>
                      {SET_BY_ID[setId].name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </MetalPanel>

        {setPerk ? (
          <Text style={styles.strip}>
            {'SET COMPLETE: ' + setPerk.name + ' — ' + setPerk.perk}
          </Text>
        ) : null}

        {summary.layerUnlocked ? (
          <Text style={[styles.strip, styles.stripBronze]}>
            {'VAULT LAYER ' + summary.layerUnlocked + ' UNSEALED'}
          </Text>
        ) : null}

        <PrimaryPlateButton
          label="EXPLORE AGAIN"
          Icon={RotateCcw}
          onPress={onAgain}
          height={60}
          style={styles.cta}
        />
        <SecondaryButton label="MENU" onPress={onMenu} style={styles.exit} />
        <SecondaryButton label="ARTIFACT ARCHIVE" tone="neutral" onPress={onArchive} />
      </ScrollView>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  bodyContent: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28},
  stats: {marginTop: 16},
  haul: {width: '100%', marginTop: 6, marginBottom: 12},
  haulInner: {paddingHorizontal: 14, paddingVertical: 14},
  haulTitle: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.textMuted,
    marginBottom: 10,
  },
  haulRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  haulTile: {width: 72, alignItems: 'center'},
  haulSprite: {width: 56, height: 56},
  haulName: {
    marginTop: 4,
    fontSize: 8,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  strip: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: theme.fill.goldSoft,
    borderWidth: 1,
    borderColor: theme.border.gold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  stripBronze: {
    backgroundColor: theme.fill.bronzeSoft,
    borderColor: theme.border.bronze,
    color: theme.colors.bronzeLight,
  },
  cta: {marginTop: 4, marginBottom: 10},
  exit: {marginBottom: 10},
});

export default ExpeditionResultsScreen;
