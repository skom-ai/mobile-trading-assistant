/**
 * Filename:    governance.tsx  [ app/(tabs) ]
 * Description: Governance tab route.
 * Purpose:     Fourth tab. Renders the ported GovernanceScreen organism (WORM
 *              audit trail / compliance view). Thin route wrapper — all UI and
 *              state live in the organism per atomic-design layering.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { GovernanceScreen } from '@/components/organisms';

export default function GovernanceRoute(): React.JSX.Element {
  return <GovernanceScreen />;
}
