<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <nav class="navbar">
    <button @click="router.push('/home')">Tilbake</button>
  </nav>
  <div>
    <h1>Yatzy Multiplayer</h1>
    <p>Velkommen til Yatzy Multiplayer!</p>
  </div>
</template>

<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #222;
  color: #fff;
  padding: 0.8em;
  border-bottom: 2px solid #444;
}
</style>
