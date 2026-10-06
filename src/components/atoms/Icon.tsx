/**
 * Filename:    Icon.tsx
 * Description: Thin Ionicons wrapper atom with theme-token color defaults.
 * Purpose:     Give the app one icon surface so name/size/color usage is
 *              consistent and swappable. Defaults to muted content color; ADA
 *              hint via accessibilityLabel when the icon is meaningful.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Ionicons } from '@expo/vector-icons';

import { useThemeColors } from '@/theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface IconProps {
  /** Ionicons glyph name. */
  name: IconName;
  /** Pixel size (default 18). */
  size?: number;
  /** Hex color; defaults to muted text token. */
  color?: string;
  /** When set, the icon is announced; otherwise it is decorative. */
  label?: string;
}

/** Icon renders an Ionicons glyph with theme defaults. */
export function Icon({
  name,
  size = 18,
  color,
  label,
}: IconProps): React.JSX.Element {
  const theme = useThemeColors();
  const resolved = color ?? theme.textMuted;
  return (
    <Ionicons
      name={name}
      size={size}
      color={resolved}
      accessibilityElementsHidden={label === undefined}
      importantForAccessibility={label === undefined ? 'no' : 'yes'}
      accessibilityLabel={label}
    />
  );
}
