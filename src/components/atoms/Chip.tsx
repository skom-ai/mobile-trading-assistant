/**
 * Filename:    Chip.tsx
 * Description: Selectable filter chip atom (e.g. sector / setup filters).
 * Purpose:     Reusable pressable pill with a selected/unselected state,
 *              matching the scanner's filter buttons. ADA: accessibilityState
 *              reports the selected flag to assistive tech.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, type PressableProps } from 'react-native';

import { Text } from './Typography';

export interface ChipProps extends Omit<PressableProps, 'children'> {
  /** Chip label. */
  label: string;
  /** Whether the chip is currently active. */
  selected?: boolean;
}

/** Chip renders a pressable, selectable filter pill. */
export function Chip({
  label,
  selected = false,
  className,
  ...rest
}: ChipProps): React.JSX.Element {
  const state = selected
    ? 'bg-violet border-violet'
    : 'bg-surface-container border-outline';
  const textTone = selected ? 'text-background' : 'text-content-secondary';
  return (
    <Pressable
      className={`px-2.5 py-1 rounded-lg border ${state} ${(className as string) ?? ''}`.trim()}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Filter: ${label}`}
      {...rest}
    >
      <Text variant="label" className={`${textTone} tracking-normal`}>
        {label}
      </Text>
    </Pressable>
  );
}
