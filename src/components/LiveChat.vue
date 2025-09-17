<script lang="ts" setup>
import { ref, computed, nextTick, watch } from "vue";
import { auth } from "@/services/firebase";
import { Timestamp } from "firebase/firestore";
import type { Message } from "@/services/yatzy/types";

interface Props {
  messages: Message[];
  displayDate: (date: Timestamp) => string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "post-message", message: string): void;
  (e: "delete-msg", dockId: string, messageUserUid: string): void;
  (e: "edit-msg", dockId: string, messageUserUid: string): void;
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
  emit("post-message", newMessage.value);
  newMessage.value = "";
};
</script>

<template>
  <div class="live-chat-header">
    <button @click="isChatActive = !isChatActive">
      {{ chatArrow }}
    </button>
    <h3 class="green">Live Chat <v-icon name="bi-chat-dots" scale="1.5" /></h3>
  </div>
  <div v-if="isChatActive" class="chat-content">
    <div v-if="props.messages" class="messages" ref="messagesContainer">
      <div class="message" v-for="msg in props.messages" :key="msg.id">
        <img
          :src="msg.profilePicture ? msg.profilePicture : './src/images/default-avatar.jpeg'"
          alt="User Avatar"
          width="27"
          height="27"
        />
        <div class="message-content">
          <p class="time">{{ props.displayDate(msg.createdAt) }}</p>
          <h4>{{ msg.displayName }} : {{ msg.text }}</h4>
          <div class="chat-btns" v-show="auth.currentUser?.uid === msg.user">
            <button class="delete-btn" @click="emit('delete-msg', msg.id, msg.user)">
              <v-icon name="md-delete" style="font-size: 1em" />
            </button>
            <button class="edit-btn" @click="emit('edit-msg', msg.id, msg.user)">
              <v-icon name="fa-edit" style="font-size: 1em" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-chat">
      <p>ingen meldinger</p>
    </div>
    <div class="input-container">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
      <button @click="sendMessage">Send</button>
      <!-- <button @click="firebaseStore.fetchOnceAndRenderMessagesFromDB">Fetch Messages</button> -->
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
  position: relative;
}

.live-chat-header {
  display: flex;
  align-items: center;
  min-width: 400px;
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
}
input {
  width: 100%;
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
</style>
