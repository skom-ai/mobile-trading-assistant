/**
 * Filename:    useStrategyStore.ts  [ src/store ]
 * Description: Typed Zustand store for the Strategy domain.
 * Purpose:     Own analyzable assets + the currently-selected asset as store
 *              state, seeded from strategyRepository (repository pattern).
 *              Selecting an asset is a store action so any screen stays in sync.
 *              Exposes selector hooks for slice-level subscriptions.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { create } from 'zustand';

import type { StrategyAsset } from '@/data/strategy';
import { strategyRepository, liveStrategyRepository, type Repository } from '@/services';

/** Reactive state owned by the strategy feature. */
export interface StrategyState {
  assets: StrategyAsset[];
  /** id of the selected asset, or null before first selection. */
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Imperative actions that mutate strategy state. */
export interface StrategyActions {
  /** (Re)load analyzable assets and default-select the first one. */
  load: () => void;
  /**
   * Load analyzable assets from the live BFF (defaults to the live repo),
   * preserving the current selection when the symbol still exists. Resolves
   * even on API failure (repository degrades to its last snapshot).
   */
  loadRemote: (repo?: Repository<StrategyAsset>) => Promise<void>;
  /** Select an asset by id (ignored when unknown). */
  select: (id: string) => void;
  reset: () => void;
}

export type StrategyStore = StrategyState & StrategyActions;

const seed = strategyRepository.getAll();

const initialState: StrategyState = {
  assets: seed,
  selectedId: seed[0]?.id ?? null,
  isLoading: false,
  error: null,
};

/** useStrategyStore — strategy assets + selection, seeded from the repository. */
export const useStrategyStore = create<StrategyStore>((set, get) => ({
  ...initialState,

  load: () => {
    const assets = strategyRepository.getAll();
    // eslint-disable-next-line no-console
    console.debug('[useStrategyStore] load', { count: assets.length });
    set({ assets, selectedId: assets[0]?.id ?? null, error: null });
  },

  loadRemote: async (repo = liveStrategyRepository) => {
    set({ isLoading: true, error: null });
    const assets = repo.getAllAsync ? await repo.getAllAsync() : repo.getAll();
    const prev = get().selectedId;
    const selectedId = assets.some((a) => a.id === prev) ? prev : (assets[0]?.id ?? null);
    // eslint-disable-next-line no-console
    console.debug('[useStrategyStore] loadRemote', { count: assets.length });
    set({ assets, selectedId, isLoading: false });
  },

  select: (id) => {
    if (!get().assets.some((a) => a.id === id)) return;
    // eslint-disable-next-line no-console
    console.debug('[useStrategyStore] select', id);
    set({ selectedId: id });
  },

  reset: () => set({ ...initialState }),
}));

/** Selector: all analyzable assets. */
export const useStrategyAssets = (): StrategyAsset[] => useStrategyStore((s) => s.assets);

/** Selector: the currently-selected asset (falls back to the first). */
export const useSelectedAsset = (): StrategyAsset | undefined =>
  useStrategyStore((s) => s.assets.find((a) => a.id === s.selectedId) ?? s.assets[0]);
