/**
 * Filename:    liveRepositories.ts  [ src/services ]
 * Description: Live-backed repositories that fetch from the BFF and adapt the
 *              API payloads into the mobile domain shapes.
 * Purpose:     Implement the SAME Repository<T> contract the stores already
 *              depend on, but back it with the typed BFF client instead of a
 *              static seed. Each repo is seeded with the existing static data so
 *              screens render instantly, then getAllAsync() refreshes from the
 *              live API and — on ANY failure — returns the last snapshot (seed)
 *              rather than throwing. This keeps the swap to live data a wiring
 *              change in dataRepositories/stores, not a screen rewrite, and makes
 *              the UI resilient to a backend outage by construction.
 * Author:      Sunil+AI Assistant
 * Date:        2026-10-04
 */

import type { BadgeVariant } from '@/components/atoms';
import type { ScannerAsset } from '@/data/scanner';
import type { StrategyAsset } from '@/data/strategy';
import type { CatalystVerdict, Citation } from '@/data/news';
import type { AuditRecord, AuditRecordStatus } from '@/data/governance';
import { SCANNER_ASSETS } from '@/data/scanner';
import { STRATEGY_ASSETS } from '@/data/strategy';
import { CATALYST_VERDICT } from '@/data/news';

import {
  valtideApi,
  isApiError,
  type ScanRow,
  type StrategyResponse,
  type NewsResponse,
  type AuditLedgerRecord,
} from './apiClient';
import type { Repository } from './repository';

