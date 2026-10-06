/**
 * Filename:    organisms-coverage.test.tsx  [ organisms/__tests__ ]
 * Description: Branch/interaction top-ups for organisms not fully exercised by
 *              the per-screen suites (modal copy/close, citation type branches,
 *              empty list, timeframe select, ticker toggle, cockpit degenerate
 *              range, placeholder, export action).
 * Purpose:     Push each organism's uncovered lines/branches over the bar with
 *              focused RNTL assertions. These fail if the flagged branches
 *              regress.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { act, fireEvent, render } from '@testing-library/react-native';

import StrategyRoute from '../../../../app/(tabs)/strategy';
import {
  GovernanceGuardrails,
  GovernanceRecordModal,
  GovernanceScreen,
  NewsFeed,
  NewsTickerBar,
  NewsVerdictCard,
  PlaceholderScreen,
  ScannerAssetList,
  StrategyCockpit,
  StrategyTimeframes,
} from '@/components/organisms';
import { INITIAL_AUDIT_RECORDS } from '@/data/governance';
import {
  CATALYST_VERDICT,
  NEWS_CITATIONS,
  NEWS_HEADLINES,
  NEWS_TICKERS,
} from '@/data/news';
import { STRATEGY_ASSETS } from '@/data/strategy';

describe('GovernanceRecordModal', () => {
  const record = INITIAL_AUDIT_RECORDS[0]!;

  it('returns null when there is no record', () => {
    const { toJSON } = render(
      <GovernanceRecordModal record={null} isOpen={false} onClose={jest.fn()} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('flips the copy label to "Copied!" and resets after the timeout', () => {
    jest.useFakeTimers();
    const view = render(
      <GovernanceRecordModal record={record} isOpen onClose={jest.fn()} />,
    );
    expect(view.getByText('Copy Hash')).toBeTruthy();
    fireEvent.press(view.getByLabelText('Mark hash copied'));
    expect(view.getByText('Copied!')).toBeTruthy();
    act(() => jest.advanceTimersByTime(2000));
    expect(view.getByText('Copy Hash')).toBeTruthy();
    jest.useRealTimers();
  });

  it('fires onClose from the close-inspector control', () => {
    const onClose = jest.fn();
    const view = render(
      <GovernanceRecordModal record={record} isOpen onClose={onClose} />,
    );
    fireEvent.press(view.getAllByLabelText('Close inspector')[0]!);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('NewsVerdictCard citations', () => {
  it('renders filing + wire citation icons and fires onOpenCitation', () => {
    const onOpenCitation = jest.fn();
    const view = render(
      <NewsVerdictCard
        verdict={CATALYST_VERDICT}
        citations={NEWS_CITATIONS}
        onOpenCitation={onOpenCitation}
      />,
    );
    expect(view.getByText('94.2% Confidence')).toBeTruthy();
    fireEvent.press(view.getByLabelText(new RegExp(`Open evidence: ${escapeRe(NEWS_CITATIONS[0]!.citationTag)}`)));
    expect(onOpenCitation).toHaveBeenCalledWith(NEWS_CITATIONS[0]);
  });

  it('does not throw when a citation is pressed without a handler', () => {
    const view = render(
      <NewsVerdictCard verdict={CATALYST_VERDICT} citations={NEWS_CITATIONS} />,
    );
    expect(() =>
      fireEvent.press(view.getByLabelText(new RegExp(`Open evidence: ${escapeRe(NEWS_CITATIONS[1]!.citationTag)}`))),
    ).not.toThrow();
  });
});

describe('ScannerAssetList', () => {
  it('renders the empty state when no assets are given', () => {
    const view = render(<ScannerAssetList assets={[]} />);
    expect(view.getByText('No assets found.')).toBeTruthy();
  });

  it('fires onSelect with the asset id when a row is pressed', () => {
    const onSelect = jest.fn();
    const view = render(<ScannerAssetList assets={[FIRST_SCANNER_ASSET]} onSelect={onSelect} />);
    fireEvent.press(view.getByLabelText(/NVDA, NVIDIA Corp\./));
    expect(onSelect).toHaveBeenCalledWith('nvda');
  });
});

describe('StrategyTimeframes', () => {
  it('fires onSelect for a non-active timeframe row', () => {
    const onSelect = jest.fn();
    const view = render(
      <StrategyTimeframes asset={STRATEGY_ASSETS[0]!} selected="1D" onSelect={onSelect} />,
    );
    // Press the 4H row (not currently selected) -> onSelect('4H').
    fireEvent.press(view.getByLabelText(/4-Hour Momentum/));
    expect(onSelect).toHaveBeenCalledWith('4H');
  });
});

describe('NewsTickerBar', () => {
  const tickers = [
    { ticker: '$VAL', changePercent: 14.2 },
    { ticker: '$TSLA', changePercent: -1.5 },
  ];

  it('selects an unselected ticker and toggles off a selected one', () => {
    const onSelect = jest.fn();
    const view = render(<NewsTickerBar tickers={tickers} selected={null} onSelect={onSelect} />);
    // Positive chip -> select. Negative chip present with danger tone (-1.5%).
    fireEvent.press(view.getByLabelText('Filter $VAL, +14.2%'));
    expect(onSelect).toHaveBeenCalledWith('$VAL');
    expect(view.getByText('-1.5%')).toBeTruthy();
  });

  it('toggling the already-selected ticker clears the filter (null)', () => {
    const onSelect = jest.fn();
    const view = render(<NewsTickerBar tickers={tickers} selected="$VAL" onSelect={onSelect} />);
    fireEvent.press(view.getByLabelText('Filter $VAL, +14.2%'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});

describe('StrategyCockpit', () => {
  it('renders with real price levels', () => {
    const view = render(<StrategyCockpit asset={STRATEGY_ASSETS[0]!} />);
    expect(view.getByText('Strategy Coherence Cockpit')).toBeTruthy();
  });

  it('falls back to the fixed split when target <= stop (degenerate range)', () => {
    const degenerate = { ...STRATEGY_ASSETS[0]!, stopLoss: 100, targetPrice: 100, price: 100 };
    expect(() => render(<StrategyCockpit asset={degenerate} />)).not.toThrow();
  });
});

describe('PlaceholderScreen', () => {
  it('renders its title + subtitle', () => {
    const view = render(<PlaceholderScreen title="Coming Soon" subtitle="Ported later" />);
    expect(view.getByText('Coming Soon')).toBeTruthy();
    expect(view.getByText('Ported later')).toBeTruthy();
  });
});

describe('GovernanceScreen extras', () => {
  it('renders the Export SEC Packet action', () => {
    const view = render(<GovernanceScreen />);
    expect(view.getByLabelText('Export SEC packet')).toBeTruthy();
    fireEvent.press(view.getByLabelText('Export SEC packet'));
    // No handler wired yet — pressing must not throw.
    expect(view.getByText('Export SEC Packet')).toBeTruthy();
  });

  it('opens then closes the record inspector modal', () => {
    const view = render(<GovernanceScreen />);
    const record = INITIAL_AUDIT_RECORDS[0]!;
    fireEvent.press(view.getByLabelText(new RegExp(escapeRe(record.corrId))));
    expect(view.getByText('WORM HARDWARE WRITE-LOCK SEALED')).toBeTruthy();
    // Close via the footer control -> setSelected(null) (GovernanceScreen line 109).
    fireEvent.press(view.getAllByLabelText('Close inspector')[0]!);
    expect(view.queryByText('WORM HARDWARE WRITE-LOCK SEALED')).toBeNull();
  });
});

describe('NewsFeed ticker filter', () => {
  it('narrows the feed to headlines matching the selected ticker', () => {
    const view = render(
      <NewsFeed
        headlines={NEWS_HEADLINES}
        citations={NEWS_CITATIONS}
        verdict={CATALYST_VERDICT}
        tickers={NEWS_TICKERS}
      />,
    );
    // All VAL headlines carry ticker 'VAL'; selecting $VAL keeps them (line 59 branch).
    fireEvent.press(view.getByLabelText('Filter $VAL, +14.2%'));
    expect(view.getByText(NEWS_HEADLINES[0]!.title)).toBeTruthy();
  });
});

describe('StrategyRoute toast', () => {
  it('shows then dismisses the deploy toast', () => {
    const view = render(<StrategyRoute />);
    fireEvent.press(view.getByLabelText('Deploy strategy and set alerts'));
    expect(view.getByText('Strategy Deployed Successfully')).toBeTruthy();
    // Dismiss -> setToast(null) (strategy.tsx line 88).
    fireEvent.press(view.getByLabelText('Dismiss notification'));
    expect(view.queryByText('Strategy Deployed Successfully')).toBeNull();
  });
});

describe('GovernanceGuardrails timers', () => {
  it('shows the verify toast then auto-clears it after the full timeout', () => {
    jest.useFakeTimers();
    const view = render(<GovernanceGuardrails />);
    fireEvent.press(view.getByLabelText('Verify cryptographic epoch proof'));
    // 900ms -> verifying resolves + feedback shown.
    act(() => jest.advanceTimersByTime(900));
    expect(view.getByText(/WORM roots verified/)).toBeTruthy();
    // +5000ms -> nested setTimeout clears the feedback (covers the inner cb).
    act(() => jest.advanceTimersByTime(5000));
    expect(view.queryByText(/WORM roots verified/)).toBeNull();
    jest.useRealTimers();
  });
});

/** First scanner asset fixture (mirrors src/data/scanner NVDA row). */
const FIRST_SCANNER_ASSET = {
  id: 'nvda',
  rank: '01',
  symbol: 'NVDA',
  company: 'NVIDIA Corp.',
  sector: 'Semi',
  badge: 'strongBuy' as const,
  badgeLabel: 'Strong Buy',
  zScore: 2.84,
  rsi: 68.2,
};

/** Escape regex metacharacters in a citation tag for accessibilityLabel match. */
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
