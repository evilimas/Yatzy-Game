<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
// import { useRoute } from "vue-router";
// import type { User } from "firebase/auth";

import { useFirebaseStore } from "@/stores/firebaseStore";
import ScoreboardMP from "@/components/ScoreboardMP.vue";

const firebaseStore = useFirebaseStore();
const props = defineProps<{ roomId: string }>();
const roomId = ref<string>(props.roomId);
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

const users = computed(() => firebaseStore.gameData?.players);
</script>

<template>
  <div>
    <h1>Game Room</h1>
    <p>Room ID: {{ roomId }}</p>
    <h2>Players:</h2>
    <ul>
      <li v-for="user in users" :key="user.uid">{{ user.displayName }}</li>
    </ul>
    <p v-if="firebaseStore.gameData">
      Active Player: {{ firebaseStore.gameData.activePlayer.displayName }}
    </p>
  </div>
  <div v-if="!firebaseStore.gameData">
    <p>Loading game data...</p>
  </div>
  <div v-if="firebaseStore.gameData">
    <ScoreboardMP
      :activePlayer="firebaseStore.gameData.activePlayer.displayName"
      :playersNumber="users.length"
      :users="users"
      :completeScoreboards="firebaseStore.completeScoreboards || []"
    />
  </div>
</template>

<style></style>
