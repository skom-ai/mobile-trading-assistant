/**
 * Filename:    tailwind.config.js
 * Description: Tailwind CSS (v3) configuration consumed by NativeWind v4.
 * Purpose:     Define the "Obsidian — High-Contrast Dark" design system as named
 *              theme tokens (violet primary, near-black background, emerald,
 *              zinc-based surface scale, contrast text) so screens style via
 *              semantic classNames (bg-background, text-violet, border-outline).
 *              Mirrors reference-assets/design-markdown.md. Keep in sync with
 *              src/theme/tokens.ts (single source of design truth).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  // NativeWind requires the preset so RN-specific utilities resolve.
  presets: [require('nativewind/preset')],
  // REQUIRED so colorScheme.set()/setColorScheme() work at runtime; without a
  // 'class' strategy NativeWind throws when the scheme is set manually.
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Color leaves resolve to CSS custom properties defined in global.css
      // (:root = light, .dark:root = dark). Semantic class names are unchanged
      // so no screen className moves. The rgb(var() / <alpha-value>) form keeps
      // Tailwind alpha utilities (e.g. bg-background/80) working.
      // ponytail: edit the palette table in
      // .agents/tasks/light-dark-toggle/design.md as the single source; the CSS
      // vars and src/theme/tokens.ts are hand-mirrored from it.
      colors: {
        // --- Accents (function, never decoration) ---
        violet: {
          DEFAULT: 'rgb(var(--color-violet) / <alpha-value>)',
          soft: 'rgb(var(--color-violet-soft) / <alpha-value>)',
        },
        emerald: {
          DEFAULT: 'rgb(var(--color-emerald) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--color-danger) / <alpha-value>)',
        },
        // --- Base surfaces ---
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
        },
        obsidian: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
        },
        // --- Zinc-based surface scale (very subtle increments) ---
        surface: {
          lowest: 'rgb(var(--color-surface-lowest) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          container: 'rgb(var(--color-surface-container) / <alpha-value>)',
          high: 'rgb(var(--color-surface-high) / <alpha-value>)',
        },
        // --- Borders / outlines (borders over shadows) ---
        outline: {
          DEFAULT: 'rgb(var(--color-outline) / <alpha-value>)',
          variant: 'rgb(var(--color-outline-variant) / <alpha-value>)',
        },
        // --- Text ---
        content: {
          primary: 'rgb(var(--color-content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-content-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-content-muted) / <alpha-value>)',
        },
        // --- Zinc gray ramp for ad-hoc use ---
        zinc: {
          950: 'rgb(var(--color-zinc-950) / <alpha-value>)',
          900: 'rgb(var(--color-zinc-900) / <alpha-value>)',
          800: 'rgb(var(--color-zinc-800) / <alpha-value>)',
          700: 'rgb(var(--color-zinc-700) / <alpha-value>)',
          500: 'rgb(var(--color-zinc-500) / <alpha-value>)',
          400: 'rgb(var(--color-zinc-400) / <alpha-value>)',
          50: 'rgb(var(--color-zinc-50) / <alpha-value>)',
        },
      },
      borderRadius: {
        card: '8px',
      },
      letterSpacing: {
        tightHeading: '-0.02em',
      },
      fontFamily: {
        // Geist for UI; monospace for numeric Z-score / RSI values.
        sans: ['Geist', 'System', 'sans-serif'],
        mono: ['GeistMono', 'SpaceMono', 'monospace'],
      },
    },
  },
  plugins: [],
};
