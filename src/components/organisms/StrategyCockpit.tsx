/**
 * Filename:    StrategyCockpit.tsx  [ organisms ]
 * Description: Strategy Coherence Cockpit — SL→current→target progress bar and
 *              the Entry / Stop / Target actionable cards.
 * Purpose:     Reproduce the web StrategyScreen cockpit 1:1 in RN. The bar
 *              segments are computed from the asset's stop/entry/target so the
 *              current marker reflects real price position (not the fixed
 *              35/45/20 split of the web mock).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Card, Divider, Heading, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';
import type { StrategyAsset } from '@/data/strategy';

export interface StrategyCockpitProps {
  /** Analyzed asset providing stop/entry/target/price levels. */
  asset: StrategyAsset;
}

/** Compute [stopPct, currentPct, targetPct] segment widths from price levels. */
export function cockpitSegments(asset: StrategyAsset): [number, number, number] {
  const range = asset.targetPrice - asset.stopLoss;
  if (range <= 0) return [35, 45, 20];
  const clamped = Math.max(0, Math.min(range, asset.price - asset.stopLoss));
  const current = Math.round((clamped / range) * 100);
  const left = Math.round(current * 0.6);
  return [left, current - left, Math.max(0, 100 - current)];
}

/** StrategyCockpit renders the coherence progress bar + setup cards. */
export function StrategyCockpit({ asset }: StrategyCockpitProps): React.JSX.Element {
  const colors = useThemeColors();
  const [redPct, violetPct, greenPct] = cockpitSegments(asset);
  return (
    <Card className="p-5">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Icon name="git-branch" size={18} color={colors.violet} />
          <Heading level="section">Strategy Coherence Cockpit</Heading>
        </View>
        <Text variant="label" tone="accent">
          Active Setup
        </Text>
      </View>

      <View className="flex-row justify-between mb-1.5">
        <Text variant="caption" tone="secondary" className="font-mono">
          {`Stop $${asset.stopLoss.toFixed(2)}`}
        </Text>
        <Text variant="caption" tone="accent" className="font-mono font-bold">
          {`Current $${asset.price.toFixed(2)}`}
        </Text>
        <Text variant="caption" className="font-mono text-emerald">
          {`Target $${asset.targetPrice.toFixed(2)}`}
        </Text>
      </View>
      <View
        className="w-full h-3 rounded-full overflow-hidden flex-row"
        accessibilityRole="progressbar"
        accessibilityLabel={`Price ${asset.price.toFixed(2)} between stop and target`}
      >
        <View className="h-full bg-danger/60" style={{ width: `${redPct}%` }} />
        <View className="h-full bg-violet" style={{ width: `${violetPct}%` }} />
        <View className="h-full bg-emerald/60" style={{ width: `${greenPct}%` }} />
      </View>

      <Divider className="my-4" />
      <View className="flex-row gap-2">
        <SetupCell label="Entry Zone" value={`$${asset.entryZone.toFixed(2)}`} hint="Limit order active" tone="text-violet" />
        <SetupCell label="Stop Loss" value={`$${asset.stopLoss.toFixed(2)}`} hint={`Risk: ${asset.riskPercent}%`} tone="text-danger" />
        <SetupCell label="Target" value={`$${asset.targetPrice.toFixed(2)}`} hint={`Reward: +${asset.rewardPercent}%`} tone="text-emerald" />
      </View>
    </Card>
  );
}

interface SetupCellProps {
  label: string;
  value: string;
  hint: string;
  tone: string;
}

/** SetupCell renders one Entry/Stop/Target metric tile. */
function SetupCell({ label, value, hint, tone }: SetupCellProps): React.JSX.Element {
  return (
    <View
      className="flex-1 bg-surface-container p-3 rounded-lg border border-outline"
      accessibilityRole="text"
      accessibilityLabel={`${label} ${value}, ${hint}`}
    >
      <Text variant="label" tone="muted" className="tracking-normal">
        {label}
      </Text>
      <Text className={`font-mono font-bold text-sm mt-1 ${tone}`}>{value}</Text>
      <Text variant="caption" tone="muted" className="mt-1 font-mono">
        {hint}
      </Text>
    </View>
  );
}
