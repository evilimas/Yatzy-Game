import type { Timestamp } from "firebase/firestore/lite";

const dieValues = [1, 2, 3, 4, 5, 6] as const;
type Die = (typeof dieValues)[number];
// type Die = 1 | 2 | 3 | 4 | 5 | 6;
// const dieValues: ReadonlyArray<Die | null> = [1, 2, 3, 4, 5, 6] as const;

type DieFrequencyTable = {
  [K in Die]: number;
};

type YatzyCombination =
  | "aces"
  | "twos"
  | "threes"
  | "fours"
  | "fives"
  | "sixes"
  | "onePair"
  | "twoPairs"
  | "threeOfAKind"
  | "fourOfAKind"
  | "smallStraight"
  | "largeStraight"
  | "house"
  | "chance"
  | "yatzy";

type Scoreboard = {
  [K in YatzyCombination]?: number | null;
};

type ScoreboardCombination = YatzyCombination | "sum" | "bonus" | "total";

type CompleteScoreboard = {
  [K in ScoreboardCombination]?: number | null;
};

interface DiceAndTurn {
  dice: Die[];
  throwCountRemaining: number;
  holdDie: boolean[];
  activePlayer: number;
  players: number;
}

class DiceAndTurn2 implements DiceAndTurn {
  public dice: Die[];
  public throwCountRemaining: number;
  public holdDie: boolean[];
  public activePlayer: number;
  public players: number;

  constructor() {
    this.players = 1;
    this.activePlayer = 1;
    this.throwCountRemaining = 3;
    this.holdDie = new Array(5).fill(false);
    this.dice = [];
  }

  nextTurn(): void {
    const isLastPlayer = this.activePlayer < this.players;
    this.activePlayer = isLastPlayer ? 1 : this.activePlayer + 1;
    this.throwCountRemaining = 3;
    for (let i = 0; i < this.holdDie.length; i++) {
      this.holdDie[i] = false;
    }
    this.dice.length = 0;
  }
}

interface DieViewStateStyle {
  color: string;
  background: string;
}
interface DieViewState {
  value: Die;
  index: number;
  char: string;
  style: DieViewStateStyle;
}

interface Message {
  id: string;
  user: string;
  text: string;
  createdAt: Timestamp;
  displayName: string;
  profilePicture: string | null;
}

interface HighScore {
  id: string;
  user: string;
  displayName: string;
  profilePicture: string | null;
  score: string;
  date: Timestamp;
}
interface LocalHighScore {
  name: string;
  score: number;
  date: string;
}

interface GameRoomData {
  createdBy: { uid: string; displayName: string };
  players: { uid: string; displayName: string }[];
  scoreboards: Scoreboard[];
  dice: number[];
  activePlayer: { uid: string; displayName: string };
  status: string;
  createdAt: Timestamp;
}

export { dieValues };
export type {
  Die,
  DieFrequencyTable,
  YatzyCombination,
  Scoreboard,
  DiceAndTurn,
  DieViewState,
  DieViewStateStyle,
  ScoreboardCombination,
  CompleteScoreboard,
  Message,
  HighScore,
  LocalHighScore,
  GameRoomData,
};
