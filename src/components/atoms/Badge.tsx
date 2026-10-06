/**
 * Filename:    Badge.tsx
 * Description: Variant-driven status badge (Strong Buy / Oversold / Value ...).
 * Purpose:     Single source of truth for the colored pill badges shown on
 *              ticker rows. Maps each verdict variant to Obsidian tinted
 *              bg/text/border classNames, mirroring the web app's badge styles.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Text } from './Typography';

export type BadgeVariant =
  | 'strongBuy'
  | 'neutral'
  | 'momentum'
  | 'accumulate'
  | 'stable'
  | 'hold'
  | 'oversold'
  | 'value'
  | 'error';

/** Human-facing default labels per variant. */
export const BADGE_LABELS: Record<BadgeVariant, string> = {
  strongBuy: 'Strong Buy',
  neutral: 'Neutral',
  momentum: 'Momentum',
  accumulate: 'Accumulate',
  stable: 'Stable',
  hold: 'Hold',
  oversold: 'Oversold',
  value: 'Value',
  error: 'Error',
};

/** Tinted pill classes: violet=bullish, emerald=positive, danger=oversold. */
const VARIANT_CLASS: Record<BadgeVariant, string> = {
  strongBuy: 'bg-violet/20 border border-violet/30',
  momentum: 'bg-violet/20 border border-violet/30',
  accumulate: 'bg-emerald/15 border border-emerald/30',
  value: 'bg-emerald/15 border border-emerald/30',
  oversold: 'bg-danger/15 border border-danger/40',
  error: 'bg-danger/15 border border-danger/40',
  neutral: 'bg-surface-high border border-outline',
  stable: 'bg-surface-high border border-outline',
  hold: 'bg-surface-high border border-outline',
};

const VARIANT_TEXT: Record<BadgeVariant, string> = {
  strongBuy: 'text-violet',
  momentum: 'text-violet',
  accumulate: 'text-emerald',
  value: 'text-emerald',
  oversold: 'text-danger',
  error: 'text-danger',
  neutral: 'text-content-secondary',
  stable: 'text-content-secondary',
  hold: 'text-content-secondary',
};

export interface BadgeProps {
  /** Verdict variant driving the pill color. */
  variant: BadgeVariant;
  /** Optional label override (defaults to the variant's human label). */
  label?: string;
  className?: string;
}

/** Badge renders a small colored status pill. */
export function Badge({ variant, label, className }: BadgeProps): React.JSX.Element {
  const text = label ?? BADGE_LABELS[variant];
  return (
    <View
      className={`px-1.5 py-0.5 rounded ${VARIANT_CLASS[variant]} ${className ?? ''}`.trim()}
      accessibilityRole="text"
      accessibilityLabel={`Signal: ${text}`}
    >
      <Text variant="label" className={`${VARIANT_TEXT[variant]} tracking-normal`}>
        {text}
      </Text>
    </View>
  );
}
