/**
 * Filename:    apiClient.test.ts  [ src/services/__tests__ ]
 * Description: Unit tests for the resilient BFF client + config + adapters.
 * Purpose:     Prove the integration seam behaves under failure: config
 *              resolution order, success parsing, taxonomy-error throwing,
 *              NO-retry on 4xx, retry+recover on transient 5xx, timeout
 *              mapping, correlation-id header, the response→domain adapters,
 *              and LiveRepository's graceful degradation to the seed snapshot.
 *              This is the runnable check that fails if the integration logic
 *              regresses.
 * Author:      Sunil+AI Assistant
 * Date:        2026-10-04
 */

jest.mock('expo-constants', () => ({ expoConfig: { extra: {} } }));

import { getApiConfig } from '@/services/apiConfig';
import { valtideApi, isApiError, type ApiError } from '@/services/apiClient';
import {
  badgeForScan,
  scanRowToAsset,
  strategyToAsset,
  newsToVerdict,
  ledgerToAuditRecord,
  LiveRepository,
} from '@/services/liveRepositories';
import { STRATEGY_ASSETS } from '@/data/strategy';

/** Build a minimal fetch Response stub. */
function res(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  delete process.env.EXPO_PUBLIC_API_BASE_URL;
  delete process.env.EXPO_PUBLIC_API_MAX_RETRIES;
  delete process.env.EXPO_PUBLIC_API_BACKOFF_MS;
  delete process.env.EXPO_PUBLIC_API_TIMEOUT_MS;
  jest.restoreAllMocks();
});

describe('getApiConfig', () => {
  it('defaults to local Docker and strips trailing slash on env override', () => {
    expect(getApiConfig().baseUrl).toBe('http://localhost:8080');
    process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.valtide.com/';
    expect(getApiConfig().baseUrl).toBe('https://api.valtide.com');
  });

  it('reads tuning from env with safe fallbacks', () => {
    process.env.EXPO_PUBLIC_API_MAX_RETRIES = '0';
    process.env.EXPO_PUBLIC_API_BACKOFF_MS = 'nope';
    const cfg = getApiConfig();
    expect(cfg.maxRetries).toBe(2); // 0 is not > 0 → fallback
    expect(cfg.backoffMs).toBe(300); // invalid → fallback
  });
});