/** Round to a sane number of decimals for display-oriented domain fields. */
function round(value: number | null | undefined, digits = 2): number {
  if (value == null || Number.isNaN(value)) return 0;
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

/**
 * Map a composite score + RSI into the Badge atom variant the Scanner uses.
 *
 * Deterministic, UI-only heuristic over the live factors so the ranked list
 * keeps its colour language without the backend needing a "badge" concept.
 *
 * @param score - composite rank score (higher = stronger).
 * @param rsi - 14-period RSI (used for the oversold edge).
 * @returns The Badge variant for this row.
 */
export function badgeForScan(score: number, rsi: number | null): BadgeVariant {
  if (rsi != null && rsi <= 35) return 'oversold';
  if (score >= 0.6) return 'strongBuy';
  if (score >= 0.5) return 'momentum';
  if (score >= 0.4) return 'accumulate';
  if (score >= 0.3) return 'stable';
  return 'hold';
}

/** Human label for a badge variant (kept local to avoid a UI import cycle). */
const BADGE_LABEL: Record<BadgeVariant, string> = {
  strongBuy: 'Strong Buy',
  neutral: 'Neutral',
  momentum: 'Momentum',
  accumulate: 'Accumulate',
  stable: 'Stable',
  hold: 'Hold',
  oversold: 'Oversold',
  value: 'Value',
  error: 'Error',
};

/**
 * Adapt one live scan row into the Scanner screen's ScannerAsset shape.
 *
 * @param row - the agent's ranked row.
 * @returns A ScannerAsset the existing list renders unchanged.
 */
export function scanRowToAsset(row: ScanRow): ScannerAsset {
  const rsi = row.factors?.RSI_14 ?? null;
  const z = row.factors?.VALUATION_ZSCORE ?? null;
  const badge = badgeForScan(row.composite_score, rsi);
  return {
    id: row.symbol.toLowerCase(),
    rank: String(row.rank).padStart(2, '0'),
    symbol: row.symbol,
    // The scan payload has no company/sector; show the symbol until a richer
    // endpoint exists (ponytail: BFF scan lacks company metadata — upgrade when
    // a /universe-meta endpoint lands).
    company: row.symbol,
    sector: '—',
    badge,
    badgeLabel: BADGE_LABEL[badge],
    zScore: round(z),
    rsi: round(rsi, 1),
  };
}

/**
 * Adapt the live strategy payload into a StrategyAsset, preserving the seed's
 * display-only fields the API does not provide.
 *
 * The API drives the decision fields (verdict, confidence, rationale, levels);
 * cosmetic fields with no API source (company name, sparkline, timeframe notes)
 * fall back to the matching seed asset so the rich Strategy screen stays whole.
 *
 * @param res - the FR3/FR4 strategy response.
 * @param seed - the seed asset to borrow display-only fields from (same symbol).
 * @returns A StrategyAsset the Strategy screen renders unchanged.
 */
export function strategyToAsset(res: StrategyResponse, seed: StrategyAsset): StrategyAsset {
  const s = res.strategy as {
    verdict?: string;
    rationale?: string;
    confidence?: string | number;
    entry?: number | null;
    target?: number | null;
    stop?: number | null;
  };
  const confidence =
    typeof s.confidence === 'number'
      ? s.confidence
      : s.confidence === 'HIGH'
        ? 90
        : s.confidence === 'MEDIUM'
          ? 70
          : s.confidence === 'LOW'
            ? 50
            : seed.confidence;

  return {
    ...seed,
    symbol: res.symbol,
    verdict: s.verdict ?? seed.verdict,
    verdictSubtitle: s.rationale ? s.rationale.slice(0, 120) : seed.verdictSubtitle,
    confidence,
    entryZone: s.entry ?? seed.entryZone,
    stopLoss: s.stop ?? seed.stopLoss,
    targetPrice: s.target ?? seed.targetPrice,
  };
}

/**
 * Generic live repository: serves a seed snapshot synchronously and refreshes
 * it from a fetcher on getAllAsync(), degrading to the snapshot on failure.
 *
 * @typeParam T - the domain entity type.
 */
export class LiveRepository<T> implements Repository<T> {
  private snapshot: readonly T[];
  private readonly fetcher: () => Promise<T[]>;

  /**
   * @param seed - initial snapshot shown before/if a live fetch is unavailable.
   * @param fetcher - fetches + adapts the live entities; may reject (handled).
   */
  constructor(seed: readonly T[], fetcher: () => Promise<T[]>) {
    this.snapshot = seed;
    this.fetcher = fetcher;
  }

  /** @inheritDoc */
  getAll(): T[] {
    return [...this.snapshot];
  }

  /**
   * Fetch fresh entities, cache them as the new snapshot, and return a copy.
   * On ANY failure (ApiError or otherwise) log once and return the last
   * snapshot — the screen keeps its data and never sees an exception.
   *
   * @inheritDoc
   */
  async getAllAsync(): Promise<T[]> {
    try {
      const fresh = await this.fetcher();
      if (fresh.length > 0) this.snapshot = fresh;
      return [...this.snapshot];
    } catch (err) {
      const code = isApiError(err) ? err.code : 'UNKNOWN';
      // eslint-disable-next-line no-console
      console.warn('[LiveRepository] fetch failed, serving last snapshot', { code });
      return [...this.snapshot];
    }
  }
}

/** Scanner rows from the live FR2 scan, adapted to ScannerAsset. */
export const liveScannerRepository = new LiveRepository<ScannerAsset>(SCANNER_ASSETS, async () => {
  const res = await valtideApi.scan();
  return res.rows.map(scanRowToAsset);
});

/**
 * Strategy assets refreshed from the live FR3 endpoint, one call per seed asset.
 *
 * Runs the per-symbol calls concurrently; any single rejection falls back to
 * that symbol's seed so one failure does not drop the whole list.
 */
export const liveStrategyRepository = new LiveRepository<StrategyAsset>(STRATEGY_ASSETS, async () => {
  const results = await Promise.all(
    STRATEGY_ASSETS.map(async (seed) => {
      try {
        const res = await valtideApi.strategy(seed.symbol);
        return strategyToAsset(res, seed);
      } catch {
        return seed; // Per-symbol graceful fallback.
      }
    }),
  );
  return results;
});

/** Map the FR1 confidence hint (or absent) to the verdict card's 0-100 number. */
function confidenceFromHint(hint: string | undefined, fallback: number): number {
  switch (hint) {
    case 'HIGH':
      return 92;
    case 'MEDIUM':
      return 74;
    case 'LOW':
      return 55;
    default:
      return fallback;
  }
}

/** Map the FR1 verdict label to the card's impact label. */
function impactFromLabel(label: string): string {
  if (label === 'REAL_CATALYST') return 'HIGH IMPACT';
  if (label === 'ALREADY_PRICED_IN' || label === 'HYPE_DETECTED') return 'MODERATE IMPACT';
  return 'LOW IMPACT';
}

/**
 * Adapt a live FR1 news verdict into the News screen's CatalystVerdict card.
 *
 * @param res - the FR1 response.
 * @returns A CatalystVerdict the verdict card renders unchanged.
 */
export function newsToVerdict(res: NewsResponse): CatalystVerdict {
  return {
    engine: 'Valtide BFF (live)',
    confidence: confidenceFromHint(res.confidence_hint, CATALYST_VERDICT.confidence),
    headline: res.label,
    impactLabel: impactFromLabel(res.label),
    rationale: res.rationale,
  };
}

/**
 * Adapt the FR1 citations array into the News screen's Citation list.
 *
 * The agent citation shape is a loose string map; we read the common keys and
 * fall back to safe defaults so a sparse citation never breaks the row.
 *
 * @param res - the FR1 response.
 * @returns Citation rows for the evidence list (possibly empty).
 */
export function newsToCitations(res: NewsResponse): Citation[] {
  return (res.citations ?? []).map((c, i) => ({
    id: c.id ?? `live-cit-${i + 1}`,
    citationTag: c.tag ?? c.source ?? `[CITATION_${String(i + 1).padStart(2, '0')}]`,
    title: c.title ?? 'Cited evidence',
    subtitle: c.subtitle ?? c.source ?? 'Live evidence',
    type: c.type === 'wire' ? 'wire' : 'filing',
    filingDate: c.date ?? c.filingDate ?? '',
    secAccessionNumber: c.accession ?? c.id ?? '',
    contentSnippet: c.snippet ?? c.summary ?? '',
  }));
}

/** Terminal audit status, defaulting unknown values to SEALED. */
function toAuditStatus(status: string | undefined): AuditRecordStatus {
  const up = (status ?? '').toUpperCase();
  if (up === 'VERIFIED' || up === 'LOCKED' || up === 'SEALED') return up;
  return 'SEALED';
}

/** Shorten a full hash to the 0xabcd...wxyz display form the card expects. */
function shortHash(full: string): string {
  if (full.length <= 12) return full;
  return `${full.slice(0, 6)}...${full.slice(-4)}`;
}

/**
 * Adapt one live AuditLedgerRecord into the Governance screen's AuditRecord.
 *
 * @param rec - the agent ledger row.
 * @param i - index, used only for a stable id/corr fallback.
 * @returns An AuditRecord the governance list renders unchanged.
 */
export function ledgerToAuditRecord(rec: AuditLedgerRecord, i: number): AuditRecord {
  const hash = rec.merkleHash ?? '';
  return {
    id: rec.traceId || `live-rec-${i + 1}`,
    corrId: rec.traceId ? `#${rec.traceId.slice(0, 8).toUpperCase()}` : `#CORR-${i + 1}`,
    title: rec.event || 'Governance Decision Record',
    description: `${rec.pipeline ?? 'pipeline'} • ${rec.symbol ?? '—'}`,
    timestamp: rec.timestamp ?? '',
    timeAgo: rec.timestamp ?? '',
    hash: shortHash(hash),
    fullHash: hash,
    secRule: 'SEC 17a-4(f)',
    blockNumber: 0,
    merkleRoot: hash,
    signer: rec.initiatingEntity ?? 'VALTIDE-AGENT',
    status: toAuditStatus(rec.status),
  };
}

/**
 * Fetch the live FR1 verdict + citations for a symbol.
 *
 * Returns both the adapted verdict card and citation list. On ApiError the
 * caller decides fallback; this function surfaces the error so the store can
 * record it while keeping the seed card.
 *
 * @param symbol - ticker to check.
 * @returns The adapted verdict and citations.
 */
export async function fetchNewsVerdict(
  symbol: string,
): Promise<{ verdict: CatalystVerdict; citations: Citation[] }> {
  const res = await valtideApi.newsCheck(symbol);
  return { verdict: newsToVerdict(res), citations: newsToCitations(res) };
}

/**
 * Governance records repo: fetches the live ledger and adapts it, degrading to
 * the seed snapshot when the governance endpoint is unavailable (it currently
 * returns SOURCE_UNAVAILABLE until the agent ledger is wired — the UI must not
 * break on that). Seeded via a lazy import to avoid a static seed dependency
 * here; the store passes the seed in.
 */
export function makeLiveGovernanceRepository(seed: readonly AuditRecord[]): Repository<AuditRecord> {
  return new LiveRepository<AuditRecord>(seed, async () => {
    const res = await valtideApi.governance();
    return (res.records ?? []).map(ledgerToAuditRecord);
  });
}
