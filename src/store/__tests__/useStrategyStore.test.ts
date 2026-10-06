/**
 * Filename:    useStrategyStore.test.ts  [ src/store/__tests__ ]
 * Description: Unit tests for the Strategy Zustand store.
 * Purpose:     Prove assets seed from the repository, the first asset is
 *              default-selected, select() switches/ignores-unknown, reset works.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useStrategyStore } from '@/store/useStrategyStore';

describe('useStrategyStore', () => {
  beforeEach(() => useStrategyStore.getState().reset());

  it('seeds assets and default-selects the first', () => {
    const s = useStrategyStore.getState();
    expect(s.assets.length).toBeGreaterThan(0);
    expect(s.selectedId).toBe(s.assets[0]?.id);
  });

  it('select() switches to a known id and ignores unknown ids', () => {
    const second = useStrategyStore.getState().assets[1];
    useStrategyStore.getState().select(second!.id);
    expect(useStrategyStore.getState().selectedId).toBe(second!.id);

    useStrategyStore.getState().select('does-not-exist');
    expect(useStrategyStore.getState().selectedId).toBe(second!.id);
  });

  it('reset() restores the default selection', () => {
    useStrategyStore.getState().select(useStrategyStore.getState().assets[1]!.id);
    useStrategyStore.getState().reset();
    expect(useStrategyStore.getState().selectedId).toBe(
      useStrategyStore.getState().assets[0]?.id,
    );
  });
});
