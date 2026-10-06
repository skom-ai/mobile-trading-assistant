/**
 * Filename:    ThemedText.tsx
 * Description: Minimal themed text atom used to confirm NativeWind is wired.
 * Purpose:     Smallest reusable building block that consumes Obsidian theme
 *              classNames (text color, tracking). Doubles as the render target
 *              for the sample RNTL test, proving `className` compiles to styles.
 *              Real typographic atoms are expanded in a later wave.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Text, type TextProps } from 'react-native';

export type ThemedTextVariant = 'primary' | 'secondary' | 'muted' | 'accent';

export interface ThemedTextProps extends TextProps {
  /** Semantic color variant mapped to Obsidian theme tokens. */
  variant?: ThemedTextVariant;
}

const VARIANT_CLASS: Record<ThemedTextVariant, string> = {
  primary: 'text-content-primary',
  secondary: 'text-content-secondary',
  muted: 'text-content-muted',
  accent: 'text-violet',
};

/**
 * ThemedText renders react-native Text with an Obsidian color variant.
 * Trivial className smoke-target for the NativeWind pipeline.
 */
export function ThemedText({
  variant = 'primary',
  className,
  children,
  ...rest
}: ThemedTextProps): React.JSX.Element {
  const composed = `${VARIANT_CLASS[variant]} ${className ?? ''}`.trim();
  return (
    <Text className={composed} {...rest}>
      {children}
    </Text>
  );
}
