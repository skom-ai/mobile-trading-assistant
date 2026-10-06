/**
 * Filename:    _layout.tsx
 * Description: Root Expo Router layout.
 * Purpose:     App entry stack. Imports the NativeWind global stylesheet, pins a
 *              dark StatusBar, and renders a single (tabs) group as the app shell.
 *              This is wiring/bootstrap — excluded from unit-coverage scope.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { loadScheme, useThemeColors } from '@/theme';

export default function RootLayout(): React.JSX.Element | null {
  const { colorScheme, setColorScheme } = useColorScheme();
  const colors = useThemeColors();
  const [ready, setReady] = useState(false);

  // Apply the persisted scheme via the React-subscribed setter before the first
  // painted frame. The dark splash/background covers the single async tick while
  // the gate renders null, so the user never sees a wrong-theme flash.
  useEffect(() => {
    loadScheme().then((s) => {
      setColorScheme(s);
      setReady(true);
    });
  }, [setColorScheme]);

  if (!ready) return null; // one async tick; dark splash/bg covers it

  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
