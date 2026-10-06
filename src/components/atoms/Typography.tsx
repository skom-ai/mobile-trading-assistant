/**
 * Filename:    Typography.tsx
 * Description: Semantic typography atoms — Text (body/caption) and Heading.
 * Purpose:     Single responsibility: map semantic typographic roles to
 *              Obsidian theme classNames so screens never hard-code sizes or
 *              colors. Geist sans for prose; tight tracking on headings per the
 *              design spec.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Text as RNText, type TextProps } from 'react-native';

export type TextVariant = 'body' | 'caption' | 'label';
export type TextTone = 'primary' | 'secondary' | 'muted' | 'accent';

const TONE_CLASS: Record<TextTone, string> = {
  primary: 'text-content-primary',
  secondary: 'text-content-secondary',
  muted: 'text-content-muted',
  accent: 'text-violet',
};

const VARIANT_CLASS: Record<TextVariant, string> = {
  body: 'text-sm font-sans',
  caption: 'text-[11px] font-sans',
  label: 'text-[10px] font-mono uppercase tracking-wider',
};

export interface TextComponentProps extends TextProps {
  /** Typographic role. */
  variant?: TextVariant;
  /** Semantic color tone. */
  tone?: TextTone;
}

/** Text renders react-native Text with a semantic variant + tone. */
export function Text({
  variant = 'body',
  tone = 'primary',
  className,
  children,
  ...rest
}: TextComponentProps): React.JSX.Element {
  const composed =
    `${VARIANT_CLASS[variant]} ${TONE_CLASS[tone]} ${className ?? ''}`.trim();
  return (
    <RNText className={composed} {...rest}>
      {children}
    </RNText>
  );
}

export type HeadingLevel = 'section' | 'title' | 'display';

const HEADING_CLASS: Record<HeadingLevel, string> = {
  section: 'text-sm font-sans font-bold uppercase tracking-wider',
  title: 'text-lg font-sans font-bold tracking-tight',
  display: 'text-2xl font-sans font-bold tracking-tight',
};

export interface HeadingProps extends TextProps {
  /** Heading level mapped to a size/weight scale. */
  level?: HeadingLevel;
  /** Semantic color tone. */
  tone?: TextTone;
}

/** Heading renders a role="header" Text at a fixed typographic level. */
export function Heading({
  level = 'title',
  tone = 'primary',
  className,
  children,
  accessibilityRole = 'header',
  ...rest
}: HeadingProps): React.JSX.Element {
  const composed =
    `${HEADING_CLASS[level]} ${TONE_CLASS[tone]} ${className ?? ''}`.trim();
  return (
    <RNText className={composed} accessibilityRole={accessibilityRole} {...rest}>
      {children}
    </RNText>
  );
}
