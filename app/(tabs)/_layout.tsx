/**
 * Filename:    _layout.tsx  [ app/(tabs) ]
 * Description: Bottom tab navigator for the four primary screens.
 * Purpose:     Define the tab bar in the SOURCE web app order —
 *              Scanner | News | Strategy | Governance — styled with the Obsidian
 *              palette (violet active tint, near-black bar, hairline top border).
 *              Icons map the source Material symbols to Ionicons equivalents:
 *              radar→radar-outline, newspaper→newspaper-outline,
 *              strategy→trending-up-outline, gavel→hammer-outline.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useThemeColors } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const icon =
  (name: IoniconName) =>
  ({ color, size }: { color: ColorValue; size: number }): React.JSX.Element => (
    <Ionicons name={name} color={color} size={size} />
  );

export default function TabsLayout(): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.violet,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surfaceLowest,
          borderTopColor: colors.outline,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="scanner"
        options={{ title: 'Scanner', tabBarIcon: icon('radio-outline') }}
      />
      <Tabs.Screen
        name="news"
        options={{ title: 'News', tabBarIcon: icon('newspaper-outline') }}
      />
      <Tabs.Screen
        name="strategy"
        options={{ title: 'Strategy', tabBarIcon: icon('trending-up-outline') }}
      />
      <Tabs.Screen
        name="governance"
        options={{ title: 'Governance', tabBarIcon: icon('hammer-outline') }}
      />
    </Tabs>
  );
}
