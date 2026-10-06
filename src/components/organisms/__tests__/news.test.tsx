/**
 * Filename:    news.test.tsx  [ src/components/organisms/__tests__ ]
 * Description: RNTL smoke tests for the Wave 2 News organisms.
 * Purpose:     Prove the NewsFeed renders the verdict + a headline card, that a
 *              NewsCard fires onPress, and that the search filter narrows the
 *              feed. Uses the screen-local seed data.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { fireEvent, render } from '@testing-library/react-native';

import { NewsCard, NewsFeed } from '@/components/organisms';
import {
  CATALYST_VERDICT,
  NEWS_CITATIONS,
  NEWS_HEADLINES,
  NEWS_TICKERS,
} from '@/data/news';

describe('Wave 2 News organisms', () => {
  it('NewsFeed renders the verdict card and a headline', () => {
    const view = render(
      <NewsFeed
        headlines={NEWS_HEADLINES}
        citations={NEWS_CITATIONS}
        verdict={CATALYST_VERDICT}
        tickers={NEWS_TICKERS}
      />,
    );
    expect(view.getByText('REAL_CATALYST')).toBeTruthy();
    expect(view.getByText('48-72h Credible Headlines')).toBeTruthy();
    expect(view.getByText(NEWS_HEADLINES[0].title)).toBeTruthy();
  });

  it('NewsCard fires onPress with its headline', () => {
    const onPress = jest.fn();
    const view = render(
      <NewsCard headline={NEWS_HEADLINES[0]} onPress={onPress} />,
    );
    fireEvent.press(view.getByLabelText(/headline:/i));
    expect(onPress).toHaveBeenCalledWith(NEWS_HEADLINES[0]);
  });

  it('NewsFeed search filters the headline list', () => {
    const view = render(
      <NewsFeed
        headlines={NEWS_HEADLINES}
        citations={NEWS_CITATIONS}
        verdict={CATALYST_VERDICT}
        tickers={NEWS_TICKERS}
      />,
    );
    fireEvent.changeText(view.getByLabelText('Search assets'), 'antitrust');
    expect(view.getByText(NEWS_HEADLINES[1].title)).toBeTruthy();
    expect(view.queryByText(NEWS_HEADLINES[0].title)).toBeNull();
  });
});
