/**
 * Filename:    news.tsx  [ app/(tabs) ]
 * Description: News tab route — live credible-headlines feed.
 * Purpose:     Host the ported News screen. Wires the NewsFeed organism to the
 *              screen-local news data source (seed mock until a feed service
 *              lands). Safe-area aware; logs article/citation opens.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { SafeAreaView } from 'react-native-safe-area-context';

import { NewsFeed } from '@/components/organisms';
import {
  type Citation,
  type NewsHeadline,
} from '@/data/news';
import {
  useCatalystVerdict,
  useNewsCitations,
  useNewsHeadlines,
  useNewsTickers,
} from '@/store';

export default function NewsRoute(): React.JSX.Element {
  const headlines = useNewsHeadlines();
  const citations = useNewsCitations();
  const verdict = useCatalystVerdict();
  const tickers = useNewsTickers();

  const handleOpenArticle = (headline: NewsHeadline): void => {
    // ponytail: detail modal is a later wave; log the intent for now.
    console.log('[news] open article', headline.id);
  };
  const handleOpenCitation = (citation: Citation): void => {
    console.log('[news] open citation', citation.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <NewsFeed
        headlines={headlines}
        citations={citations}
        verdict={verdict}
        tickers={tickers}
        onOpenArticle={handleOpenArticle}
        onOpenCitation={handleOpenCitation}
      />
    </SafeAreaView>
  );
}
