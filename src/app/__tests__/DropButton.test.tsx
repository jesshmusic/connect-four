/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── mock <PlayerToken> but keep its enum ─────────────────────
jest.mock('@/components/PlayerToken', () => {
  const actual = jest.requireActual<typeof import('@/components/PlayerToken')>(
    '@/components/PlayerToken'
  );

  const Stub = jest.fn(({ player }: { player: string }) => (
    <span data-testid="token">{player}</span>
  ));

  return { __esModule: true, ...actual, default: Stub };
});

import PlayerToken, { PlayerColor } from '@/components/PlayerToken';
const PlayerTokenMock = PlayerToken as unknown as jest.Mock;

import DropButton from '@/components/DropButton';

// ─── tests ────────────────────────────────────────────────────
describe('<DropButton />', () => {
  const handleClick = jest.fn();
  const col = 3;

  beforeEach(() => {
    handleClick.mockClear();
    PlayerTokenMock.mockClear();
  });

  it('calls onClick with its column number when pressed', async () => {
    render(
      <DropButton onClick={handleClick} columnNumber={col} currentPlayer={PlayerColor.YELLOW} />
    );

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(col);
  });

  it('passes correct props to PlayerToken', () => {
    const { rerender } = render(
      <DropButton onClick={handleClick} columnNumber={col} currentPlayer={PlayerColor.YELLOW} />
    );

    expect(PlayerTokenMock).toHaveBeenCalledWith(
      expect.objectContaining({ player: PlayerColor.YELLOW }),
      {}
    );

    rerender(
      <DropButton onClick={handleClick} columnNumber={col} currentPlayer={PlayerColor.RED} />
    );

    expect(PlayerTokenMock).toHaveBeenCalledWith(
      expect.objectContaining({ player: PlayerColor.RED }),
      {}
    );
  });

  it('contains the hidden “Drop” label', () => {
    render(<DropButton onClick={handleClick} columnNumber={col} currentPlayer={PlayerColor.RED} />);
    expect(screen.getByText(/drop/i)).toBeInTheDocument();
  });
});
