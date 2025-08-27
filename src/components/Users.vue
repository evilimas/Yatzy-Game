<script lang="ts" setup>
import { useFirebaseStore } from "@/stores/firebaseStore";

const firebaseStore = useFirebaseStore();
</script>

<template>
  <div>
    <div class="users-online">
      <h3>Brukere Online:</h3>
      <ul>
        <li v-for="onlineUser in firebaseStore.onlineUsers" :key="onlineUser.uid">
          {{ onlineUser.displayName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
