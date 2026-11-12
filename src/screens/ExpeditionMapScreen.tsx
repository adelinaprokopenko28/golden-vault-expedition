import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {ArrowDown, DoorOpen} from 'lucide-react-native';
import assets from '../assets';
import ChamberNode from '../components/ChamberNode';
import ConfirmPanel from '../components/ConfirmPanel';
import EmptyState from '../components/EmptyState';
import MetalPanel from '../components/MetalPanel';
import PathLink from '../components/PathLink';
import PrimaryPlateButton from '../components/PrimaryPlateButton';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatRow from '../components/StatRow';
import TorchMeter from '../components/TorchMeter';
import VaultBackground from '../components/VaultBackground';
import {DEPTH_STEP_M, TIER_LABEL} from '../constants/config';
import theme from '../constants/theme';
import {clearedCount, currentChamber, layerFinished} from '../game/expedition';
import type {Run} from '../game/types';

interface Props {
  run: Run;
  onDescend: () => void;
  onAbandon: () => void;
  onMenu: () => void;
}

export function ExpeditionMapScreen({run, onDescend, onAbandon, onMenu}: Props) {
  const [confirming, setConfirming] = useState(false);
  const finished = layerFinished(run);
  const chamber = currentChamber(run);
  const cleared = clearedCount(run);
  /* Out of light: the run can still be closed, so the player is never stuck. */
  const blocked = !finished && run.torches - chamber.entryCost < 1;

  const brief = finished
    ? 'LAYER SEALED — HAUL YOUR FINDS UP'
    : blocked
    ? 'NOT ENOUGH TORCHES TO FORCE THIS DOOR — CLOSE THE RUN'
    : 'NEXT: ' +
      chamber.name +
      ' · ' +
      chamber.lockLength +
      '-DIGIT LOCK · ENTRY ' +
      chamber.entryCost +
      ' TORCH';

  const ctaLabel =
    finished || blocked
      ? 'CLOSE EXPEDITION'
      : cleared === 0
      ? 'START DESCENT'
      : 'START NEXT CHAMBER';

  return (
    <VaultBackground variant="map">
      <ScreenHeader
        title={'VAULT LAYER ' + run.layer}
        subtitle={TIER_LABEL[chamber.tier]}
        leftSlot={
          <RoundIconButton asset={assets.iconHome} label="MENU" onPress={onMenu} />
        }
        rightSlot={<TorchMeter torches={run.torches} compact />}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <StatRow
          columns={3}
          style={styles.stats}
          items={[
            {
              key: 'chamber',
              value: cleared + 1 + '/' + run.chambers.length,
              label: 'CHAMBER',
              accent: theme.colors.gold,
            },
            {
              key: 'artifacts',
              value: run.haul.length,
              label: 'ARTIFACTS',
              accent: theme.colors.bronze,
              allowZero: true,
            },
            {
              key: 'torches',
              value: run.torches,
              label: 'TORCHES',
              accent: theme.colors.goldLight,
              allowZero: true,
            },
          ]}
        />

        <View style={styles.chain}>
          {run.chambers.map((c, i) => (
            <View key={c.index} style={i % 2 === 0 ? styles.nodeLeft : styles.nodeRight}>
              {i > 0 ? (
                <PathLink
                  cleared={run.chambers[i - 1].state === 'cleared'}
                  depthLabel={'-' + i * DEPTH_STEP_M + ' M'}
                />
              ) : null}
              <ChamberNode chamber={c} />
            </View>
          ))}
        </View>

        {finished ? (
          <EmptyState
            title={'LAYER SEALED — HAUL YOUR FINDS UP'}
            hint="CLOSE THE EXPEDITION TO BANK WHAT YOU CARRY"
          />
        ) : null}
      </ScrollView>

      <MetalPanel tone="cold" radius={theme.radius.xxl} style={styles.controls}>
        <View style={styles.controlsInner}>
          <Text numberOfLines={2} style={styles.brief}>
            {brief}
          </Text>
          <PrimaryPlateButton
            label={ctaLabel}
            Icon={finished || blocked ? ArrowDown : DoorOpen}
            onPress={onDescend}
            height={60}
            style={styles.cta}
          />
          <SecondaryButton
            label="ABANDON RUN"
            tone="danger"
            height={46}
            onPress={() => setConfirming(true)}
          />
        </View>
      </MetalPanel>

      {confirming ? (
        <ConfirmPanel
          title="ABANDON THIS RUN?"
          message="YOU KEEP EVERY ARTIFACT ALREADY RECOVERED."
          confirmLabel="ABANDON RUN"
          cancelLabel="KEEP DIGGING"
          onConfirm={() => {
            setConfirming(false);
            onAbandon();
          }}
          onCancel={() => setConfirming(false)}
        />
      ) : null}
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  bodyContent: {paddingHorizontal: 12, paddingTop: 14, paddingBottom: 20},
  stats: {marginBottom: 10},
  chain: {paddingVertical: 4},
  nodeLeft: {alignItems: 'flex-start', paddingLeft: 34},
  nodeRight: {alignItems: 'flex-end', paddingRight: 34},
  controls: {marginHorizontal: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
  controlsInner: {paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18},
  brief: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  cta: {marginBottom: 10},
});

export default ExpeditionMapScreen;
