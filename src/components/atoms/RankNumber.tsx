/**
 * Filename:    RankNumber.tsx
 * Description: Ranked-position badge atom (the "01/02.." tile on ticker rows).
 * Purpose:     Render the square rank tile with a color tint tied to the row's
 *              signal tone, mirroring the web scanner's getRankColor logic.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { View } from 'react-native';
import { Text as RNText } from 'react-native';

export type RankTone = 'bullish' | 'positive' | 'oversold' | 'neutral';

const TONE_TEXT: Record<RankTone, string> = {
  bullish: 'text-violet',
  positive: 'text-emerald',
  oversold: 'text-danger',
  neutral: 'text-content-secondary',
};

export interface RankNumberProps {
  /** Rank string, e.g. '01'. */
  rank: string;
  /** Color tone derived from the row's signal. */
  tone?: RankTone;
}

/** RankNumber renders the square, mono rank tile. */
export function RankNumber({
  rank,
  tone = 'neutral',
}: RankNumberProps): React.JSX.Element {
  return (
    <View
      className="w-10 h-10 rounded-lg bg-surface-high items-center justify-center"
      accessibilityLabel={`Rank ${rank}`}
    >
      <RNText className={`font-mono font-bold text-xs ${TONE_TEXT[tone]}`}>
        {rank}
      </RNText>
    </View>
  );
}
