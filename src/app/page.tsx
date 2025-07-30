'use client'

import Image from "next/image";
import styles from "./page.module.css";
import GameBoard, {DEFAULT_BOARD_STATE} from '@/components/GameBoard';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';
import {useState} from 'react';
// import { deepClone, checkForWinner } from "@/utils/connectFour";

export type GameState = {
  currentPlayer: PlayerColor;
  hasWinner: boolean;
  statusMessage: string;
}

const DEFAULT_GAME_STATE = {
  currentPlayer: PlayerColor.RED,
  hasWinner: false,
  statusMessage: "Player 1's turn",
};

export default function Home() {
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Connect Four</h1>
        <h2
          style={{
            alignItems: 'center',
            color: `${gameState.currentPlayer === PlayerColor.RED ? '#cc0000' : '#fdb300'}`,
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <PlayerToken player={gameState.currentPlayer} size={40} />&nbsp;{gameState.statusMessage}
        </h2>
        <div>
          <GameBoard
            newBoardState={DEFAULT_BOARD_STATE}
            gameState={gameState}
            setGameState={setGameState} />
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
