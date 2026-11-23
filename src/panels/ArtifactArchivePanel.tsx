import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Home, Lock } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { ARTIFACTS_PER_LAYER, MAX_LAYERS } from '../constants/config';
import { LAYERS } from '../game/layers';
import { layerArtifacts, setProgress } from '../game/artifacts';
import { LayerSpec } from '../game/types';
import { pct } from '../utils/format';
import { VaultBackground } from '../components/VaultBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { BrassPanel } from '../components/BrassPanel';
import { SectionHeader } from '../components/SectionHeader';
import { ArtifactTile } from '../components/ArtifactTile';
import { EmptyState } from '../components/EmptyState';
import { SecondaryButton } from '../components/SecondaryButton';

interface Props {
  artifacts: Record<string, boolean>;
  unlockedLayers: number;
  reducedMotion: boolean;
  onMenu: () => void;
}

const G_FRAME = 12;
const G_GAP = 8;

export function ArtifactArchivePanel({ artifacts, unlockedLayers, reducedMotion, onMenu }: Props) {
  const { width } = useWindowDimensions();
  const gridWidth = Math.min(width - 32, 380);
  const tile = Math.floor(
    (gridWidth - 2 * G_FRAME - (ARTIFACTS_PER_LAYER - 1) * G_GAP) / ARTIFACTS_PER_LAYER,
  );
  const ownedTotal = Object.keys(artifacts).filter(k => artifacts[k]).length;

  const renderLayer = useCallback(
    ({ item }: { item: LayerSpec }) => {
      const found = setProgress(artifacts, item.index);
      const reachable = item.index <= unlockedLayers;
      return (
        <BrassPanel radius={theme.radius.lg} style={styles.section}>
          <SectionHeader
            title={item.title}
            right={found + ' / ' + ARTIFACTS_PER_LAYER}
          />
          <View style={styles.bar}>
            <View style={{ width: pct(found / ARTIFACTS_PER_LAYER) }}>
              <LinearGradient
                colors={theme.gradients.bar as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barFill}
              />
            </View>
          </View>
          <View style={styles.row}>
            {layerArtifacts(item.index).map(artifact => (
              <ArtifactTile
                key={artifact.id}
                artifact={artifact}
                owned={!!artifacts[artifact.id]}
                size={tile}
                dim={!reachable}
                showName={false}
              />
            ))}
          </View>
          <Text style={styles.caption}>
            {reachable ? item.name : 'SEALED · COMPLETE THE SET ABOVE TO DESCEND'}
          </Text>
        </BrassPanel>
      );
    },
    [artifacts, unlockedLayers, tile],
  );

  const keyExtractor = useCallback((item: LayerSpec) => 'layer' + item.index, []);

  return (
    <VaultBackground variant="plain" reducedMotion={reducedMotion}>
      <ScreenHeader
        title="ARTIFACT COLLECTION"
        onBack={onMenu}
        backLabel="MENU"
        right={
          <Text style={styles.counter}>
            {ownedTotal + '/' + MAX_LAYERS * ARTIFACTS_PER_LAYER}
          </Text>
        }
      />

      {ownedTotal > 0 ? (
        <FlatList
          data={LAYERS}
          renderItem={renderLayer}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState
            Icon={Lock}
            title="NOTHING RECOVERED YET"
            hint="RUN AN EXPEDITION TO CARRY THE FIRST ARTIFACT OUT"
          />
          <BrassPanel radius={theme.radius.lg} style={styles.previewPanel}>
            <SectionHeader title={LAYERS[0].title} right={'0 / ' + ARTIFACTS_PER_LAYER} />
            <View style={styles.row}>
              {layerArtifacts(1).map(artifact => (
                <ArtifactTile
                  key={artifact.id}
                  artifact={artifact}
                  owned={false}
                  size={tile}
                  showName={false}
                />
              ))}
            </View>
          </BrassPanel>
        </View>
      )}

      <View style={styles.footer}>
        <SecondaryButton label="MENU" Icon={Home} tone="steel" onPress={onMenu} />
      </View>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  section: {
    padding: G_FRAME,
    marginBottom: 12,
  },
  bar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    marginBottom: 10,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  row: {
    flexDirection: 'row',
    gap: G_GAP,
  },
  caption: {
    marginTop: 8,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  counter: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.gold,
    fontVariant: ['tabular-nums'],
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: 16,
  },
  previewPanel: {
    padding: G_FRAME,
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 6,
  },
});

export default ArtifactArchivePanel;
