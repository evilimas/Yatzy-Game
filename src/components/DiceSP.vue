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
  (e: "throwDice"): void;
  (e: "flip", index: number): void;
  // throwDice: [];
  // flip: [number];
}>();

const props = defineProps<Props>();

const trillText = computed(() =>
  props.throwCount <= 0 ? "Ferdig, plasser terningen din" : "Ganger igjen"
);
</script>

<template>
  <fieldset v-show="gameStarted">
    <legend>
      <h4>
        Aktiv Spiller:
        <span class="green">{{ activePlayer }}</span>
      </h4>
    </legend>
    <div v-show="gameStarted">
      <div class="button-row">
        <div class="btn-div">
          <button class="primary-btn" @click="emit('throwDice')" :disabled="throwCount <= 0">
            Trill Terninger
          </button>
        </div>
        <div class="trill-text">
          <span v-if="!(props.throwCount <= 0)" class="green">{{ props.throwCount }}</span>
          {{ trillText }}
        </div>
      </div>

      <div class="dice" :disabled="throwCount === 3">
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
h4 {
  color: rgb(218, 218, 218);
  font-weight: 600;
}
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
  line-height: 90%;
}
.dice {
  display: flex;
  user-select: none;
  cursor: pointer;
}
fieldset {
  height: 135px;
  width: 16vw;
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.button-row {
  display: flex;
  flex-direction: column;
}
</style>
