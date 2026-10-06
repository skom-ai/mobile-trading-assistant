/**
 * Filename:    geminiService.ts  [ src/services ]
 * Description: Gemini LLM catalyst/verdict service — DETERMINISTIC STUB (v1).
 * Purpose:     Provide the typed interface the app codes against (analyzeCatalyst
 *              / generateVerdict) while v1 returns a fixed, deterministic stub —
 *              NO network call, NO hardcoded key. The API key is read from an env
 *              var (EXPO_PUBLIC_GEMINI_API_KEY, fallback expo-constants extra) so
 *              wiring a live client later needs no interface change.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SUGGESTED AUGMENTATION (out of v1 scope): replace the stub bodies with a  │
 * │ real @google/genai call guarded by getApiKey(). Interface stays stable —  │
 * │ only the two method bodies change. Do NOT wire live without user sign-off.│
 * └─────────────────────────────────────────────────────────────────────────┘
 */

import Constants from 'expo-constants';

/** Structured result of analysing a news headline for trade relevance. */
export interface CatalystAnalysis {
  readonly verdict: 'REAL_CATALYST' | 'NOISE';
  readonly impactLabel: 'HIGH IMPACT' | 'MODERATE IMPACT' | 'LOW IMPACT';
  readonly confidence: number;
  readonly rationale: string;
}

/** Structured trade verdict for a scanned asset symbol. */
export interface AssetVerdict {
  readonly symbol: string;
  readonly verdict: string;
  readonly confidence: number;
  readonly rationale: string;
}

/** The LLM catalyst/verdict contract the app depends on (impl is swappable). */
export interface GeminiService {
  analyzeCatalyst(headline: string): Promise<CatalystAnalysis>;
  generateVerdict(symbol: string): Promise<AssetVerdict>;
}

/**
 * Resolve the Gemini API key from the environment.
 *
 * Order: EXPO_PUBLIC_GEMINI_API_KEY, then expo-constants `extra.geminiApiKey`.
 * Never hardcoded; may be undefined in v1 since the stub makes no live call.
 *
 * @returns The configured key, or undefined when none is set.
 */
export function getApiKey(): string | undefined {
  const fromEnv = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (fromEnv) return fromEnv;
  const extra = Constants.expoConfig?.extra as { geminiApiKey?: string } | undefined;
  return extra?.geminiApiKey;
}

/**
 * Deterministic hash of a string to a bounded confidence value.
 *
 * Keeps stub output stable per input (same headline → same confidence) so tests
 * and UI snapshots are reproducible without any randomness.
 *
 * @param input - the source text to derive confidence from.
 * @returns A confidence in the inclusive range [70, 99].
 */
function deterministicConfidence(input: string): number {
  let acc = 0;
  for (let i = 0; i < input.length; i += 1) acc = (acc * 31 + input.charCodeAt(i)) % 1000;
  return 70 + (acc % 30);
}

/**
 * v1 deterministic stub implementation of {@link GeminiService}.
 *
 * Logs that it is stubbed on every call and returns fixed, input-derived output.
 * No network access, no key required.
 */
export const geminiService: GeminiService = {
  async analyzeCatalyst(headline: string): Promise<CatalystAnalysis> {
    // eslint-disable-next-line no-console
    console.info('[geminiService] STUBBED analyzeCatalyst — no live call', {
      keyPresent: Boolean(getApiKey()),
    });
    const confidence = deterministicConfidence(headline);
    return {
      verdict: confidence >= 85 ? 'REAL_CATALYST' : 'NOISE',
      impactLabel: confidence >= 90 ? 'HIGH IMPACT' : confidence >= 80 ? 'MODERATE IMPACT' : 'LOW IMPACT',
      confidence,
      rationale: `Stubbed analysis of "${headline.slice(0, 48)}" — wire live Gemini to replace.`,
    };
  },

  async generateVerdict(symbol: string): Promise<AssetVerdict> {
    // eslint-disable-next-line no-console
    console.info('[geminiService] STUBBED generateVerdict — no live call', {
      symbol,
      keyPresent: Boolean(getApiKey()),
    });
    const confidence = deterministicConfidence(symbol);
    return {
      symbol,
      verdict: confidence >= 85 ? 'BUY PULLBACK' : 'RANGE BOUND',
      confidence,
      rationale: `Stubbed verdict for ${symbol} — deterministic placeholder pending live model.`,
    };
  },
};
