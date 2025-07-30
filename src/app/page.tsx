'use client'

import Image from "next/image";
import styles from "./page.module.css";
import GameBoard from '@/components/GameBoard';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';
import {useEffect, useState} from 'react';
import {GameState, loadWinStats, WinStats} from '@/utils/connectFour';

const DEFAULT_GAME_STATE = {
  currentPlayer: PlayerColor.RED,
  hasWinner: false,
  statusMessage: "RED's turn",
  shouldReset: false,
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [winStats, setWinStats] = useState<WinStats>({
    redWins: 0,
    yellowWins: 0,
    draws: 0
  });

  useEffect(() => {
    setWinStats(loadWinStats());
  }, []);

  return (
    <div
      className={styles.page}
      style={{
        width: '100%',
        minHeight: '100svh',
        padding: '1rem',
        boxSizing: 'border-box',
        backgroundColor: 'black',
        color: '#ededed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <main
        className={styles.main}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          width: '100%',
          maxWidth: 'min(90vw, 700px)',
        }}
      >
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>Connect Four</h1>

        <div style={{ textAlign: 'center', color: '#fcc' }}>
          <p><strong style={{ fontSize: '1.1rem', textDecoration: 'underline' }}>Stats:</strong></p>
          <p>Red: {winStats.redWins}</p>
          <p>Yellow: {winStats.yellowWins}</p>
          <p>Draws: {winStats.draws}</p>
        </div>

        <h3
          style={{
            alignItems: 'center',
            color: `${gameState.currentPlayer === PlayerColor.RED ? '#cc0000' : '#fdb300'}`,
            display: 'flex',
            flexDirection: 'row',
            fontSize: '1.2rem',
            gap: '0.5rem',
            justifyContent: 'center'
          }}
        >
          <PlayerToken player={gameState.currentPlayer} size={40} />
          {gameState.statusMessage}
        </h3>

        {(gameState.hasWinner || gameState.statusMessage === 'Draw!') && (
          <button
            onClick={() =>
              setGameState({
                ...DEFAULT_GAME_STATE,
                shouldReset: true,
              })
            }
            style={{
              border: '2px solid #cc0000',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              height: '50px',
              textAlign: 'center',
              width: '100px',
              background: 'transparent',
              color: 'white',
            }}
          >
            Reset
          </button>
        )}

        <div style={{ width: '100%' }}>
          <GameBoard
            gameState={gameState}
            setGameState={setGameState}
            winStats={winStats}
            setWinStats={setWinStats}
          />
        </div>
      </main>

      <footer
        className={styles.footer}
        style={{
          marginTop: 'auto',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '0.9rem',
        }}
      >
        <a
          href="https://www.existentialmusic.com/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#ededed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Image
            aria-hidden
            src="/Token.svg"
            alt="Token icon"
            width={30}
            height={30}
          />
          &copy; 2025 Jess Hendricks
        </a>
      </footer>
    </div>
  );

}
