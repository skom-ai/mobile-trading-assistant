/**
 * Filename:    useThemeColors.ts
 * Description: React hook that returns the active color palette for the scheme.
 * Purpose:     Scheme-aware access to the JS token palette for code paths that
 *              cannot use className (Ionicons color, StatusBar, navigation
 *              options, TextInput placeholderTextColor). Subscribes the caller
 *              to NativeWind's color scheme so colors re-render on toggle.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useColorScheme } from 'nativewind';

import { darkColors, lightColors } from './tokens';

/**
 * Active palette shape: the shared token keys, each a string. Widened from the
 * per-palette literal types so both darkColors and lightColors are assignable.
 */
export type Palette = Record<keyof typeof darkColors, string>;

/** Returns lightColors in light scheme, darkColors otherwise (incl. undefined). */
export function useThemeColors(): Palette {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'light' ? lightColors : darkColors;
}
