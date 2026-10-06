/**
 * Filename:    governance.ts  [ src/data ]
 * Description: Static governance / WORM audit-trail data for the Governance tab.
 * Purpose:     Screen-local source of truth for the immutable decision records
 *              and vault status figures rendered by GovernanceScreen. Ported
 *              1:1 from the web app's mockData.INITIAL_AUDIT_RECORDS so the RN
 *              screen shows identical content. No store exists for this screen,
 *              so the data lives here (this screen only).
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 *
 * Notes:
 *   - Synthetic fixture data (compliance demo); NOT a live feed.
 *   - Keep in sync with the web reference if audit fields change.
 */

/** Terminal seal state for a WORM audit record. */
export type AuditRecordStatus = 'VERIFIED' | 'LOCKED' | 'SEALED';

/** One immutable, cryptographically-anchored governance decision record. */
export interface AuditRecord {
  id: string;
  corrId: string;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  hash: string;
  fullHash: string;
  secRule: string;
  blockNumber: number;
  merkleRoot: string;
  signer: string;
  status: AuditRecordStatus;
}

/** Total sealed records in the immutable vault (headline figure). */
export const TOTAL_RECORDS_COUNT = 1489204;

/** Height of the most-recently sealed block. */
export const LAST_SEALED_BLOCK = 9928410;

/** Immutable decision records shown in the audit decision trail. */
export const INITIAL_AUDIT_RECORDS: readonly AuditRecord[] = [
  {
    id: 'rec-1',
    corrId: '#CORR-8842',
    title: 'Automated Liquidity Rebalance Override',
    description: 'Authorized by Governance DAO Multiseig #4',
    timestamp: '2 mins ago',
    timeAgo: '2 mins ago',
    hash: '0xf89c...421a',
    fullHash: '0xf89c31a7b059345e23908db1426189ea7c891390421a',
    secRule: 'SEC 17a-4(f)',
    blockNumber: 9928410,
    merkleRoot: '0x9928410d8a43f8e5891349bca74e628174bc',
    signer: 'DAO-MULTISIG-4 [0x489...E412]',
    status: 'SEALED',
  },
  {
    id: 'rec-2',
    corrId: '#CORR-8841',
    title: 'Emergency Circuit Breaker Trigger',
    description: 'Volatility threshold exceeded on pool #USDC-ETH',
    timestamp: '14 mins ago',
    timeAgo: '14 mins ago',
    hash: '0x31a2...990b',
    fullHash: '0x31a284e907c125697a8109ef3270914a51e6990b',
    secRule: 'SEC 17a-4(f)',
    blockNumber: 9928404,
    merkleRoot: '0x31a2404b901e74a6659124a9dc384918e74b',
    signer: 'SENTINEL-AUTOMATION-ORACLE [0x789...11A3]',
    status: 'SEALED',
  },
  {
    id: 'rec-3',
    corrId: '#CORR-8840',
    title: 'Compliance Policy Parameter Update',
    description: 'Updated KYC threshold limits per regulatory memo',
    timestamp: '1 hour ago',
    timeAgo: '1 hour ago',
    hash: '0x99ef...112c',
    fullHash: '0x99ef41289dc00127548a8e10471b0094e432112c',
    secRule: 'SEC 17a-4(f)',
    blockNumber: 9928389,
    merkleRoot: '0x99ef389d41287e00941578e9124ab8c71289',
    signer: 'CHIEF-COMPLIANCE-OFFICER [0x110...88C9]',
    status: 'SEALED',
  },
];
