<script setup lang="ts">
import { ref, watch } from "vue";
import Scoreboard from "@/components/Scoreboard.vue";
import Dice from "@/components/Dice.vue";
import Player from "@/components/Player.vue";
import WinnerModal from "@/components/WinnerModal.vue";
import { yatzyStore } from "../stores/yatzyStore";
import ConfettiExplosion from "vue-confetti-explosion";

const showWinnerModal = ref(false);
const store = yatzyStore();

watch(
  () => store.isGameFinished,
  (isFinished) => {
    if (isFinished) {
      showWinnerModal.value = true;
    }
  }
);
const handleCloseModal = () => {
  showWinnerModal.value = false;
};
const handleNewGame = () => {
  store.resetGame();
  showWinnerModal.value = false;
};
const handlePlayerUpdate = (players: string) => {
  if (players === "increase") {
    store.players++;
  } else if (players === "decrease" && store.players > 1) {
    store.players--;
  }
};
const handleStartGame = () => {
  store.gameStarted = true;
};
const handlePlaceScore = (score: string | null) => {
  if (score) {
    store.nextTurn(score);
  }
};
const handleRestartGame = () => {
  store.resetGame();
  store.gameStarted = false;
};
</script>

<template>
  <div id="game">
    <h1 class="green">Det beste Yatzy-spillet!</h1>
    <ConfettiExplosion
      v-if="showWinnerModal"
      :duration="8000"
      :particleCount="800"
      :colors="['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']"
    />
    <div>
      <Player
        :players="store.players"
        :gameStarted="store.gameStarted"
        @player="handlePlayerUpdate"
        @startGame="handleStartGame"
        @reStartGame="handleRestartGame"
      />
    </div>
    <div>
      <Dice
        :activePlayer="store.activePlayer"
        :gameStarted="store.gameStarted"
        :throwCount="store.throwCount"
        :diceObjects="store.diceObjects"
        @throwDice="store.throwDice"
        @flip="store.flip"
      />
    </div>
    <div>
      <Scoreboard
        :activePlayer="store.activePlayer"
        :players="store.players"
        :complete-scoreboards="store.completeScoreboards"
        @placeScore="handlePlaceScore"
      />
    </div>
    <WinnerModal
      :is-visible="showWinnerModal"
      :winner-text="store.winner()"
      @close="handleCloseModal"
      @new-game="handleNewGame"
    />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

#game {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  text-decoration: underline;
}
</style>
