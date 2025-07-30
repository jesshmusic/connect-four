"use client"

import React, {useEffect, useState} from 'react';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';
import DropButton from '@/components/DropButton';
import {
  BoardState,
  checkForWinner,
  deepClone,
  DEFAULT_BOARD_STATE,
  GameBoardProps
} from '@/utils/connectFour';

const GameBoard = ({gameState, setGameState}: GameBoardProps) => {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD_STATE);

  useEffect(() => {
    if (gameState.shouldReset === true) {
      setBoard(deepClone(DEFAULT_BOARD_STATE));
      setGameState({
        ...gameState,
        shouldReset: false,
        }
      )
    }
  }, [gameState]);

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
    const newBoard = board.map((row) => [...row]) as BoardState;
    let tokenDropped = false;
    for (let row = board.length - 1; row >= 0; row--) {
      if (newBoard[row][columnNumber] === null) {
        newBoard[row][columnNumber] = gameState.currentPlayer === PlayerColor.RED ? 1 : 2;
        tokenDropped = true;
        break;
      }
    }

    if (!tokenDropped) {
      return;
    }

    setBoard(newBoard);

    const winner = checkForWinner(newBoard);
    if (winner) {
      setGameState({
        currentPlayer: gameState.currentPlayer,
        hasWinner: winner !== 'draw',
        statusMessage: winner === 'draw' ? 'Draw!' : `${gameState.currentPlayer.toUpperCase()} wins!`,
      });
    } else {
      const nextPlayer = gameState.currentPlayer === PlayerColor.RED ?
        PlayerColor.YELLOW :
        PlayerColor.RED;
      setGameState({
        currentPlayer: nextPlayer,
        hasWinner: false,
        statusMessage: `${nextPlayer.toUpperCase()}'s turn`,
      });
    }
  }

  return (
    <div>
      {(!gameState.hasWinner && gameState.statusMessage !== 'Draw!') && (
        <div style={{
          display: 'grid',
          gap: '5px',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: '60px',
          height: '80px',
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
      )}
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
