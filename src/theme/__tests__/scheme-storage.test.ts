/**
 * Filename:    scheme-storage.test.ts
 * Description: Direct checks for the real scheme-storage module.
 * Purpose:     Cover loadScheme (stored/absent/invalid/error → default),
 *              persistScheme (write + swallow error), and applyScheme (delegates
 *              to the imperative colorScheme singleton). These run against the
 *              real module (theme-toggle.test mocks it), with AsyncStorage and
 *              the nativewind singleton stubbed.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';

import { applyScheme, loadScheme, persistScheme } from '@/theme/scheme-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.mock('nativewind', () => ({
  colorScheme: { set: jest.fn() },
}));

const getItem = AsyncStorage.getItem as jest.Mock;
const setItem = AsyncStorage.setItem as jest.Mock;
const schemeSet = (colorScheme as unknown as { set: jest.Mock }).set;

describe('scheme-storage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('loadScheme returns the stored value when valid', async () => {
    getItem.mockResolvedValueOnce('light');
    await expect(loadScheme()).resolves.toBe('light');
  });

  it('loadScheme returns dark when absent', async () => {
    getItem.mockResolvedValueOnce(null);
    await expect(loadScheme()).resolves.toBe('dark');
  });

  it('loadScheme returns dark on an invalid stored value', async () => {
    getItem.mockResolvedValueOnce('neon');
    await expect(loadScheme()).resolves.toBe('dark');
  });

  it('loadScheme returns dark when the read throws', async () => {
    getItem.mockRejectedValueOnce(new Error('native storage error'));
    await expect(loadScheme()).resolves.toBe('dark');
  });

  it('persistScheme writes the value under the scheme key', async () => {
    setItem.mockResolvedValueOnce(undefined);
    await persistScheme('light');
    expect(setItem).toHaveBeenCalledWith('valtide.colorScheme', 'light');
  });

  it('persistScheme swallows write errors', async () => {
    setItem.mockRejectedValueOnce(new Error('disk full'));
    await expect(persistScheme('dark')).resolves.toBeUndefined();
  });

  it('applyScheme delegates to the imperative colorScheme singleton', () => {
    applyScheme('light');
    expect(schemeSet).toHaveBeenCalledWith('light');
  });
});
