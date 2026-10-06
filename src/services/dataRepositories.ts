/**
 * Filename:    dataRepositories.ts  [ src/services ]
 * Description: Concrete domain repositories bound to the static seed modules.
 * Purpose:     One place that maps each domain (scanner / news / strategy /
 *              governance) to its seed source under src/data via StaticRepository.
 *              Stores import these repositories, never the src/data modules, so
 *              swapping to a live feed is a one-file change here. Seed data is
 *              NOT invented — it re-exports the existing screen-scoped modules.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import {
  CATALYST_VERDICT,
  NEWS_CITATIONS,
  NEWS_HEADLINES,
  NEWS_TICKERS,
  type CatalystVerdict,
  type Citation,
  type NewsHeadline,
} from '@/data/news';
import { SCANNER_ASSETS, SCANNER_INDEX, type ScannerAsset, type ScannerIndex } from '@/data/scanner';
import { STRATEGY_ASSETS, type StrategyAsset } from '@/data/strategy';
import {
  INITIAL_AUDIT_RECORDS,
  LAST_SEALED_BLOCK,
  TOTAL_RECORDS_COUNT,
  type AuditRecord,
} from '@/data/governance';

import { StaticRepository, type Repository } from './repository';

/** News-feed singletons that are not list-shaped (verdict + vault-style stats). */
export interface NewsMeta {
  readonly verdict: CatalystVerdict;
  readonly tickers: ReadonlyArray<{ ticker: string; changePercent: number }>;
}

/** Governance headline figures shown above the audit trail. */
export interface GovernanceMeta {
  readonly totalRecordsCount: number;
  readonly lastSealedBlock: number;
}

/** Scanner ranked rows, seeded from the Scanner screen data module. */
export const scannerRepository: Repository<ScannerAsset> = new StaticRepository(SCANNER_ASSETS);

/** Strategy analyzable assets, seeded from the Strategy screen data module. */
export const strategyRepository: Repository<StrategyAsset> = new StaticRepository(STRATEGY_ASSETS);

/** News headlines, seeded from the News screen data module. */
export const newsHeadlineRepository: Repository<NewsHeadline> = new StaticRepository(NEWS_HEADLINES);

/** News citations, seeded from the News screen data module. */
export const newsCitationRepository: Repository<Citation> = new StaticRepository(NEWS_CITATIONS);

/** Governance audit records, seeded from the Governance screen data module. */
export const governanceRepository: Repository<AuditRecord> = new StaticRepository(
  INITIAL_AUDIT_RECORDS,
);

/** Static scanner index banner (single object, not a list). */
export const scannerIndex: ScannerIndex = SCANNER_INDEX;

/** Static news meta (verdict card + marquee tickers). */
export const newsMeta: NewsMeta = { verdict: CATALYST_VERDICT, tickers: NEWS_TICKERS };

/** Static governance meta (vault headline figures). */
export const governanceMeta: GovernanceMeta = {
  totalRecordsCount: TOTAL_RECORDS_COUNT,
  lastSealedBlock: LAST_SEALED_BLOCK,
};
