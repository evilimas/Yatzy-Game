<script setup lang="ts">
import { ref, watch } from "vue";
import Scoreboard from "@/components/ScoreboardSP.vue";
import Dice from "@/components/DiceSP.vue";
import Player from "@/components/PlayerComponent.vue";
import WinnerModal from "@/components/WinnerModal.vue";
import HighScore from "@/components/HighScore.vue";
import LiveChat from "@/components/LiveChat.vue";
import UsersComponent from "@/components/UsersComponent.vue";
import ConfettiExplosion from "vue-confetti-explosion";
import { yatzyStore } from "../stores/yatzyStore";
import { useFirebaseStore } from "@/stores/firebaseStore";

const showWinnerModal = ref<boolean>(false);
const store = yatzyStore();
const firebaseStore = useFirebaseStore();

watch(
  () => store.isGameFinished,
  (isFinished) => {
    if (isFinished) {
      showWinnerModal.value = true;
    }
  }
);

const handleCloseModal = (): void => {
  showWinnerModal.value = false;
};
const handleNewGame = (): void => {
  store.resetGame();
  showWinnerModal.value = false;
};
const handlePlayerUpdate = (players: string): void => {
  if (players === "increase") {
    store.players++;
  } else if (players === "decrease" && store.players > 1) {
    store.players--;
  }
};
const handleStartGame = (): void => {
  store.gameStarted = true;
};
const handlePlaceScore = (score: string | null): void => {
  if (score) {
    store.nextTurn(score);
  }
};
const handleRestartGame = (): void => {
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
  <div class="high-scores">
    <HighScore
      :isGameFinished="store.isGameFinished"
      :scores="store.scores"
      :onlineScores="firebaseStore.highScores"
      :display-date="firebaseStore.displayDate"
    />
  </div>
  <div class="live-chat">
    <LiveChat
      :messages="firebaseStore.messages"
      @post-message="firebaseStore.postMessage"
      @delete-msg="firebaseStore.deleteMessage"
      @edit-msg="firebaseStore.editMessage"
      :display-date="firebaseStore.displayDate"
    />
  </div>
  <div class="users">
    <UsersComponent :users="firebaseStore.onlineUsers" />
  </div>
</template>

<style scoped>
#game {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}
h1 {
  text-decoration: underline;
}
.high-scores {
  position: fixed;
  bottom: 5px;
  right: 5px;
  width: auto;
  max-height: 400px;
  overflow-y: auto;
  background-color: #239ba7;
  border-radius: 10px;
  padding: 3px;
}
.live-chat {
  position: fixed;
  top: 60px;
  right: 10px;
  width: auto;
  max-height: 400px;
  overflow-y: auto;
  background-color: #239ba7;
  border-radius: 10px;
  padding: 3px;
}

.users {
  position: fixed;
  top: 60px;
  left: 10px;
}
h1 {
  color: #239ba7;
  font-weight: 600;
  font-size: 2rem;
}

@media (min-width: 1000px) {
  #game {
    align-items: center;
    margin-top: 150px;
  }
  /* .users {
  } */
}
</style>
