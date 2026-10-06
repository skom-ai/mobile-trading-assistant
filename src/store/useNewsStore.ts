/**
 * Filename:    useNewsStore.ts  [ src/store ]
 * Description: Typed Zustand store for the News domain.
 * Purpose:     Own headlines, citations, marquee tickers, and the catalyst
 *              verdict as store state, seeded from the news repositories +
 *              newsMeta (repository pattern) so a live feed swaps in later.
 *              Exposes selector hooks for slice-level subscriptions.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { create } from 'zustand';

import type { CatalystVerdict, Citation, NewsHeadline } from '@/data/news';
import {
  newsCitationRepository,
  newsHeadlineRepository,
  newsMeta,
  fetchNewsVerdict,
  isApiError,
  type NewsMeta,
} from '@/services';

/** Reactive state owned by the news feature. */
export interface NewsState {
  headlines: NewsHeadline[];
  citations: Citation[];
  verdict: CatalystVerdict;
  tickers: NewsMeta['tickers'];
  isLoading: boolean;
  error: string | null;
}

/** Imperative actions that mutate news state. */
export interface NewsActions {
  /** (Re)load headlines + citations from the seed repositories. */
  load: () => void;
  /**
   * Refresh the live FR1 verdict + citations for a symbol from the BFF,
   * keeping seed headlines/tickers (no live source). On API failure the seed
   * verdict/citations are preserved and `error` is set; never rejects.
   */
  loadRemoteVerdict: (symbol: string) => Promise<void>;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type NewsStore = NewsState & NewsActions;

const initialState: NewsState = {
  headlines: newsHeadlineRepository.getAll(),
  citations: newsCitationRepository.getAll(),
  verdict: newsMeta.verdict,
  tickers: newsMeta.tickers,
  isLoading: false,
  error: null,
};

/** useNewsStore — news feed slices, seeded from the repositories. */
export const useNewsStore = create<NewsStore>((set) => ({
  ...initialState,

  load: () => {
    const headlines = newsHeadlineRepository.getAll();
    const citations = newsCitationRepository.getAll();
    // eslint-disable-next-line no-console
    console.debug('[useNewsStore] load', { headlines: headlines.length });
    set({ headlines, citations, error: null });
  },

  loadRemoteVerdict: async (symbol) => {
    set({ isLoading: true, error: null });
    try {
      const { verdict, citations } = await fetchNewsVerdict(symbol);
      // eslint-disable-next-line no-console
      console.debug('[useNewsStore] loadRemoteVerdict', { symbol, label: verdict.headline });
      set({ verdict, citations, isLoading: false });
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Unable to load the live verdict.';
      console.warn('[useNewsStore] loadRemoteVerdict failed, keeping seed', message);
      set({ isLoading: false, error: message });
    }
  },

  setError: (error) => {
    if (error) console.warn('[useNewsStore] error', error);
    set({ error });
  },

  reset: () => set({ ...initialState }),
}));

/** Selector: credible headlines feed. */
export const useNewsHeadlines = (): NewsHeadline[] => useNewsStore((s) => s.headlines);

/** Selector: verifiable-evidence citations. */
export const useNewsCitations = (): Citation[] => useNewsStore((s) => s.citations);

/** Selector: the synthesized catalyst verdict card. */
export const useCatalystVerdict = (): CatalystVerdict => useNewsStore((s) => s.verdict);

/** Selector: marquee ticker chips. */
export const useNewsTickers = (): NewsMeta['tickers'] => useNewsStore((s) => s.tickers);
