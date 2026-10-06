/**
 * Filename:    GovernanceStatusBanner.tsx  [ src/components/organisms ]
 * Description: WORM immutable-vault status banner for the Governance screen.
 * Purpose:     Reproduce the web GovernanceScreen's top banner — SEC Rule 17a-4
 *              badge, "Immutable Vault Active" title, chain-integrity readout,
 *              and the Total Records / Last Sealed Block figures. Governance-
 *              specific organism; composes shared atoms only.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Badge, Card, Heading, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';

export interface GovernanceStatusBannerProps {
  /** Total sealed records in the vault. */
  totalRecordsCount: number;
  /** Height of the most-recently sealed block. */
  lastSealedBlock: number;
}

/** GovernanceStatusBanner renders the immutable-vault status header. */
export function GovernanceStatusBanner({
  totalRecordsCount,
  lastSealedBlock,
}: GovernanceStatusBannerProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Card className="p-5" accessibilityLabel="WORM immutable vault status">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-12 h-12 rounded-lg bg-violet/20 items-center justify-center">
            <Icon name="shield-checkmark" size={24} color={colors.violet} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text variant="label" tone="accent">
                SEC Rule 17a-4
              </Text>
              <Badge variant="accumulate" label="WORM VERIFIED" />
            </View>
            <Heading level="title" className="mt-0.5">
              Immutable Vault Active
            </Heading>
          </View>
        </View>

        <View className="items-end">
          <Text variant="caption" tone="muted" className="font-mono">
            Chain Integrity
          </Text>
          <Text
            className="text-base font-mono font-bold text-emerald"
            accessibilityLabel="Chain integrity 100 percent"
          >
            100%
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3 mt-4 pt-4 border-t border-outline">
        <View className="flex-1">
          <Text variant="caption" tone="muted" className="font-mono">
            Total Records
          </Text>
          <Text className="text-sm font-mono font-bold text-content-primary">
            {totalRecordsCount.toLocaleString()}
          </Text>
        </View>
        <View className="flex-1">
          <Text variant="caption" tone="muted" className="font-mono">
            Last Sealed Block
          </Text>
          <Text className="text-sm font-mono font-bold text-content-primary">
            #{lastSealedBlock}
          </Text>
        </View>
      </View>
    </Card>
  );
}
