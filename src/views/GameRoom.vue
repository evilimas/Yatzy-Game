<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
// import { useRouter } from "vue-router";
// import type { User } from "firebase/auth";

import { useFirebaseStore } from "@/stores/firebaseStore";
import ScoreboardMP from "@/components/ScoreboardMP.vue";
import DiceMP from "@/components/DiceMP.vue";
import PlayerMpComponent from "@/components/PlayerMpComponent.vue";
import WinnerModal from "@/components/WinnerModal.vue";
import ConfettiExplosion from "vue-confetti-explosion";

// const router = useRouter();
const firebaseStore = useFirebaseStore();

const props = defineProps<{ roomId: string }>();
const roomId = ref<string>(props.roomId);
const showWinnerModal = ref<boolean>(false);

type Player = {
  uid: string;
  displayName: string;
};

watch(
  () => firebaseStore.isGameFinished,
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
  firebaseStore.restartGame(roomId.value);
  showWinnerModal.value = false;
};

// const users = ref<{ uid: string; displayName: string }[]>([]);

// onMounted(async () => {
//   const gameDoc = await getDoc(doc(firebaseStore.db, "games", roomId.value));
//   if (gameDoc.exists()) {
//     gameData.value = gameDoc.data() as GameRoomData;
//     users.value = gameData.value.players || [];
//   }
// });
// let stop: (() => void) | null = null;

onMounted(() => {
  firebaseStore.listenToGameRoom(props.roomId);
});
// onUnmounted(() => {
//   if (stop) stop();
// });

const users = computed<Player[]>(() => firebaseStore.gameData?.players ?? []);
</script>

<template>
  <!-- <nav class="navbar">
    <button @click="router.push('/yatzy-mp')">
      <v-icon name="bi-arrow-return-left" scale="0.7" /> Tilbake
    </button>
  </nav> -->
  <div class="game-room">
    <div class="info">
      <h1>Game Room</h1>
      <p>Room ID: {{ roomId }}</p>
      <h2>{{ users.length }} Players in room :</h2>
      <ul>
        <li v-for="user in users" :key="user.uid">{{ user.displayName }}</li>
      </ul>
      <!-- <p v-if="firebaseStore.gameData">
        Active Player: {{ firebaseStore.gameData.activePlayer.displayName }}
      </p> -->
      <div v-if="!firebaseStore.gameData?.gameStarted">
        <p>Venter for spillere...</p>

        <p>Min 2 spillere for å starte</p>
      </div>
      <p v-else>Game has started!</p>
      <button
        v-if="!firebaseStore.gameData?.gameStarted"
        class="button"
        :disabled="users.length < 1"
        :style="{ cursor: users.length >= 1 ? 'pointer' : 'not-allowed' }"
        @click="firebaseStore.startGame(roomId)"
      >
        Start Spill
        <v-icon name="md-notstarted-outlined" scale="0.8" animation="flash" color="white" />
      </button>
      <button v-if="firebaseStore.gameData?.gameStarted" @click="firebaseStore.restartGame(roomId)">
        Restart Spill <v-icon name="ri-restart-line" scale="0.8" animation="spin" color="white" />
      </button>
    </div>
    <div>
      <div v-if="!firebaseStore.gameData">
        <p>Loading game data...</p>
      </div>
      <div v-if="firebaseStore.gameData" class="game-area">
        <ConfettiExplosion
          v-if="showWinnerModal"
          :duration="8000"
          :particleCount="800"
          :colors="['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']"
        />
        <PlayerMpComponent
          :gameStarted="firebaseStore.gameData.gameStarted"
          :players="users.length"
          :roomId="roomId"
          @start-game="firebaseStore.startGame(roomId)"
          @restart-game="firebaseStore.restartGame(roomId)"
        />
        <DiceMP
          :activePlayer="firebaseStore.gameData.activePlayer.displayName"
          :gameStarted="firebaseStore.gameData.gameStarted"
          :throwCount="firebaseStore.gameData.throwCount"
          :die="firebaseStore.gameData.dice"
          :heldDie="firebaseStore.gameData.holdDie"
          :uid="firebaseStore.gameData.uid"
          :roomId="roomId"
          @roll-dice="firebaseStore.rollDice"
          @hold-die="firebaseStore.holdDie"
        />
        <ScoreboardMP
          :activePlayer="firebaseStore.gameData.activePlayer.displayName"
          :playersNumber="users.length"
          :users="users"
          :roomId="roomId"
          :completeScoreboards="firebaseStore.completeScoreboards || []"
          @placeScore="firebaseStore.placeScoreAndNextTurn"
        />
        <WinnerModal
          :is-visible="showWinnerModal"
          :winner-text="firebaseStore.winner()"
          @close="handleCloseModal"
          @new-game="handleNewGame"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.info {
  /* margin-bottom: 1em; */
  background: #222;
  padding: 1em;
  border-radius: 8px;
  height: fit-content;
  align-self: center;
}
.game-room {
  display: flex;
  gap: 2em;
}
.game-area {
  /* flex: 1; */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2em;
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
@media (max-width: 768px) {
  .game-room {
    flex-direction: column-reverse;
    align-items: center;
  }
}
</style>
