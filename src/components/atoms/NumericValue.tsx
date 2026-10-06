/**
 * Filename:    NumericValue.tsx
 * Description: Monospace numeric readout (Z-score, RSI, price) with sign color.
 * Purpose:     Centralize the "numbers are mono; positive=emerald, negative=
 *              danger" rule so every metric renders identically. RSI uses
 *              oversold(<35)/overbought(>65) thresholds like the web scanner.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Text as RNText } from 'react-native';

export type NumericMode = 'signed' | 'plain' | 'rsi';

export interface NumericValueProps {
  /** Raw numeric value. */
  value: number;
  /** Coloring/formatting mode. signed=Z-score, rsi=threshold, plain=neutral. */
  mode?: NumericMode;
  /** Fixed decimal places (default 2). */
  decimals?: number;
  /** Emphasize (bold) the value. */
  bold?: boolean;
  className?: string;
}

/** Pick a color class from the value + mode. */
function colorClass(value: number, mode: NumericMode): string {
  if (mode === 'plain') return 'text-content-primary';
  if (mode === 'rsi') {
    if (value < 35) return 'text-danger';
    if (value > 65) return 'text-emerald';
    return 'text-content-primary';
  }
  return value >= 0 ? 'text-emerald' : 'text-danger';
}

/** Format the value; signed mode prefixes a '+' for non-negatives. */
function formatValue(value: number, mode: NumericMode, decimals: number): string {
  const fixed = value.toFixed(decimals);
  if (mode === 'signed' && value >= 0) return `+${fixed}`;
  return fixed;
}

/** NumericValue renders a mono, sign-colored number. */
export function NumericValue({
  value,
  mode = 'signed',
  decimals = 2,
  bold = false,
  className,
}: NumericValueProps): React.JSX.Element {
  const weight = bold ? 'font-bold' : '';
  const text = formatValue(value, mode, decimals);
  return (
    <RNText
      className={`font-mono text-sm ${colorClass(value, mode)} ${weight} ${className ?? ''}`.trim()}
      accessibilityLabel={text}
    >
      {text}
    </RNText>
  );
}
