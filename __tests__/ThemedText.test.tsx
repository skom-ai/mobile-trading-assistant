/**
 * Filename:    ThemedText.test.tsx
 * Description: Sample React Native Testing Library test for the scaffold.
 * Purpose:     Prove the Jest + jest-expo + RNTL pipeline runs and that the
 *              NativeWind-styled ThemedText atom renders its children. Also
 *              exercises the Zustand store to confirm the pattern is testable.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { render } from '@testing-library/react-native';

import { ThemedText } from '@/components/atoms';
import { useScannerStore } from '@/store';

describe('Wave 0 scaffold', () => {
  it('renders ThemedText children', () => {
    const view = render(<ThemedText variant="accent">Valtide</ThemedText>);
    expect(view.getByText('Valtide')).toBeTruthy();
  });

  it('useScannerStore seeds from the repository and re-loads via actions', () => {
    const { load, reset } = useScannerStore.getState();
    reset();
    expect(useScannerStore.getState().assets.length).toBeGreaterThan(0);

    load();
    expect(useScannerStore.getState().assets.length).toBeGreaterThan(0);
    expect(useScannerStore.getState().assets[0]?.symbol).toBe('NVDA');

    reset();
    expect(useScannerStore.getState().error).toBeNull();
  });
});
