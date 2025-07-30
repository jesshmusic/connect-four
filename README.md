# Connect Four (Next.js + TypeScript)

![React](https://img.shields.io/badge/framework-React-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/framework-Next.js-black?logo=next.js)
![Game](https://img.shields.io/badge/project-Connect4-green)

A modern Connect Four game built with **Next.js**, **React 19**, and **TypeScript** using the App Router and React Server Components. Includes keyboard and mouse interaction, sound effects for gameplay, and clear modular organization.

---

## 🎮 Features

- Interactive 7x6 Connect Four board
- Keyboard and click-based token drop
- Sound effects on drop, win, and draw
- State and logic handled in a single file
- LocalStorage win tracking
- Fully typed with TypeScript

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # App layout wrapper
│   ├── page.tsx                # Main game component with all logic
│   └── globals.css             # Tailwind and global styles
│
├── components/
│   ├── GameBoard.tsx           # Renders the Connect Four grid UI
│   ├── DropButton.tsx          # Drop button component per column
│   └── PlayerToken.tsx         # SVG-rendered token
│
├── utils/
│   └── connectFour.ts          # Game rules, types, win tracking, and logic helpers
```

---

## ⚙️ Core Logic Overview

### `page.tsx`
- Manages `board`, `currentPlayer`, `winner`, and `statusMessage`
- Contains `handleDrop(col)` to process token drops
- Calls `checkForWinner()` from `connectFour.ts`

### `GameBoard.tsx`
- Displays a 7x6 grid of tokens
- Receives game state and triggers drops via `onDrop`

### `DropButton.tsx`
- A small button shown above each column
- Triggers sound and `onDrop()` when clicked

### `PlayerToken.tsx`
- Renders a red or yellow circle representing a player

---

## 🔧 `connectFour.ts` Details

Defines game logic, types, and win-stat helpers.

### ➕ Types
- `BoardState`, `GameState`, `WinStats`, `GameBoardProps`

### 🧩 Game Logic
- `checkVerticalWinner(board)`
- `checkHorizontalWinner(board)`
- `checkDiagonalWinner(board)`
- `checkForWinner(board)` — returns a winner token or `"draw"`

### ♻️ Utility
- `deepClone(board)` — returns a deep copy
- `DEFAULT_BOARD_STATE` — 7x6 `null` grid

### 🧮 Win Tracking
- `loadWinStats()` — loads from localStorage
- `saveWinStats(stats)` — saves to localStorage

---

## 🔊 Sounds

All sounds are stored under `public/sounds/`:

- `drop.mp3` – on token drop
- `win.mp3` – when a player wins
- `draw.mp3` – when the game ends in a tie

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Start the development server

```bash
yarn dev
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Running Tests

```bash
yarn test
```

Test file:
```
src/app/__tests__/page.test.tsx
```

---

## 📄 License

MIT
