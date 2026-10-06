/**
 * Filename:    scanner.tsx  [ app/(tabs) ]
 * Description: Scanner tab — Obsidian Z-score / RSI market scanner screen.
 * Purpose:     Wave 2 port of the web ScannerScreen. Composes reusable
 *              molecules (SearchBar, IndexTickerHeader, StatCard) and the
 *              Scanner* organisms into the scrollable screen. Reads rows from
 *              the screen-scoped data module and mirrors them into the existing
 *              useScannerStore selector so loading state stays store-driven.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IndexTickerHeader, SearchBar, StatCard } from '@/components/molecules';
import { ScannerAssetList, ScannerHeader } from '@/components/organisms';
import { useScannerAssets, useScannerIndex } from '@/store';

/** ScannerRoute renders the full scanner screen. */
export default function ScannerRoute(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const assets = useScannerAssets();
  const index = useScannerIndex();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(
      (a) =>
        a.symbol.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.sector.toLowerCase().includes(q) ||
        a.badgeLabel.toLowerCase().includes(q) ||
        a.zScore.toString().includes(q),
    );
  }, [query, assets]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 gap-5"
        keyboardShouldPersistTaps="handled"
        accessibilityLabel="Scanner screen"
      >
        <ScannerHeader />

        <SearchBar
          value={query}
          onChangeText={setQuery}
          onToggleFilter={() => setFilterOpen((v) => !v)}
          filterActive={filterOpen}
        />

        <IndexTickerHeader
          name={index.name}
          price={index.price}
          change={index.change}
          changePercent={index.changePercent}
          positive={index.positive}
        />

        <View className="flex-row justify-between px-1">
          <StatCard label="Market Sentiment" value={index.sentiment} valueTone="accent" />
          <StatCard label="Volume" value={index.volume} />
          <StatCard label="VIX" value={index.vix} />
        </View>

        <ScannerAssetList assets={visible} />
      </ScrollView>
    </SafeAreaView>
  );
}
