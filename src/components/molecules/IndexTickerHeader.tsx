/**
 * Filename:    IndexTickerHeader.tsx
 * Description: Index banner — name, live dot, price, % change, sparkline slot.
 * Purpose:     Compose the S&P 500 index header from atoms + StatCard. The
 *              sparkline is a bordered placeholder slot (children) so a chart
 *              organism can drop in later without changing this molecule.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Card, Text } from '@/components/atoms';

export interface IndexTickerHeaderProps {
  /** Index name, e.g. 'S&P 500 / INDEX TICKER'. */
  name: string;
  /** Pre-formatted index level, e.g. '5,117.09'. */
  price: string;
  /** Pre-formatted absolute change, e.g. '+71.82'. */
  change: string;
  /** Pre-formatted percent change, e.g. '+1.42% (Today)'. */
  changePercent: string;
  /** True when the day's move is positive (drives emerald vs danger). */
  positive?: boolean;
  /** Optional sparkline node; a bordered placeholder is shown otherwise. */
  sparkline?: React.ReactNode;
}

/** IndexTickerHeader renders the index banner with a sparkline slot. */
export function IndexTickerHeader({
  name,
  price,
  change,
  changePercent,
  positive = true,
  sparkline,
}: IndexTickerHeaderProps): React.JSX.Element {
  const tone = positive ? 'text-emerald' : 'text-danger';
  return (
    <Card accessibilityLabel={`${name}, ${price}, ${changePercent}`}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className={`w-2 h-2 rounded-full ${positive ? 'bg-emerald' : 'bg-danger'}`} />
          <Text variant="label" tone="secondary">
            {name}
          </Text>
        </View>
        <Text variant="caption" className={`font-mono ${tone}`}>
          {changePercent}
        </Text>
      </View>

      <View className="flex-row items-end justify-between">
        <View className="flex-row items-baseline gap-2">
          <Text className="font-mono font-bold text-2xl tracking-tight">{price}</Text>
          <Text variant="caption" className={`font-mono ${tone}`}>
            {change}
          </Text>
        </View>
        <View
          className="w-28 h-8 rounded border border-outline items-center justify-center"
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {sparkline ?? (
            <Text variant="label" tone="muted">
              ~
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}
