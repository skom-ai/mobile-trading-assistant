/**
 * Filename:    Card.tsx
 * Description: Surface container atom — filled surface with hairline outline.
 * Purpose:     Encapsulate the design system's "borders over shadows" rule so
 *              every card shares one radius/outline/background. Composition over
 *              inheritance: callers pass children and extra classNames.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View, type ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  /** Extra padding preset; defaults to comfortable p-3.5. */
  padded?: boolean;
}

/** Card renders a surface View with the standard 8px radius + hairline border. */
export function Card({
  padded = true,
  className,
  children,
  ...rest
}: CardProps): React.JSX.Element {
  const pad = padded ? 'p-3.5' : '';
  return (
    <View
      className={`bg-surface rounded-card border border-outline ${pad} ${className ?? ''}`.trim()}
      {...rest}
    >
      {children}
    </View>
  );
}
