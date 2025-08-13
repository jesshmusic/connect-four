/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { loadWinStats as mockLoadWinStats } from '@/utils/connectFour';

// ──────────────────────────────────────────────────────────────
// 1. Module mocks
// ──────────────────────────────────────────────────────────────

jest.mock('@/utils/connectFour', () => {
  // retain the real exports so other functions keep working
  const actual = jest.requireActual('@/utils/connectFour');
  return {
    __esModule: true,
    ...actual,
    loadWinStats: jest.fn(), // <-- writable mock fn
  };
});

jest.mock('@/components/GameBoard', () => {
  return function MockBoard({ setGameState, gameState }) {
    return (
      <button
        data-testid="mock-board"
        onClick={() =>
          setGameState({
            ...gameState,
            hasWinner: true,
            statusMessage: 'RED wins!',
          })
        }
      >
        Board stub
      </button>
    );
  };
});

jest.mock('@/components/PlayerToken', () => {
  return {
    __esModule: true,
    PlayerColor: { RED: 1, YELLOW: 2 },
    default: ({ player }: { player: number }) => (
      <span data-testid="token">{player === 1 ? '🔴' : '🟡'}</span>
    ),
  };
});

// ──────────────────────────────────────────────────────────────
// 2. Tests
// ──────────────────────────────────────────────────────────────

describe('<Home />', () => {
  beforeEach(() => {
    // Arrange the return value of our mock
    (mockLoadWinStats as jest.Mock).mockReturnValue({
      redWins: 3,
      yellowWins: 2,
      draws: 1,
    });

    // Stub localStorage
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(), setItem: jest.fn() },
      writable: true,
    });
  });

  it('renders heading, status banner, and initial win stats', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /connect four/i })).toBeInTheDocument();
    expect(screen.getByText(/red: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/yellow: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/draws: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/red's turn/i)).toBeInTheDocument();
    expect(screen.getByTestId('token')).toHaveTextContent('🔴');
  });

  it('shows Reset button after a win and resets to initial state', async () => {
    render(<Home />);

    // Trigger win through mocked GameBoard
    await userEvent.click(screen.getByTestId('mock-board'));

    expect(screen.getByText(/red wins!/i)).toBeInTheDocument();
    const reset = screen.getByRole('button', { name: /reset/i });
    expect(reset).toBeInTheDocument();

    await userEvent.click(reset);

    expect(screen.getByText(/red's turn/i)).toBeInTheDocument();
    expect(screen.queryByText(/red wins!/i)).not.toBeInTheDocument();
  });
});
