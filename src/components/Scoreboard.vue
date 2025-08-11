<script setup lang="ts">
import type { CompleteScoreboard } from "@/services/yatzy/types";
import { uiLabels } from "../yatzyLogic";
interface Props {
  players: number;
  activePlayer: number;
  completeScoreboards: CompleteScoreboard[];
}
defineProps<Props>();

const emit = defineEmits<{
  nextTurn: [string | null];
  placeScore: [string | null];
}>();
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Kombinasjon</th>
          <th
            v-for="player of players"
            :key="player"
            :style="{
              background: activePlayer === player ? '#239BA9' : '',
              color: activePlayer === player ? 'black' : '',
            }"
          >
            Spiller: {{ player }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, combination) in uiLabels" :key="combination">
          <td :id="combination">{{ value }}</td>
          <td
            v-for="(scoreBoard, index) of completeScoreboards"
            :key="index"
            :id="combination"
            :class="{
              disabled: scoreBoard[combination] !== null || scoreBoard[combination] == 0,
            }"
            :style="{
              background: activePlayer === index + 1 ? '#239BA7' : '',
              cursor: scoreBoard[combination] !== null ? 'not-allowed' : 'pointer',
              opacity: scoreBoard[combination] !== null || scoreBoard[combination] == 0 ? 0.3 : 1,
            }"
            @click="emit('placeScore', scoreBoard[combination] === null ? combination : null)"
          >
            {{ scoreBoard[combination] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table,
tr,
th,
td {
  border: 1px solid lightblue;
  border-collapse: collapse;
  padding: 4px;
}

.disabled {
  pointer-events: none;
  background-color: #f0f0f0 !important;
  color: #888;
}
</style>
