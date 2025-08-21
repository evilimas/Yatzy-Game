<script lang="ts" setup>
import { ref, computed, nextTick, watch } from "vue";
import { useFirebaseStore } from "../stores/firebaseStore";

const isChatActive = ref(false);
const newMessage = ref<string>("");
const messagesContainer = ref<HTMLElement | null>(null);

const chatArrow = computed(() => (isChatActive.value ? "▲" : "▼"));

const firebaseStore = useFirebaseStore();

watch(
  () => firebaseStore.messages.length,
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  }
);
const sendMessage = async () => {
  firebaseStore.postMessage(newMessage.value);
  newMessage.value = "";
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
      <div v-if="firebaseStore.messages" class="messages" ref="messagesContainer">
        <div class="message" v-for="msg in firebaseStore.messages" :key="msg.id">
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
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
        <button @click="sendMessage">Send</button>
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
  max-width: 500px;
  display: flex;
  flex-direction: column;
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
input {
  width: 100%;
}
</style>
