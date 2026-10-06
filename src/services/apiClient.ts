/**
 * Filename:    apiClient.ts  [ src/services ]
 * Description: Typed, resilient client for the Valtide BFF (the sole public API).
 * Purpose:     The single integration seam the app uses to reach the backend
 *              (Principle P1 — the client never calls the agent/LLM directly).
 *              Mirrors the web UI's src/api/client.ts surface so the two clients
 *              stay the SAME shape, and adds mobile-grade resilience: per-request
 *              timeout (AbortController), bounded retry-with-backoff on transient
 *              failures, a correlation id per call, and the BFF taxonomy error
 *              envelope normalized into a thrown {@link ApiError}. Base URL comes
 *              from getApiConfig() so local Docker -> cloud is a config change.
 * Author:      Sunil+AI Assistant
 * Date:        2026-10-04
 */

import { getApiConfig } from './apiConfig';

/** Sanitized error envelope returned by the BFF TaxonomyExceptionFilter. */
export interface ApiError {
  /** Stable taxonomy code (e.g. SOURCE_UNAVAILABLE, VALIDATION, TIMEOUT, NETWORK). */
  code: string;
  /** Human-readable, already-sanitized message. */
  message: string;
  /** Correlation id for cross-service tracing (echoed or client-generated). */
  correlationId: string;
  /** Optional structured detail bag (never contains secrets). */
  details?: Record<string, unknown>;
}

/** True when a value looks like the BFF taxonomy error envelope. */
function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ApiError).code === 'string' &&
    typeof (value as ApiError).message === 'string'
  );
}

/** A single ranked scanner row (mirrors the agent response). */
export interface ScanRow {
  symbol: string;
  rank: number;
  composite_score: number;
  last_price: number | null;
  factors: Record<string, number | null>;
  provenance?: string;
}

/** FR2 scan response. */
export interface ScanResponse {
  weight_version: number;
  universe_size: number;
  rows: ScanRow[];
}

/** FR1 news verdict response. */
export interface NewsResponse {
  symbol: string;
  label: string;
  rationale: string;
  confidence_hint?: string;
  citations: Array<Record<string, string>>;
  disclaimer: string;
}

/** FR3+FR4 strategy response. */
export interface StrategyResponse {
  symbol: string;
  strategy: Record<string, unknown>;
  analogs: Array<Record<string, unknown>>;
  analog_error?: string | null;
  disclaimer: string;
  analog_disclaimer: string;
}

/** One immutable audit-ledger row (mirrors the agent AuditLedgerRecord). */
export interface AuditLedgerRecord {
  traceId: string;
  event: string;
  symbol: string;
  pipeline: string;
  merkleHash: string;
  status: string;
  timestamp: string;
  initiatingEntity: string;
  latencyMs: number;
}

/** FR5 governance response: ledger records + canonical SEC-17a-4 bundle. */
export interface GovernanceResponse {
  correlationUuid: string;
  records: AuditLedgerRecord[];
  canonicalBundle: Record<string, unknown>;
}

/** RFC4122-ish v4 id for X-Correlation-Id when the platform lacks randomUUID. */
function newCorrelationId(): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (typeof g.crypto?.randomUUID === 'function') return g.crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Retry only on transient conditions; a 4xx is a client error — never retried. */
function isTransient(status: number | undefined): boolean {
  return status === undefined || status >= 500;
}

/** Resolve after `ms` (used for backoff between attempts). */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Options for a single BFF request. */
interface RequestOptions {
  method: 'GET' | 'POST';
  path: string;
  body?: unknown;
  query?: Record<string, string | undefined>;
}

/**
 * Build the final URL with non-empty query params appended.
 *
 * @param baseUrl - resolved BFF origin (no trailing slash).
 * @param path - endpoint path beginning with '/'.
 * @param query - optional params; empty/undefined values are skipped.
 * @returns The full request URL.
 */
function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  const suffix = parts.length ? `?${parts.join('&')}` : '';
  return `${baseUrl}${path}${suffix}`;
}

/**
 * Perform one fetch attempt with a timeout. Resolves the Response or throws a
 * normalized {@link ApiError} for network/timeout failures (status undefined).
 */
