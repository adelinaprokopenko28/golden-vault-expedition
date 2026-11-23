import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Compass } from 'lucide-react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { CHAMBERS_PER_LAYER } from '../constants/config';
import { RouteKey, RouteOption, NodeState } from '../game/types';
import { layerSpec } from '../game/layers';
import { VaultBackground } from '../components/VaultBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { BrassPanel } from '../components/BrassPanel';
import { ChamberNode } from '../components/ChamberNode';
import { RouteCard } from '../components/RouteCard';
import { SectionHeader } from '../components/SectionHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { TorchMeter } from '../components/TorchMeter';

interface Props {
  layer: number;
  chamberIndex: number;
  chambersCracked: number;
  torches: number;
  nodes: NodeState[];
  routes: RouteOption[];
  selectedRoute: RouteKey | null;
  needsRoute: boolean;
  reducedMotion: boolean;
  onSelectRoute: (key: RouteKey) => void;
  onEnter: () => void;
  onBack: () => void;
}

const ZIGZAG = [-36, 30, -22, 34, 0];

export function ExpeditionMapPanel({
  layer,
  chamberIndex,
  chambersCracked,
  torches,
  nodes,
  routes,
  selectedRoute,
  needsRoute,
  reducedMotion,
  onSelectRoute,
  onEnter,
  onBack,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enter.setValue(0);
    Animated.spring(enter, {
      toValue: 1,
      tension: 170,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [enter, chamberIndex]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const ready = !needsRoute || selectedRoute !== null;
  const spec = layerSpec(layer);

  return (
    <VaultBackground variant="map" reducedMotion={reducedMotion}>
      <ScreenHeader
        title={'LAYER ' + layer + ' · CHAMBER ' + (chamberIndex + 1) + '/' + CHAMBERS_PER_LAYER}
        onBack={onBack}
        backLabel="MENU"
        right={<TorchMeter torches={torches} compact />}
      />

      <View style={styles.map}>
        <ImageBackground
          source={assets.bgGame}
          resizeMode="cover"
          style={styles.stone}
          imageStyle={styles.stoneImage}
        />
        <Text style={styles.layerName}>{spec.name}</Text>
        <View style={styles.chain}>
          {nodes.map((state, i) => (
            <View key={'node' + i} style={styles.nodeRow}>
              {i > 0 ? (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: i <= chambersCracked ? theme.colors.gold : theme.colors.lockedBorder },
                  ]}
                />
              ) : null}
              <ChamberNode
                index={i}
                state={state}
                offset={ZIGZAG[i % ZIGZAG.length]}
                reducedMotion={reducedMotion}
                onPress={onEnter}
              />
            </View>
          ))}
        </View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={{ opacity: enter, transform: [{ translateY }] }}>
        <BrassPanel topOnly radius={24} rivets style={styles.panel}>
          <SectionHeader
            title={needsRoute ? 'CHOOSE YOUR ROUTE' : 'THE FIRST SEAL IS OPEN TO YOU'}
            right={needsRoute ? (selectedRoute ? 'LOCKED IN' : 'PICK ONE') : undefined}
          />
          <View style={styles.routes}>
            {routes.map(route => (
              <RouteCard
                key={route.key}
                route={route}
                selected={selectedRoute === route.key}
                onPress={onSelectRoute}
              />
            ))}
          </View>
          <Text style={styles.hint}>
            {needsRoute
              ? 'TAP A ROUTE CARD · IT RESHAPES THE NEXT CHAMBER'
              : 'NO ROUTE NEEDED · WALK STRAIGHT IN'}
          </Text>
          <PrimaryButton
            label="GO TO CHAMBER"
            Icon={Compass}
            height={56}
            disabled={!ready}
            onPress={onEnter}
          />
        </BrassPanel>
      </Animated.View>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stone: {
    ...StyleSheet.absoluteFillObject,
  },
  stoneImage: {
    opacity: 0.22,
  },
  layerName: {
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: theme.colors.textSecondary,
  },
  chain: {
    alignItems: 'center',
  },
  nodeRow: {
    alignItems: 'center',
  },
  connector: {
    width: 3,
    height: 12,
    borderRadius: 2,
    marginBottom: 2,
  },
  panel: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },
  routes: {
    flexDirection: 'row',
    gap: 10,
  },
  hint: {
    marginTop: 12,
    marginBottom: 10,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
});

export default ExpeditionMapPanel;
