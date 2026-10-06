/**
 * Filename:    StrategyTickerSummary.tsx  [ organisms ]
 * Description: Strategy-screen ticker summary — symbol tile, price/change,
 *              asset picker, and the market-cap / RSI / vol stat grid.
 * Purpose:     Reproduce the web StrategyScreen header card 1:1 in RN, reusing
 *              Card / Heading / Text / NumericValue / Icon / Divider atoms.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, View } from 'react-native';

import { Card, Divider, Heading, Icon, NumericValue, Text } from '@/components/atoms';
import { StatCard } from '@/components/molecules';
import { useThemeColors } from '@/theme';
import type { StrategyAsset } from '@/data/strategy';

export interface StrategyTickerSummaryProps {
  /** Currently analyzed asset. */
  asset: StrategyAsset;
  /** All selectable assets for the picker grid. */
  assets: StrategyAsset[];
  /** Whether the picker popup is open. */
  pickerOpen: boolean;
  /** Toggle the picker popup. */
  onTogglePicker: () => void;
  /** Select a new asset to analyze. */
  onSelectAsset: (asset: StrategyAsset) => void;
}

/** StrategyTickerSummary renders the analyzed asset's summary header. */
export function StrategyTickerSummary({
  asset,
  assets,
  pickerOpen,
  onTogglePicker,
  onSelectAsset,
}: StrategyTickerSummaryProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Card className="p-5">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-3 flex-1">
          <Pressable
            onPress={onTogglePicker}
            className="w-12 h-12 rounded-lg bg-surface-container border border-outline items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={`Switch asset, current ${asset.symbol}`}
            accessibilityState={{ expanded: pickerOpen }}
          >
            <Text className="font-mono font-bold text-lg text-violet">{asset.symbol}</Text>
          </Pressable>
          <View className="flex-1">
            <Heading level="title">{asset.companyName}</Heading>
            <Text variant="caption" tone="muted" className="font-mono">
              {`NASDAQ: ${asset.symbol} • ${asset.sector}`}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="font-mono font-bold text-lg">{`$${asset.price.toFixed(2)}`}</Text>
          <View className="flex-row items-center gap-1">
            <Icon
              name={asset.changePercent >= 0 ? 'trending-up' : 'trending-down'}
              size={14}
              color={asset.changePercent >= 0 ? colors.emerald : colors.danger}
            />
            <NumericValue value={asset.changePercent} mode="signed" />
          </View>
        </View>
      </View>

      {pickerOpen ? (
        <View className="mb-3 p-3 bg-surface-container border border-outline rounded-lg">
          <Text variant="label" tone="muted" className="mb-2">
            Select Scanned Asset to Analyze
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            {assets.map((a) => {
              const active = a.symbol === asset.symbol;
              return (
                <Pressable
                  key={a.symbol}
                  onPress={() => onSelectAsset(a)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    active ? 'bg-violet border-violet' : 'bg-surface border-outline'
                  }`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Analyze ${a.symbol}`}
                >
                  <Text
                    className={`font-mono font-bold text-xs ${
                      active ? 'text-background' : 'text-content-primary'
                    }`}
                  >
                    {a.symbol}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <Divider className="my-3" />
      <View className="flex-row justify-between">
        <StatCard label="Market Cap" value={asset.marketCap} />
        <StatCard label="RSI (14)" value={`${asset.rsi}`} />
        <StatCard label="Vol Profile" value={asset.volProfile} valueTone="accent" />
      </View>
    </Card>
  );
}
