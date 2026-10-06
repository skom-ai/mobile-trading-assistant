/**
 * Filename:    scanner.test.tsx
 * Description: RNTL smoke test for the Scanner screen (Wave 2 port).
 * Purpose:     Prove the screen renders without crashing and that both the S&P
 *              500 index card and at least one ranked ticker row are present.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { render } from '@testing-library/react-native';

import ScannerRoute from '@app/(tabs)/scanner';

describe('Scanner screen', () => {
  it('renders the index card and a ticker row without crashing', () => {
    const view = render(<ScannerRoute />);

    // Index ticker card — accessibilityLabel includes the index name + price.
    expect(view.getByLabelText(/S&P 500 \/ INDEX TICKER/)).toBeTruthy();

    // First ranked ticker row (NVDA) is present with its accessible label.
    expect(view.getByLabelText(/NVDA, NVIDIA Corp\./)).toBeTruthy();

    // Section header meta confirms the list rendered.
    expect(view.getByText(/Live Z-Scores/)).toBeTruthy();
  });
});
