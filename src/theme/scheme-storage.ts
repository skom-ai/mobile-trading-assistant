/**
 * Filename:    scheme-storage.ts
 * Description: Persistence for the chosen color scheme (light/dark).
 * Purpose:     Read/write the user's scheme choice to AsyncStorage and provide
 *              an imperative apply helper for outside-React callers. First-run
 *              default is 'dark' (matches app.json userInterfaceStyle). All
 *              storage access is wrapped so a failure degrades to the default
 *              rather than crashing.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';

const KEY = 'valtide.colorScheme';

export type Scheme = 'light' | 'dark';

/** Read the stored choice; return 'dark' when absent/invalid/error (default). */
export async function loadScheme(): Promise<Scheme> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    // Trust-boundary check on persisted input: only the two literals are valid.
    return v === 'light' || v === 'dark' ? v : 'dark';
  } catch {
    return 'dark'; // storage read failed → safe default, no crash
  }
}

/** Persist the choice; swallow write errors (non-fatal — in-memory still set). */
export async function persistScheme(scheme: Scheme): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, scheme);
  } catch {
    /* ignore: a failed write only means the next launch falls back to default */
  }
}

/**
 * Apply a scheme to NativeWind imperatively (usable outside React).
 * Requires darkMode:'class' in tailwind.config.js. NOTE: the startup path uses
 * the React hook's setColorScheme instead; this is kept for non-React callers.
 */
export function applyScheme(scheme: Scheme): void {
  colorScheme.set(scheme);
}
