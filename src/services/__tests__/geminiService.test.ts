/**
 * Filename:    geminiService.test.ts  [ src/services/__tests__ ]
 * Description: Unit tests for the deterministic Gemini stub service.
 * Purpose:     Prove analyzeCatalyst/generateVerdict are deterministic (same
 *              input → same output), that getApiKey() reads the env var, and
 *              that each call logs it is stubbed and makes no network call.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

jest.mock('expo-constants', () => ({ expoConfig: { extra: {} } }));

import { geminiService, getApiKey } from '@/services/geminiService';

describe('geminiService (stub)', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    jest.restoreAllMocks();
  });

  it('analyzeCatalyst is deterministic for identical input', async () => {
    const a = await geminiService.analyzeCatalyst('EU clears acquisition');
    const b = await geminiService.analyzeCatalyst('EU clears acquisition');
    expect(a).toEqual(b);
    expect(a.confidence).toBeGreaterThanOrEqual(70);
    expect(a.confidence).toBeLessThanOrEqual(99);
  });

  it('generateVerdict returns the symbol and a bounded confidence', async () => {
    const v = await geminiService.generateVerdict('NVDA');
    expect(v.symbol).toBe('NVDA');
    expect(v.confidence).toBeGreaterThanOrEqual(70);
    expect(v.rationale).toMatch(/NVDA/);
  });

  it('getApiKey reads EXPO_PUBLIC_GEMINI_API_KEY and defaults undefined', () => {
    expect(getApiKey()).toBeUndefined();
    process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-key';
    expect(getApiKey()).toBe('test-key');
  });

  it('logs that it is stubbed and never throws (no network call)', async () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    await geminiService.analyzeCatalyst('x');
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('STUBBED'),
      expect.any(Object),
    );
  });
});
