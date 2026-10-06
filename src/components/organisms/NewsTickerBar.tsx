/**
 * Filename:    NewsTickerBar.tsx  [ src/components/organisms ]
 * Description: Horizontal live-ticker marquee of selectable ticker chips.
 * Purpose:     Port the web NewsScreen ticker bar: each chip shows a symbol +
 *              signed percent (emerald/danger) and toggles a ticker filter.
 *              Controlled selection lives in the owning feed organism.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/atoms';

export interface NewsTickerItem {
  ticker: string;
  changePercent: number;
}

export interface NewsTickerBarProps {
  /** Chips to render. */
  tickers: NewsTickerItem[];
  /** Currently selected ticker (or null for none). */
  selected: string | null;
  /** Toggle a ticker filter on/off. */
  onSelect: (ticker: string | null) => void;
}

/** Format a signed percent, e.g. +14.2% / -1.5%. */
function fmtPct(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

/** NewsTickerBar renders a scrollable row of selectable ticker chips. */
export function NewsTickerBar({
  tickers,
  selected,
  onSelect,
}: NewsTickerBarProps): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel="Ticker filters"
    >
      <View className="flex-row items-center gap-2.5">
        {tickers.map(({ ticker, changePercent }) => {
          const isSelected = selected === ticker;
          const pctTone = changePercent >= 0 ? 'text-emerald' : 'text-danger';
          return (
            <Pressable
              key={ticker}
              onPress={() => onSelect(isSelected ? null : ticker)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Filter ${ticker}, ${fmtPct(changePercent)}`}
              className={`flex-row items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isSelected
                  ? 'bg-violet/20 border-violet'
                  : 'bg-surface border-outline'
              }`}
            >
              <Text
                variant="caption"
                tone="primary"
                className="font-mono font-bold"
              >
                {ticker}
              </Text>
              <Text variant="caption" className={`font-mono font-semibold ${pctTone}`}>
                {fmtPct(changePercent)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
