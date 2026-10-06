/**
 * Filename:    news.ts  [ src/data ]
 * Description: News-screen data source — types + seed headlines/citations.
 * Purpose:     Mirror the web app's News mock data (INITIAL_NEWS_HEADLINES,
 *              INITIAL_CITATIONS) for THIS screen only, since no news store
 *              exists yet. Synthetic seed is dev/UI data; swap for a live feed
 *              service when one lands. No other screen imports this module.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

/** Catalyst categories that drive the category chip color/label. */
export type NewsCategory =
  | 'INFRASTRUCTURE'
  | 'REGULATORY'
  | 'EARNINGS'
  | 'M&A'
  | 'MACRO';

/** A single credible-headline feed item. */
export interface NewsHeadline {
  id: string;
  title: string;
  category: NewsCategory;
  timeAgo: string;
  source: string;
  summary: string;
  ticker?: string;
  /** 0-100 model impact score. */
  impactScore: number;
  catalystType: string;
}

/** A verifiable-evidence citation shown under the LLM verdict. */
export interface Citation {
  id: string;
  citationTag: string;
  title: string;
  subtitle: string;
  type: 'filing' | 'wire';
  filingDate: string;
  secAccessionNumber: string;
  contentSnippet: string;
}

/** The LLM catalyst verdict summary rendered at the top of the feed. */
export interface CatalystVerdict {
  engine: string;
  confidence: number;
  headline: string;
  impactLabel: string;
  rationale: string;
}

/** 48-72h credible headlines (mirrors web INITIAL_NEWS_HEADLINES). */
export const NEWS_HEADLINES: NewsHeadline[] = [
  {
    id: 'news-1',
    category: 'INFRASTRUCTURE',
    timeAgo: '2h ago',
    title:
      'Valtide Expands Distributed Compute Cluster Across Three New European Zones',
    source: 'Bloomberg',
    ticker: 'VAL',
    summary:
      'Valtide has brought online three Tier-4 sovereign compute facilities in Frankfurt, Paris, and Zurich, tripling low-latency execution capacity for enterprise algorithmic trading desks and SEC 17a-4 certified storage nodes.',
    impactScore: 92,
    catalystType: 'Direct Capacity Expansion',
  },
  {
    id: 'news-2',
    category: 'REGULATORY',
    timeAgo: '5h ago',
    title:
      'EU Antitrust Division Clears Key Milestone for Valtide Enterprise Acquisition',
    source: 'Financial Times',
    ticker: 'VAL',
    summary:
      'The European Commission Directorate-General for Competition approved without concessions Valtide’s pending acquisition of QuantVault Core. Phase-2 review concluded zero anti-competitive market foreclosure.',
    impactScore: 96,
    catalystType: 'Regulatory Clearance',
  },
  {
    id: 'news-3',
    category: 'EARNINGS',
    timeAgo: '12h ago',
    title:
      'Q3 Recurring Revenue Projections Exceed Wall Street Consensus by 18%',
    source: 'Wall Street Journal',
    ticker: 'VAL',
    summary:
      'Independent equity research projects ARR reaching $340M in Q3, fueled by accelerated adoption of hardware-level WORM immutable audit-trail software across Tier-1 broker-dealers.',
    impactScore: 88,
    catalystType: 'ARR Guidance Beat',
  },
];

/** Verifiable-evidence citations (mirrors web INITIAL_CITATIONS). */
export const NEWS_CITATIONS: Citation[] = [
  {
    id: 'cit-1',
    citationTag: '[CITATION_01] SEC Form 8-K Filing',
    title: "Item 4.02 Changes in Registrant's Certifying Accountant",
    subtitle: 'SEC Form 8-K Current Report',
    type: 'filing',
    filingDate: 'September 28, 2026',
    secAccessionNumber: '0001437749-26-028491',
    contentSnippet:
      'On September 27, 2026, the Audit Committee completed its independent review of cryptographic consensus anchors and affirmed complete chain integrity with zero material weakness under SEC Rule 17a-4(f).',
  },
  {
    id: 'cit-2',
    citationTag: '[CITATION_02] Reuters Wire Service',
    title: 'Exclusive: Valtide secures Tier-1 enterprise partnership',
    subtitle: 'Institutional Liquidity & Custody Deployment',
    type: 'wire',
    filingDate: 'September 29, 2026 09:14 ET',
    secAccessionNumber: 'REUTERS-FIN-20260929-8834',
    contentSnippet:
      'Global prime broker consortium finalizes multi-year mandate for Valtide’s real-time risk mitigation engine, routing $14B daily flow through automated circuit breaker protocols.',
  },
];

/** Live ticker marquee chips shown above the feed. */
export const NEWS_TICKERS: { ticker: string; changePercent: number }[] = [
  { ticker: '$VAL', changePercent: 14.2 },
  { ticker: '$NVDA', changePercent: 3.8 },
  { ticker: '$TSLA', changePercent: -1.5 },
  { ticker: '$AAPL', changePercent: 0.7 },
];

/** The synthesized LLM verdict card content. */
export const CATALYST_VERDICT: CatalystVerdict = {
  engine: 'Valtide LLM Engine v4.2',
  confidence: 94.2,
  headline: 'REAL_CATALYST',
  impactLabel: 'HIGH IMPACT',
  rationale:
    'Synthesized rationale confirms verified institutional accumulation paired with an unannounced regulatory clearance filing. Price-action divergence indicates strong organic momentum rather than speculative noise.',
};
