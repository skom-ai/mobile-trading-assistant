/**
 * Filename:    NewsFeed.tsx  [ src/components/organisms ]
 * Description: News screen body — search + ticker bar + verdict + headline feed.
 * Purpose:     Compose the ported News screen from atoms/molecules and the
 *              News* organisms. Owns local search + ticker-filter state and the
 *              client-side filter (title/summary/category/source + ticker).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { SearchBar, SectionHeader } from '@/components/molecules';
import { Text } from '@/components/atoms';
import type { CatalystVerdict, Citation, NewsHeadline } from '@/data/news';
import type { NewsTickerItem } from './NewsTickerBar';
import { NewsTickerBar } from './NewsTickerBar';
import { NewsVerdictCard } from './NewsVerdictCard';
import { NewsCard } from './NewsCard';

export interface NewsFeedProps {
  headlines: NewsHeadline[];
  citations: Citation[];
  verdict: CatalystVerdict;
  tickers: NewsTickerItem[];
  onOpenArticle?: (headline: NewsHeadline) => void;
  onOpenCitation?: (citation: Citation) => void;
}

/** Case-insensitive match across the searchable headline fields. */
function matchesQuery(item: NewsHeadline, q: string): boolean {
  const t = q.toLowerCase();
  return (
    item.title.toLowerCase().includes(t) ||
    item.summary.toLowerCase().includes(t) ||
    item.category.toLowerCase().includes(t) ||
    item.source.toLowerCase().includes(t)
  );
}

/** NewsFeed renders the full scrollable News screen body. */
export function NewsFeed({
  headlines,
  citations,
  verdict,
  tickers,
  onOpenArticle,
  onOpenCitation,
}: NewsFeedProps): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const bare = selectedTicker?.replace('$', '').toLowerCase() ?? null;
    return headlines.filter((item) => {
      if (!matchesQuery(item, query)) return false;
      if (!bare) return true;
      return (
        item.title.toLowerCase().includes(bare) ||
        item.ticker?.toLowerCase() === bare
      );
    });
  }, [headlines, query, selectedTicker]);

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NewsCard headline={item} onPress={onOpenArticle} />
      )}
      contentContainerClassName="gap-2.5 px-4 pb-24"
      ItemSeparatorComponent={() => <View className="h-0.5" />}
      showsVerticalScrollIndicator={false}
      accessibilityLabel="Credible headlines feed"
      ListHeaderComponent={
        <View className="gap-4 pt-4 pb-3">
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search ticker or event catalyst (e.g. $VAL)..."
          />
          <NewsTickerBar
            tickers={tickers}
            selected={selectedTicker}
            onSelect={setSelectedTicker}
          />
          <NewsVerdictCard
            verdict={verdict}
            citations={citations}
            onOpenCitation={onOpenCitation}
          />
          <SectionHeader
            title="48-72h Credible Headlines"
            icon="newspaper-outline"
            meta="Live Feed"
          />
        </View>
      }
      ListEmptyComponent={
        <View className="py-10 items-center">
          <Text variant="caption" tone="muted">
            No headlines match your filter.
          </Text>
        </View>
      }
    />
  );
}
