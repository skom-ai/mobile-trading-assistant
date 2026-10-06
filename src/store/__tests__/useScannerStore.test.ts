/**
 * Filename:    useScannerStore.test.ts  [ src/store/__tests__ ]
 * Description: Unit tests for the Scanner Zustand store.
 * Purpose:     Prove the store seeds assets + index from the repository, that
 *              load() re-reads, setError() records, and reset() restores seed.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useScannerStore } from '@/store/useScannerStore';

describe('useScannerStore', () => {
  beforeEach(() => useScannerStore.getState().reset());

  it('seeds ranked assets and the index banner from the repository', () => {
    const { assets, index } = useScannerStore.getState();
    expect(assets.length).toBeGreaterThan(0);
    expect(assets[0]?.symbol).toBe('NVDA');
    expect(index.name).toMatch(/S&P 500/);
  });

  it('load() re-reads assets from the repository', () => {
    useScannerStore.setState({ assets: [] });
    useScannerStore.getState().load();
    expect(useScannerStore.getState().assets.length).toBeGreaterThan(0);
  });

  it('setError() records and reset() clears state', () => {
    useScannerStore.getState().setError('boom');
    expect(useScannerStore.getState().error).toBe('boom');
    useScannerStore.getState().reset();
    expect(useScannerStore.getState().error).toBeNull();
  });
});
