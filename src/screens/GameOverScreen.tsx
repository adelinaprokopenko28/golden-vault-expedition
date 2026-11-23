import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Compass, Home, Layers, Lock } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { DISCLAIMER_SHORT, TIMING, CHAMBERS_PER_LAYER } from '../constants/config';
import { groupNumber, multiplierLabel } from '../utils/format';
import { RunSummary } from '../game/types';
import { artifactById } from '../game/artifacts';
import { layerSpec } from '../game/layers';
import { VaultBackground } from '../components/VaultBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { BrassPanel } from '../components/BrassPanel';
import { StatRow } from '../components/StatRow';
import { ArtifactTile } from '../components/ArtifactTile';
import { EmptyState } from '../components/EmptyState';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

interface Props {
  summary: RunSummary;
  torchesBurned: number;
  reducedMotion: boolean;
  onAgain: () => void;
  onArchive: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  summary,
  torchesBurned,
  reducedMotion,
  onAgain,
  onArchive,
  onMenu,
}: Props) {
  const won = summary.outcome === 'won';
  const pop = useRef(new Animated.Value(0)).current;
  const count = useRef(new Animated.Value(0)).current;
  const [shownScore, setShownScore] = useState(0);

  useEffect(() => {
    pop.setValue(0);
    Animated.spring(pop, {
      toValue: 1,
      tension: 160,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [pop]);

  useEffect(() => {
    const target = summary.score;
    if (reducedMotion || target <= 0) {
      setShownScore(target);
      return undefined;
    }
    count.setValue(0);
    const id = count.addListener(({ value }) => setShownScore(Math.round(value * target)));
    const anim = Animated.timing(count, {
      toValue: 1,
      duration: TIMING.statCountUp,
      useNativeDriver: false,
    });
    anim.start();
    return () => {
      anim.stop();
      count.removeListener(id);
    };
  }, [summary.score, count, reducedMotion]);

  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const accent = won ? theme.colors.goldLight : theme.colors.danger;
  const carried = summary.carried
    .map(id => artifactById(id))
    .filter(a => a !== null) as NonNullable<ReturnType<typeof artifactById>>[];

  return (
    <VaultBackground variant={won ? 'result-win' : 'result-lose'} reducedMotion={reducedMotion}>
      <ScreenHeader
        title={'EXPEDITION REPORT · ' + layerSpec(summary.layer).name}
        onBack={onMenu}
        backLabel="MENU"
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.body, { opacity: pop, transform: [{ scale }] }]}>
        <Text style={[styles.headline, { color: accent }]}>
          {won ? 'VAULT SEALED BEHIND YOU' : 'THE LIGHT DIED'}
        </Text>
        <Text style={styles.subline}>
          {'LAYER ' +
            summary.layer +
            ' · CHAMBER ' +
            (summary.chamberIndex + 1) +
            ' OF ' +
            CHAMBERS_PER_LAYER}
        </Text>

        <BrassPanel radius={theme.radius.xl} rivets style={styles.card}>
          <Text style={styles.scoreLabel}>EXPEDITION SCORE</Text>
          <Text style={[styles.score, { color: accent }]}>{groupNumber(shownScore)}</Text>

          <View style={styles.statBlock}>
            <StatRow
              compact
              items={[
                { key: 'att', value: summary.attempts, label: 'PULLS', color: theme.colors.steel },
                {
                  key: 'burn',
                  value: torchesBurned,
                  label: 'TORCHES BURNED',
                  color: theme.colors.ember,
                },
                {
                  key: 'cracked',
                  value: summary.chambersCracked,
                  label: 'CRACKED',
                  color: theme.colors.gold,
                },
              ]}
            />
          </View>
          <View style={styles.statBlock}>
            <StatRow
              compact
              items={[
                {
                  key: 'deep',
                  value: summary.layer,
                  label: 'DEEPEST',
                  color: theme.colors.goldLight,
                },
                {
                  key: 'mult',
                  value: multiplierLabel(summary.multiplier),
                  label: 'MULTIPLIER',
                  color: theme.colors.gold,
                },
                {
                  key: 'clean',
                  value: summary.cleanCracks,
                  label: 'CLEAN CRACKS',
                  color: theme.colors.ember,
                },
              ]}
            />
          </View>
        </BrassPanel>

        {summary.setCompleted ? (
          <View style={styles.setBanner}>
            <Text style={styles.setBannerText}>
              {'ARTIFACT SET COMPLETE · LAYER ' +
                Math.min(5, summary.setCompleted + 1) +
                ' UNLOCKED'}
            </Text>
          </View>
        ) : null}

        <View style={styles.finds}>
          {carried.length > 0 ? (
            <View style={styles.findRow}>
              {carried.slice(0, 5).map((artifact, i) => (
                <ArtifactTile
                  key={artifact.id + i}
                  artifact={artifact}
                  owned
                  size={56}
                  dim={!won}
                  showName={false}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              Icon={Lock}
              title="NOTHING LEFT THE VAULT"
              hint="CRACK A CHAMBER TO CARRY AN ARTIFACT OUT"
            />
          )}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <PrimaryButton label="DESCEND AGAIN" Icon={Compass} onPress={onAgain} />
        <View style={styles.row}>
          <View style={styles.slot}>
            <SecondaryButton label="ARTIFACT COLLECTION" Icon={Layers} onPress={onArchive} />
          </View>
          <View style={styles.slot}>
            <SecondaryButton label="MENU" Icon={Home} tone="steel" onPress={onMenu} />
          </View>
        </View>
        <Text style={styles.disclaimer}>{DISCLAIMER_SHORT}</Text>
      </View>
    </VaultBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  headline: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: 2.4,
    textAlign: 'center',
  },
  subline: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  scoreLabel: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: theme.colors.textMuted,
  },
  score: {
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  statBlock: {
    marginTop: 10,
  },
  setBanner: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245,215,122,0.45)',
  },
  setBannerText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.goldLight,
  },
  finds: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 80,
  },
  findRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  slot: {
    flex: 1,
  },
  disclaimer: {
    marginTop: 12,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.textFaint,
  },
});

export default GameOverScreen;
