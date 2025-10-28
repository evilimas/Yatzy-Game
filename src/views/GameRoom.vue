<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { useFirebaseStore } from "@/stores/firebaseStore";
import ScoreboardMP from "@/components/ScoreboardMP.vue";
import DiceMP from "@/components/DiceMP.vue";
import PlayerMpComponent from "@/components/PlayerMpComponent.vue";
import WinnerModal from "@/components/WinnerModal.vue";
import ConfettiExplosion from "vue-confetti-explosion";
import RoomLiveChat from "@/components/RoomLiveChat.vue";

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

onMounted(() => {
  firebaseStore.listenToGameRoom(props.roomId);
});

const users = computed<Player[]>(() => firebaseStore.gameData?.players ?? []);

const usersWantRestart = computed(() => {
  return firebaseStore.gameData?.players.filter((p) => p.willRestart).length ?? 0;
});
</script>

<template>
  <div class="game-room">
    <div class="info">
      <h1>Game Room</h1>
      <p>Room ID: {{ roomId }}</p>
      <h2>{{ users.length }} Players in room :</h2>
      <ul>
        <li v-for="user in users" :key="user.uid">{{ user.displayName }}</li>
      </ul>

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
      <button
        v-if="firebaseStore.gameData?.gameStarted"
        @click="firebaseStore.confirmRestart(roomId)"
      >
        Start På Nytt <v-icon name="ri-restart-line" scale="0.8" animation="spin" color="white" />
      </button>
      <p v-if="usersWantRestart > 0">
        {{ usersWantRestart }} / {{ users.length }} spillere ønsker å starte på nytt
      </p>
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
  <div class="live-chat">
    <RoomLiveChat
      :messages="firebaseStore.gameData?.messages || []"
      @post-room-message="firebaseStore.postRoomMessage"
      :room-id="roomId"
    />
  </div>
</template>

<style scoped>
.info {
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
@media (min-width: 1000px) {
  .game-room {
    align-items: center;
    margin-top: 150px;
  }
}
@media (max-width: 768px) {
  .game-room {
    flex-direction: column-reverse;
    align-items: center;
  }
}
</style>
