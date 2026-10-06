/**
 * Filename:    StrategyTimeframes.tsx  [ organisms ]
 * Description: Multi-Timeframe Evidence — selectable 1D / 4H / 1W rows with a
 *              note, status, and aligned check.
 * Purpose:     Reproduce the web StrategyScreen evidence breakdown 1:1 in RN,
 *              reusing Card / Icon / Heading / Text atoms. Selection is local UI
 *              state owned by the screen and passed down.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, View } from 'react-native';

import { Card, Heading, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';
import type { StrategyAsset } from '@/data/strategy';

/** Timeframe selector key. */
export type Timeframe = '1D' | '4H' | '1W';

export interface StrategyTimeframesProps {
  /** Analyzed asset supplying the three evidence rows. */
  asset: StrategyAsset;
  /** Currently highlighted timeframe. */
  selected: Timeframe;
  /** Change the highlighted timeframe. */
  onSelect: (tf: Timeframe) => void;
}

/** StrategyTimeframes renders the three-row multi-timeframe evidence card. */
export function StrategyTimeframes({
  asset,
  selected,
  onSelect,
}: StrategyTimeframesProps): React.JSX.Element {
  const colors = useThemeColors();
  const rows: { tf: Timeframe; title: string; note: string; status: string }[] = [
    { tf: '1D', title: 'Daily Structure', note: asset.dailyStructure.note, status: asset.dailyStructure.status },
    { tf: '4H', title: '4-Hour Momentum', note: asset.fourHourMomentum.note, status: asset.fourHourMomentum.status },
    { tf: '1W', title: 'Weekly Trend', note: asset.weeklyTrend.note, status: asset.weeklyTrend.status },
  ];

  return (
    <Card className="p-5">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Icon name="pulse" size={18} color={colors.violet} />
          <Heading level="section">Multi-Timeframe Evidence</Heading>
        </View>
        <Text variant="caption" tone="muted" className="font-mono">
          3/3 Aligned
        </Text>
      </View>

      <View className="gap-2.5">
        {rows.map((r) => {
          const active = selected === r.tf;
          return (
            <Pressable
              key={r.tf}
              onPress={() => onSelect(r.tf)}
              className={`flex-row items-center justify-between p-3 rounded-lg border ${
                active ? 'bg-surface-container border-violet/50' : 'bg-surface-container border-outline'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${r.title}, ${r.status}`}
            >
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                <View className="w-8 h-8 rounded bg-violet/20 items-center justify-center">
                  <Text className="font-mono font-bold text-xs text-violet">{r.tf}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-xs">{r.title}</Text>
                  <Text variant="caption" tone="secondary">
                    {r.note}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <Icon name="checkmark-circle" size={14} color={colors.emerald} />
                <Text variant="caption" className="font-mono text-emerald">
                  {r.status}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
