import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import DoorCard from '../components/DoorCard';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import TorchMeter from '../components/TorchMeter';
import VaultBackground from '../components/VaultBackground';
import theme from '../constants/theme';
import type {Door} from '../game/types';

interface Props {
  doors: Door[];
  torches: number;
  routeIntel: boolean;
  onChoose: (door: Door) => void;
}

export function RouteChoiceScreen({doors, torches, routeIntel, onChoose}: Props) {
  return (
    <VaultBackground variant="route">
      <ScreenHeader
        title="CHOOSE YOUR ROUTE"
        subtitle="LOCK CRACKED"
        rightSlot={<TorchMeter torches={torches} compact />}
      />
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {doors.length === 0 ? (
          <EmptyState
            title={'NO PASSAGE READS CLEAR — THE WAY DOWN IS SEALED'}
          />
        ) : (
          doors.map(door => (
            <DoorCard key={door.id} door={door} intel={routeIntel} onPress={onChoose} />
          ))
        )}
        <Text style={styles.footer}>EACH DOOR RESHAPES THE CHAMBERS BELOW</Text>
      </ScrollView>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1},
  bodyContent: {paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28},
  footer: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textFaint,
    textAlign: 'center',
  },
});

export default RouteChoiceScreen;
