<script lang="ts" setup>
import { computed, ref } from "vue";
import type { User } from "firebase/auth";

interface Props {
  users: User[];
}

defineProps<Props>();

const isUsersActive = ref<boolean>(false);

const chatArrow = computed(() => (isUsersActive.value ? "▲" : "▼"));
</script>

<template>
  <div class="users-online">
    <div class="users-header">
      <button @click="isUsersActive = !isUsersActive">
        {{ chatArrow }}
      </button>
      <h3 class="green">Brukere Online</h3>
    </div>
    <div class="users-container" v-if="isUsersActive">
      <ul>
        <li v-for="user in users" :key="user.uid">
          <img :src="user.photoURL ? user.photoURL : '/src/images/default-avatar.jpeg'" alt="" />
          <p>{{ user.displayName }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.users-online {
  background: #cecece;
  padding: 0.2em;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.users-container {
  background: #222;
  border-radius: 8px;
}
.users-header {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}
h3 {
  font-weight: 600;
}
ul {
  padding: 0.4rem;
}
li {
  color: #f9f9f9;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin-bottom: 0.2em;
}
img {
  width: 30px;
}
</style>
