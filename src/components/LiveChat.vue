<script lang="ts" setup>
import { ref, computed } from "vue";
import { useFirebaseStore } from "../stores/firebaseStore";
import { auth } from "@/services/firebase";

const isChatActive = ref(false);

const firebaseStore = useFirebaseStore();

const newMessage = ref<string>("");

const chatArrow = computed(() => (isChatActive.value ? "▲" : "▼"));

// interface ChatMessage {
//   id: number;
//   user: string;
//   text: string;
// }

// const messages = ref(firebaseStore.messages || []);

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
        <div class="message" v-for="msg in firebaseStore.sortedMessages" :key="msg.id">
          <img
            :src="msg.profilePicture ? msg.profilePicture : './src/images/default-avatar.jpeg'"
            alt="User Avatar"
            width="27"
            height="27"
          />
          <div class="message-content">
            <p class="time">{{ firebaseStore.displayDate(msg.createdAt) }}</p>
            <h4>{{ msg.displayName }} : {{ msg.text }}</h4>
          </div>
        </div>
      </div>
      <div v-else class="no-chat">
        <p>ingen meldinger</p>
      </div>
      <div class="input-container">
        <input
          v-model="newMessage"
          @keyup.enter="postMessage()"
          placeholder="Type your message..."
        />
        <button @click="postMessage()">Send</button>
        <!-- <button @click="firebaseStore.fetchOnceAndRenderMessagesFromDB">Fetch Messages</button> -->
      </div>
    </div>
  </div>
</template>

<style>
.messages {
  max-height: 300px;
  max-width: 500px;
  overflow-y: auto;
  background: #222;
  color: #f9f9f9;
  display: flex;
  flex-direction: column;
}
.message {
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 5px;
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
img {
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.input-container {
  display: flex;
  gap: 0.3em;
}
.message-content {
  display: flex;
  flex-direction: column;
}
.time {
  font-size: 0.8em;
  color: #aaa;
}
h4 {
  flex-wrap: wrap;
}
input {
  width: 100%;
}
</style>