describe('valtideApi request engine', () => {
  beforeEach(() => {
    // No real waiting between retries.
    process.env.EXPO_PUBLIC_API_BACKOFF_MS = '1';
  });

  it('parses a 200 body and sends the correlation-id header', async () => {
    const fetchMock = jest.fn().mockResolvedValue(res(200, { weight_version: 1, universe_size: 1, rows: [] }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const out = await valtideApi.scan();
    expect(out.weight_version).toBe(1);
    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>)['X-Correlation-Id']).toMatch(/[0-9a-f-]{36}/);
  });

  it('throws the taxonomy envelope on 4xx and does NOT retry', async () => {
    const body: ApiError = { code: 'VALIDATION', message: 'bad symbol', correlationId: 'abc' };
    const fetchMock = jest.fn().mockResolvedValue(res(400, body));
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(valtideApi.newsCheck('???')).rejects.toMatchObject({ code: 'VALIDATION' });
    expect(fetchMock).toHaveBeenCalledTimes(1); // 4xx = no retry
  });

  it('retries a transient 5xx then succeeds', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(res(503, { code: 'SOURCE_UNAVAILABLE', message: 'down', correlationId: 'x' }))
      .mockResolvedValueOnce(res(200, { symbol: 'NVDA', label: 'REAL_CATALYST', rationale: 'r', citations: [], disclaimer: 'd' }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const out = await valtideApi.newsCheck('NVDA');
    expect(out.label).toBe('REAL_CATALYST');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('maps an aborted request to a TIMEOUT ApiError', async () => {
    const abortErr = Object.assign(new Error('aborted'), { name: 'AbortError' });
    const fetchMock = jest.fn().mockRejectedValue(abortErr);
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.EXPO_PUBLIC_API_MAX_RETRIES = '1';

    await expect(valtideApi.scan()).rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('isApiError guards the envelope shape', () => {
    expect(isApiError({ code: 'X', message: 'y', correlationId: 'z' })).toBe(true);
    expect(isApiError({ nope: 1 })).toBe(false);
    expect(isApiError(null)).toBe(false);
  });
});

describe('adapters', () => {
  it('badgeForScan picks oversold for low RSI and tiers by score', () => {
    expect(badgeForScan(0.9, 20)).toBe('oversold');
    expect(badgeForScan(0.65, 60)).toBe('strongBuy');
    expect(badgeForScan(0.52, 60)).toBe('momentum');
    expect(badgeForScan(0.1, 60)).toBe('hold');
  });

  it('scanRowToAsset maps a live row to the ScannerAsset shape', () => {
    const asset = scanRowToAsset({
      symbol: 'SNOW',
      rank: 1,
      composite_score: 0.65,
      last_price: 341,
      factors: { RSI_14: 56.4, VALUATION_ZSCORE: null },
    });
    expect(asset).toMatchObject({ id: 'snow', symbol: 'SNOW', rank: '01', badge: 'strongBuy' });
    expect(asset.rsi).toBe(56.4);
  });

  it('strategyToAsset drives decision fields and keeps seed cosmetics', () => {
    const seed = STRATEGY_ASSETS[0]!;
    const asset = strategyToAsset(
      { symbol: seed.symbol, strategy: { verdict: 'WAIT', confidence: 'HIGH', rationale: 'overbought', entry: null }, analogs: [], disclaimer: '', analog_disclaimer: '' },
      seed,
    );
    expect(asset.verdict).toBe('WAIT');
    expect(asset.confidence).toBe(90); // HIGH → 90
    expect(asset.entryZone).toBe(seed.entryZone); // null entry falls back to seed
    expect(asset.historicalPrecedent).toEqual(seed.historicalPrecedent); // cosmetic preserved
  });

  it('newsToVerdict and ledgerToAuditRecord map live payloads', () => {
    const verdict = newsToVerdict({ symbol: 'NVDA', label: 'REAL_CATALYST', rationale: 'r', confidence_hint: 'HIGH', citations: [], disclaimer: '' });
    expect(verdict).toMatchObject({ headline: 'REAL_CATALYST', impactLabel: 'HIGH IMPACT', confidence: 92 });

    const rec = ledgerToAuditRecord(
      { traceId: 'abcdef123456', event: 'SCAN', symbol: 'NVDA', pipeline: 'fr2', merkleHash: '0x1234567890abcdef', status: 'sealed', timestamp: 't', initiatingEntity: 'agent', latencyMs: 5 },
      0,
    );
    expect(rec).toMatchObject({ title: 'SCAN', status: 'SEALED', hash: '0x1234...cdef' });
  });
});

describe('LiveRepository graceful degradation', () => {
  it('serves fresh data on success and caches it', async () => {
    const repo = new LiveRepository<number>([0], async () => [1, 2, 3]);
    expect(repo.getAll()).toEqual([0]); // seed snapshot before fetch
    expect(await repo.getAllAsync()).toEqual([1, 2, 3]);
    expect(repo.getAll()).toEqual([1, 2, 3]); // snapshot updated
  });

  it('returns the last snapshot (never throws) when the fetcher rejects', async () => {
    const apiErr: ApiError = { code: 'SOURCE_UNAVAILABLE', message: 'down', correlationId: 'c' };
    const repo = new LiveRepository<number>([9, 9], async () => {
      throw apiErr;
    });
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(await repo.getAllAsync()).toEqual([9, 9]); // degraded to seed
    expect(warn).toHaveBeenCalled();
  });
});
