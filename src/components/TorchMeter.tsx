import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Flame} from 'lucide-react-native';
import {TORCH_METER_SLOTS} from '../constants/config';
import theme from '../constants/theme';

interface Props {
  torches: number;
  max?: number;
  compact?: boolean;
}

/** Flame glyphs plus a tabular count. Turns danger-red and pulses at one torch. */
export function TorchMeter({torches, max = TORCH_METER_SLOTS, compact = false}: Props) {
  const low = torches <= 1;
  const pulse = useRef(new Animated.Value(1)).current;
  const loop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loop.current?.stop();
    if (!low) {
      pulse.setValue(1);
      return;
    }
    loop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.16,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.current.start();
    return () => {
      loop.current?.stop();
    };
  }, [low, pulse]);

  const tint = low ? theme.colors.danger : theme.colors.bronze;
  const slots = Math.max(1, Math.min(max, TORCH_METER_SLOTS));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.root, {transform: [{scale: pulse}]}]}>
      {compact ? null : (
        <View style={styles.slots}>
          {Array.from({length: slots}).map((_, i) => (
            <View key={i} style={styles.slotBox}>
              <Flame
                size={14}
                strokeWidth={2.4}
                color={i < torches ? tint : theme.colors.hairline}
              />
            </View>
          ))}
        </View>
      )}
      <View style={styles.countRow}>
        <View style={styles.iconBox}>
          <Flame size={18} strokeWidth={2.4} color={tint} />
        </View>
        <Text style={[styles.count, {color: low ? theme.colors.danger : theme.colors.goldLight}]}>
          {String(torches)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {alignItems: 'flex-end'},
  slots: {flexDirection: 'row', marginBottom: 2},
  slotBox: {width: 16, height: 16, alignItems: 'center', justifyContent: 'center'},
  countRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  iconBox: {width: 18, height: 18, alignItems: 'center', justifyContent: 'center'},
  count: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

export default TorchMeter;
