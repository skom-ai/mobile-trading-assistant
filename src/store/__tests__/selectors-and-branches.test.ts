/**
 * Filename:    selectors-and-branches.test.ts  [ src/store/__tests__ ]
 * Description: Supplementary coverage for store SELECTOR hooks + the remaining
 *              service/store branches the per-store suites do not exercise
 *              (selector functions, setError warn-path, generateVerdict).
 * Purpose:     Invoke every exported selector hook once and drive the leftover
 *              branches so store/service coverage clears the 95% bar. Kept
 *              separate from the per-store suites to avoid shared-store bleed.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { renderHook } from '@testing-library/react-native';

import {
  useScannerStore,
  useScannerAssets,
  useScannerIndex,
} from '@/store/useScannerStore';
import {
  useGovernanceStore,
  useGovernanceMeta,
} from '@/store/useGovernanceStore';
import {
  useNewsStore,
  useNewsHeadlines,
  useNewsCitations,
  useCatalystVerdict,
  useNewsTickers,
} from '@/store/useNewsStore';
import {
  useStrategyStore,
  useStrategyAssets,
  useSelectedAsset,
} from '@/store/useStrategyStore';
import { geminiService } from '@/services/geminiService';

describe('store selector hooks', () => {
  it('scanner selectors return the seeded slices', () => {
    expect(renderHook(() => useScannerAssets()).result.current.length).toBeGreaterThan(0);
    expect(renderHook(() => useScannerIndex()).result.current.name).toMatch(/S&P 500/);
  });

  it('governance meta selector returns the vault figures', () => {
    expect(renderHook(() => useGovernanceMeta()).result.current.lastSealedBlock).toBeGreaterThan(0);
  });

  it('governance load() re-reads records and clears error (action coverage)', () => {
    useGovernanceStore.setState({ records: [], error: 'stale' });
    useGovernanceStore.getState().load();
    expect(useGovernanceStore.getState().records.length).toBeGreaterThan(0);
    expect(useGovernanceStore.getState().error).toBeNull();
    useGovernanceStore.getState().reset();
  });

  it('strategy select() switches on a known id and ignores unknown (action coverage)', () => {
    const assets = useStrategyStore.getState().assets;
    const second = assets[1];
    if (second) {
      useStrategyStore.getState().select(second.id);
      expect(useStrategyStore.getState().selectedId).toBe(second.id);
    }
    const before = useStrategyStore.getState().selectedId;
    useStrategyStore.getState().select('no-such-id');
    expect(useStrategyStore.getState().selectedId).toBe(before);
    useStrategyStore.getState().reset();
  });

  it('strategy load() re-reads and default-selects the first (action coverage)', () => {
    useStrategyStore.setState({ assets: [], selectedId: null, error: 'stale' });
    useStrategyStore.getState().load();
    const s = useStrategyStore.getState();
    expect(s.assets.length).toBeGreaterThan(0);
    expect(s.selectedId).toBe(s.assets[0]?.id);
    expect(s.error).toBeNull();
    useStrategyStore.getState().reset();
  });

  it('news selectors return their slices', () => {
    expect(renderHook(() => useNewsHeadlines()).result.current.length).toBeGreaterThan(0);
    expect(renderHook(() => useNewsCitations()).result.current.length).toBeGreaterThan(0);
    expect(renderHook(() => useCatalystVerdict()).result.current.headline).toBe('REAL_CATALYST');
    expect(renderHook(() => useNewsTickers()).result.current.length).toBeGreaterThan(0);
  });

  it('strategy selectors resolve assets + the selected asset', () => {
    expect(renderHook(() => useStrategyAssets()).result.current.length).toBeGreaterThan(0);
    expect(renderHook(() => useSelectedAsset()).result.current?.id).toBe(
      useStrategyStore.getState().assets[0]?.id,
    );
  });

  it('useSelectedAsset falls back to the first asset when selectedId is unknown', () => {
    useStrategyStore.setState({ selectedId: 'ghost-id' });
    const { result } = renderHook(() => useSelectedAsset());
    expect(result.current?.id).toBe(useStrategyStore.getState().assets[0]?.id);
    useStrategyStore.getState().reset();
  });
});

describe('store setError warn-path branches', () => {
  afterEach(() => {
    useScannerStore.getState().reset();
    useNewsStore.getState().reset();
  });

  it('scanner setError(message) warns; setError(null) is silent', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    useScannerStore.getState().setError('rate limited');
    useScannerStore.getState().setError(null);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('news setError(message) warns; setError(null) is silent', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    useNewsStore.getState().setError('feed down');
    useNewsStore.getState().setError(null);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

describe('geminiService.generateVerdict branch coverage', () => {
  it('spans BUY PULLBACK / RANGE BOUND across many symbols', async () => {
    const symbols = Array.from({ length: 40 }, (_, i) => `SYM${i}`);
    const results = await Promise.all(symbols.map((s) => geminiService.generateVerdict(s)));
    const verdicts = new Set(results.map((r) => r.verdict));
    for (const r of results) {
      expect(r.confidence).toBeGreaterThanOrEqual(70);
      expect(r.confidence).toBeLessThanOrEqual(99);
    }
    expect(verdicts.size).toBeGreaterThanOrEqual(2);
  });

  it('analyzeCatalyst spans all impact-label + verdict branches', async () => {
    const inputs = Array.from({ length: 60 }, (_, i) => `catalyst-${i}-${'y'.repeat(i % 11)}`);
    const results = await Promise.all(inputs.map((h) => geminiService.analyzeCatalyst(h)));
    const impacts = new Set(results.map((r) => r.impactLabel));
    const verdicts = new Set(results.map((r) => r.verdict));
    // Enough inputs to cross the 90 / 80 confidence thresholds both ways.
    expect(impacts.size).toBeGreaterThanOrEqual(2);
    expect(verdicts.size).toBeGreaterThanOrEqual(2);
  });
});
