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

const trillText = computed(() =>
  props.throwCount <= 0 ? "Ferdig, plasser terningen din" : "Ganger igjen"
);
</script>

<template>
  <fieldset v-show="gameStarted">
    <legend>
      Aktiv Spiller:
      <span class="green">{{ activePlayer }}</span>
    </legend>
    <div v-show="gameStarted">
      <button @click="emit('throwDice')" :disabled="throwCount <= 0">Trill Terninger</button>
      <div class="trill-text">
        <span v-if="!(props.throwCount <= 0)" class="green">{{ props.throwCount }}</span>
        {{ trillText }}
      </div>

      <div class="dice" style="display: flex" :disabled="throwCount === 3">
        <span
          class="dice-span"
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
.trill-text {
  color: rgb(214, 214, 214);
  font-weight: 600;
}
legend {
  color: white;
  font-weight: 600;
}
.dice-span {
  font-size: 330%;
  /* background: lightblue; */
  line-height: 90%;
}
.dice {
  user-select: none;
  cursor: pointer;
}
fieldset {
  height: 12vh;
  width: 21vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
