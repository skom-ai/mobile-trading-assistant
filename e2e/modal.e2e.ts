/**
 * Filename:    modal.e2e.ts  [ e2e ]
 * Description: Detox end-to-end spec — open + dismiss the Governance record
 *              inspector modal (the app's one true RN <Modal>).
 * Purpose:     Prove the modal flow end to end: from the Governance audit trail,
 *              tap a record card to open the inspector bottom sheet, assert its
 *              WORM seal banner is visible, then close it via the Close
 *              Inspector button and confirm the trail is shown again.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 *
 * Notes:
 *   - The ONLY component using RN <Modal> is GovernanceRecordModal. The News
 *     verdict citations and Scanner rows fire handlers (console log / no-op),
 *     not a modal, so the modal E2E anchors on Governance.
 *   - Record card accessibilityLabel:
 *     "Audit record <corrId>: <title>. Open inspector." (src/data/governance.ts
 *     seeds #CORR-8842 "Automated Liquidity Rebalance Override").
 *   - Modal anchors: "WORM HARDWARE WRITE-LOCK SEALED" banner text; the footer
 *     button exposes accessibilityLabel "Close inspector".
 *   - NOT run in this authoring sandbox — commands live in the report.
 */

/* global device, element, by, expect, beforeAll, describe, it */
/* eslint-disable no-undef */

const RECORD_CARD =
  'Audit record #CORR-8842: Automated Liquidity Rebalance Override. Open inspector.';

describe('Governance record inspector modal', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await element(by.text('Governance')).tap();
    await expect(element(by.text('Audit Decision Trail'))).toBeVisible();
  });

  it('opens the inspector when a record card is tapped', async () => {
    await element(by.label(RECORD_CARD)).tap();
    await expect(element(by.text('WORM HARDWARE WRITE-LOCK SEALED'))).toBeVisible();
  });

  it('closes the inspector via the Close Inspector button', async () => {
    await element(by.label('Close inspector').and(by.traits(['button']))).tap();
    // Trail is visible again; the seal banner is gone.
    await expect(element(by.text('Audit Decision Trail'))).toBeVisible();
    await expect(
      element(by.text('WORM HARDWARE WRITE-LOCK SEALED')),
    ).toBeNotVisible();
  });
});
