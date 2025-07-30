'use client'

import Image from "next/image";
import styles from "./page.module.css";
import GameBoard from '@/components/GameBoard';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';
import {useState} from 'react';
import {GameState, loadWinStats, WinStats} from '@/utils/connectFour';

const DEFAULT_GAME_STATE = {
  currentPlayer: PlayerColor.RED,
  hasWinner: false,
  statusMessage: "RED's turn",
  shouldReset: false,
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [winStats, setWinStats] = useState<WinStats>(loadWinStats());

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Connect Four</h1>
        <div style={{ color: '#fcc'}}>
          <p><strong style={{fontSize: '18px', textDecoration: 'underline'}}>Stats:</strong></p>
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
          }}
        >
          <PlayerToken player={gameState.currentPlayer} size={40} />&nbsp;{gameState.statusMessage}
        </h3>
        {
          (gameState.hasWinner || gameState.statusMessage === 'Draw!') && (<p>
            <button
              onClick={() => setGameState({
                ...DEFAULT_GAME_STATE,
                shouldReset: true,
              })}
              style={{
                border: '2px solid #cc0000',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '20px',
                height: '50px',
                textAlign: 'center',
                width: '100px',
              }}
            >
              Reset
            </button>
          </p>)
        }
        <div>
          <GameBoard
            gameState={gameState}
            setGameState={setGameState}
            winStats={winStats}
            setWinStats={setWinStats}
          />
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://www.existentialmusic.com/portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/Token.svg"
            alt="Token icon"
            width={50}
            height={50}
          />
          &copy; 2025 Jess Hendricks
        </a>
      </footer>
    </div>
  );
}
