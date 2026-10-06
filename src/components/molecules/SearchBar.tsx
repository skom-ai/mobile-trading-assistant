/**
 * Filename:    SearchBar.tsx
 * Description: Search input with a trailing filter toggle button (molecule).
 * Purpose:     Compose the scanner's "search ticker/sector/Z-score" field and
 *              its filter (tune) button from atoms. Controlled input; emits
 *              onChangeText and onToggleFilter to the owning organism.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View, TextInput, Pressable } from 'react-native';

import { Icon } from '@/components/atoms';
import { useThemeColors } from '@/theme';

export interface SearchBarProps {
  /** Current query text. */
  value: string;
  /** Called when the query changes. */
  onChangeText: (text: string) => void;
  /** Called when the filter button is pressed. */
  onToggleFilter?: () => void;
  /** Whether the filter drawer is open (drives the button's active style). */
  filterActive?: boolean;
  placeholder?: string;
}

/** SearchBar renders a mono search field plus a filter toggle. */
export function SearchBar({
  value,
  onChangeText,
  onToggleFilter,
  filterActive = false,
  placeholder = 'Search ticker, sector, or Z-score...',
}: SearchBarProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center gap-2">
      <View className="flex-1 flex-row items-center bg-surface rounded-xl border border-outline px-3.5">
        <Icon name="search" size={18} />
        <TextInput
          className="flex-1 py-3 px-2 text-sm font-mono text-content-primary"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Search assets"
          accessibilityRole="search"
        />
      </View>
      <Pressable
        onPress={onToggleFilter}
        accessibilityRole="button"
        accessibilityLabel="Filter options"
        accessibilityState={{ expanded: filterActive }}
        className={`px-3.5 py-3 rounded-xl border ${
          filterActive
            ? 'bg-violet/20 border-violet'
            : 'bg-surface border-outline'
        }`}
      >
        <Icon
          name="options-outline"
          size={18}
          color={filterActive ? colors.violet : colors.textPrimary}
          label="Filter"
        />
      </Pressable>
    </View>
  );
}
