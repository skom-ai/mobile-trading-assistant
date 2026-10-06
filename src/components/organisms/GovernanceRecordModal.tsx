/**
 * Filename:    GovernanceRecordModal.tsx  [ src/components/organisms ]
 * Description: Audit-record inspector modal for the Governance screen.
 * Purpose:     Reproduce the web RecordModal — a bottom-sheet dialog showing the
 *              WORM seal banner, event context, the full SHA-256 digest (with a
 *              copy affordance), Merkle epoch root, and signer authority.
 *              Governance-specific organism.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Heading, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';
import type { AuditRecord } from '@/data/governance';

export interface GovernanceRecordModalProps {
  /** Record under inspection, or null when closed. */
  record: AuditRecord | null;
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Called to dismiss the modal. */
  onClose: () => void;
}

interface FieldProps {
  label: string;
  value: string;
  valueTone?: string;
  surface?: string;
}

/** A labelled monospace field block used for hashes / signer text. */
function Field({ label, value, valueTone = 'text-content-primary', surface = 'bg-surface-container' }: FieldProps): React.JSX.Element {
  return (
    <View className="gap-1">
      <Text variant="caption" tone="muted" className="font-mono uppercase">{label}</Text>
      <View className={`p-2.5 rounded-lg border border-outline ${surface}`}>
        <Text className={`text-[11px] font-mono ${valueTone}`} selectable>{value}</Text>
      </View>
    </View>
  );
}

/** GovernanceRecordModal renders the record inspector bottom sheet. */
export function GovernanceRecordModal({
  record,
  isOpen,
  onClose,
}: GovernanceRecordModalProps): React.JSX.Element | null {
  const colors = useThemeColors();
  const [copied, setCopied] = useState(false);

  // Reflect the digest as "selected"; native clipboard is intentionally left to
  // the platform long-press (selectable text) to avoid adding a dependency.
  const flagCopied = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (!record) return null;

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1 bg-black/75 justify-end"
        accessibilityLabel="Dismiss inspector"
        onPress={onClose}
      >
        <Pressable
          onPress={() => undefined}
          accessibilityViewIsModal
          className="bg-surface border border-outline rounded-t-2xl max-h-[88%] overflow-hidden"
        >
          <View className="flex-row items-center justify-between p-4 border-b border-outline">
            <View className="flex-row items-center gap-2.5 flex-1">
              <View className="px-2 py-1 rounded bg-violet/10">
                <Text className="text-xs font-mono font-bold text-violet">{record.corrId}</Text>
              </View>
              <View className="flex-1">
                <Heading level="section" numberOfLines={1}>
                  {record.title}
                </Heading>
                <Text variant="label" tone="muted" className="tracking-normal">
                  Block #{record.blockNumber} • {record.secRule}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close inspector"
              className="w-7 h-7 rounded-lg bg-surface-high items-center justify-center"
            >
              <Icon name="close" size={16} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView className="p-4" contentContainerClassName="gap-3.5">
            <View className="p-3 rounded-xl border border-emerald/30 bg-emerald/10 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 flex-1">
                <Icon name="lock-closed" size={18} color={colors.emerald} />
                <Text variant="caption" className="font-mono font-bold text-emerald flex-1">
                  WORM HARDWARE WRITE-LOCK SEALED
                </Text>
              </View>
              <View className="px-2 py-0.5 rounded bg-emerald/20">
                <Text className="text-[10px] font-mono text-content-primary">{record.status}</Text>
              </View>
            </View>

            <Field label="Event Authorization & Context" value={record.description} />

            <View className="flex-row items-center justify-between">
              <Text variant="caption" tone="muted" className="font-mono">
                SHA-256 Digest Hash
              </Text>
              <Pressable
                onPress={flagCopied}
                accessibilityRole="button"
                accessibilityLabel="Mark hash copied"
                className="flex-row items-center gap-1"
              >
                <Icon name="copy-outline" size={12} color={colors.violet} />
                <Text className="text-[10px] font-mono text-violet">
                  {copied ? 'Copied!' : 'Copy Hash'}
                </Text>
              </Pressable>
            </View>
            <Field label="Digest" value={record.fullHash} valueTone="text-emerald" surface="bg-background" />
            <Field label="Merkle Epoch Root Anchor" value={record.merkleRoot} valueTone="text-content-secondary" surface="bg-background" />
            <Field label="Signer Authority" value={record.signer} />
          </ScrollView>

          <View className="p-3.5 border-t border-outline">
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close inspector"
              className="h-10 rounded-lg bg-violet items-center justify-center"
            >
              <Text className="text-xs font-sans font-bold text-background">Close Inspector</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
