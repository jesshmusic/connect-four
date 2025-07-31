"use client"

import React, {useEffect, useState} from 'react';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';
import DropButton from '@/components/DropButton';
import {
  BoardState,
  checkForWinner,
  deepClone,
  DEFAULT_BOARD_STATE,
  GameBoardProps, saveWinStats
} from '@/utils/connectFour';

const GameBoard = ({
  gameState,
  setGameState,
  setWinStats,
  winStats
}: GameBoardProps) => {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD_STATE);
  const [dropAudio, setDropAudio] = useState<HTMLAudioElement | null>(null);
  const [winAudio, setWinAudio] = useState<HTMLAudioElement | null>(null);
  const [drawAudio, setDrawAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDropAudio(new Audio('/sounds/drop.mp3'));
      setWinAudio(new Audio('/sounds/win.mp3'));
      setDrawAudio(new Audio('/sounds/draw.mp3'));
    }
  }, []);

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
    if (dropAudio) {
      dropAudio.currentTime = 0;
      dropAudio.play().catch((e) => console.warn("Audio playback failed", e));
    }
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
      const newWinStats = {
        redWins: winStats.redWins + (winner === 1 ? 1 : 0),
        yellowWins: winStats.yellowWins + (winner === 2 ? 1 : 0),
        draws: winStats.draws + (winner === 'draw' ? 1 : 0),
      }
      setWinStats(newWinStats);
      saveWinStats(newWinStats);
      if (winner === 'draw') {
        if (drawAudio) {
          drawAudio.currentTime = 0;
          drawAudio.play().catch((e) => console.warn("Audio playback failed", e));
        }
      } else {
        if (winAudio) {
          winAudio.currentTime = 0;
          winAudio.play().catch((e) => console.warn("Audio playback failed", e));
        }
      }

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
          gridTemplateColumns: 'repeat(6, 1fr)',
          width: '100%',
          maxWidth: '90vw',
          gap: '5px',
          margin: '0 auto',
          height: '10vh',
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
        width: '100%',
        maxWidth: '90vw',
        aspectRatio: '6 / 7',
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
                {cellState && <PlayerToken player={cellState} size={'100%'} />}
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
