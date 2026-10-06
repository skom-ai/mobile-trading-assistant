/**
 * Filename:    scanner.ts
 * Description: Typed, screen-scoped data for the Scanner tab (Wave 2 port).
 * Purpose:     Mirror the web app's mockData sector-asset slice + index banner
 *              for the SCANNER screen ONLY, until a live service backs the
 *              Zustand store. Also maps each verdict badge to the Badge atom's
 *              variant and the RankNumber tone, so organisms stay presentational.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import type { BadgeVariant, RankTone } from '@/components/atoms';

/** One ranked scanner row (screen-scoped projection of the source model). */
export interface ScannerAsset {
  readonly id: string;
  readonly rank: string;
  readonly symbol: string;
  readonly company: string;
  readonly sector: string;
  readonly badge: BadgeVariant;
  readonly badgeLabel: string;
  readonly zScore: number;
  readonly rsi: number;
}

/** Static index-banner readings shown above the asset list. */
export interface ScannerIndex {
  readonly name: string;
  readonly price: string;
  readonly change: string;
  readonly changePercent: string;
  readonly positive: boolean;
  readonly sentiment: string;
  readonly volume: string;
  readonly vix: string;
}

/** S&P 500 index summary (mirrors the design screenshot). */
export const SCANNER_INDEX: ScannerIndex = {
  name: 'S&P 500 / INDEX TICKER',
  price: '5,117.09',
  change: '+71.82',
  changePercent: '+1.42% (Today)',
  positive: true,
  sentiment: 'Bullish (78%)',
  volume: '3.42B',
  vix: '13.24',
};

/**
 * Top 10 sector assets, values copied verbatim from the source mockData.
 * NOTE: mock data is for this screen only; a live feed replaces it later.
 */
export const SCANNER_ASSETS: readonly ScannerAsset[] = [
  { id: 'nvda', rank: '01', symbol: 'NVDA', company: 'NVIDIA Corp.', sector: 'Semi', badge: 'strongBuy', badgeLabel: 'Strong Buy', zScore: 2.84, rsi: 68.2 },
  { id: 'aapl', rank: '02', symbol: 'AAPL', company: 'Apple Inc.', sector: 'Tech', badge: 'neutral', badgeLabel: 'Neutral', zScore: 0.42, rsi: 52.1 },
  { id: 'avgo', rank: '03', symbol: 'AVGO', company: 'Broadcom Inc.', sector: 'Semi', badge: 'momentum', badgeLabel: 'Momentum', zScore: 1.95, rsi: 64.8 },
  { id: 'amd', rank: '04', symbol: 'AMD', company: 'Advanced Micro', sector: 'Semi', badge: 'accumulate', badgeLabel: 'Accumulate', zScore: 1.15, rsi: 58.4 },
  { id: 'msft', rank: '05', symbol: 'MSFT', company: 'Microsoft Corp.', sector: 'Tech', badge: 'stable', badgeLabel: 'Stable', zScore: 0.88, rsi: 55.9 },
  { id: 'googl', rank: '06', symbol: 'GOOGL', company: 'Alphabet Inc.', sector: 'Comm', badge: 'hold', badgeLabel: 'Hold', zScore: -0.12, rsi: 48.3 },
  { id: 'meta', rank: '07', symbol: 'META', company: 'Meta Platforms', sector: 'Comm', badge: 'momentum', badgeLabel: 'Momentum', zScore: 2.1, rsi: 66.5 },
  { id: 'tsla', rank: '08', symbol: 'TSLA', company: 'Tesla Inc.', sector: 'Auto', badge: 'oversold', badgeLabel: 'Oversold', zScore: -1.85, rsi: 31.4 },
  { id: 'amzn', rank: '09', symbol: 'AMZN', company: 'Amazon.com', sector: 'Cons', badge: 'stable', badgeLabel: 'Stable', zScore: 0.65, rsi: 54.0 },
  { id: 'jpm', rank: '10', symbol: 'JPM', company: 'JPMorgan Chase', sector: 'Financial', badge: 'value', badgeLabel: 'Value', zScore: 1.4, rsi: 60.2 },
];

/** Map a badge variant to the RankNumber color tone (mirrors getRankColor). */
export function rankToneForBadge(badge: BadgeVariant): RankTone {
  if (badge === 'oversold' || badge === 'error') return 'oversold';
  if (badge === 'strongBuy' || badge === 'momentum') return 'bullish';
  if (badge === 'accumulate' || badge === 'value') return 'positive';
  return 'neutral';
}
