/**
 * Filename:    SectionHeader.tsx
 * Description: Section title row — leading icon + heading + trailing meta.
 * Purpose:     Compose the scanner's "TOP 10 SECTOR ASSETS ... Live Z-Scores"
 *              header from Icon + Heading + Text atoms. Trailing meta is
 *              optional so the molecule reuses across sections.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Heading, Icon, type IconName, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';

export interface SectionHeaderProps {
  /** Section title, e.g. 'Top 10 Sector Assets'. */
  title: string;
  /** Optional leading icon (defaults to a radar glyph). */
  icon?: IconName;
  /** Optional trailing meta text, e.g. '10 Assets • Live Z-Scores'. */
  meta?: string;
}

/** SectionHeader renders a titled section divider row. */
export function SectionHeader({
  title,
  icon = 'radio-outline',
  meta,
}: SectionHeaderProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Icon name={icon} size={18} color={colors.violet} />
        <Heading level="section">{title}</Heading>
      </View>
      {meta ? (
        <Text variant="caption" tone="muted" className="font-mono">
          {meta}
        </Text>
      ) : null}
    </View>
  );
}
