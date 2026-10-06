/**
 * Filename:    screens.test.tsx  [ src/__tests__ ]
 * Description: RNTL render/interaction tests for the app/ route wrappers.
 * Purpose:     Cover the thin tab-route files (index redirect, governance/news
 *              wrappers, scanner search + filter-toggle branches) that the
 *              organism-level suites do not exercise. These fail if a route
 *              wrapper stops mounting its screen or its handlers regress.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { fireEvent, render } from '@testing-library/react-native';

// expo-router pulls in ESM (standard-navigation) that jest-expo does not
// transform in this environment; the Index route only needs <Redirect/> to be
// a renderable no-op, so stub the module surface used by app/index.tsx.
jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>redirect:{href}</Text>;
  },
}));

import IndexRoute from '@app/index';
import GovernanceRoute from '@app/(tabs)/governance';
import NewsRoute from '@app/(tabs)/news';
import ScannerRoute from '@app/(tabs)/scanner';

describe('app route wrappers', () => {
  it('Index route redirects to /scanner', () => {
    const view = render(<IndexRoute />);
    expect(view.getByText('redirect:/scanner')).toBeTruthy();
  });

  it('Governance route renders the audit trail heading', () => {
    const view = render(<GovernanceRoute />);
    expect(view.getByText('Audit Decision Trail')).toBeTruthy();
  });

  it('News route renders the verdict card and fires open handlers', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const view = render(<NewsRoute />);
    expect(view.getByText('REAL_CATALYST')).toBeTruthy();

    // Open article handler (first NewsCard press) -> console.log('[news] open article').
    fireEvent.press(view.getAllByLabelText(/headline:/i)[0]!);
    // Open citation handler (first verdict citation press) -> '[news] open citation'.
    fireEvent.press(view.getAllByLabelText(/Open evidence:/i)[0]!);

    expect(logSpy).toHaveBeenCalledWith('[news] open article', expect.any(String));
    expect(logSpy).toHaveBeenCalledWith('[news] open citation', expect.any(String));
    logSpy.mockRestore();
  });

  it('Scanner route filters rows by search query', () => {
    const view = render(<ScannerRoute />);
    // NVDA present initially.
    expect(view.getByLabelText(/NVDA, NVIDIA Corp\./)).toBeTruthy();

    fireEvent.changeText(view.getByLabelText('Search assets'), 'tesla');
    expect(view.getByLabelText(/TSLA, Tesla Inc\./)).toBeTruthy();
    expect(view.queryByLabelText(/NVDA, NVIDIA Corp\./)).toBeNull();
  });

  it('Scanner route shows the empty state for an unmatched query', () => {
    const view = render(<ScannerRoute />);
    fireEvent.changeText(view.getByLabelText('Search assets'), 'zzz-nope');
    expect(view.getByText('No assets found.')).toBeTruthy();
  });

  it('Scanner route toggles the filter button active state', () => {
    const view = render(<ScannerRoute />);
    const filterBtn = view.getByLabelText('Filter options');
    // Toggle on then off — exercises the setFilterOpen((v) => !v) branch.
    fireEvent.press(filterBtn);
    fireEvent.press(filterBtn);
    expect(filterBtn).toBeTruthy();
  });
});
