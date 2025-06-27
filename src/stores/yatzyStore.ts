import { ref, computed, reactive, watch } from "vue";
import { defineStore } from "pinia";
import { createNewDiceAndTurn } from "../services/yatzy/diceAndTurns";
import { scoreFunctions, scoreboardFunctions, emptyScoreboard } from "../services/yatzy/scoreboard";
import type {
  Die, YatzyCombination, Scoreboard, DiceAndTurn,
  DieViewStateStyle, DieViewState,
  ScoreboardCombination, CompleteScoreboard
} from "@/services/yatzy/types";

export const yatzyStore = defineStore("scoreBoard", () => {
  // hjelpefunksjoner
  const createEmptyScoreboards = (count: number) =>
    Array.from({ length: Math.min(count, 4) }, emptyScoreboard);

  const setupScoreboardsFromPlayerCount = (playerCount: number) => {
    scoreboards.length = 0;
    scoreboards.push(...createEmptyScoreboards(playerCount));
  };
  const createEmptyDice = Array.from({ length: 5 }, () => null);

  // reactive state
  const players = ref<number>(1);
  const gameStarted = ref<boolean>(false);
  const activePlayer = ref<number>(1);
  const diceChars = "⚀⚁⚂⚃⚄⚅";
  const dice = ref<(Die | null)[]>(createEmptyDice);
  const holdDie = ref<boolean[]>(new Array(5).fill(false));
  const dieColor = ref<string[]>(["black", "black", "black", "black", "black"]);
  const throwCountRemaining = ref(3);
  const scoreboards = reactive<Scoreboard[]>(createEmptyScoreboards(players.value));
  // const diceAndTurn = reactive<DiceAndTurn>(createNewDiceAndTurn())
  // const diceAndTurn2 = reactive<DiceAndTurn>(new DiceAndTurn2());

  // watch
  watch(players, setupScoreboardsFromPlayerCount);

  // action
  const nextTurn = (combination: string) => {
    if (!dice.value || dice.value.some((die) => die === null)) return;
    placeScore(combination);
    const isLastPlayer = activePlayer.value >= players.value;
    activePlayer.value = isLastPlayer ? 1 : activePlayer.value + 1;
    throwCountRemaining.value = 3;
    holdDie.value = new Array(5).fill(false);
    dice.value = createEmptyDice;
    // createNewDiceAndTurn
  };

  // action
  const placeScore = (combination: string) => {
    let combo = combination as YatzyCombination;
    const playerIndex = activePlayer.value - 1;
    if (!gameStarted.value || throwCountRemaining.value == 3) return;
    const scoreboard = scoreboards[playerIndex];
    const scoreFunction = scoreFunctions[combo];
    scoreboard[combo] = scoreFunction(dice.value as Die[]);
    // scoreboard[combo] = scoreFunction(dice.value.filter((d): d is Die => d !== null));
  };

  // action

  // const throwDice = () => {
  // dice.value ? [...dice.value] : (dice.value = new Array(5).fill(0) as Die[]);
  // for (let i = 0; i < dice.value.length; i++) {
  //   if (holdDie.value[i]) continue;
  //   dice.value[i] = Math.floor(Math.random() * 6 + 1) as Die;
  // }
  // throwCountRemaining.value--;
  // };
  const throwDice = () => {
    dice.value = dice.value.map((die, index) =>
      holdDie.value[index] ? die : (Math.floor(Math.random() * 6 + 1) as Die)
    );
    throwCountRemaining.value--;
  };

  // action
  const flip = (index: number) => {
    holdDie.value[index] = !holdDie.value[index];
  };

  // action
  const resetGame = () => {
    setupScoreboardsFromPlayerCount(players.value);
    activePlayer.value = 1;
    throwCountRemaining.value = 3;
    holdDie.value = new Array(5).fill(false);
    dice.value = createEmptyDice;
    gameStarted.value = false;
  };

  // computed
  const completeScoreboards = computed(() =>
    scoreboards.map((sb) => {
      const completeScoreboard: CompleteScoreboard = { ...sb };
      completeScoreboard.sum = scoreboardFunctions.sum(sb);
      completeScoreboard.bonus = scoreboardFunctions.bonus(sb);
      completeScoreboard.total = scoreboardFunctions.total(sb);
      return completeScoreboard;
    }));

  // computed
  const isGameFinished = computed(() => {
    return scoreboards.every((board) => Object.values(board).every((score) => score !== null));
  });

  // computed
  const diceObjects = computed(() =>
    dice.value.map((die: Die | null, index: number) => ({
      value: die,
      index: index,
      char: die ? diceChars[die - 1] : "",
      style: dieStyle(index),
    }))
  );

  // viewstate funksjon
  const winner = () => {
    const scores = completeScoreboards.value;
    // const boards = [...scores];
    // boards.sort((a, b) => b.total - a.total);
    // const winner = boards[0];
    const maxScore = Math.max(...scores.map((score) => score.total));
    const winners = scores
      .map((score, index) => ({ player: index + 1, score: score.total }))
      .filter((score) => score.score === maxScore);

    return winners.length > 1
      ? `Det er uavgjort mellom spillerne ${winners
        .map((winner) => winner.player)
        .join(", ")} med en poengsum på ${maxScore}`
      : `Spiller ${winners[0].player} vinner med ${maxScore} poeng`;
  };

  // viewstate funksjon
  const dieStyle = (index: number): DieViewStateStyle => {
    const isSelected = holdDie.value[index];
    return {
      background: isSelected ? "lightblue" : "black",
      color: isSelected ? "black" : "white",
    };
  };

  return {
    isGameFinished,
    gameStarted,
    players,
    activePlayer,
    completeScoreboards,
    dieColor,
    holdDie,
    dice,
    diceChars,
    throwCount: throwCountRemaining,
    diceObjects,
    dieStyle,
    flip,
    nextTurn,
    placeScore,
    resetGame,
    throwDice,
    winner,
  };
});
