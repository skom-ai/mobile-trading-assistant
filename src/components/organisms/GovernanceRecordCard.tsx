/**
 * Filename:    GovernanceRecordCard.tsx  [ src/components/organisms ]
 * Description: Tappable audit-decision record card for the Governance screen.
 * Purpose:     Reproduce one row of the web GovernanceScreen's "Audit Decision
 *              Trail" — correlation id pill, time-ago, title + description, and
 *              a hash / SEC-rule footer. Pressing it opens the record inspector.
 *              Governance-specific organism.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, View } from 'react-native';

import { Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';
import type { AuditRecord } from '@/data/governance';

export interface GovernanceRecordCardProps {
  /** The audit record to render. */
  record: AuditRecord;
  /** Called when the card is pressed (opens the inspector). */
  onOpen: (record: AuditRecord) => void;
}

/** GovernanceRecordCard renders a single tappable audit-trail record. */
export function GovernanceRecordCard({
  record,
  onOpen,
}: GovernanceRecordCardProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => onOpen(record)}
      accessibilityRole="button"
      accessibilityLabel={`Audit record ${record.corrId}: ${record.title}. Open inspector.`}
      className="bg-surface rounded-card border border-outline p-4 gap-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="px-2 py-0.5 rounded bg-violet/10">
          <Text className="text-xs font-mono font-bold text-violet">
            {record.corrId}
          </Text>
        </View>
        <Text variant="caption" tone="muted" className="font-mono">
          {record.timeAgo}
        </Text>
      </View>

      <View>
        <Text className="text-xs font-sans font-semibold text-content-primary">
          {record.title}
        </Text>
        <Text variant="caption" tone="muted" className="font-mono mt-1">
          {record.description}
        </Text>
      </View>

      <View className="pt-2 border-t border-outline flex-row items-center justify-between">
        <View className="flex-row items-center gap-1 flex-1">
          <Icon name="shield-checkmark-outline" size={14} color={colors.emerald} />
          <Text variant="caption" className="font-mono text-emerald" numberOfLines={1}>
            Hash: {record.hash}
          </Text>
        </View>
        <Text variant="caption" tone="muted" className="font-mono">
          {record.secRule}
        </Text>
      </View>
    </Pressable>
  );
}
