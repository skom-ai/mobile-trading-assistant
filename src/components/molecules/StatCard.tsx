/**
 * Filename:    StatCard.tsx
 * Description: Label + value stat pair (Market Sentiment / Volume / VIX).
 * Purpose:     Compact metric cell used inside the index header's stat grid.
 *              Value tone is selectable so positive readings render emerald.
 *              Aliased as SentimentStat for call-site readability.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Text, type TextTone } from '@/components/atoms';

export interface StatCardProps {
  /** Metric label, e.g. 'VIX'. */
  label: string;
  /** Metric value, pre-formatted, e.g. 'Bullish (78%)'. */
  value: string;
  /** Color tone for the value (default primary). */
  valueTone?: TextTone;
  className?: string;
}

/** StatCard renders a stacked label/value pair. */
export function StatCard({
  label,
  value,
  valueTone = 'primary',
  className,
}: StatCardProps): React.JSX.Element {
  return (
    <View
      className={`flex-col ${className ?? ''}`.trim()}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text variant="label" tone="muted" className="tracking-normal">
        {label}
      </Text>
      <Text variant="caption" tone={valueTone} className="font-mono font-medium">
        {value}
      </Text>
    </View>
  );
}

/** SentimentStat is a semantic alias of StatCard for sentiment readouts. */
export const SentimentStat = StatCard;
