/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import PlayerToken, { PlayerColor } from '@/components/PlayerToken';

// Helpers to pluck circles & their attributes
const getCircles = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('circle')) as SVGCircleElement[];

describe('<PlayerToken />', () => {
  it('renders a RED token with default size (100) and opacity (1.0)', () => {
    const { container } = render(
      <PlayerToken player={PlayerColor.RED} />,
    );

    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '100px');
    expect(svg).toHaveAttribute('height', '100px');
    expect(svg).toHaveAttribute('opacity', '1');

    const [outer, inner] = getCircles(container);
    expect(outer).toHaveAttribute('fill', '#cc0000'); // red primary
    expect(inner).toHaveAttribute('fill', '#640000'); // red shadow
  });

  it('renders a YELLOW token with custom numeric size and opacity', () => {
    const { container } = render(
      <PlayerToken player={PlayerColor.YELLOW} size={150} opacity={0.4} />,
    );

    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '150px');
    expect(svg).toHaveAttribute('height', '150px');
    expect(svg).toHaveAttribute('opacity', '0.4');

    const [outer, inner] = getCircles(container);
    expect(outer).toHaveAttribute('fill', '#bc8e0d'); // yellow primary
    expect(inner).toHaveAttribute('fill', '#5d4505'); // yellow shadow
  });

  it('accepts string size values (e.g., "200px")', () => {
    const { container } = render(
      <PlayerToken player={PlayerColor.RED} size="200px" />,
    );

    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '200px');
    expect(svg).toHaveAttribute('height', '200px');
  });
});
