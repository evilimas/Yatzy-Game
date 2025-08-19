<script lang="ts" setup>
import { ref, computed } from "vue";
import { useFirebaseStore } from "../stores/firebaseStore";
import type { User } from "firebase/auth";
import { auth } from "@/services/firebase";

const isChatActive = ref(false);

const firebaseStore = useFirebaseStore();

// interface ChatMessage {
//   id: number;
//   user: string;
//   text: string;
// }

// const messages = ref(firebaseStore.messages || []);
const newMessage = ref<string>("");

const chatArrow = computed(() => (isChatActive.value ? "▲" : "▼"));

// const sendMessage = () => {
//   if (newMessage.value.trim()) {
//     messages.value.push({
//       id: Date.now(),
//       user: firebaseStore.user?.email || "User",
//       text: newMessage.value,
//     });
//     newMessage.value = "";
//   }
// };
const postMessage = () => {
  const messageBody = newMessage.value;
  const user = auth.currentUser;

  if (messageBody) {
    firebaseStore.addMessageToDB(messageBody, user);
    newMessage.value = "";
  }
};
</script>
<template>
  <div class="live-chat">
    <div class="live-chat-header">
      <button @click="isChatActive = !isChatActive">
        {{ chatArrow }}
      </button>
      <h2 class="green">Live Chat</h2>
    </div>
    <div v-if="isChatActive" class="chat-content">
      <div v-if="firebaseStore.messages.length" class="messages">
        <div class="message" v-for="msg in firebaseStore.messages" :key="msg.id">
          <strong>{{ msg.displayName }}:</strong> {{ msg.text }} -
          <em>{{ firebaseStore.displayDate(msg.createdAt) }}</em>
        </div>
      </div>
      <div v-else class="no-chat">
        <p>ingen meldinger</p>
      </div>
      <input v-model="newMessage" @keyup.enter="postMessage()" placeholder="Type your message..." />
      <!-- <button @click="firebaseStore.fetchOnceAndRenderMessagesFromDB">Fetch Messages</button> -->
    </div>
  </div>
</template>

<style>
.messages {
  max-height: 300px;
  overflow-y: auto;
  background: #222;
  color: #f9f9f9;
}
.message {
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
}
.live-chat {
  background: #f9f9f9;
  padding: 1em;
  border-radius: 8px;
  width: 400px;
  display: flex;
  flex-direction: column;
}
.live-chat-header {
  display: flex;
  align-items: center;
}
.no-chat {
  text-align: center;
  color: #1f1f1f;
  font-weight: 800;
}
</style>
