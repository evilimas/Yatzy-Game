<script setup lang="ts">
import { computed } from "vue";
import type { DieViewState } from "../services/yatzy/types";

interface Props {
  activePlayer: number;
  gameStarted: boolean;
  throwCount: number;
  diceObjects: DieViewState[];
}
const emit = defineEmits<{
  throwDice: [];
  flip: [number];
}>();

const props = defineProps<Props>();

const trillText = computed(() => (props.throwCount <= 0 ? "Ferdig" : "Ganger igjen"));
</script>

<template>
  <fieldset>
    <legend>Spiller: {{ activePlayer }}</legend>
    <div v-show="gameStarted">
      <button @click="emit('throwDice')" :disabled="throwCount <= 0">Trill terninger</button>
      <div>{{ throwCount }} {{ trillText }}</div>

      <div class="dice" style="display: flex" :disabled="throwCount === 3">
        <span
          v-for="dieData of diceObjects"
          :key="dieData.index"
          :style="dieData.style"
          @click="emit('flip', dieData.index)"
        >
          <div>
            {{ dieData.char }}
          </div>
        </span>
      </div>
    </div>
  </fieldset>
</template>

<style scoped>
span {
  font-size: 300%;
  background: lightblue;
  line-height: 90%;
}
.dice {
  user-select: none;
  cursor: pointer;
}
fieldset {
  height: 15vh;
  width: 23vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
