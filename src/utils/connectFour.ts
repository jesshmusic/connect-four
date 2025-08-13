import { PlayerColor } from '@/components/PlayerToken';

type Board = Array<Array<string | number | null | undefined>>;
const NUM_IN_ROW_WIN = 4;

const checkVerticalWinner = (board: Board) => {
  for (let x = 0; x < board.length; x++) {
    let maxNumInRow = 1;
    let lastToken = board[x][0];
    for (let y = 1; y < board[x].length; y++) {
      const currentToken = board[x][y];
      if (currentToken === lastToken && currentToken !== null) {
        maxNumInRow++;
        if (maxNumInRow === NUM_IN_ROW_WIN) {
          return currentToken;
        }
      } else {
        maxNumInRow = 1;
      }
      lastToken = currentToken;
    }
  }

  return null;
};

const checkHorizontalWinner = (board: Board) => {
  for (let y = 0; y < board[0].length; y++) {
    let maxNumInRow = 1;
    let lastToken = board[0][y];
    for (let x = 1; x < board.length; x++) {
      const currentToken = board[x][y];
      if (currentToken === lastToken && currentToken !== null) {
        maxNumInRow++;
        if (maxNumInRow === NUM_IN_ROW_WIN) {
          return currentToken;
        }
      } else {
        maxNumInRow = 1;
      }
      lastToken = currentToken;
    }
  }

  return null;
};

const checkDiagonalWinner = (board: Board) => {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      const currentToken = board[x][y];

      if (
        currentToken !== null &&
        ((x < board.length - 3 &&
          y < board[x].length - 3 &&
          currentToken === board[x + 1][y + 1] &&
          currentToken === board[x + 2][y + 2] &&
          currentToken === board[x + 3][y + 3]) ||
          (x >= 3 &&
            currentToken === board[x - 1][y + 1] &&
            currentToken === board[x - 2][y + 2] &&
            currentToken === board[x - 3][y + 3]))
      ) {
        return currentToken;
      }
    }
  }

  return null;
};

export type BoardState = Array<Array<number | null>>;
export type GameState = {
  currentPlayer: PlayerColor;
  hasWinner: boolean;
  statusMessage: string;
  shouldReset?: boolean;
};
export type GameBoardProps = {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  shouldReset?: boolean;
  winStats: WinStats;
  setWinStats: (winStats: WinStats) => void;
};
export const DEFAULT_BOARD_STATE: BoardState = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];

export type WinStats = {
  redWins: number;
  yellowWins: number;
  draws: number;
};

export function deepClone(arr: BoardState): BoardState {
  return JSON.parse(JSON.stringify(arr));
}

export function checkForWinner(board: BoardState) {
  let hasEmptySpace = false;
  board.forEach(
    (row) => (hasEmptySpace = hasEmptySpace || row.findIndex((cell) => cell === null) >= 0)
  );
  if (!hasEmptySpace) {
    return 'draw';
  }
  return checkVerticalWinner(board) || checkHorizontalWinner(board) || checkDiagonalWinner(board);
}

export const loadWinStats = (): WinStats => {
  if (typeof window === 'undefined') {
    return { redWins: 0, yellowWins: 0, draws: 0 };
  }
  const winStats = window.localStorage.getItem('winStats');
  return winStats ? JSON.parse(winStats) : { redWins: 0, yellowWins: 0, draws: 0 };
};

export const saveWinStats = (winStats: WinStats) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem('winStats', JSON.stringify(winStats));
};
