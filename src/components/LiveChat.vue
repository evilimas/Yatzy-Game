<script lang="ts" setup>
import { ref } from "vue";
import { useFirebaseStore } from "../stores/firebaseStore";
import type { User } from "firebase/auth";
const firebaseStore = useFirebaseStore();

interface ChatMessage {
  id: number;
  user: string;
  text: string;
}

const messages = ref<ChatMessage[]>([]);
const newMessage = ref("");

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: Date.now(),
      user: firebaseStore.user?.email || "User",
      text: newMessage.value,
    });
    newMessage.value = "";
  }
};
</script>
<template>
  <div>
    <h2>Live Chat</h2>
    <div class="messages">
      <div class="message" v-for="msg in messages" :key="msg.id">
        <strong>{{ msg.user }}:</strong> {{ msg.text }}
      </div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
  </div>
</template>

<style>
.messages {
  max-height: 300px;
  overflow-y: auto;
}
.message {
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
}
</style>
