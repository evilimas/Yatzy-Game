<script setup lang="ts">
interface Props {
  gameStarted: boolean;
  players: number;
}

defineProps<Props>();

const emit = defineEmits<{
  (event: "player", type: "increase" | "decrease"): void;
  (event: "startGame"): void;
  (event: "reStartGame"): void;
}>();
</script>
<template>
  <div>
    <div v-if="!gameStarted" id="Player">
      <h3>
        Spillere: <span class="green">{{ players }}</span>
      </h3>
      <button :disabled="players >= 4" @click="emit('player', 'increase')">+</button>
      <button :disabled="players <= 1" @click="emit('player', 'decrease')">-</button>
      <button @click="emit('startGame')">Start Spill</button>
    </div>
    <button v-if="gameStarted" @click="emit('reStartGame')">Restart Spill</button>
  </div>
</template>
<style scoped>
h3 {
  text-decoration: underline;
}
</style>
