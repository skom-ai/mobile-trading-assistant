/**
 * Filename:    GovernanceGuardrails.tsx  [ src/components/organisms ]
 * Description: System-guardrails status list for the Governance screen.
 * Purpose:     Reproduce the web GovernanceScreen's "System Guardrails" block —
 *              the WORM write-lock card, the Cryptographic Epoch Anchor card
 *              with a tappable verify action + spinner, and the verification
 *              feedback toast. Governance-specific organism.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Card, Heading, Icon, Text } from '@/components/atoms';
import { useThemeColors } from '@/theme';

const EPOCH_VERIFIED_MSG =
  'All 1,489,204 WORM roots verified against AWS Nitro Enclave HSM & Google Cloud KMS.';

interface GuardrailRowProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/** One guardrail card: leading icon, title/subtitle, trailing status slot. */
function GuardrailRow({
  icon,
  title,
  subtitle,
  children,
}: GuardrailRowProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Card className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-8 h-8 rounded-lg bg-surface-container items-center justify-center">
          <Icon name={icon} size={18} color={colors.violet} />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-sans font-medium text-content-primary">
            {title}
          </Text>
          <Text variant="caption" tone="muted" className="font-mono">
            {subtitle}
          </Text>
        </View>
      </View>
      {children}
    </Card>
  );
}

/** GovernanceGuardrails renders the enforced-guardrails status section. */
export function GovernanceGuardrails(): React.JSX.Element {
  const colors = useThemeColors();
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleVerifyEpoch = useCallback(() => {
    setIsVerifying(true);
    setFeedback(null);
    setTimeout(() => {
      setIsVerifying(false);
      setFeedback(EPOCH_VERIFIED_MSG);
      setTimeout(() => setFeedback(null), 5000);
    }, 900);
  }, []);

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-1">
        <View className="flex-row items-center gap-2">
          <Icon name="shield-outline" size={18} color={colors.violet} />
          <Heading level="section">System Guardrails</Heading>
        </View>
        <Text variant="caption" className="font-mono text-emerald">
          All Enforced
        </Text>
      </View>

      <GuardrailRow
        icon="lock-closed"
        title="Write-Once-Read-Many (WORM)"
        subtitle="Hardware-level write lock engaged"
      >
        <Icon name="checkmark-circle" size={20} color={colors.emerald} label="Enforced" />
      </GuardrailRow>

      <GuardrailRow
        icon="ribbon-outline"
        title="Cryptographic Epoch Anchor"
        subtitle="SHA-256 Merkle root synced to cloud"
      >
        <Pressable
          onPress={handleVerifyEpoch}
          disabled={isVerifying}
          accessibilityRole="button"
          accessibilityLabel="Verify cryptographic epoch proof"
          accessibilityState={{ disabled: isVerifying, busy: isVerifying }}
        >
          {isVerifying ? (
            <ActivityIndicator size="small" color={colors.emerald} />
          ) : (
            <Icon name="checkmark-circle" size={20} color={colors.emerald} label="Verify epoch" />
          )}
        </Pressable>
      </GuardrailRow>

      {feedback ? (
        <View
          className="p-3 rounded-xl border border-emerald/30 bg-emerald/10 flex-row items-center gap-2"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          <Icon name="checkmark-done" size={16} color={colors.emerald} />
          <Text variant="caption" className="font-mono text-emerald flex-1">
            {feedback}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
