<script lang="ts" setup>
import { ref } from "vue";
import { auth } from "@/services/firebase";
import { useRouter } from "vue-router";
import { useFirebaseStore } from "@/stores/firebaseStore";
import { yatzyStore } from "../stores/yatzyStore";
import type { User } from "firebase/auth";
import type { GameRoomData } from "@/services/yatzy/types";
import UsersComponent from "@/components/UsersComponent.vue";
import LiveChat from "@/components/LiveChat.vue";
import HighScore from "@/components/HighScore.vue";

const store = yatzyStore();
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
  <div class="mp-container">
    <h1>Yatzy Multiplayer</h1>
    <p class="info-text">
      For å spille Yatzy Multiplayer, vennligst opprett eller bli med i et spillrom.
    </p>
    <button @click="handleCreateGameRoom">
      Opprett Spillrom <v-icon name="pr-plus-circle" scale="0.9" color="white" animation="pulse" />
    </button>
    <p>Spillromene:</p>
    <div v-if="firebaseStore.allGameRooms.length > 0">
      <table>
        <thead>
          <tr>
            <th>Opprettet av</th>
            <th>Spillere</th>
            <th>Status</th>
            <th>Handlinger</th>
          </tr>
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
            <td class="actions">
              <button @click="selectGameRoom(room.id)">
                Bli med <v-icon name="co-room" scale="0.8" color="white" />
              </button>
              <button
                v-show="auth.currentUser?.uid === room.data.createdBy.uid"
                @click="firebaseStore.deleteGameRoom(room.id, room.data.createdBy.uid)"
              >
                Slett <v-icon name="md-delete-outlined" scale="0.8" color="white" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h3>Ingen spillrom tilgjengelig.</h3>
    </div>
  </div>
  <div class="high-scores">
    <HighScore
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
.mp-container {
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  background: #222;
  padding: 1em;
  border-radius: 8px;
  width: fit-content;
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
h1 {
  margin-bottom: 50px;
  color: #239ba7;
}
.info-text {
  margin-bottom: 20px;
  font-size: 1.2em;
  width: 70%;
  text-align: center;
  flex-wrap: wrap;
}
.actions {
  display: flex;
  gap: 6px;
  border: none;
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
</style>
