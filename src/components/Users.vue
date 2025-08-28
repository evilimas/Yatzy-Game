<script lang="ts" setup>
import type { User } from "firebase/auth";

interface Props {
  users: User[];
}

defineProps<Props>();
</script>

<template>
  <div>
    <div class="users-online">
      <h3>Brukere Online:</h3>
      <ul>
        <li v-for="onlineUser in users" :key="onlineUser.uid">
          {{ onlineUser.displayName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
