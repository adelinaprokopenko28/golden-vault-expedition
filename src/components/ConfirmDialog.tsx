import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { BrassPanel } from './BrassPanel';
import { SecondaryButton } from './SecondaryButton';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ visible, title, body, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <BrassPanel radius={theme.radius.xl} rivets style={styles.card}>
          <View style={styles.iconWrap}>
            <Trash2 size={28} color={theme.colors.danger} strokeWidth={2.4} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.row}>
            <View style={styles.slot}>
              <SecondaryButton label="CANCEL" tone="steel" onPress={onCancel} />
            </View>
            <View style={styles.slot}>
              <SecondaryButton label={confirmLabel} tone="danger" onPress={onConfirm} />
            </View>
          </View>
        </BrassPanel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(181,69,47,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(181,69,47,0.45)',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 1.8,
    textAlign: 'center',
    color: theme.colors.textPrimary,
  },
  body: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  slot: {
    flex: 1,
  },
});

export default ConfirmDialog;
