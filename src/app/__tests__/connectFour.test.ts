/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DEFAULT_BOARD_STATE,
  deepClone,
  checkForWinner,
  loadWinStats,
  saveWinStats,
  type WinStats,
} from '@/utils/connectFour';

/* ── helpers ────────────────────────────────────────────────── */

const place = (coords: Array<[x: number, y: number]>, token: 1 | 2) => {
  const board = deepClone(DEFAULT_BOARD_STATE);
  coords.forEach(([x, y]) => (board[x][y] = token));
  return board;
};

/* ── winner detection tests ────────────────────────────────── */

describe('checkForWinner – vertical / horizontal / diagonal', () => {
  it('detects a vertical win', () => {
    const board = place(
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
      1
    );
    expect(checkForWinner(board)).toBe(1);
  });

  it('detects a horizontal win', () => {
    const board = place(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      2
    );
    expect(checkForWinner(board)).toBe(2);
  });

  it('detects a “\\” diagonal win', () => {
    const board = place(
      [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      1
    );
    expect(checkForWinner(board)).toBe(1);
  });

  it('detects a “/” diagonal win', () => {
    const board = place(
      [
        [3, 0],
        [2, 1],
        [1, 2],
        [0, 3],
      ],
      2
    );
    expect(checkForWinner(board)).toBe(2);
  });
});

describe('checkForWinner – draw & null', () => {
  it('returns "draw" on a full board with no four-in-a-row', () => {
    const full = deepClone(DEFAULT_BOARD_STATE);
    for (let x = 0; x < full.length; x += 1) {
      for (let y = 0; y < full[x].length; y += 1) {
        full[x][y] = (x + y) % 2 === 0 ? 1 : 2;
      }
    }
    expect(checkForWinner(full)).toBe('draw');
  });

  it('returns null when the game is still in progress', () => {
    const board = deepClone(DEFAULT_BOARD_STATE);
    board[0][0] = 1;
    board[1][1] = 2;
    expect(checkForWinner(board)).toBeNull();
  });
});

/* ── deepClone ─────────────────────────────────────────────── */

describe('deepClone()', () => {
  it('creates a structural clone', () => {
    const clone = deepClone(DEFAULT_BOARD_STATE);
    clone[0][0] = 99 as unknown as 1;
    expect(DEFAULT_BOARD_STATE[0][0]).toBeNull();
  });
});

/* ── loadWinStats / saveWinStats ───────────────────────────── */

describe('loadWinStats()', () => {
  const DEFAULTS: WinStats = { redWins: 0, yellowWins: 0, draws: 0 };

  it('returns defaults when `window` is undefined (server env)', () => {
    // Backup and delete the global window reference
    const originalWindow = global.window;
    // @ts-expect-error – we intentionally remove it
    delete global.window;

    expect(loadWinStats()).toEqual(DEFAULTS);

    // Restore window so other tests stay happy
    global.window = originalWindow;
  });

  it('parses stats from localStorage when available (browser env)', () => {
    const fakeStats: WinStats = { redWins: 3, yellowWins: 2, draws: 1 };

    // Stub localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify(fakeStats)),
        setItem: jest.fn(),
      },
      writable: true,
    });

    expect(loadWinStats()).toEqual(fakeStats);
  });
});

describe('saveWinStats()', () => {
  const STATS: WinStats = { redWins: 5, yellowWins: 4, draws: 2 };

  it('does nothing when `window` is undefined (server env)', () => {
    const originalWindow = global.window;
    // @ts-expect-error – remove window
    delete global.window;

    // Should not throw
    expect(() => saveWinStats(STATS)).not.toThrow();

    global.window = originalWindow;
  });

  it('writes JSON to localStorage in browser env', () => {
    const setItem = jest.fn();

    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(), setItem },
      writable: true,
    });

    saveWinStats(STATS);
    expect(setItem).toHaveBeenCalledWith('winStats', JSON.stringify(STATS));
  });
});
