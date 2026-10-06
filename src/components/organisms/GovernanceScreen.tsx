/**
 * Filename:    GovernanceScreen.tsx  [ src/components/organisms ]
 * Description: Governance / WORM audit-trail screen (composed organism).
 * Purpose:     Port the web GovernanceScreen 1:1 to RN — vault status banner,
 *              system guardrails, and the searchable "Audit Decision Trail"
 *              with an Export SEC Packet action and a record inspector modal.
 *              Composes shared atoms/molecules + Governance-specific organisms.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Heading, Icon, Text } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { useThemeColors } from '@/theme';
import {
  INITIAL_AUDIT_RECORDS,
  LAST_SEALED_BLOCK,
  TOTAL_RECORDS_COUNT,
  type AuditRecord,
} from '@/data/governance';

import { GovernanceGuardrails } from './GovernanceGuardrails';
import { GovernanceRecordCard } from './GovernanceRecordCard';
import { GovernanceRecordModal } from './GovernanceRecordModal';
import { GovernanceStatusBanner } from './GovernanceStatusBanner';

/** Case-insensitive match across the searchable record fields. */
function matches(rec: AuditRecord, q: string): boolean {
  const needle = q.toLowerCase();
  return (
    rec.corrId.toLowerCase().includes(needle) ||
    rec.title.toLowerCase().includes(needle) ||
    rec.description.toLowerCase().includes(needle) ||
    rec.hash.toLowerCase().includes(needle)
  );
}

/** GovernanceScreen renders the full governance/audit compliance view. */
export function GovernanceScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AuditRecord | null>(null);

  const filtered = useMemo(
    () => INITIAL_AUDIT_RECORDS.filter((rec) => matches(rec, query)),
    [query],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-24 gap-6">
        <GovernanceStatusBanner
          totalRecordsCount={TOTAL_RECORDS_COUNT}
          lastSealedBlock={LAST_SEALED_BLOCK}
        />

        <GovernanceGuardrails />

        <View className="gap-3">
          <View className="flex-row items-center justify-between px-1">
            <View className="flex-row items-center gap-2">
              <Icon name="hammer-outline" size={18} color={colors.violet} />
              <Heading level="section">Audit Decision Trail</Heading>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Export SEC packet"
              className="flex-row items-center gap-1"
            >
              <Text variant="caption" className="font-mono text-violet">
                Export SEC Packet
              </Text>
              <Icon name="download-outline" size={14} color={colors.violet} />
            </Pressable>
          </View>

          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search correlation ID or event..."
          />

          <View className="gap-2">
            {filtered.map((record) => (
              <GovernanceRecordCard
                key={record.id}
                record={record}
                onOpen={setSelected}
              />
            ))}

            {filtered.length === 0 ? (
              <View className="p-8 rounded-card border border-outline bg-surface items-center">
                <Text variant="caption" tone="muted" className="font-mono">
                  No audit records matching query.
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <GovernanceRecordModal
        record={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}
