/**
 * Filename:    ScannerAssetList.tsx
 * Description: Ranked sector-asset list — section header + TickerRow rows.
 * Purpose:     Screen-specific organism composing the SectionHeader molecule
 *              and TickerRow molecules for the 'TOP 10 SECTOR ASSETS' block.
 *              Presentational: receives already-filtered rows, delegates press.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';

import { Text } from '@/components/atoms';
import { SectionHeader, TickerRow } from '@/components/molecules';
import { rankToneForBadge, type ScannerAsset } from '@/data/scanner';

export interface ScannerAssetListProps {
  /** Rows to render (already filtered/sorted by the caller). */
  assets: readonly ScannerAsset[];
  /** Called with an asset id when its row is pressed. */
  onSelect?: (id: string) => void;
}

/** ScannerAssetList renders the titled, ranked list of scanner assets. */
export function ScannerAssetList({
  assets,
  onSelect,
}: ScannerAssetListProps): React.JSX.Element {
  return (
    <View className="gap-2.5">
      <SectionHeader
        title="Top 10 Sector Assets"
        icon="radio-outline"
        meta={`${assets.length} Assets • Live Z-Scores`}
      />

      {assets.map((asset) => (
        <TickerRow
          key={asset.id}
          rank={asset.rank}
          symbol={asset.symbol}
          company={asset.company}
          sector={asset.sector}
          badge={asset.badge}
          badgeLabel={asset.badgeLabel}
          rankTone={rankToneForBadge(asset.badge)}
          zScore={asset.zScore}
          rsi={asset.rsi}
          onPress={() => onSelect?.(asset.id)}
        />
      ))}

      {assets.length === 0 ? (
        <View className="p-8 items-center bg-surface rounded-xl border border-outline">
          <Text variant="caption" tone="muted" className="font-mono">
            No assets found.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
