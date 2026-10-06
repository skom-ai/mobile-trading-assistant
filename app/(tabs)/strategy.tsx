/**
 * Filename:    strategy.tsx  [ app/(tabs) ]
 * Description: Strategy tab — 1:1 RN port of the web StrategyScreen. Composes
 *              the Strategy* organisms (ticker summary, verdict banner,
 *              coherence cockpit, multi-timeframe evidence, historical
 *              precedent + deploy CTA) over local UI state.
 * Purpose:     Let the user pick a scanned asset and review its full strategy
 *              setup, evidence, and analog precedent, then "deploy" (toast).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useState } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/atoms';
import {
  StrategyCockpit,
  StrategyPrecedent,
  StrategyTickerSummary,
  StrategyTimeframes,
  StrategyVerdictBanner,
  type Timeframe,
} from '@/components/organisms';
import { STRATEGY_ASSETS, type StrategyAsset } from '@/data/strategy';
import { useSelectedAsset, useStrategyAssets, useStrategyStore } from '@/store';
import { useThemeColors } from '@/theme';

/** StrategyRoute assembles the Strategy screen from its organisms. */
export default function StrategyRoute(): React.JSX.Element {
  const colors = useThemeColors();
  const assets = useStrategyAssets();
  const asset = useSelectedAsset() ?? STRATEGY_ASSETS[0];
  const selectFromStore = useStrategyStore((s) => s.select);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [toast, setToast] = useState<string | null>(null);

  const selectAsset = (next: StrategyAsset): void => {
    // eslint-disable-next-line no-console
    console.debug('[strategy] selectAsset', next.symbol);
    selectFromStore(next.id);
    setPickerOpen(false);
  };

  const deploy = (): void => {
    // eslint-disable-next-line no-console
    console.debug('[strategy] deploy', asset.symbol);
    setToast(`${asset.symbol} setup armed • alerts active`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 gap-5 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <StrategyTickerSummary
          asset={asset}
          assets={assets}
          pickerOpen={pickerOpen}
          onTogglePicker={() => setPickerOpen((v) => !v)}
          onSelectAsset={selectAsset}
        />
        <StrategyVerdictBanner
          verdict={asset.verdict}
          subtitle={asset.verdictSubtitle}
          confidence={asset.confidence}
        />
        <StrategyCockpit asset={asset} />
        <StrategyTimeframes asset={asset} selected={timeframe} onSelect={setTimeframe} />
        <StrategyPrecedent precedent={asset.historicalPrecedent} onDeploy={deploy} />
      </ScrollView>

      {toast ? (
        <View className="absolute bottom-6 left-4 right-4 bg-surface-container border border-violet/40 p-4 rounded-xl flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <Icon name="checkmark-done" size={18} color={colors.emerald} label="Deployed" />
            <View className="flex-1">
              <Text className="font-bold text-xs">Strategy Deployed Successfully</Text>
              <Text variant="caption" tone="muted" className="font-mono">
                {toast}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => setToast(null)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss notification"
            className="p-1"
          >
            <Icon name="close" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
