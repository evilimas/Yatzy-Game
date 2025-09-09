<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useFirebaseStore } from "@/stores/firebaseStore";
import type { User } from "firebase/auth";
import type { GameRoomData } from "@/services/yatzy/types";

const firebaseStore = useFirebaseStore();
const router = useRouter();
const user = ref<User | null>(firebaseStore.user);

const handleCreateGameRoom = async () => {
  const allreadyCreated = firebaseStore.allGameRooms.some(
    (room: { id: string; data: GameRoomData }) => room.data.createdBy.uid === user.value?.uid
  );

  if (!allreadyCreated) {
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
  } else {
    console.log("User has already created a game room.");
    alert("Du har allerede opprettet et spillrom.");
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

// watch(
//   () => firebaseStore.listenToGameRoom,
//   (newRooms) => {
//     console.log("Updated game rooms:", newRooms);
//   }
// );
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
    <div v-if="firebaseStore.allGameRooms.length > 0">
      <table>
        <thead>
          <th>Opprettet av</th>
          <th>Spillere</th>
          <th>Status</th>
        </thead>
        <tbody>
          <tr v-for="room in firebaseStore.allGameRooms" :key="room.id">
            <td>
              {{ room.data.createdBy.displayName }}
            </td>
            <td>
              {{ room.data.players.length }}
            </td>
            <td>
              {{ room.data.status }}
            </td>
            <td>
              <button @click="selectGameRoom(room.id)">Bli med</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h3>Ingen spillrom tilgjengelig.</h3>
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
h3 {
  color: rgb(238, 238, 238);
}
</style>
