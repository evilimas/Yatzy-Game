<script setup lang="ts">
interface Props {
  gameStarted: boolean;
  players: number;
  roomId?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "start-game"): void;
  (e: "restart-game"): void;
}>();
</script>
<template>
  <div>
    <div v-if="!gameStarted" id="Player">
      <h3>
        Spillere inne rom: <span class="green">{{ players }}</span>
      </h3>

      <button class="button" :disabled="players < 2" @click="emit('start-game')">
        Start Spill
      </button>
    </div>
  </div>
  <button v-if="gameStarted" @click="emit('restart-game')">Restart Spill</button>
</template>
<style scoped>
h3 {
  text-decoration: underline;
  text-align: center;
  color: rgb(231, 231, 231);
  padding: 0.5em;
}
</style>
