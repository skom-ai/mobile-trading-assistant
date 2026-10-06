/**
 * Filename:    theme-toggle.test.tsx
 * Description: Runnable checks for the light/dark theme capability.
 * Purpose:     Prove the three things that must hold for scheme switching to
 *              work: (1) the two palettes stay key-parallel (single source of
 *              truth), (2) useThemeColors() selects the palette by active
 *              scheme, and (3) the ScannerHeader toggle flips the scheme and
 *              persists the choice with the correct a11y label/icon.
 * Author:      Sunil+AI Assistant
 * Date:        2026-10-04
 */

import { render, renderHook, fireEvent } from '@testing-library/react-native';
import { useColorScheme } from 'nativewind';

import { ScannerHeader } from '@/components/organisms/ScannerHeader';
import { darkColors, lightColors, useThemeColors } from '@/theme';
import { persistScheme } from '@/theme/scheme-storage';

// NativeWind's setColorScheme/toggle throw under jest-expo because the Metro
// transform that sets darkMode:'class' does not run here. Mock the hook and the
// imperative singleton so render never touches the real guard.
jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(() => ({
    colorScheme: 'dark',
    toggleColorScheme: jest.fn(),
    setColorScheme: jest.fn(),
  })),
  colorScheme: { set: jest.fn(), get: jest.fn(() => 'dark'), toggle: jest.fn() },
  vars: jest.fn(),
}));

// Keep persistence a no-op spy so no real AsyncStorage runs during render.
jest.mock('@/theme/scheme-storage', () => ({
  persistScheme: jest.fn(),
  loadScheme: jest.fn(() => Promise.resolve('dark')),
  applyScheme: jest.fn(),
}));

const mockUseColorScheme = useColorScheme as jest.Mock;

/** Helper: set the mocked scheme and the toggle spy for a given test. */
function setScheme(scheme: 'light' | 'dark', toggle = jest.fn()) {
  mockUseColorScheme.mockReturnValue({
    colorScheme: scheme,
    toggleColorScheme: toggle,
    setColorScheme: jest.fn(),
  });
  return toggle;
}

describe('theme toggle capability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setScheme('dark');
  });

  it('light and dark palettes expose identical token keys (single source of truth)', () => {
    expect(Object.keys(lightColors).sort()).toEqual(Object.keys(darkColors).sort());
  });

  it('useThemeColors selects the palette by active scheme', () => {
    setScheme('light');
    expect(renderHook(() => useThemeColors()).result.current).toBe(lightColors);

    setScheme('dark');
    expect(renderHook(() => useThemeColors()).result.current).toBe(darkColors);
  });

  it('ScannerHeader shows the "switch to light" control in dark mode and flips on press', () => {
    const toggle = setScheme('dark');
    const view = render(<ScannerHeader />);

    const btn = view.getByLabelText('Switch to light mode');
    expect(btn).toBeTruthy();

    fireEvent.press(btn);
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(persistScheme).toHaveBeenCalledWith('light');
  });

  it('ScannerHeader shows the "switch to dark" control in light mode and flips on press', () => {
    const toggle = setScheme('light');
    const view = render(<ScannerHeader />);

    const btn = view.getByLabelText('Switch to dark mode');
    expect(btn).toBeTruthy();

    fireEvent.press(btn);
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(persistScheme).toHaveBeenCalledWith('dark');
  });
});
