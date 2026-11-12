import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import assets from '../assets';
import ConfirmPanel from '../components/ConfirmPanel';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import ToggleRow from '../components/ToggleRow';
import VaultBackground from '../components/VaultBackground';
import theme, {DISCLAIMER} from '../constants/theme';
import type {Settings} from '../game/types';

interface Props {
  settings: Settings;
  onToggle: (key: keyof Settings, value: boolean) => void;
  onReset: () => void;
  onMenu: () => void;
}

export function SettingsScreen({settings, onToggle, onReset, onMenu}: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <VaultBackground variant="panel">
      <ScreenHeader
        title="SETTINGS"
        subtitle="EXPEDITION RULES"
        leftSlot={<RoundIconButton asset={assets.iconHome} label="MENU" onPress={onMenu} />}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <ToggleRow
          label="ASSIST PIPS"
          description="OFF: ONLY EXACT READINGS ARE REPORTED. HARDER, +5 PP FIND CHANCE."
          value={settings.assistPips}
          onChange={next => onToggle('assistPips', next)}
        />
        <ToggleRow
          label="ROUTE INTEL"
          description="OFF: DOOR CARDS HIDE LOCK LENGTH AND COST. +10 PP FIND CHANCE."
          value={settings.routeIntel}
          onChange={next => onToggle('routeIntel', next)}
        />
        <ToggleRow
          label="LETTER MARKS"
          description="ON: FEEDBACK PIPS CARRY E / P / X LETTERS FOR EASIER READING."
          value={settings.letterMarks}
          onChange={next => onToggle('letterMarks', next)}
        />

        <Text style={styles.dangerTitle}>DANGER</Text>
        <SecondaryButton
          label="RESET VAULT PROGRESS"
          tone="danger"
          height={52}
          onPress={() => setConfirming(true)}
        />

        <Text style={styles.version}>VERSION 1.0</Text>
        <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
      </ScrollView>

      {confirming ? (
        <ConfirmPanel
          title="RESET VAULT PROGRESS?"
          message="EVERY ARTIFACT, LAYER AND RECORD IS WIPED."
          confirmLabel="CONFIRM RESET"
          cancelLabel="KEEP MY VAULT"
          onConfirm={() => {
            setConfirming(false);
            onReset();
          }}
          onCancel={() => setConfirming(false)}
        />
      ) : null}
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  bodyContent: {paddingHorizontal: 14, paddingTop: 14, paddingBottom: 28},
  dangerTitle: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.danger,
  },
  version: {
    marginTop: 22,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  disclaimer: {
    marginTop: 6,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    color: theme.colors.textFaint,
    textAlign: 'center',
  },
});

export default SettingsScreen;
