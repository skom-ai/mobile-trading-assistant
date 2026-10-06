/**
 * Filename:    useGovernanceStore.ts  [ src/store ]
 * Description: Typed Zustand store for the Governance domain.
 * Purpose:     Own the immutable audit records + vault headline figures as store
 *              state, seeded from governanceRepository + governanceMeta
 *              (repository pattern). Exposes a query action and selector hooks so
 *              the audit-trail search stays store-driven.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { AuditRecord } from '@/data/governance';
import {
  governanceMeta,
  governanceRepository,
  makeLiveGovernanceRepository,
  type GovernanceMeta,
} from '@/services';

/** Case-insensitive match across the searchable record fields. */
function matches(rec: AuditRecord, q: string): boolean {
  const needle = q.toLowerCase();
  return (
    rec.corrId.toLowerCase().includes(needle) ||
    rec.title.toLowerCase().includes(needle) ||
    rec.description.toLowerCase().includes(needle) ||
    rec.hash.toLowerCase().includes(needle)
  );
}

/** Reactive state owned by the governance feature. */
export interface GovernanceState {
  records: AuditRecord[];
  meta: GovernanceMeta;
  query: string;
  error: string | null;
}

/** Imperative actions that mutate governance state. */
export interface GovernanceActions {
  /** (Re)load audit records from the seed repository. */
  load: () => void;
  /**
   * Load the audit ledger from the live BFF. The governance endpoint may be
   * unavailable (returns SOURCE_UNAVAILABLE until the agent ledger is wired);
   * the repository degrades to the seed snapshot, so this never rejects and the
   * ledger view always shows records.
   */
  loadRemote: () => Promise<void>;
  /** Set the audit-trail search query. */
  setQuery: (query: string) => void;
  reset: () => void;
}

export type GovernanceStore = GovernanceState & GovernanceActions;

const initialState: GovernanceState = {
  records: governanceRepository.getAll(),
  meta: governanceMeta,
  query: '',
  error: null,
};

/** Live ledger repo seeded with the current static records (graceful fallback). */
const liveGovernanceRepository = makeLiveGovernanceRepository(governanceRepository.getAll());

/** useGovernanceStore — audit records + vault meta, seeded from the repository. */
export const useGovernanceStore = create<GovernanceStore>((set) => ({
  ...initialState,

  load: () => {
    const records = governanceRepository.getAll();
    // eslint-disable-next-line no-console
    console.debug('[useGovernanceStore] load', { count: records.length });
    set({ records, error: null });
  },

  loadRemote: async () => {
    const records = await liveGovernanceRepository.getAllAsync!();
    // eslint-disable-next-line no-console
    console.debug('[useGovernanceStore] loadRemote', { count: records.length });
    set({ records });
  },

  setQuery: (query) => set({ query }),

  reset: () => set({ ...initialState }),
}));

/**
 * Selector: audit records filtered by the current query.
 *
 * Wrapped in `useShallow` so the freshly-computed array is compared element-wise
 * against the previous snapshot. Without it, `records.filter(...)` returns a new
 * reference every render and Zustand v5's `useSyncExternalStore` rejects the
 * unstable snapshot with an infinite "Maximum update depth exceeded" re-render.
 */
export const useFilteredRecords = (): AuditRecord[] =>
  useGovernanceStore(useShallow((s) => s.records.filter((r) => matches(r, s.query))));

/** Selector: vault headline figures (total sealed + last block). */
export const useGovernanceMeta = (): GovernanceMeta => useGovernanceStore((s) => s.meta);
