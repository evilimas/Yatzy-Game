<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
// import { useRoute } from "vue-router";
// import type { User } from "firebase/auth";

import { useFirebaseStore } from "@/stores/firebaseStore";
import ScoreboardMP from "@/components/ScoreboardMP.vue";
import DiceMP from "@/components/DiceMP.vue";
import PlayerMpComponent from "@/components/PlayerMpComponent.vue";

const firebaseStore = useFirebaseStore();
const props = defineProps<{ roomId: string }>();
const roomId = ref<string>(props.roomId);

type Player = {
  uid: string;
  displayName: string;
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
  <div class="game-room">
    <div class="info">
      <h1>Game Room</h1>
      <p>Room ID: {{ roomId }}</p>
      <h2>Players in room:</h2>
      <ul>
        <li v-for="user in users" :key="user.uid">{{ user.displayName }}</li>
      </ul>
      <p v-if="firebaseStore.gameData">
        Active Player: {{ firebaseStore.gameData.activePlayer.displayName }}
      </p>
      <div v-if="!firebaseStore.gameData?.gameStarted">
        <p>Venter for spillere...</p>

        <p>Min 2 spillere for å starte</p>
      </div>
      <p v-else>Game has started!</p>
    </div>
    <div>
      <div v-if="!firebaseStore.gameData">
        <p>Loading game data...</p>
      </div>
      <div v-if="firebaseStore.gameData">
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
          @reset-hold-die="firebaseStore.resetHoldDie"
        />
        <ScoreboardMP
          :activePlayer="firebaseStore.gameData.activePlayer.displayName"
          :playersNumber="users.length"
          :users="users"
          :completeScoreboards="firebaseStore.completeScoreboards || []"
        />
      </div>
    </div>
  </div>
</template>

<style>
.info {
  margin-bottom: 1em;
}
.game-room {
  display: flex;
  gap: 2em;
}
</style>
