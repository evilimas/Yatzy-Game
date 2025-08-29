<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Scoreboard from "@/components/Scoreboard.vue";
import Dice from "@/components/Dice.vue";
import Player from "@/components/Player.vue";
import WinnerModal from "@/components/WinnerModal.vue";
import HighScore from "@/components/HighScore.vue";
import LiveChat from "@/components/LiveChat.vue";
import Users from "@/components/Users.vue";
import { yatzyStore } from "../stores/yatzyStore";
import { useFirebaseStore } from "@/stores/firebaseStore";
import ConfettiExplosion from "vue-confetti-explosion";

const router = useRouter();
const showWinnerModal = ref(false);
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
  <nav class="navbar">
    <button @click="router.push('/home')">Tilbake</button>
  </nav>
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
    <HighScore :isGameFinished="store.isGameFinished" />
  </div>
  <div class="live-chat">
    <LiveChat
      :messages="firebaseStore.messages"
      @post-message="firebaseStore.postMessage"
      @delete-msg="firebaseStore.deleteMessage"
      @edit-msg="firebaseStore.editMessage"
      @display-date="firebaseStore.displayDate"
    />
  </div>
  <div class="users">
    <Users :users="firebaseStore.onlineUsers" />
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
  background-color: rgba(255, 255, 255, 0.8);
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
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 3px;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #222;
  color: #fff;
  padding: 0.8em;
  border-bottom: 2px solid #444;
}
.users {
  position: fixed;
  top: 60px;
  left: 10px;
}
</style>
