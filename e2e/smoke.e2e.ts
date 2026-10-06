/**
 * Filename:    smoke.e2e.ts  [ e2e ]
 * Description: Detox end-to-end spec — one smoke assertion per screen.
 * Purpose:     A fast, shallow gate that each of the four screens mounts its
 *              signature content when navigated to. Broader than the launch
 *              check in navigation.e2e.ts: it asserts a distinctive element deep
 *              in each screen body, not just the header, so a screen that mounts
 *              but renders empty is caught. Fleshed out from the Wave 0 scaffold
 *              once the screens were ported (Wave 2/3).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 *
 * Notes:
 *   - Smoke anchors (unique per screen):
 *       Scanner    -> "Top 10 Sector Assets" section header
 *       News       -> "REAL_CATALYST" verdict headline
 *       Strategy   -> "Deploy Strategy & Set Alerts" CTA
 *       Governance -> "Immutable Vault Active" status banner
 *   - NOT run in this authoring sandbox (no booted simulator/device). See
 *     docs/visual-compliance-report.md for the build/test commands.
 */

/* global device, element, by, expect, beforeAll, describe, it */
/* eslint-disable no-undef */

/** Tap a tab then assert its smoke element is visible. */
async function smoke(tabLabel: string, anchorText: string): Promise<void> {
  await element(by.text(tabLabel)).tap();
  await expect(element(by.text(anchorText)).atIndex(0)).toBeVisible();
}

describe('Per-screen smoke', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('Scanner renders the ranked sector-asset list', async () => {
    await smoke('Scanner', 'Top 10 Sector Assets');
  });

  it('News renders the LLM catalyst verdict', async () => {
    await smoke('News', 'REAL_CATALYST');
  });

  it('Strategy renders the deploy CTA', async () => {
    await smoke('Strategy', 'Deploy Strategy & Set Alerts');
  });

  it('Governance renders the immutable-vault banner', async () => {
    await smoke('Governance', 'Immutable Vault Active');
  });
});
