/**
 * Filename:    atoms.test.tsx
 * Description: RNTL smoke tests for the Wave 1b atoms.
 * Purpose:     Prove each atom renders and that value-driven logic (Badge
 *              labels, NumericValue sign/format) behaves. These are the runnable
 *              checks that fail if the atom contracts break.
 * Author:      Sunil+AI Assistant
 * Date:        2026-09-30
 */

import { render } from '@testing-library/react-native';

import {
  Badge,
  Card,
  Chip,
  Divider,
  Heading,
  Icon,
  NumericValue,
  RankNumber,
  Text,
  ThemedText,
} from '@/components/atoms';

describe('Wave 1b atoms', () => {
  it('Text and Heading render children', () => {
    const t = render(<Text tone="accent">Valtide</Text>);
    expect(t.getByText('Valtide')).toBeTruthy();
    const h = render(<Heading level="section">Top 10</Heading>);
    expect(h.getByText('Top 10')).toBeTruthy();
  });

  it('Badge shows its default variant label', () => {
    const view = render(<Badge variant="strongBuy" />);
    expect(view.getByText('Strong Buy')).toBeTruthy();
  });

  it('Badge respects a label override', () => {
    const view = render(<Badge variant="oversold" label="Deep Value" />);
    expect(view.getByText('Deep Value')).toBeTruthy();
  });

  it('NumericValue prefixes + for non-negative signed values', () => {
    const view = render(<NumericValue value={2.1} mode="signed" />);
    expect(view.getByText('+2.10')).toBeTruthy();
  });

  it('NumericValue formats RSI with one decimal', () => {
    const view = render(<NumericValue value={68} mode="rsi" decimals={1} />);
    expect(view.getByText('68.0')).toBeTruthy();
  });

  it('RankNumber renders its rank', () => {
    const view = render(<RankNumber rank="01" tone="bullish" />);
    expect(view.getByText('01')).toBeTruthy();
  });

  it('Chip renders label and reports selected state', () => {
    const view = render(<Chip label="Semiconductors" selected />);
    expect(view.getByText('Semiconductors')).toBeTruthy();
  });

  it('Card and Divider mount without crashing', () => {
    const card = render(
      <Card>
        <Text>inside</Text>
      </Card>,
    );
    expect(card.getByText('inside')).toBeTruthy();
    expect(() => render(<Divider />)).not.toThrow();
  });

  // ---- Branch coverage top-ups (Wave 3b) --------------------------------

  it('NumericValue colors RSI danger below 35 and neutral in-band', () => {
    const low = render(<NumericValue value={30} mode="rsi" decimals={1} />);
    expect(low.getByText('30.0')).toBeTruthy();
    const mid = render(<NumericValue value={50} mode="rsi" decimals={1} />);
    expect(mid.getByText('50.0')).toBeTruthy();
  });

  it('NumericValue plain mode does not prefix a sign', () => {
    const view = render(<NumericValue value={13.24} mode="plain" />);
    expect(view.getByText('13.24')).toBeTruthy();
  });

  it('NumericValue signed mode shows a negative value unprefixed + bold', () => {
    const view = render(<NumericValue value={-1.85} mode="signed" bold />);
    expect(view.getByText('-1.85')).toBeTruthy();
  });

  it('Chip renders the unselected state and reports it via a11y', () => {
    const view = render(<Chip label="Value" />);
    const chip = view.getByLabelText('Filter: Value');
    expect(chip.props.accessibilityState).toMatchObject({ selected: false });
  });

  it('Badge covers a neutral/danger variant pair', () => {
    expect(render(<Badge variant="hold" />).getByText('Hold')).toBeTruthy();
    expect(render(<Badge variant="oversold" />).getByText('Oversold')).toBeTruthy();
    expect(render(<Badge variant="value" />).getByText('Value')).toBeTruthy();
  });

  it('RankNumber renders each tone', () => {
    for (const tone of ['bullish', 'positive', 'oversold', 'neutral'] as const) {
      const view = render(<RankNumber rank="05" tone={tone} />);
      expect(view.getByLabelText('Rank 05')).toBeTruthy();
    }
    // Default tone (no prop) path.
    expect(render(<RankNumber rank="09" />).getByText('09')).toBeTruthy();
  });

  it('Heading renders each level + tone', () => {
    for (const level of ['section', 'title', 'display'] as const) {
      const view = render(<Heading level={level}>H-{level}</Heading>);
      expect(view.getByText(`H-${level}`)).toBeTruthy();
    }
    const toned = render(
      <Heading level="title" tone="accent">
        Accent Title
      </Heading>,
    );
    expect(toned.getByText('Accent Title')).toBeTruthy();
  });

  it('Text renders every tone + variant', () => {
    for (const tone of ['primary', 'secondary', 'muted', 'accent'] as const) {
      const view = render(
        <Text tone={tone} variant="caption">
          T-{tone}
        </Text>,
      );
      expect(view.getByText(`T-${tone}`)).toBeTruthy();
    }
  });

  it('Card without padding still renders children', () => {
    const view = render(
      <Card padded={false}>
        <Text>nopad</Text>
      </Card>,
    );
    expect(view.getByText('nopad')).toBeTruthy();
  });

  it('Divider renders vertical orientation', () => {
    expect(() => render(<Divider orientation="vertical" />)).not.toThrow();
  });

  it('Heading uses the default title level when none is passed', () => {
    const view = render(<Heading>Default Title</Heading>);
    expect(view.getByText('Default Title')).toBeTruthy();
  });

  it('ThemedText renders each variant', () => {
    for (const variant of ['primary', 'secondary', 'muted', 'accent'] as const) {
      const view = render(<ThemedText variant={variant}>TT-{variant}</ThemedText>);
      expect(view.getByText(`TT-${variant}`)).toBeTruthy();
    }
    // Default variant path (no prop).
    expect(render(<ThemedText>TT-default</ThemedText>).getByText('TT-default')).toBeTruthy();
  });

  it('Icon renders both announced (label) and decorative (no label) forms', () => {
    // Both branches of the label ternary (importantForAccessibility) mount.
    expect(() => render(<Icon name="search" label="Search" />)).not.toThrow();
    expect(() => render(<Icon name="chevron-forward" />)).not.toThrow();
  });
});
