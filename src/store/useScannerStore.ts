/**
 * Filename:    useScannerStore.ts  [ src/store ]
 * Description: Typed Zustand store for the Scanner domain.
 * Purpose:     Own the ranked scanner assets + index banner as store state,
 *              seeded from scannerRepository (repository pattern) so a live feed
 *              can replace the seed without touching screens. Exposes selector
 *              hooks so components subscribe to slices, not the whole store.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { create } from 'zustand';

import type { ScannerAsset } from '@/data/scanner';
import { scannerIndex, scannerRepository, liveScannerRepository, type Repository } from '@/services';
import type { ScannerIndex } from '@/data/scanner';

/** Reactive state owned by the scanner feature. */
export interface ScannerState {
  assets: ScannerAsset[];
  index: ScannerIndex;
  isLoading: boolean;
  error: string | null;
}

/** Imperative actions that mutate scanner state. */
export interface ScannerActions {
  /** (Re)load assets from the injected repository (defaults to seed repo). */
  load: (repo?: Repository<ScannerAsset>) => void;
  /**
   * Load assets from the live BFF (defaults to the live scanner repo).
   * Resolves even on API failure — the repository degrades to its last
   * snapshot, so this never rejects and the UI never breaks.
   */
  loadRemote: (repo?: Repository<ScannerAsset>) => Promise<void>;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type ScannerStore = ScannerState & ScannerActions;

const initialState: ScannerState = {
  assets: scannerRepository.getAll(),
  index: scannerIndex,
  isLoading: false,
  error: null,
};

/** useScannerStore — scanner assets + index, seeded from the repository. */
export const useScannerStore = create<ScannerStore>((set) => ({
  ...initialState,

  load: (repo = scannerRepository) => {
    const assets = repo.getAll();
    // eslint-disable-next-line no-console
    console.debug('[useScannerStore] load', { count: assets.length });
    set({ assets, error: null });
  },

  loadRemote: async (repo = liveScannerRepository) => {
    set({ isLoading: true, error: null });
    const assets = repo.getAllAsync ? await repo.getAllAsync() : repo.getAll();
    // eslint-disable-next-line no-console
    console.debug('[useScannerStore] loadRemote', { count: assets.length });
    set({ assets, isLoading: false });
  },

  setError: (error) => {
    if (error) console.warn('[useScannerStore] error', error);
    set({ error });
  },

  reset: () => set({ ...initialState }),
}));

/** Selector: all ranked scanner assets. */
export const useScannerAssets = (): ScannerAsset[] => useScannerStore((s) => s.assets);

/** Selector: the S&P 500 index banner readings. */
export const useScannerIndex = (): ScannerIndex => useScannerStore((s) => s.index);
