/**
 * Filename:    ScannerHeader.tsx
 * Description: Scanner screen header — 'SCANNER' title + profile avatar button.
 * Purpose:     Screen-specific organism composing atoms into the top bar shown
 *              in the design screenshot. Presentational; avatar press is
 *              delegated via onPressProfile.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';

import { Heading, Icon } from '@/components/atoms';
import { persistScheme, useThemeColors } from '@/theme';

export interface ScannerHeaderProps {
  /** Called when the profile avatar is pressed. */
  onPressProfile?: () => void;
}

/** ScannerHeader renders the SCANNER title and a profile avatar control. */
export function ScannerHeader({
  onPressProfile,
}: ScannerHeaderProps): React.JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';
  return (
    <View
      className="flex-row items-center justify-between"
      accessibilityRole="header"
    >
      <Heading level="title" className="uppercase tracking-wider">
        SCANNER
      </Heading>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => {
            toggleColorScheme();
            // Compute from isDark: colorScheme won't update synchronously here.
            void persistScheme(isDark ? 'light' : 'dark');
          }}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-9 h-9 rounded-full bg-surface-high border border-outline items-center justify-center"
        >
          <Icon
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
        <Pressable
          onPress={onPressProfile}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          className="w-9 h-9 rounded-full bg-surface-high border border-outline items-center justify-center"
        >
          <Icon name="person-outline" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}
