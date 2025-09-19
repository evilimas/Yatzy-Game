import { dieValues } from "./types";
import type { Die, DieFrequencyTable, Scoreboard } from "./types";

const compose =
  (...fns: Function[]) =>
  (...args: any[]) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

const uiLabels = {
  aces: "Enere",
  twos: "Toere",
  threes: "Treere",
  fours: "Firere",
  fives: "Femmere",
  sixes: "Seksere",
  onePair: "Ett par ••",
  twoPairs: "To par ",
  threeOfAKind: "Tre like ∴",
  fourOfAKind: "Fire like ····",
  smallStraight: "Liten Straight",
  largeStraight: "Stor Straight",
  house: "Hus 🏠︎",
  chance: "Sjanse",
  yatzy: "Yatzy",
} as const;

const countOne = (table: DieFrequencyTable, number: Die): DieFrequencyTable => ({
  ...table,
  [number]: table[number] + 1,
});

const createFrequencyTable = (numbers: Die[]) =>
  numbers.reduce(countOne, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });

const nOfAKind =
  (numberOfAKind: number) =>
  (dice: Die[]): number => {
    const frequencyTable: DieFrequencyTable = createFrequencyTable(dice);
    const reduceOne = (points: number, dieValue: Die) =>
      frequencyTable[dieValue] >= numberOfAKind ? dieValue * numberOfAKind : points;
    return dieValues.reduce(reduceOne, 0);
  };

const positiveToFixedNumber = (fixedNumber: number) => (n: number) => n > 0 ? fixedNumber : 0;
const pointsSum = (dice: Die[]) => dice.reduce((sum: number, die: Die) => sum + die, 0);

const pointsStraight =
  (skipDie: Die, points: number) =>
  (dice: Die[]): number => {
    const frequencyTable: DieFrequencyTable = createFrequencyTable(dice);
    const hasStraight = dieValues
      .filter((die) => die != skipDie)
      .every((die) => frequencyTable[die] === 1);
    return hasStraight ? points : 0;
  };

const pointsHouse = (dice: Die[]): number => {
  const frequencyTable: DieFrequencyTable = createFrequencyTable(dice);
  const dieCounts = Object.values(frequencyTable);
  return dieCounts.includes(3) && dieCounts.includes(2) ? pointsSum(dice) : 0;
};

const pointsTwoPairs = (dice: Die[]): number => {
  const frequencyTable = createFrequencyTable(dice);
  const diceWithPairs = dieValues.filter((die) => frequencyTable[die] >= 2);
  if (diceWithPairs.length < 2) return 0;
  return pointsSum(diceWithPairs.slice(-2)) * 2;
};

const pointsUpperSection =
  (dieValue: Die) =>
  (dice: Die[]): number => {
    const frequencyTable = createFrequencyTable(dice);
    return frequencyTable[dieValue] * dieValue;
  };

const scoreFunctions = {
  aces: pointsUpperSection(1),
  twos: pointsUpperSection(2),
  threes: pointsUpperSection(3),
  fours: pointsUpperSection(4),
  fives: pointsUpperSection(5),
  sixes: pointsUpperSection(6),
  onePair: nOfAKind(2),
  twoPairs: pointsTwoPairs,
  threeOfAKind: nOfAKind(3),
  fourOfAKind: nOfAKind(4),
  smallStraight: pointsStraight(6, 15),
  largeStraight: pointsStraight(1, 20),
  house: pointsHouse,
  chance: pointsSum,
  yatzy: compose(positiveToFixedNumber(50), nOfAKind(5)),
} as const;

const scoreboardFunctions = {
  sum: (board: Scoreboard): number => {
    return (
      (board.aces ?? 0) +
      (board.twos ?? 0) +
      (board.threes ?? 0) +
      (board.fours ?? 0) +
      (board.fives ?? 0) +
      (board.sixes ?? 0)
    );
  },

  bonus: (board: Scoreboard): number => {
    return scoreboardFunctions.sum(board) >= 63 ? 50 : 0;
  },

  total: (board: Scoreboard): number => {
    const allScores = Object.values(board).map((n) => n ?? 0);
    return allScores.reduce((a, b) => a + b, 0) + scoreboardFunctions.bonus(board);
  },
};

const emptyScoreboard = (): Scoreboard => ({
  aces: null,
  twos: null,
  threes: null,
  fours: null,
  fives: null,
  sixes: null,
  onePair: null,
  twoPairs: null,
  threeOfAKind: null,
  fourOfAKind: null,
  smallStraight: null,
  largeStraight: null,
  house: null,
  chance: null,
  yatzy: null,
});

export { scoreFunctions, scoreboardFunctions, emptyScoreboard, uiLabels, createFrequencyTable };

export {
  compose,
  pointsSum,
  pointsHouse,
  pointsTwoPairs,
  pointsStraight,
  positiveToFixedNumber,
  nOfAKind,
  pointsUpperSection,
};
