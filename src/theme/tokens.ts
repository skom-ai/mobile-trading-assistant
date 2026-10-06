/**
 * Filename:    tokens.ts
 * Description: Design tokens for the "Obsidian — High-Contrast Dark" system.
 * Purpose:     Single, typed source of truth for colors, spacing, radius, and
 *              typography. Mirrors tailwind.config.js so code paths that cannot
 *              use className (e.g. navigation options, StatusBar) share the same
 *              values. Derived from reference-assets/design-markdown.md.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

// ponytail: the palette table in .agents/tasks/light-dark-toggle/design.md is
// the single source of color truth. darkColors/lightColors below and the CSS
// vars in global.css are hand-mirrored from it and must change in lockstep.
// darkColors and lightColors MUST keep identical key sets (guarded by the
// token-parity test in src/theme/__tests__/theme-toggle.test.tsx).

/** DARK palette — "Obsidian — High-Contrast Dark" (the baseline). */
export const darkColors = {
  violet: '#a78bfa', // Primary accent — interactive, links, focus rings
  violetSoft: '#c4b5fd',
  emerald: '#34d399', // Positive / success indicators
  danger: '#ef4444', // Errors only
  background: '#09090b', // True near-black
  surfaceLowest: '#0c0c0f',
  surface: '#0c0c0f',
  surfaceContainer: '#18181b',
  surfaceHigh: '#27272a',
  outline: '#27272a', // Borders over shadows
  textPrimary: '#fafafa',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
} as const;

/** LIGHT palette — accents darkened for legibility on light surfaces. */
export const lightColors = {
  violet: '#6d28d9',
  violetSoft: '#7c3aed',
  emerald: '#047857',
  danger: '#b91c1c',
  background: '#ffffff',
  surfaceLowest: '#f8fafc',
  surface: '#f8fafc',
  surfaceContainer: '#f1f5f9',
  surfaceHigh: '#e2e8f0',
  outline: '#cbd5e1',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
} as const;

/** Back-compat default: dark remains the baseline palette. */
export const colors = darkColors;

/** 4px base spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Border radii. Cards use an 8px radius per the design spec. */
export const radius = {
  sm: 4,
  card: 8,
  lg: 12,
  full: 9999,
} as const;

/** Typography. Geist for UI; monospace for numeric Z-score / RSI values. */
export const typography = {
  fontFamily: {
    sans: 'Geist',
    mono: 'GeistMono',
  },
  letterSpacing: {
    heading: -0.02, // Tight letter-spacing on headings
    body: 0,
  },
  size: {
    caption: 11,
    body: 14,
    title: 18,
    heading: 24,
  },
} as const;

/**
 * Convenience aggregate export.
 * ponytail: `theme.colors` is the non-scheme-aware DARK default (= darkColors).
 * It is fine for spacing/radius/typography reads, but scheme-aware color reads
 * MUST use useThemeColors() — reading theme.colors.* returns a stuck-dark value.
 */
export const theme = { colors, spacing, radius, typography } as const;

export type Theme = typeof theme;
export type ColorToken = keyof typeof colors;
