/**
 * Filename:    useGovernanceStore.test.ts  [ src/store/__tests__ ]
 * Description: Unit tests for the Governance Zustand store.
 * Purpose:     Prove audit records + meta seed from the repository, that
 *              setQuery() drives filtering, and reset() clears the query.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { renderHook } from '@testing-library/react-native';

import { useFilteredRecords, useGovernanceStore } from '@/store/useGovernanceStore';

describe('useGovernanceStore', () => {
  beforeEach(() => useGovernanceStore.getState().reset());

  it('seeds audit records and vault meta', () => {
    const s = useGovernanceStore.getState();
    expect(s.records.length).toBeGreaterThan(0);
    expect(s.meta.totalRecordsCount).toBeGreaterThan(0);
    expect(s.meta.lastSealedBlock).toBeGreaterThan(0);
  });

  it('setQuery() narrows the records via case-insensitive match', () => {
    useGovernanceStore.getState().setQuery('CIRCUIT');
    const q = useGovernanceStore.getState().query.toLowerCase();
    const hits = useGovernanceStore
      .getState()
      .records.filter((r) => r.title.toLowerCase().includes(q));
    expect(hits.length).toBe(1);
  });

  it('reset() clears the query', () => {
    useGovernanceStore.getState().setQuery('x');
    useGovernanceStore.getState().reset();
    expect(useGovernanceStore.getState().query).toBe('');
  });

  // Renders the selector via useSyncExternalStore. Before the useShallow fix
  // this looped infinitely ("Maximum update depth exceeded") on a fresh array
  // reference each render; a stable render here proves the reference is stable
  // and covers matches() across every searchable field + the no-match branch.
  it('useFilteredRecords renders without looping and drives matches()', () => {
    const empty = renderHook(() => useFilteredRecords());
    expect(empty.result.current).toEqual(useGovernanceStore.getState().records);

    // Exercise every OR-branch of matches() by querying each searchable field.
    const [rec] = useGovernanceStore.getState().records;
    for (const field of [rec.corrId, rec.title, rec.description, rec.hash]) {
      useGovernanceStore.getState().setQuery(field);
      const { result } = renderHook(() => useFilteredRecords());
      expect(result.current.length).toBeGreaterThan(0);
      expect(result.current).toEqual(
        useGovernanceStore.getState().records.filter((r) =>
          [r.corrId, r.title, r.description, r.hash].some((v) =>
            v.toLowerCase().includes(field.toLowerCase()),
          ),
        ),
      );
    }

    // No-match branch: false across all four fields.
    useGovernanceStore.getState().setQuery('zzz-no-such-record-zzz');
    const { result } = renderHook(() => useFilteredRecords());
    expect(result.current).toEqual([]);
    useGovernanceStore.getState().reset();
  });
});
