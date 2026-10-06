/**
 * Filename:    StrategyPrecedent.tsx  [ organisms ]
 * Description: Historical Precedents — analog setup card with a bar sparkline,
 *              pattern summary, and the "Deploy Strategy" execute button.
 * Purpose:     Reproduce the web StrategyScreen precedent card + execute CTA
 *              1:1 in RN. Sparkline is drawn as height-scaled Views (no chart
 *              dep) matching the web's volume-bar simulation.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, View } from 'react-native';

import { Badge, Card, Heading, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';
import type { HistoricalPrecedent } from '@/data/strategy';

export interface StrategyPrecedentProps {
  /** Matched historical analog for the analyzed asset. */
  precedent: HistoricalPrecedent;
  /** Fired when the user taps the deploy CTA. */
  onDeploy: () => void;
}

/** Bar tint by position: early=faint violet, mid=violet, late=emerald. */
function barClass(index: number): string {
  if (index >= 7) return 'bg-emerald';
  if (index >= 4) return 'bg-violet/80';
  return 'bg-violet/40';
}

/** StrategyPrecedent renders the analog card + deploy button. */
export function StrategyPrecedent({
  precedent,
  onDeploy,
}: StrategyPrecedentProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <View className="gap-5">
      <Card className="p-5">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Icon name="time" size={18} color={colors.violet} />
            <Heading level="section">Historical Precedents</Heading>
          </View>
          <Text variant="caption" tone="muted" className="font-mono">
            {`Case ${precedent.caseId} Match`}
          </Text>
        </View>

        <View className="bg-surface-container rounded-lg p-4 border border-outline gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              <Badge variant="strongBuy" label={precedent.setupName} />
              <Text variant="caption" tone="secondary" className="font-mono">
                {`Duration: ${precedent.duration}`}
              </Text>
            </View>
            <Text className="font-mono font-bold text-xs text-emerald">
              {`${precedent.returnRate} Return`}
            </Text>
          </View>

          <View
            className="w-full h-16 bg-surface-lowest rounded flex-row items-end p-2 gap-1"
            accessibilityLabel={`Analog sparkline, ${precedent.returnRate} return`}
          >
            {precedent.sparklineData.map((val, idx) => (
              <View
                key={idx}
                className={`flex-1 rounded-t ${barClass(idx)}`}
                style={{ height: `${val}%` }}
              />
            ))}
          </View>

          <Text variant="caption" tone="secondary">
            {precedent.patternSummary}
          </Text>
        </View>
      </Card>

      <Pressable
        onPress={onDeploy}
        className="w-full h-12 bg-violet rounded-lg flex-row items-center justify-center gap-2"
        accessibilityRole="button"
        accessibilityLabel="Deploy strategy and set alerts"
      >
        <Icon name="flash" size={20} color={colors.background} />
        <Text className="font-bold text-background">Deploy Strategy & Set Alerts</Text>
      </Pressable>
    </View>
  );
}
