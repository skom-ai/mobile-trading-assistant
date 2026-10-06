/**
 * Filename:    useNewsStore.test.ts  [ src/store/__tests__ ]
 * Description: Unit tests for the News Zustand store.
 * Purpose:     Prove headlines, citations, verdict, and tickers seed from the
 *              repositories/meta, that load() re-reads, and reset() restores.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useNewsStore } from '@/store/useNewsStore';

describe('useNewsStore', () => {
  beforeEach(() => useNewsStore.getState().reset());

  it('seeds headlines, citations, verdict, and tickers', () => {
    const s = useNewsStore.getState();
    expect(s.headlines.length).toBeGreaterThan(0);
    expect(s.citations.length).toBeGreaterThan(0);
    expect(s.verdict.engine).toMatch(/Valtide/);
    expect(s.tickers.length).toBeGreaterThan(0);
  });

  it('load() re-reads headlines from the repository', () => {
    useNewsStore.setState({ headlines: [] });
    useNewsStore.getState().load();
    expect(useNewsStore.getState().headlines.length).toBeGreaterThan(0);
  });

  it('setError() records and reset() clears it', () => {
    useNewsStore.getState().setError('feed down');
    expect(useNewsStore.getState().error).toBe('feed down');
    useNewsStore.getState().reset();
    expect(useNewsStore.getState().error).toBeNull();
  });
});
