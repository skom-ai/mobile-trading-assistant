/**
 * Filename:    PlaceholderScreen.tsx
 * Description: Shared placeholder screen for Wave 0 tab routes.
 * Purpose:     Render a themed, safe-area-aware placeholder so all four tabs
 *              exist and demonstrate the Obsidian styling via NativeWind
 *              classNames before real screens are ported. Confirms a trivial
 *              className (bg-background, text-violet) renders.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/atoms';

export interface PlaceholderScreenProps {
  /** Screen title shown to the user. */
  title: string;
  /** Short description of what will live here once ported. */
  subtitle: string;
}

/** Themed placeholder body. Kept tiny and reusable across the four tabs. */
export function PlaceholderScreen({
  title,
  subtitle,
}: PlaceholderScreenProps): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 items-center justify-center px-6">
        <ThemedText variant="accent" className="text-2xl font-semibold">
          {title}
        </ThemedText>
        <ThemedText variant="secondary" className="mt-2 text-center text-sm">
          {subtitle}
        </ThemedText>
        <View className="mt-6 rounded-card border border-outline bg-surface-container px-4 py-2">
          <ThemedText variant="muted" className="font-mono text-xs">
            Wave 0 scaffold · screen ported later
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}
