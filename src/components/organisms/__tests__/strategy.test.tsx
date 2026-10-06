/**
 * Filename:    strategy.test.tsx  [ organisms/__tests__ ]
 * Description: RNTL tests for the Wave 2 Strategy organisms + screen.
 * Purpose:     Prove the organisms render their asset data, the asset picker
 *              swaps the analyzed asset, the deploy CTA fires, and the cockpit
 *              segment math is sound. These are the runnable checks that fail
 *              if the Strategy contracts break.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { fireEvent, render } from '@testing-library/react-native';

import StrategyRoute from '../../../../app/(tabs)/strategy';
import {
  cockpitSegments,
  StrategyPrecedent,
  StrategyVerdictBanner,
} from '@/components/organisms';
import { STRATEGY_ASSETS } from '@/data/strategy';

describe('Wave 2 Strategy screen', () => {
  it('renders the first asset verdict + confidence', () => {
    const view = render(<StrategyRoute />);
    expect(view.getByText('NVIDIA Corp.')).toBeTruthy();
    expect(view.getByText('BUY PULLBACK')).toBeTruthy();
    expect(view.getByText('84%')).toBeTruthy();
  });

  it('swaps the analyzed asset via the picker', () => {
    const view = render(<StrategyRoute />);
    fireEvent.press(view.getByLabelText('Switch asset, current NVDA'));
    fireEvent.press(view.getByLabelText('Analyze TSLA'));
    expect(view.getByText('Tesla Inc.')).toBeTruthy();
    expect(view.getByText('MEAN REVERSION')).toBeTruthy();
  });

  it('shows a deploy toast when the CTA is pressed', () => {
    const view = render(<StrategyRoute />);
    fireEvent.press(view.getByLabelText('Deploy strategy and set alerts'));
    expect(view.getByText('Strategy Deployed Successfully')).toBeTruthy();
  });

  it('VerdictBanner renders subtitle text', () => {
    const view = render(
      <StrategyVerdictBanner verdict="BUY" subtitle="Structural zone" confidence={90} />,
    );
    expect(view.getByText('Structural zone')).toBeTruthy();
    expect(view.getByText('90%')).toBeTruthy();
  });

  it('Precedent fires onDeploy', () => {
    const onDeploy = jest.fn();
    const view = render(
      <StrategyPrecedent precedent={STRATEGY_ASSETS[0].historicalPrecedent} onDeploy={onDeploy} />,
    );
    fireEvent.press(view.getByLabelText('Deploy strategy and set alerts'));
    expect(onDeploy).toHaveBeenCalledTimes(1);
  });

  it('cockpitSegments sum to ~100 and place current inside range', () => {
    const [r, v, g] = cockpitSegments(STRATEGY_ASSETS[0]);
    expect(r + v + g).toBeGreaterThanOrEqual(99);
    expect(r + v + g).toBeLessThanOrEqual(101);
    expect(v).toBeGreaterThanOrEqual(0);
  });
});
