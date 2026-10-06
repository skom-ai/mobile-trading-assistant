/**
 * Filename:    molecules.test.tsx
 * Description: RNTL smoke tests for the Wave 1b molecules.
 * Purpose:     Prove each molecule composes its atoms and surfaces the right
 *              text/interactions (SearchBar onChangeText, TickerRow onPress).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { fireEvent, render } from '@testing-library/react-native';

import {
  IndexTickerHeader,
  SearchBar,
  SectionHeader,
  StatCard,
  TickerRow,
} from '@/components/molecules';

describe('Wave 1b molecules', () => {
  it('SearchBar emits typed text', () => {
    const onChangeText = jest.fn();
    const view = render(<SearchBar value="" onChangeText={onChangeText} />);
    fireEvent.changeText(view.getByLabelText('Search assets'), 'AAPL');
    expect(onChangeText).toHaveBeenCalledWith('AAPL');
  });

  it('TickerRow renders symbol + badge and fires onPress', () => {
    const onPress = jest.fn();
    const view = render(
      <TickerRow
        rank="01"
        symbol="AAPL"
        company="Apple Inc."
        sector="Tech"
        badge="strongBuy"
        rankTone="bullish"
        zScore={2.1}
        rsi={68}
        onPress={onPress}
      />,
    );
    expect(view.getByText('AAPL')).toBeTruthy();
    expect(view.getByText('Strong Buy')).toBeTruthy();
    fireEvent.press(view.getByLabelText(/AAPL, Apple Inc\./));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('StatCard stacks label and value', () => {
    const view = render(<StatCard label="VIX" value="13.24" />);
    expect(view.getByText('VIX')).toBeTruthy();
    expect(view.getByText('13.24')).toBeTruthy();
  });

  it('IndexTickerHeader shows price and percent change', () => {
    const view = render(
      <IndexTickerHeader
        name="S&P 500"
        price="5,117.09"
        change="+71.82"
        changePercent="+1.42% (Today)"
      />,
    );
    expect(view.getByText('5,117.09')).toBeTruthy();
    expect(view.getByText('+1.42% (Today)')).toBeTruthy();
  });

  it('SectionHeader renders title and meta', () => {
    const view = render(
      <SectionHeader title="Top 10 Sector Assets" meta="10 Assets • Live Z-Scores" />,
    );
    expect(view.getByText('Top 10 Sector Assets')).toBeTruthy();
    expect(view.getByText('10 Assets • Live Z-Scores')).toBeTruthy();
  });

  // ---- Branch coverage top-ups (Wave 3b) --------------------------------

  it('SearchBar toggles the filter button and reflects filterActive', () => {
    const onToggleFilter = jest.fn();
    const view = render(
      <SearchBar value="" onChangeText={jest.fn()} onToggleFilter={onToggleFilter} filterActive />,
    );
    const btn = view.getByLabelText('Filter options');
    expect(btn.props.accessibilityState).toMatchObject({ expanded: true });
    fireEvent.press(btn);
    expect(onToggleFilter).toHaveBeenCalledTimes(1);
  });

  it('IndexTickerHeader renders the negative (danger) tone + a custom sparkline', () => {
    const view = render(
      <IndexTickerHeader
        name="S&P 500"
        price="4,900.00"
        change="-45.10"
        changePercent="-0.92% (Today)"
        positive={false}
        sparkline={<StatCard label="spark" value="chart" />}
      />,
    );
    expect(view.getByText('-0.92% (Today)')).toBeTruthy();
    expect(view.getByText('-45.10')).toBeTruthy();
    // Custom sparkline replaces the '~' placeholder (slot is a11y-hidden).
    expect(view.queryByText('~')).toBeNull();
  });

  it('SectionHeader without meta omits the trailing text', () => {
    const view = render(<SectionHeader title="Only Title" />);
    expect(view.getByText('Only Title')).toBeTruthy();
    expect(view.queryByText('•')).toBeNull();
  });

  it('TickerRow honors a badgeLabel override and negative Z/RSI coloring', () => {
    const view = render(
      <TickerRow
        rank="08"
        symbol="TSLA"
        company="Tesla Inc."
        sector="Auto"
        badge="oversold"
        badgeLabel="Deep Value"
        rankTone="oversold"
        zScore={-1.85}
        rsi={31.4}
      />,
    );
    expect(view.getByText('Deep Value')).toBeTruthy();
    expect(view.getByText('-1.85')).toBeTruthy();
    expect(view.getByText('31.4')).toBeTruthy();
  });

  it('TickerRow uses default rankTone + variant badge label when unspecified', () => {
    const view = render(
      <TickerRow
        rank="05"
        symbol="MSFT"
        company="Microsoft Corp."
        sector="Tech"
        badge="stable"
        zScore={0.88}
        rsi={55.9}
      />,
    );
    // No badgeLabel -> Badge falls back to the variant's default label.
    expect(view.getByText('Stable')).toBeTruthy();
    expect(view.getByText('MSFT')).toBeTruthy();
  });
});
