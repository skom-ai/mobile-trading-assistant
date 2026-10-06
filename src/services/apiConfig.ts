/**
 * Filename:    apiConfig.ts  [ src/services ]
 * Description: Single source of truth for the Valtide BFF connection settings.
 * Purpose:     Resolve the API base URL (and request tuning) from config so
 *              switching local Docker -> cloud is a ONE-PLACE change: set
 *              EXPO_PUBLIC_API_BASE_URL in the env (.env / EAS secret) or
 *              expo-constants `extra.apiBaseUrl` in app.json. No code change,
 *              no re-import — mirrors the web UI's VITE_BFF_BASE_URL switch and
 *              the existing geminiService.getApiKey() precedent in this folder.
 * Author:      Sunil+AI Assistant
 * Date:        2026-10-04
 */

import Constants from 'expo-constants';

/** Local Docker BFF default used when nothing is configured (dev convenience). */
const DEFAULT_BASE_URL = 'http://localhost:8080';

/** Tunable request behaviour for the BFF client (all have safe defaults). */
export interface ApiConfig {
  /** Fully-qualified BFF origin, no trailing slash (e.g. https://api.valtide.com). */
  readonly baseUrl: string;
  /** Per-request timeout before the client aborts and surfaces TIMEOUT. */
  readonly timeoutMs: number;
  /** Max retry attempts for transient failures (network / 5xx / timeout). */
  readonly maxRetries: number;
  /** Base backoff in ms; attempt N waits backoffMs * 2^(N-1). */
  readonly backoffMs: number;
}

/**
 * Read a string setting from env first, then expo-constants `extra`.
 *
 * EXPO_PUBLIC_* vars are inlined at build time by Expo; `extra` is the runtime
 * app.json fallback. This is the same resolution order as getApiKey().
 *
 * @param envValue - the already-read `process.env.EXPO_PUBLIC_*` value.
 * @param extraKey - the key to look up under `expoConfig.extra`.
 * @returns The resolved string, or undefined when neither is set.
 */
function readSetting(envValue: string | undefined, extraKey: string): string | undefined {
  if (envValue) return envValue;
  const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined;
  const fromExtra = extra?.[extraKey];
  return typeof fromExtra === 'string' && fromExtra ? fromExtra : undefined;
}

/**
 * Parse a positive integer setting, falling back when absent or invalid.
 *
 * @param raw - the raw string value (from env or extra).
 * @param fallback - the value to use when raw is missing or not a positive int.
 * @returns A positive integer.
 */
function readPositiveInt(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

/** Strip any trailing slash so `${baseUrl}${path}` never doubles the slash. */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Resolve the active API configuration.
 *
 * Call at use-time (not module load) so a test or runtime config change is
 * picked up. The baseUrl is the only value most deployments need to set.
 *
 * @returns The resolved, normalized {@link ApiConfig}.
 */
export function getApiConfig(): ApiConfig {
  const baseUrl = normalizeBaseUrl(
    readSetting(process.env.EXPO_PUBLIC_API_BASE_URL, 'apiBaseUrl') ?? DEFAULT_BASE_URL,
  );
  return {
    baseUrl,
    timeoutMs: readPositiveInt(process.env.EXPO_PUBLIC_API_TIMEOUT_MS, 15000),
    maxRetries: readPositiveInt(process.env.EXPO_PUBLIC_API_MAX_RETRIES, 2),
    backoffMs: readPositiveInt(process.env.EXPO_PUBLIC_API_BACKOFF_MS, 300),
  };
}
