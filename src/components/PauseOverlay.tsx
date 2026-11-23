import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Compass, Home } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { BrassPanel } from './BrassPanel';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface Props {
  visible: boolean;
  onResume: () => void;
  onMenu: () => void;
}

/** Dims the chamber and freezes the burn-down timer. */
export function PauseOverlay({ visible, onResume, onMenu }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onResume}>
      <View style={styles.backdrop}>
        <BrassPanel radius={theme.radius.xl} rivets warm style={styles.card}>
          <Text style={styles.title}>EXPEDITION HELD</Text>
          <Text style={styles.body}>THE TORCH IS SHIELDED · NOTHING BURNS WHILE YOU WAIT</Text>
          <PrimaryButton label="RESUME" Icon={Compass} onPress={onResume} />
          <View style={styles.gap} />
          <SecondaryButton label="MENU" Icon={Home} tone="steel" onPress={onMenu} />
        </BrassPanel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,5,8,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    paddingVertical: 26,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 2.4,
    textAlign: 'center',
    color: theme.colors.goldLight,
  },
  body: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
  gap: {
    height: 10,
  },
});

export default PauseOverlay;
