import { ref, computed, reactive, watch } from "vue";
import { defineStore } from "pinia";
import { scoreFunctions, scoreboardFunctions, emptyScoreboard } from "../yatzyLogic";
import type { Die, YatzyCombination, Scoreboard } from "../yatzyLogic";

export const yatzyStore = defineStore("scoreBoard", () => {
  const players = ref<number>(1);
  const gameStarted = ref<boolean>(false);
  const activePlayer = ref<number>(1);

  const nextTurn = (combination: string) => {
    placeScore(combination);

    if (activePlayer.value < players.value) {
      activePlayer.value++;
    } else {
      activePlayer.value = 1;
    }
    throwCount.value = 3;
    holdDie.value = new Array(5).fill(false);
    dice.value = [null, null, null, null, null];
  };

  const placeScore = (combination: string) => {
    if (gameStarted.value && throwCount.value <= 2) {
      let combo = combination as YatzyCombination;
      scoreBoards[activePlayer.value - 1][combo] = scoreFunctions[combo](
        dice.value.filter((d): d is Die => d !== null)
      );
    }
  };

  const allBoardScores = computed(() => {
    return scoreBoards.map((scoreBoard) => ({
      sum: scoreboardFunctions.sum(scoreBoard),
      bonus: scoreboardFunctions.bonus(scoreBoard),
      total: scoreboardFunctions.totalSum(scoreBoard),
    }));
  });

  const scoreBoards = reactive<Scoreboard[]>(
    Array.from({ length: Math.min(players.value, 4) }, emptyScoreboard)
  );

  watch(players, (newVal) => {
    scoreBoards.splice(
      0,
      scoreBoards.length,
      ...Array.from({ length: Math.min(newVal, 4) }, emptyScoreboard)
    );
  });

  const isGameFinished = computed(() => {
    return scoreBoards.every((board) => Object.values(board).every((score) => score !== null));
  });

  const winner = () => {
    const scores = allBoardScores.value;
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

  //   Dice store

  const diceChars = "⚀⚁⚂⚃⚄⚅";
  const dice = ref<(Die | null)[]>([null, null, null, null, null]);
  const holdDie = ref<boolean[]>(new Array(5).fill(false));
  const dieColor = ref<string[]>(["black", "black", "black", "black", "black"]);
  const throwCount = ref(3);
  const throwDice = () => {
    for (let i = 0; i < dice.value.length; i++) {
      if (holdDie.value[i]) {
        continue;
      }
      dice.value[i] = Math.floor(Math.random() * 6 + 1) as Die;
    }
    throwCount.value--;
  };

  const dieStyle = (index: number) => {
    const isSelected = holdDie.value[index];
    return {
      background: isSelected ? "lightblue" : "black",
      color: isSelected ? "black" : "white",
    };
  };

  const flip = (index: number) => {
    holdDie.value[index] = !holdDie.value[index];
  };

  const diceObjects = computed(() =>
    dice.value.map((die: Die | null, index: number) => ({
      value: die,
      index: index,
      char: die ? diceChars[die - 1] : "",
      style: dieStyle(index),
    }))
  );

  const resetGame = () => {
    scoreBoards.splice(
      0,
      scoreBoards.length,
      ...Array.from({ length: Math.min(players.value, 4) }, emptyScoreboard)
    );
    activePlayer.value = 1;
    throwCount.value = 3;
    holdDie.value = new Array(5).fill(false);
    dice.value = [null, null, null, null, null];
    gameStarted.value = false;
  };

  return {
    resetGame,
    isGameFinished,
    winner,
    gameStarted,
    players,
    nextTurn,
    scoreBoards,
    activePlayer,
    placeScore,
    allBoardScores,
    // Dice store
    dieColor,
    holdDie,
    dice,
    diceChars,
    throwCount,
    throwDice,
    flip,
    dieStyle,
    diceObjects,
  };
});
