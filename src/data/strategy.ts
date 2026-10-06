/**
 * Filename:    strategy.ts  [ src/data ]
 * Description: Strategy-screen data model + seed assets (this screen only).
 * Purpose:     Port the web app's SectorAsset shape and INITIAL_SECTOR_ASSETS
 *              so the Strategy tab renders 1:1 without depending on other
 *              screens' stores/services. Synthetic seed data — real feeds wire
 *              in later. Scope: Strategy screen only.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

/** A single timeframe evidence row (daily / 4H / weekly). */
export interface TimeframeEvidence {
  readonly note: string;
  readonly status: string;
}

/** A matched historical analog precedent with a sparkline series. */
export interface HistoricalPrecedent {
  readonly caseId: string;
  readonly setupName: string;
  readonly duration: string;
  readonly returnRate: string;
  readonly patternSummary: string;
  readonly sparklineData: number[];
}

/** One analyzable asset with strategy setup + evidence (mirrors web type). */
export interface StrategyAsset {
  readonly id: string;
  readonly symbol: string;
  readonly companyName: string;
  readonly sector: string;
  readonly price: number;
  readonly change: number;
  readonly changePercent: number;
  readonly marketCap: string;
  readonly rsi: number;
  readonly volProfile: string;
  readonly confidence: number;
  readonly verdict: string;
  readonly verdictSubtitle: string;
  readonly entryZone: number;
  readonly stopLoss: number;
  readonly targetPrice: number;
  readonly riskPercent: number;
  readonly rewardPercent: number;
  readonly dailyStructure: TimeframeEvidence;
  readonly fourHourMomentum: TimeframeEvidence;
  readonly weeklyTrend: TimeframeEvidence;
  readonly historicalPrecedent: HistoricalPrecedent;
}

/** Seed assets analyzable on the Strategy screen (synthetic, from web app). */
export const STRATEGY_ASSETS: StrategyAsset[] = [
  {
    id: 'nvda',
    symbol: 'NVDA',
    companyName: 'NVIDIA Corp.',
    sector: 'Semi',
    price: 126.85,
    change: 3.04,
    changePercent: 2.45,
    marketCap: '$3.12T',
    rsi: 68.2,
    volProfile: 'Accumulation',
    confidence: 84,
    verdict: 'BUY PULLBACK',
    verdictSubtitle: 'High probability structural accumulation zone',
    entryZone: 124.5,
    stopLoss: 118.8,
    targetPrice: 138.5,
    riskPercent: -4.58,
    rewardPercent: 11.2,
    dailyStructure: { note: 'Higher low established at 50 EMA support', status: 'Bullish' },
    fourHourMomentum: { note: 'Bullish divergence on MACD histogram', status: 'Reversing' },
    weeklyTrend: { note: 'Macro channel support holding firm', status: 'Impulsive' },
    historicalPrecedent: {
      caseId: '#482',
      setupName: 'Q3 2023 Setup',
      duration: '18 Days',
      returnRate: '+18.4%',
      patternSummary:
        'Analog pattern matches current volatility compression near the 50-day moving average prior to an explosive continuation phase.',
      sparklineData: [30, 20, 25, 40, 55, 50, 65, 80, 90, 100],
    },
  },
  {
    id: 'avgo',
    symbol: 'AVGO',
    companyName: 'Broadcom Inc.',
    sector: 'Semi',
    price: 172.6,
    change: 4.8,
    changePercent: 2.86,
    marketCap: '$806B',
    rsi: 64.8,
    volProfile: 'Aggressive Accumulation',
    confidence: 89,
    verdict: 'BREAKOUT RUNNER',
    verdictSubtitle: 'Custom silicon demand driving multi-timeframe volume surge',
    entryZone: 169.5,
    stopLoss: 163.2,
    targetPrice: 188.0,
    riskPercent: -3.72,
    rewardPercent: 10.91,
    dailyStructure: { note: 'Clean breakout from ascending triangle', status: 'Bullish' },
    fourHourMomentum: { note: 'Strong RSI expansion without bearish divergence', status: 'Bullish' },
    weeklyTrend: { note: 'Parabolic impulse phase along upper Bollinger Band', status: 'Impulsive' },
    historicalPrecedent: {
      caseId: '#512',
      setupName: 'Q4 2023 Continuation',
      duration: '22 Days',
      returnRate: '+24.1%',
      patternSummary: 'Sustained institutional flow following custom ASIC client announcements.',
      sparklineData: [20, 25, 35, 45, 60, 70, 75, 85, 95, 100],
    },
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    sector: 'Auto',
    price: 242.15,
    change: -3.85,
    changePercent: -1.56,
    marketCap: '$770B',
    rsi: 31.4,
    volProfile: 'Capitulation Exhaustion',
    confidence: 76,
    verdict: 'MEAN REVERSION',
    verdictSubtitle: 'Extreme statistical deviation hitting high-volume anchor node',
    entryZone: 238.0,
    stopLoss: 228.0,
    targetPrice: 268.0,
    riskPercent: -4.2,
    rewardPercent: 12.6,
    dailyStructure: { note: 'Approaching key multi-month liquidity shelf', status: 'Neutral' },
    fourHourMomentum: { note: 'RSI divergence bottoming near 30 threshold', status: 'Reversing' },
    weeklyTrend: { note: 'Macro consolidation range testing range low', status: 'Corrective' },
    historicalPrecedent: {
      caseId: '#420',
      setupName: 'Q1 2024 Bounce',
      duration: '12 Days',
      returnRate: '+21.4%',
      patternSummary: 'Violent short-squeeze following oversold RSI divergence print.',
      sparklineData: [80, 65, 45, 25, 20, 35, 55, 75, 85, 95],
    },
  },
];
