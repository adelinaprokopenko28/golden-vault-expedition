import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home, Trash2 } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { DISCLAIMER_LONG, GameSettings } from '../constants/config';
import { VaultBackground } from '../components/VaultBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { BrassPanel } from '../components/BrassPanel';
import { SectionHeader } from '../components/SectionHeader';
import { ToggleRow } from '../components/ToggleRow';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SecondaryButton } from '../components/SecondaryButton';

interface Props {
  settings: GameSettings;
  reducedMotion: boolean;
  onChange: (patch: Partial<GameSettings>) => void;
  onReset: () => void;
  onMenu: () => void;
}

const ROWS: { key: keyof GameSettings; label: string; hint: string }[] = [
  {
    key: 'expertLocks',
    label: 'EXPERT LOCKS',
    hint: 'EVERY CHAMBER STARTS ONE GRADE HARDER · SCORE x1.25',
  },
  {
    key: 'clueRings',
    label: 'CLUE RINGS',
    hint: 'OFF HIDES THE CLUE CHIPS · SOLVE FROM PIPS ALONE · SCORE x1.15',
  },
  {
    key: 'reducedMotion',
    label: 'REDUCED MOTION',
    hint: 'STOPS THE TORCH FLICKER AND THE CTA PULSE · GAME ANIMATIONS STAY',
  },
  {
    key: 'keepRun',
    label: 'KEEP RUN ON EXIT',
    hint: 'OFF ALWAYS STARTS A FRESH EXPEDITION FROM THE DEEPEST LAYER',
  },
];

export function SettingsPanel({ settings, reducedMotion, onChange, onReset, onMenu }: Props) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = useCallback(() => {
    setConfirming(false);
    onReset();
    onMenu();
  }, [onReset, onMenu]);

  return (
    <VaultBackground variant="plain" reducedMotion={reducedMotion}>
      <ScreenHeader title="SETTINGS" onBack={onMenu} backLabel="MENU" />

      <View style={styles.body}>
        <BrassPanel radius={theme.radius.lg} style={styles.card}>
          <View style={styles.cardHead}>
            <SectionHeader title="EXPEDITION RULES" />
          </View>
          {ROWS.map(row => (
            <ToggleRow
              key={row.key}
              label={row.label}
              hint={row.hint}
              value={settings[row.key]}
              onToggle={next => onChange({ [row.key]: next } as Partial<GameSettings>)}
            />
          ))}
        </BrassPanel>

        <BrassPanel radius={theme.radius.lg} style={styles.danger}>
          <SectionHeader title="DANGER ZONE" />
          <SecondaryButton
            label="RESET VAULT"
            Icon={Trash2}
            tone="danger"
            onPress={() => setConfirming(true)}
          />
        </BrassPanel>

        <Text style={styles.footerText}>{DISCLAIMER_LONG}</Text>
      </View>

      <View style={styles.footer}>
        <SecondaryButton label="MENU" Icon={Home} tone="steel" onPress={onMenu} />
      </View>

      <ConfirmDialog
        visible={confirming}
        title="RESET VAULT"
        body="THIS ERASES EVERY ARTIFACT AND LAYER"
        confirmLabel="ERASE"
        onConfirm={handleConfirm}
        onCancel={() => setConfirming(false)}
      />
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
    paddingTop: 14,
    paddingBottom: 2,
    marginBottom: 12,
  },
  cardHead: {
    paddingHorizontal: 14,
  },
  danger: {
    padding: 14,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.textFaint,
    paddingHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 6,
  },
});

export default SettingsPanel;
