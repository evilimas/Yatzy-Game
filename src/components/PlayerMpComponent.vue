<script setup lang="ts">
interface Props {
  gameStarted: boolean;
  players: number;
  roomId?: string;
}

defineProps<Props>();

// const emit = defineEmits<{
//   // (e: "start-game"): void;
//   // (e: "restart-game"): void;
// }>();
</script>
<template>
  <div>
    <h2 class="green">Det beste Yatzy spillet!</h2>
    <div v-if="!gameStarted" id="Player">
      <h3>
        Spillere inne rom: <span class="green">{{ players }}</span>
      </h3>

      <!-- <button class="button" :disabled="players < 2" @click="emit('start-game')">
        Start Spill
      </button> -->
    </div>
  </div>
</template>
<style scoped>
h2 {
  text-align: center;
  color: #239ba7;
  padding: 0.5em;
  text-shadow: 0 0 5px #239ba7;
  font-size: 2em;
}
h3 {
  text-decoration: underline;
  text-align: center;
  color: rgb(231, 231, 231);
  padding: 0.5em;
}
</style>
