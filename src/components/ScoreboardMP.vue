<script setup lang="ts">
import type { CompleteScoreboard } from "@/services/yatzy/types";
import { uiLabels } from "../yatzyLogic";

interface Props {
  activePlayer: string | null;
  playersNumber: number;
  users: { uid: string; displayName: string }[];
  completeScoreboards: CompleteScoreboard[];
  roomId: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "placeScore", combination: string | null, room: string): void;
}>();
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Kombinasjon</th>
          <th
            v-for="user of users"
            :key="user.uid"
            :style="{
              background: activePlayer === user.displayName ? '#239BA9' : '',
              color: activePlayer === user.displayName ? 'black' : '',
            }"
          >
            User: {{ user.displayName }}
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
            v-for="(user, userIndex) in users"
            :key="user.uid"
            :id="combination"
            :class="{
              disabled:
                completeScoreboards[userIndex]?.[combination] !== null ||
                completeScoreboards[userIndex]?.[combination] == 0,
            }"
            :style="{
              background: activePlayer == user.displayName ? '#239BA7' : '',
              cursor:
                completeScoreboards[userIndex]?.[combination] !== null ? 'not-allowed' : 'pointer',
              opacity:
                completeScoreboards[userIndex]?.[combination] !== null ||
                completeScoreboards[userIndex]?.[combination] == 0
                  ? 0.3
                  : 1,
            }"
            @click="
              emit(
                'placeScore',
                completeScoreboards[userIndex]?.[combination] === null ? combination : null,
                roomId
              )
            "
          >
            {{ completeScoreboards[userIndex]?.[combination] }}
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
  border: 1.5px solid lightblue;
  border-collapse: collapse;
  padding: 4px;
  color: rgb(255, 255, 255);
  font-weight: 500;
}
.combination-cell v-icon {
  margin-left: auto;
}

.disabled {
  background-color: #f0f0f0 !important;
  color: #000000;
}
table {
  border: 1px solid #239ba7;
  border-radius: 12px;
  background: #292929;
  overflow: hidden;
}
</style>
