<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useFirebaseStore } from "@/stores/firebaseStore";
import type { User } from "firebase/auth";

const firebaseStore = useFirebaseStore();
const router = useRouter();
const user = ref<User | null>(firebaseStore.user);

const handleCreateGameRoom = async () => {
  if (user.value) {
    const roomId = await firebaseStore.createGameRoom(user.value);
    if (roomId) {
      router.push(`/yatzy-mp/${roomId}`);
    } else {
      console.log("Game room ID not found.");
    }
  } else {
    console.log("User is not logged in.");
  }
};

const selectGameRoom = (roomId: string) => {
  if (user.value) {
    firebaseStore.joinGameRoom(roomId, user.value);
    router.push(`/yatzy-mp/${roomId}`);
  } else {
    console.log("User is not logged in.");
  }
};

watch(
  () => firebaseStore.listenToGameRoom,
  (newRooms) => {
    console.log("Updated game rooms:", newRooms);
  }
);
</script>

<template>
  <nav class="navbar">
    <button @click="router.push('/home')">Tilbake</button>
  </nav>
  <div>
    <h1>Yatzy Multiplayer</h1>
    <p>Velkommen til Yatzy Multiplayer!</p>
    <button @click="handleCreateGameRoom">Opprett Spillrom</button>
    <p>Spillromene:</p>
    <div>
      <table v-for="room in firebaseStore.allGameRooms" :key="room.id">
        <th>
          {{ room.data.players[0].displayName }}
        </th>
        {{
          room.data.players.length
        }}
        spiller(e) -
        <tr>
          <button @click="selectGameRoom(room.id)">Bli med i rommet</button>
        </tr>
      </table>
    </div>
  </div>
</template>

<style>
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
table,
tr,
th,
td {
  border: 2px solid lightblue;
  border-collapse: collapse;
  padding: 4px;
  color: rgb(228, 228, 228);
  font-weight: 500;
}
</style>
