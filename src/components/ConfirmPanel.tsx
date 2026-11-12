import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';
import MetalPanel from './MetalPanel';
import SecondaryButton from './SecondaryButton';

interface Props {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** In-screen confirm block used by ABANDON RUN, the pause plate and RESET VAULT. */
export function ConfirmPanel({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <View style={styles.overlay}>
      <MetalPanel tone="warm" radius={theme.radius.xl} rivets style={styles.panel}>
        <View style={styles.inner}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <SecondaryButton
            label={confirmLabel}
            tone="danger"
            onPress={onConfirm}
            style={styles.button}
          />
          <SecondaryButton label={cancelLabel} tone="gold" onPress={onCancel} />
        </View>
      </MetalPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,8,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  panel: {width: '100%'},
  inner: {paddingVertical: 20, paddingHorizontal: 18},
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  button: {marginTop: 16, marginBottom: 10},
});

export default ConfirmPanel;
