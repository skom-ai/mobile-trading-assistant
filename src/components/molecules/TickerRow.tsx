/**
 * Filename:    TickerRow.tsx
 * Description: Scanner list row — rank, symbol, badge, company/sector, Z/RSI.
 * Purpose:     Compose atoms (RankNumber, Badge, NumericValue, Icon, Text) into
 *              the ranked asset row from the web Scanner. Pure presentation;
 *              press is delegated via onPress.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, View } from 'react-native';

import {
  Badge,
  type BadgeVariant,
  Icon,
  NumericValue,
  RankNumber,
  type RankTone,
  Text,
} from '@/components/atoms';

export interface TickerRowProps {
  rank: string;
  symbol: string;
  company: string;
  sector: string;
  badge: BadgeVariant;
  badgeLabel?: string;
  rankTone?: RankTone;
  zScore: number;
  rsi: number;
  onPress?: () => void;
}

/** TickerRow renders one ranked asset row. */
export function TickerRow({
  rank,
  symbol,
  company,
  sector,
  badge,
  badgeLabel,
  rankTone = 'neutral',
  zScore,
  rsi,
  onPress,
}: TickerRowProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${symbol}, ${company}, ${sector}, Z-score ${zScore}, RSI ${rsi}`}
      className="flex-row items-center justify-between bg-surface p-3.5 rounded-xl border border-outline"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <RankNumber rank={rank} tone={rankTone} />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="font-mono font-bold text-base">{symbol}</Text>
            <Badge variant={badge} label={badgeLabel} />
          </View>
          <Text variant="caption" tone="muted" className="font-mono">
            {company} • {sector}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-4">
        <View className="items-end">
          <Text variant="caption" tone="muted" className="font-mono">
            Z-Score
          </Text>
          <NumericValue value={zScore} mode="signed" bold />
        </View>
        <View className="items-end w-12">
          <Text variant="caption" tone="muted" className="font-mono">
            RSI
          </Text>
          <NumericValue value={rsi} mode="rsi" decimals={1} />
        </View>
        <Icon name="chevron-forward" size={18} />
      </View>
    </Pressable>
  );
}
