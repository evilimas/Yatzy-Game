<script setup lang="ts">
interface Props {
  gameStarted: boolean;
  players: number;
}

defineProps<Props>();

const emit = defineEmits<{
  // (e: "player", type: "increase" | "decrease"): void;
  (e: "player", player: string): void;
  (e: "startGame"): void;
  (e: "reStartGame"): void;
}>();
</script>
<template>
  <div>
    <div v-if="!gameStarted" id="Player">
      <h3>
        Spillere: <span class="green">{{ players }}</span>
      </h3>
      <div class="button-row">
        <button class="button" :disabled="players <= 1" @click="emit('player', 'decrease')">
          -
        </button>
        <button class="button" :disabled="players >= 4" @click="emit('player', 'increase')">
          +
        </button>
        <button class="button" @click="emit('startGame')">Start Spill</button>
      </div>
    </div>
    <button v-if="gameStarted" @click="emit('reStartGame')">Restart Spill</button>
  </div>
</template>
<style scoped>
h3 {
  text-decoration: underline;
  text-align: center;
  color: rgb(231, 231, 231);
  padding: 0.5em;
}
.button-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.button {
  margin: 0 5px 4px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button:nth-child(1),
.button:nth-child(2) {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  text-align: center;
  padding: 0;
  font-size: 1.2em;
}
</style>