async function fetchOnce(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  correlationId: string,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    const aborted = (err as { name?: string }).name === 'AbortError';
    const apiErr: ApiError = {
      code: aborted ? 'TIMEOUT' : 'NETWORK',
      message: aborted
        ? 'The request timed out. Check your connection and try again.'
        : 'Unable to reach the service. Check your connection and try again.',
      correlationId,
    };
    throw apiErr;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Core request engine: timeout + bounded retry-with-backoff + taxonomy mapping.
 *
 * Transient failures (network, timeout, 5xx) are retried up to maxRetries with
 * exponential backoff. 4xx responses throw immediately (client error, no retry).
 * Any thrown value is always a normalized {@link ApiError}, so callers get one
 * failure shape to handle.
 *
 * @typeParam T - the expected success body type.
 * @param opts - the request definition.
 * @returns The parsed success body.
 * @throws ApiError on any non-2xx response or transport failure.
 */
async function request<T>(opts: RequestOptions): Promise<T> {
  const cfg = getApiConfig();
  const correlationId = newCorrelationId();
  const url = buildUrl(cfg.baseUrl, opts.path, opts.query);
  const init: RequestInit = {
    method: opts.method,
    headers: {
      Accept: 'application/json',
      'X-Correlation-Id': correlationId,
      ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  };

  let lastError: ApiError = {
    code: 'UNKNOWN',
    message: 'The request could not be completed.',
    correlationId,
  };

  for (let attempt = 0; attempt <= cfg.maxRetries; attempt += 1) {
    let retryable: boolean;
    try {
      const res = await fetchOnce(url, init, cfg.timeoutMs, correlationId);
      const data: unknown = await res.json().catch(() => undefined);

      if (res.ok) return data as T;

      // Non-2xx: prefer the BFF taxonomy envelope; else synthesize one.
      lastError = isApiError(data)
        ? { ...data, correlationId: data.correlationId || correlationId }
        : {
            code: `HTTP_${res.status}`,
            message: 'The service returned an unexpected response.',
            correlationId,
          };
      retryable = isTransient(res.status); // 4xx → false, 5xx → true.
    } catch (err) {
      // fetchOnce only throws a normalized ApiError (NETWORK / TIMEOUT), both
      // transient. Anything else is a programming error — surface it.
      if (!isApiError(err)) throw err;
      lastError = err;
      retryable = true;
    }

    if (!retryable || attempt === cfg.maxRetries) break;
    await delay(cfg.backoffMs * 2 ** attempt);
  }

  throw lastError;
}

/** Valtide BFF API surface used by the mobile app (same shape as the web UI). */
export const valtideApi = {
  /**
   * FR2 — run the deterministic top-10 scan.
   * @param universe Optional explicit universe override.
   */
  scan: (universe?: string[]): Promise<ScanResponse> =>
    request<ScanResponse>({ method: 'POST', path: '/api/v1/scan', body: { universe: universe ?? null } }),

  /**
   * FR1 — news-driven opportunity verdict.
   * @param symbol Ticker symbol.
   * @param simulateEmpty Force the empty-evidence path (demo).
   */
  newsCheck: (symbol: string, simulateEmpty = false): Promise<NewsResponse> =>
    request<NewsResponse>({ method: 'POST', path: '/api/v1/news-check', body: { symbol, simulateEmpty } }),

  /**
   * FR3+FR4 — strategy generation with historical analogs.
   * @param symbol Ticker symbol.
   * @param newsLabel Optional originating FR1 label.
   */
  strategy: (symbol: string, newsLabel?: string): Promise<StrategyResponse> =>
    request<StrategyResponse>({
      method: 'POST',
      path: '/api/v1/strategy',
      body: { symbol, newsLabel },
    }),

  /**
   * FR5 — read the governance audit ledger + canonical SEC-17a-4 bundle.
   * @param symbol Optional ticker filter (allowlisted by the BFF).
   * @param correlationId Optional correlation UUID filter.
   */
  governance: (symbol?: string, correlationId?: string): Promise<GovernanceResponse> =>
    request<GovernanceResponse>({
      method: 'GET',
      path: '/api/v1/governance',
      query: { symbol, correlationId },
    }),
};

export { isApiError };
