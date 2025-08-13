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
          <td :id="combination" class="combination-cell">
            <span v-if="combination === 'aces'">
              {{ value }} <v-icon name="bi-dice-1" style="font-size: 1.5em" />
            </span>
            <span v-else-if="combination === 'twos'">
              {{ value }} <v-icon name="bi-dice-2" style="font-size: 1.5em" />
            </span>
            <span v-else-if="combination === 'threes'">
              {{ value }} <v-icon name="bi-dice-3" style="font-size: 1.5em" />
            </span>
            <span v-else-if="combination === 'fours'">
              {{ value }} <v-icon name="bi-dice-4" style="font-size: 1.5em" />
            </span>
            <span v-else-if="combination === 'fives'">
              {{ value }} <v-icon name="bi-dice-5" style="font-size: 1.5em" />
            </span>
            <span v-else-if="combination === 'sixes'">
              {{ value }} <v-icon name="bi-dice-6" style="font-size: 1.5em" />
            </span>
            <span v-else>
              {{ value }}
            </span>
          </td>
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
  border: 2px solid lightblue;
  border-collapse: collapse;
  padding: 4px;
  color: rgb(228, 228, 228);
  font-weight: 500;
}
.combination-cell v-icon {
  margin-left: auto;
}

.disabled {
  /* pointer-events: none; */
  background-color: #f0f0f0 !important;
  color: #000000;
}
/* .big-die-icon {
  font-size: 1.5em;
  vertical-align: middle;
} */
</style>
