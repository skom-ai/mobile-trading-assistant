/**
 * Filename:    scanner.e2e.ts  [ e2e ]
 * Description: Detox end-to-end spec — Scanner search + filter interaction.
 * Purpose:     Exercise the two interactive controls on the Scanner screen:
 *              the search field (client-side row filter) and the filter-toggle
 *              button. Confirms typing a query narrows the ranked list to the
 *              matching ticker and hides non-matches, and that the filter
 *              button is tappable. Mirrors the RNTL unit test
 *              (src/__tests__/screens.test.tsx) at the real-device layer.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 *
 * Notes:
 *   - Anchors use accessibilityLabel (by.label): SearchBar exposes
 *     "Search assets" + "Filter options"; each TickerRow exposes
 *     "<SYMBOL>, <company>, <sector>, Z-score <z>, RSI <rsi>".
 *   - Seed rows come from src/data/scanner.ts (NVDA rank 01, TSLA rank 08).
 *   - NOT run in this authoring sandbox — commands live in the report.
 */

/* global device, element, by, expect, beforeAll, beforeEach, describe, it */
/* eslint-disable no-undef */

const NVDA_ROW = 'NVDA, NVIDIA Corp., Semi, Z-score 2.84, RSI 68.2';
const TSLA_ROW = 'TSLA, Tesla Inc., Auto, Z-score -1.85, RSI 31.4';

describe('Scanner search + filter', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    // Ensure we are on Scanner and the query is cleared between cases.
    await element(by.text('Scanner')).tap();
    await element(by.label('Search assets')).replaceText('');
  });

  it('lists the seed rows before filtering', async () => {
    await expect(element(by.label(NVDA_ROW))).toBeVisible();
  });

  it('filters the list to a matching ticker and hides non-matches', async () => {
    await element(by.label('Search assets')).typeText('tesla');
    await expect(element(by.label(TSLA_ROW))).toBeVisible();
    await expect(element(by.label(NVDA_ROW))).toBeNotVisible();
  });

  it('shows the empty state for an unmatched query', async () => {
    await element(by.label('Search assets')).typeText('zzz-nope');
    await expect(element(by.text('No assets found.'))).toBeVisible();
  });

  it('toggles the filter button without crashing', async () => {
    const filterBtn = element(by.label('Filter options'));
    await filterBtn.tap(); // open
    await filterBtn.tap(); // close
    await expect(filterBtn).toBeVisible();
  });
});
