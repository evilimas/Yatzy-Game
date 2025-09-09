<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useFirebaseStore } from "@/stores/firebaseStore";
import type { GameRoomData } from "@/services/yatzy/types";

const route = useRoute();
const roomId = ref<string>(route.params.roomId as string);
const users = ref<{ uid: string; displayName: string }[]>([]);
const gameData = ref<GameRoomData | null>(null);
const firebaseStore = useFirebaseStore();

onMounted(async () => {
  const gameDoc = await getDoc(doc(firebaseStore.db, "games", roomId.value));
  if (gameDoc.exists()) {
    gameData.value = gameDoc.data() as GameRoomData;
    users.value = gameData.value.players || [];
  }
});
</script>

<template>
  <div>
    <h1>Game Room</h1>
    <p>Room ID: {{ roomId }}</p>
    <h2>Players:</h2>
    <ul>
      <li v-for="user in users" :key="user.uid">{{ user.displayName }}</li>
    </ul>
    <p v-if="gameData">Active Player: {{ gameData.activePlayer.displayName }}</p>
  </div>
</template>

<style></style>
