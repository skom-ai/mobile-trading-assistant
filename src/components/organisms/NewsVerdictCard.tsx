/**
 * Filename:    NewsVerdictCard.tsx  [ src/components/organisms ]
 * Description: LLM catalyst verdict card — confidence, rationale, evidence.
 * Purpose:     Port the web NewsScreen "REAL_CATALYST" verdict block: engine
 *              badge, confidence pill, headline + impact, rationale, and a list
 *              of pressable verifiable-evidence citations. Built from atoms.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, View } from 'react-native';

import { Card, Divider, Heading, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';
import type { CatalystVerdict, Citation } from '@/data/news';

export interface NewsVerdictCardProps {
  /** Synthesized verdict summary. */
  verdict: CatalystVerdict;
  /** Verifiable-evidence citations. */
  citations: Citation[];
  /** Called when a citation row is pressed. */
  onOpenCitation?: (citation: Citation) => void;
}

/** NewsVerdictCard renders the LLM verdict block with evidence citations. */
export function NewsVerdictCard({
  verdict,
  citations,
  onOpenCitation,
}: NewsVerdictCardProps): React.JSX.Element {
  const colors = useThemeColors();
  const { engine, confidence, headline, impactLabel, rationale } = verdict;
  return (
    <Card className="gap-3" padded>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-emerald" />
          <Text variant="label" tone="muted">
            {engine}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 bg-emerald/15 border border-emerald/20 px-2 py-0.5 rounded-full">
          <Icon name="shield-checkmark" size={12} color={colors.emerald} />
          <Text variant="caption" className="font-mono text-emerald">
            {confidence.toFixed(1)}% Confidence
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <Heading level="title" className="font-mono">
          {headline}
        </Heading>
        <View className="bg-violet/10 border border-violet/20 px-2 py-0.5 rounded">
          <Text variant="label" tone="accent" className="tracking-normal">
            {impactLabel}
          </Text>
        </View>
      </View>

      <Text variant="body" tone="secondary" className="leading-relaxed">
        {rationale}
      </Text>

      <Divider className="my-1" />

      <Text variant="label" tone="muted">
        Verifiable Evidence
      </Text>
      <View className="gap-2">
        {citations.map((cit) => (
          <Pressable
            key={cit.id}
            onPress={() => onOpenCitation?.(cit)}
            accessibilityRole="button"
            accessibilityLabel={`Open evidence: ${cit.citationTag}. ${cit.title}.`}
            className="flex-row items-center justify-between bg-surface-container border border-outline rounded-lg p-2.5"
          >
            <View className="flex-row items-center gap-2.5 flex-1 pr-2">
              <Icon
                name={cit.type === 'filing' ? 'document-text' : 'globe-outline'}
                size={18}
                color={cit.type === 'filing' ? colors.violet : colors.emerald}
              />
              <View className="flex-1">
                <Text variant="caption" tone="primary" className="font-medium">
                  {cit.citationTag}
                </Text>
                <Text variant="caption" tone="muted" numberOfLines={1}>
                  {cit.title}
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}
