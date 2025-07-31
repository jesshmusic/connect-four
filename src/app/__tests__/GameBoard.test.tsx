/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GameBoard from '@/components/GameBoard';
import type { PlayerColor } from '@/components/PlayerToken';

import { checkForWinner, saveWinStats } from '@/utils/connectFour';

// ──────────────────────────────────────────────────────────────
// 1.  Mocks
// ──────────────────────────────────────────────────────────────

jest.mock('@/components/PlayerToken', () => {
  const actual = jest.requireActual<typeof import('@/components/PlayerToken')>(
    '@/components/PlayerToken',
  );
  // eslint-disable-next-line react/display-name
  const Mock = ({
                  player,
                }: {
    player: PlayerColor;
    isDropping?: boolean;
    dropRows?: number;
  }) => <span data-testid="token">{player}</span>;
  return { __esModule: true, ...actual, default: Mock };
});

jest.mock('@/components/DropButton', () => ({
  __esModule: true,
  default: ({
              onClick,
              columnNumber,
            }: {
    onClick: (col: number) => void;
    columnNumber: number;
  }) => (
    <button
      data-testid={`drop-${columnNumber}`}
      onClick={() => onClick(columnNumber)}
    />
  ),
}));

jest.mock('@/utils/connectFour', () => {
  const actual = jest.requireActual<typeof import('@/utils/connectFour')>(
    '@/utils/connectFour',
  );
  return {
    __esModule: true,
    ...actual,
    checkForWinner: jest.fn(),
    saveWinStats: jest.fn(),
  };
});

// ──────────────────────────────────────────────────────────────
// 2.  Global <audio> stub
// ──────────────────────────────────────────────────────────────
class MockAudio implements Pick<HTMLAudioElement, 'play' | 'currentTime'> {
  currentTime = 0;
  play = jest.fn(() => Promise.resolve());
}
// @ts-expect-error – jsdom global
global.Audio = MockAudio;

// ──────────────────────────────────────────────────────────────
// 3.  Common data & helpers
// ──────────────────────────────────────────────────────────────
const baseGameState = {
  currentPlayer: 'red' as PlayerColor,
  hasWinner: false,
  statusMessage: "RED's turn",
  shouldReset: false,
};

const mockedCheckForWinner = checkForWinner as jest.Mock;
const mockedSaveWinStats = saveWinStats as jest.Mock;

// ──────────────────────────────────────────────────────────────
// 4.  Tests
// ──────────────────────────────────────────────────────────────
describe('<GameBoard />', () => {
  const setGameState = jest.fn();
  const setWinStats = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initially renders six drop buttons', () => {
    render(
      <GameBoard
        gameState={baseGameState}
        setGameState={setGameState}
        winStats={{ redWins: 0, yellowWins: 0, draws: 0 }}
        setWinStats={setWinStats}
      />,
    );
    expect(screen.getAllByRole('button')).toHaveLength(6);
  });

  it('after a normal move switches to YELLOW’s turn', async () => {
    mockedCheckForWinner.mockReturnValue(null);

    render(
      <GameBoard
        gameState={baseGameState}
        setGameState={setGameState}
        winStats={{ redWins: 0, yellowWins: 0, draws: 0 }}
        setWinStats={setWinStats}
      />,
    );

    await userEvent.click(screen.getByTestId('drop-0'));

    expect(mockedCheckForWinner).toHaveBeenCalledTimes(1);
    expect(setGameState).toHaveBeenCalledWith(
      expect.objectContaining({
        currentPlayer: 'yellow',
        statusMessage: "YELLOW's turn",
      }),
    );
  });

  it('handles a RED win and updates win stats', async () => {
    mockedCheckForWinner.mockReturnValue(1);

    render(
      <GameBoard
        gameState={baseGameState}
        setGameState={setGameState}
        winStats={{ redWins: 0, yellowWins: 0, draws: 0 }}
        setWinStats={setWinStats}
      />,
    );

    await userEvent.click(screen.getByTestId('drop-1'));

    expect(setWinStats).toHaveBeenCalledWith(
      expect.objectContaining({ redWins: 1 }),
    );
    expect(mockedSaveWinStats).toHaveBeenCalled();
    expect(setGameState).toHaveBeenCalledWith(
      expect.objectContaining({
        hasWinner: true,
        statusMessage: 'RED wins!',
      }),
    );
  });

  it('handles a draw and increments draw count', async () => {
    mockedCheckForWinner.mockReturnValue('draw');

    render(
      <GameBoard
        gameState={baseGameState}
        setGameState={setGameState}
        winStats={{ redWins: 0, yellowWins: 0, draws: 0 }}
        setWinStats={setWinStats}
      />,
    );

    await userEvent.click(screen.getByTestId('drop-2'));

    expect(setWinStats).toHaveBeenCalledWith(
      expect.objectContaining({ draws: 1 }),
    );
    expect(setGameState).toHaveBeenCalledWith(
      expect.objectContaining({ statusMessage: 'Draw!' }),
    );
  });

  it('runs the reset useEffect when shouldReset is true', () => {
    render(
      <GameBoard
        gameState={{ ...baseGameState, shouldReset: true }}
        setGameState={setGameState}
        winStats={{ redWins: 0, yellowWins: 0, draws: 0 }}
        setWinStats={setWinStats}
      />,
    );

    expect(setGameState).toHaveBeenCalledWith(
      expect.objectContaining({ shouldReset: false }),
    );
  });

  it('removes the drop button when a column is full', async () => {
    mockedCheckForWinner.mockReturnValue(null);

    render(
      <GameBoard
        gameState={baseGameState}
        setGameState={setGameState}
        winStats={{ redWins: 0, yellowWins: 0, draws: 0 }}
        setWinStats={setWinStats}
      />,
    );

    // Fill column 0 (7 rows)
    for (let i = 0; i < 7; i++) {
      await userEvent.click(screen.getByTestId('drop-0'));
    }

    // Button should now be gone
    expect(screen.queryByTestId('drop-0')).toBeNull();
  });
});
