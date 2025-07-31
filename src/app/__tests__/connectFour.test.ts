/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DEFAULT_BOARD_STATE,
  deepClone,
  checkForWinner,
  loadWinStats,
  saveWinStats,
  type WinStats,
} from '@/utils/connectFour';

/* ── helper types ─────────────────────────────────────────── */

type GlobalWithWindow = typeof globalThis & {
  window?: Window & typeof globalThis;
};

type StorageStub = Pick<
  Storage,
  'getItem' | 'setItem' | 'clear' | 'removeItem' | 'key' | 'length'
>;

const g = global as GlobalWithWindow;

/* ── board helper ──────────────────────────────────────────── */

const place = (coords: Array<[number, number]>, token: 1 | 2) => {
  const board = deepClone(DEFAULT_BOARD_STATE);
  coords.forEach(([x, y]) => (board[x][y] = token));
  return board;
};

const DEFAULTS: WinStats = { redWins: 0, yellowWins: 0, draws: 0 };

/* ── winner detection tests ───────────────────────────────── */

describe('checkForWinner – vertical / horizontal / diagonal', () => {
  it('detects a vertical win', () => {
    const board = place(
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
      1,
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
      2,
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
      1,
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
      2,
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

/* ── deepClone ────────────────────────────────────────────── */

describe('deepClone()', () => {
  it('creates a structural clone', () => {
    const clone = deepClone(DEFAULT_BOARD_STATE);
    clone[0][0] = 99 as unknown as 1;
    expect(DEFAULT_BOARD_STATE[0][0]).toBeNull();
  });
});

/* ── helpers for window stubbing ──────────────────────────── */

function withStubbedWindow<T>(
  storageImpl: () => StorageStub,
  fn: (stub: StorageStub) => T,
): T {
  const originalWindow = g.window;
  const stubStorage: StorageStub = storageImpl();

  // minimal window replacement
  const stubWindow = {
    localStorage: stubStorage as unknown as Storage,
  } as Window & typeof globalThis;

  Object.defineProperty(g, 'window', {
    value: stubWindow,
    configurable: true,
  });

  try {
    return fn(stubStorage);
  } finally {
    Object.defineProperty(g, 'window', {
      value: originalWindow,
      configurable: true,
    });
  }
}

describe('loadWinStats()', () => {
  it('returns defaults when `window` is undefined (server env)', () => {
    const orig = g.window;
    Object.defineProperty(g, 'window', { value: undefined, configurable: true });

    expect(loadWinStats()).toEqual(DEFAULTS);

    Object.defineProperty(g, 'window', { value: orig, configurable: true });
  });

  it('parses stats from localStorage when present', () => {
    const fake: WinStats = { redWins: 3, yellowWins: 2, draws: 1 };

    // JSDOM’s Storage object already exists; just mock its method.
    const spy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key) =>
        key === 'winStats' ? JSON.stringify(fake) : null,
      );

    expect(loadWinStats()).toEqual(fake);

    spy.mockRestore();
  });
});

describe('saveWinStats()', () => {
  const NEW_STATS: WinStats = { redWins: 5, yellowWins: 4, draws: 2 };

  it('is a no-op when `window` is undefined (server env)', () => {
    const orig = g.window;
    Object.defineProperty(g, 'window', { value: undefined, configurable: true });

    expect(() => saveWinStats(NEW_STATS)).not.toThrow();

    Object.defineProperty(g, 'window', { value: orig, configurable: true });
  });

  it('writes JSON to localStorage in browser env', () => {
    const spy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(jest.fn());

    saveWinStats(NEW_STATS);

    expect(spy).toHaveBeenCalledWith(
      'winStats',
      JSON.stringify(NEW_STATS),
    );

    spy.mockRestore();
  });
});
