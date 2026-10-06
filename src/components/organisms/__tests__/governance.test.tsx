/**
 * Filename:    governance.test.tsx
 * Description: RNTL tests for the Wave 2 Governance screen + organisms.
 * Purpose:     Prove the ported GovernanceScreen renders the vault banner,
 *              guardrails, and audit records; that search filters the trail;
 *              and that tapping a record opens the inspector modal. These fail
 *              if the compose wiring or filter logic regresses.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { act, fireEvent, render } from '@testing-library/react-native';

import {
  GovernanceGuardrails,
  GovernanceRecordCard,
  GovernanceScreen,
  GovernanceStatusBanner,
} from '@/components/organisms';
import { INITIAL_AUDIT_RECORDS } from '@/data/governance';

describe('Wave 2 Governance', () => {
  it('StatusBanner shows vault title, total records, and sealed block', () => {
    const view = render(
      <GovernanceStatusBanner totalRecordsCount={1489204} lastSealedBlock={9928410} />,
    );
    expect(view.getByText('Immutable Vault Active')).toBeTruthy();
    expect(view.getByText('WORM VERIFIED')).toBeTruthy();
    expect(view.getByText('1,489,204')).toBeTruthy();
    expect(view.getByText('#9928410')).toBeTruthy();
  });

  it('Guardrails verify-epoch reveals the verification feedback toast', () => {
    jest.useFakeTimers();
    const view = render(<GovernanceGuardrails />);
    fireEvent.press(view.getByLabelText('Verify cryptographic epoch proof'));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(view.getByText(/WORM roots verified/)).toBeTruthy();
    jest.useRealTimers();
  });

  it('RecordCard renders corrId + title and fires onOpen', () => {
    const onOpen = jest.fn();
    const record = INITIAL_AUDIT_RECORDS[0]!;
    const view = render(<GovernanceRecordCard record={record} onOpen={onOpen} />);
    expect(view.getByText(record.corrId)).toBeTruthy();
    expect(view.getByText(record.title)).toBeTruthy();
    fireEvent.press(view.getByLabelText(new RegExp(record.corrId.replace('#', '\\#'))));
    expect(onOpen).toHaveBeenCalledWith(record);
  });

  it('Screen filters the audit trail by search query', () => {
    const view = render(<GovernanceScreen />);
    // All three records visible initially.
    expect(view.getByText('Emergency Circuit Breaker Trigger')).toBeTruthy();
    fireEvent.changeText(view.getByLabelText('Search assets'), 'Compliance');
    expect(view.getByText('Compliance Policy Parameter Update')).toBeTruthy();
    expect(view.queryByText('Emergency Circuit Breaker Trigger')).toBeNull();
  });

  it('Screen shows empty state when nothing matches', () => {
    const view = render(<GovernanceScreen />);
    fireEvent.changeText(view.getByLabelText('Search assets'), 'zzz-no-match');
    expect(view.getByText('No audit records matching query.')).toBeTruthy();
  });

  it('Screen opens the record inspector on card press', () => {
    const view = render(<GovernanceScreen />);
    const record = INITIAL_AUDIT_RECORDS[0]!;
    fireEvent.press(view.getByLabelText(new RegExp(record.corrId.replace('#', '\\#'))));
    expect(view.getByText('WORM HARDWARE WRITE-LOCK SEALED')).toBeTruthy();
    expect(view.getByText(record.fullHash)).toBeTruthy();
  });
});
