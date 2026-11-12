import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {DoorOpen} from 'lucide-react-native';
import assets, {SPRITES} from '../assets';
import ArtifactSlot from '../components/ArtifactSlot';
import EmptyState from '../components/EmptyState';
import MetalPanel from '../components/MetalPanel';
import PrimaryPlateButton from '../components/PrimaryPlateButton';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SetBadge from '../components/SetBadge';
import VaultBackground from '../components/VaultBackground';
import {SET_PIECES, TOTAL_ARTIFACTS} from '../constants/config';
import theme from '../constants/theme';
import {SETS, pieceName} from '../game/artifacts';
import type {SetId} from '../game/types';

interface Props {
  artifacts: Record<SetId, number>;
  artifactCount: number;
  onMenu: () => void;
  onPlay: () => void;
}

const TIER_ACCENT = [
  theme.colors.safe,
  theme.colors.bronze,
  theme.colors.gold,
  theme.colors.goldLight,
  theme.colors.bronzeLight,
];

export function ArtifactArchiveScreen({artifacts, artifactCount, onMenu, onPlay}: Props) {
  return (
    <VaultBackground variant="panel">
      <ScreenHeader
        title="ARTIFACT ARCHIVE"
        subtitle="FIVE SETS · THREE PIECES EACH"
        leftSlot={<RoundIconButton asset={assets.iconHome} label="MENU" onPress={onMenu} />}
        rightSlot={
          <Text style={styles.counter}>{artifactCount + '/' + TOTAL_ARTIFACTS}</Text>
        }
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {artifactCount === 0 ? (
          <EmptyState
            title={'THE ARCHIVE IS EMPTY — RUN AN EXPEDITION'}
            hint="EVERY CRACKED LOCK CAN DROP A PIECE"
          />
        ) : null}

        {SETS.map((set, setIndex) => {
          const owned = artifacts[set.id] || 0;
          const complete = owned >= SET_PIECES;
          return (
            <MetalPanel
              key={set.id}
              radius={theme.radius.xl}
              style={[styles.block, complete ? styles.blockComplete : null]}>
              <View style={styles.blockInner}>
                <SetBadge
                  setName={set.name}
                  sprite={SPRITES[set.spriteIndex]}
                  owned={owned}
                  perkText={set.perk}
                  complete={complete}
                />
                <View style={styles.slots}>
                  {[0, 1, 2].map(slot => (
                    <ArtifactSlot
                      key={slot}
                      locked={slot >= owned}
                      sprite={SPRITES[set.spriteIndex]}
                      name={pieceName(set.id, slot)}
                      accent={TIER_ACCENT[setIndex]}
                    />
                  ))}
                </View>
              </View>
            </MetalPanel>
          );
        })}

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
  counter: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  block: {width: '100%', marginBottom: 12},
  blockComplete: {borderColor: theme.colors.gold},
  blockInner: {paddingHorizontal: 14, paddingVertical: 14},
  slots: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 4},
  cta: {marginTop: 6},
});

export default ArtifactArchiveScreen;
