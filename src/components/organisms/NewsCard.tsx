/**
 * Filename:    NewsCard.tsx  [ src/components/organisms ]
 * Description: Single credible-headline feed card (category, title, source).
 * Purpose:     Port the web NewsScreen headline row to RN using shared atoms
 *              (Card, Text, Icon). Pressable; emits onPress so the feed owns
 *              navigation/opening. Borders-over-shadows; mono for meta.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, View } from 'react-native';

import { Card, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';
import type { NewsHeadline } from '@/data/news';

export interface NewsCardProps {
  /** The headline to render. */
  headline: NewsHeadline;
  /** Called when the card is pressed. */
  onPress?: (headline: NewsHeadline) => void;
}

/** NewsCard renders one pressable headline card. */
export function NewsCard({ headline, onPress }: NewsCardProps): React.JSX.Element {
  const colors = useThemeColors();
  const { title, category, timeAgo, source, impactScore } = headline;
  return (
    <Pressable
      onPress={() => onPress?.(headline)}
      accessibilityRole="button"
      accessibilityLabel={`${category} headline: ${title}. Source ${source}, ${timeAgo}.`}
    >
      <Card className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="bg-violet/10 px-1.5 py-0.5 rounded">
            <Text variant="label" tone="accent" className="tracking-normal">
              {category}
            </Text>
          </View>
          <Text variant="caption" tone="muted" className="font-mono">
            {timeAgo}
          </Text>
        </View>

        <Text variant="body" tone="primary" className="font-medium leading-snug">
          {title}
        </Text>

        <View className="flex-row items-center gap-2 pt-1">
          <Icon name="checkmark-circle" size={13} color={colors.emerald} />
          <Text variant="caption" tone="muted">
            Verified Source
          </Text>
          <Text variant="caption" tone="muted">
            •
          </Text>
          <Text variant="caption" tone="secondary">
            {source}
          </Text>
          <View className="flex-1" />
          <Text variant="caption" tone="muted" className="font-mono">
            Impact {impactScore}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
