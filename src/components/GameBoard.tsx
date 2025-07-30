"use client"

import React, {useEffect, useState} from 'react';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';
import DropButton from '@/components/DropButton';
import {GameState} from '@/app/page';

type BoardState = Array<Array<number | null>>;

type GameBoardProps = {
  newBoardState: BoardState;
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

export const DEFAULT_BOARD_STATE: BoardState = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
]

const GameBoard = ({newBoardState, gameState}: GameBoardProps) => {
  const [board, setBoard] = useState<BoardState>(newBoardState);

  useEffect(() => {
    setBoard(newBoardState);
  }, [newBoardState]);

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

  const handleClick = (columnNumber: number) => {
    console.log(columnNumber);
  }

  return (
    <div>
        <div style={{
          display: 'grid',
          gap: '5px',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: '60px',
          height: '60px',
          padding: '0 5px',
          width: '650px',
        }} >
        {[0, 1, 2, 3, 4, 5].map((col) => (
          <DropButton
            key={col}
            onClick={handleClick}
            currentPlayer={gameState.currentPlayer}
            columnNumber={col} />
        ))}
      </div>
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
    </div>
  )
}

export default GameBoard;
