/**
 * Filename:    Divider.tsx
 * Description: Hairline separator atom (horizontal or vertical).
 * Purpose:     One reusable rule using the outline token, so separators are
 *              consistent and never drawn with ad-hoc borders. Decorative by
 *              default (hidden from assistive tech).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

export interface DividerProps {
  /** Orientation of the rule. */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/** Divider renders a 1px outline-colored rule. */
export function Divider({
  orientation = 'horizontal',
  className,
}: DividerProps): React.JSX.Element {
  const shape = orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full';
  return (
    <View
      className={`bg-outline ${shape} ${className ?? ''}`.trim()}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
