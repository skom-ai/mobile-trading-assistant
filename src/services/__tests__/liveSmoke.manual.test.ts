/**
 * Filename:    liveSmoke.manual.test.ts  [ src/services/__tests__ ]
 * Description: LIVE smoke test — hits the real running BFF (no fetch mock).
 * Purpose:     Prove the actual client code retrieves results from the running
 *              Docker BFF and that governance degrades gracefully. Opt-in only:
 *              runs when LIVE_SMOKE=1 so CI/offline runs skip it (it needs the
 *              stack up on localhost:8080). Not part of the default suite.
 * Author:      Sunil+AI Assistant
 * Date:        2026-10-04
 *
 * Run: LIVE_SMOKE=1 npx jest liveSmoke.manual --forceExit
 */

jest.mock('expo-constants', () => ({ expoConfig: { extra: {} } }));

import { valtideApi, isApiError } from '@/services/apiClient';
import { makeLiveGovernanceRepository } from '@/services/liveRepositories';

const RUN = process.env.LIVE_SMOKE === '1';
const d = RUN ? describe : describe.skip;

d('LIVE BFF smoke (localhost:8080)', () => {
  jest.setTimeout(60000);

  it('FR2 scan returns ranked rows', async () => {
    const out = await valtideApi.scan();
    expect(Array.isArray(out.rows)).toBe(true);
    expect(out.rows.length).toBeGreaterThan(0);
    expect(out.rows[0]).toHaveProperty('composite_score');
    // eslint-disable-next-line no-console
    console.log('[smoke] scan top row:', out.rows[0]?.symbol, out.rows[0]?.composite_score);
  });

  it('FR1 news-check returns a verdict label', async () => {
    const out = await valtideApi.newsCheck('NVDA');
    expect(typeof out.label).toBe('string');
    // eslint-disable-next-line no-console
    console.log('[smoke] news verdict:', out.label);
  });

  it('FR3 strategy returns a strategy + analogs', async () => {
    const out = await valtideApi.strategy('NVDA');
    expect(out.symbol).toBe('NVDA');
    expect(out.strategy).toBeDefined();
    // eslint-disable-next-line no-console
    console.log('[smoke] strategy verdict:', (out.strategy as { verdict?: string }).verdict);
  });

  it('governance degrades gracefully to seed when the endpoint is unavailable', async () => {
    const seed = [{ id: 'seed-1' }] as never[];
    const repo = makeLiveGovernanceRepository(seed);
    const records = await repo.getAllAsync!();
    // Either live records or the seed — but NEVER a throw.
    expect(Array.isArray(records)).toBe(true);
    // eslint-disable-next-line no-console
    console.log('[smoke] governance records returned:', records.length);
  });

  it('a direct governance call surfaces a taxonomy ApiError (not a crash)', async () => {
    try {
      await valtideApi.governance();
      // eslint-disable-next-line no-console
      console.log('[smoke] governance succeeded (ledger wired)');
    } catch (err) {
      expect(isApiError(err)).toBe(true);
      // eslint-disable-next-line no-console
      console.log('[smoke] governance ApiError code:', (err as { code: string }).code);
    }
  });
});
