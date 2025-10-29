<script lang="ts" setup>
import { ref, computed, nextTick, watch } from "vue";
import { auth } from "@/services/firebase";

import type { RoomMessage } from "@/services/yatzy/types";
import defaultPicture from "/src/images/default-avatar.jpeg";

interface Props {
  messages: RoomMessage[];
  roomId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "post-room-message", message: string, roomId: string): void;
}>();

const isChatActive = ref<boolean>(false);
const newMessage = ref<string>("");
const messagesContainer = ref<HTMLElement | null>(null);

const chatArrow = computed(() => (isChatActive.value ? "▲" : "▼"));

function scrollChatToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    scrollChatToBottom();
  }
);

const sendMessage = () => {
  emit("post-room-message", newMessage.value, props.roomId);
  newMessage.value = "";
};
</script>

<template>
  <div class="live-chat-header">
    <button @click="isChatActive = !isChatActive">
      {{ chatArrow }}
    </button>
    <h3>Spillrom Chat <v-icon name="bi-chat-dots" scale="1.5" /></h3>
  </div>
  <div v-if="isChatActive" class="chat-content">
    <div v-if="props.messages.length > 0" class="messages" ref="messagesContainer">
      <div class="message" v-for="msg of props.messages" :key="msg.id">
        <img
          :src="msg.profilePicture ? msg.profilePicture : defaultPicture"
          alt="User Avatar"
          width="27"
          height="27"
        />
        <div class="message-content">
          <h4>{{ msg.displayName }} : {{ msg.messageBody }}</h4>
          <div class="chat-btns" v-show="auth.currentUser?.uid === msg.uid"></div>
        </div>
      </div>
    </div>
    <div v-else class="no-chat">
      <p>ingen meldinger</p>
    </div>
    <div class="input-container">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
      <button @click="sendMessage" class="send-btn">Send</button>
    </div>
  </div>
</template>

<style scoped>
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
  position: relative;
}

.live-chat-header {
  display: flex;
  align-items: center;
  min-width: 400px;
  gap: 0.3em;
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
h3 {
  font-weight: 600;
  font-size: 1.2rem;
  color: white;
}
input {
  width: 100%;
  padding: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.delete-btn {
  background: none;
  border: none;
  color: #b9b9b9;
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 2px;
}
.edit-btn {
  background: none;
  border: none;
  color: #b9b9b9;
  cursor: pointer;
  position: absolute;
  right: 30px;
  top: 2px;
}
.send-btn {
  border: 1px solid #4e4e4e;
}
.live-chat {
  scrollbar-color: rgb(66, 66, 66) #239ba7;
  scrollbar-width: small;
}
</style>
