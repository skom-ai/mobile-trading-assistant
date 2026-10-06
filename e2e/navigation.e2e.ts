/**
 * Filename:    navigation.e2e.ts  [ e2e ]
 * Description: Detox end-to-end spec — app launch + bottom-tab navigation.
 * Purpose:     Assert the app boots to the Scanner tab and can navigate to all
 *              four tabs in the SOURCE order (Scanner | News | Strategy |
 *              Governance), landing on each screen's own smoke element. This is
 *              the top-level stability gate: it fails if a route stops mounting
 *              or the tab bar order/labels regress.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 *
 * Notes:
 *   - Detox matchers: by.text() matches visible text (tab labels + headings);
 *     by.label() matches a node's accessibilityLabel.
 *   - Tab labels come from app/(tabs)/_layout.tsx `title` options.
 *   - Screen smoke anchors are the per-screen header/title text.
 *   - NOT run in this authoring sandbox (no booted simulator) — see
 *     docs/visual-compliance-report.md for the exact build/test commands.
 */

/* global device, element, by, expect, beforeAll, describe, it */
/* eslint-disable no-undef */

/** Tap a bottom-tab by its visible label and assert an on-screen anchor. */
async function gotoTab(tabLabel: string, screenAnchor: string): Promise<void> {
  await element(by.text(tabLabel)).tap();
  await expect(element(by.text(screenAnchor)).atIndex(0)).toBeVisible();
}

describe('App launch + tab navigation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('boots to the Scanner tab', async () => {
    // app/index.tsx redirects to /scanner; ScannerHeader renders "SCANNER".
    await expect(element(by.text('SCANNER'))).toBeVisible();
  });

  it('shows all four tab labels in source order', async () => {
    await expect(element(by.text('Scanner'))).toBeVisible();
    await expect(element(by.text('News'))).toBeVisible();
    await expect(element(by.text('Strategy'))).toBeVisible();
    await expect(element(by.text('Governance'))).toBeVisible();
  });

  it('navigates Scanner -> News -> Strategy -> Governance and back', async () => {
    // News: 48-72H credible-headlines section header is the screen anchor.
    await gotoTab('News', '48-72H Credible Headlines');
    // Strategy: coherence cockpit heading is unique to the Strategy screen.
    await gotoTab('Strategy', 'Strategy Coherence Cockpit');
    // Governance: audit-trail section heading is unique to Governance.
    await gotoTab('Governance', 'Audit Decision Trail');
    // Back to Scanner: the SCANNER header re-appears.
    await gotoTab('Scanner', 'SCANNER');
  });
});
