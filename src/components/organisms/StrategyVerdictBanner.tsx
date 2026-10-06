/**
 * Filename:    StrategyVerdictBanner.tsx  [ organisms ]
 * Description: Public verdict banner — verdict pill, subtitle, confidence %.
 * Purpose:     Reproduce the web StrategyScreen "Public Verdict" banner in RN
 *              using Card / Icon / Heading / Text / Badge atoms.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Badge, Card, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';

export interface StrategyVerdictBannerProps {
  /** Verdict label, e.g. 'BUY PULLBACK'. */
  verdict: string;
  /** One-line supporting rationale. */
  subtitle: string;
  /** Confidence percentage (0-100). */
  confidence: number;
}

/** StrategyVerdictBanner renders the public verdict + confidence card. */
export function StrategyVerdictBanner({
  verdict,
  subtitle,
  confidence,
}: StrategyVerdictBannerProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Card
      className="p-4 flex-row items-center justify-between border-violet/20"
      accessibilityLabel={`Public verdict ${verdict}, confidence ${confidence} percent`}
    >
      <View className="flex-row items-center gap-3 flex-1 pr-2">
        <View className="w-10 h-10 rounded-full bg-violet/20 items-center justify-center">
          <Icon name="shield-checkmark" size={20} color={colors.violet} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text variant="label" tone="accent">
              Public Verdict
            </Text>
            <Badge variant="strongBuy" label={verdict} />
          </View>
          <Text variant="caption" tone="secondary" className="mt-0.5">
            {subtitle}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="font-mono font-bold text-lg text-emerald">{`${confidence}%`}</Text>
        <Text variant="label" tone="muted">
          Confidence
        </Text>
      </View>
    </Card>
  );
}
