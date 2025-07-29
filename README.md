## Objective

Create a 2-player game of Connect Four with TypeScript and React.

## Prompt

Create a two-player game of [Connect Four](https://en.wikipedia.org/wiki/Connect_Four)

![](https://wookie.codesubmit.io/static/challenges/connect-four/connect-four.png)

### Requirements

- The board should be 7 wide by 6 high
- It should alternate between the 'red' and 'yellow' players turn
- Clicking the "Drop" button should drop a token of the current player's to the bottom-most free position
- Clicking the "Drop" button on a full column should have no effect
- If either player gets four in a row (horizontally, vertically, or diagonally):
  - The "COLOR's turn" heading should be replaced by "COLOR won!"
  - The "Drop" buttons should be replaced by a "Play again" button
- If the board is full and there is no winner:
  - The "COLOR's turn" heading should be replaced by "Draw!"
  - The "Drop" buttons should be replaced by a "Play again" button

### Important

- Checking the win condition is outside the scope of this question. We have provided a [utility to check whether there is a winner or draw](./src/utils/connectFour.ts). Example usage:

```js
// Board must be a 2D array filled with `null` for empty space
// and primitive values representing player tokens (numbers, strings)
// e.g. 1 or 2, 'red' or 'yellow', 'player 1' or 'player 2'
//
// returns `null` for no winner, 'draw' for draw, or the value of the winning token
const exampleBoard = [
  [1, 2, null, null, null, null],
  [1, 1, 1, 1, null, null], // player `1` has 4 in a row
  [2, null, null, null, null, null],
  [2, null, null, null, null, null],
  [2, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
];

const winner = checkForWinner(exampleBoard);
console.log(winner); // 1
```

## Hints and challenges

See the HINTS.md file if you get stuck and the CHALLENGES.md file if you've finished with extra time and would like to show off your skills!

### Evaluation Criteria

- **TypeScript** best practices
- Show us your work through your commit history
- We're looking for you to produce working code, with enough room to demonstrate how to structure components in a small program
- Completeness: Did you complete the features?
- Correctness: Does the functionality act in sensible, thought-out ways?
- Maintainability: Is it written in a clean, maintainable way?
- Testing: Is the system adequately tested?

### CodeSubmit

Please organize, design, test, and document your code as if it were going into production - then push your changes to the master branch. After you have pushed your code, you may submit the assignment on the assignment page.

All the best and happy coding,

The Reserv Team

### Getting Started
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Testing

```console
npm test
```

More info on react-testing-library: https://testing-library.com/docs/react-testing-library/cheatsheet
