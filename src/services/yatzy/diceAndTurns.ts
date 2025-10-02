// import type { DiceAndTurn } from "./types";

// const createNewDiceAndTurn = (diceAndTurn?: DiceAndTurn): DiceAndTurn => {
//   if (!diceAndTurn) {
//     return {
//       players: 1,
//       activePlayer: 1,
//       throwCountRemaining: 3,
//       holdDie: new Array(5).fill(false),
//       dice: [],
//     } as DiceAndTurn;
//   }
//   const isLastPlayer = diceAndTurn.activePlayer < diceAndTurn.players;
//   return {
//     players: diceAndTurn.players,
//     activePlayer: isLastPlayer ? 1 : diceAndTurn.activePlayer + 1,
//     throwCountRemaining: 3,
//     holdDie: new Array(5).fill(false),
//     dice: [],
//   } as DiceAndTurn;
// };

// export { createNewDiceAndTurn };
