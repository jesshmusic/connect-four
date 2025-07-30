"use client"

import React, {useEffect, useState} from 'react';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';

type BoardState = Array<Array<number | null>>;

type GameBoardProps = {
  newGameState: BoardState;
}

export const DEFAULT_BOARD_STATE: BoardState = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, 1, null, 2, null, 1],
  [1, 2, 1, 1, 2, 2]
]

const GameBoard = ({newGameState}: GameBoardProps) => {
  const [board, setBoard] = useState<BoardState>(newGameState);

  useEffect(() => {
    setBoard(newGameState);
  }, [newGameState]);

  const getCellState = (cellValue: number | null): PlayerColor | null => {
    switch (cellValue) {
      case 1:
        return PlayerColor.RED;
      case 2:
        return PlayerColor.YELLOW;
      default:
        return null;
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gridTemplateRows: 'repeat(7, 1fr)',
      gap: '5px',
      border: '5px solid white',
      width: '650px',
      height: '750px'
    }} >
      {board.map((row, rowIndex) => (
        row.map((cell, cellIndex) => {
          const cellState = getCellState(cell);
          return (
            <div key={`${rowIndex}-${cellIndex}`} style={{
              border: '1px solid #555555',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {cellState && <PlayerToken player={cellState} />}
            </div>
          )
          }
        )
      ))}
    </div>
  )
}

export default GameBoard;
