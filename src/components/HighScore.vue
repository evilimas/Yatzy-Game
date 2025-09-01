<script setup lang="ts">
import { ref, computed } from "vue";
import { useFirebaseStore } from "@/stores/firebaseStore";
import type { HighScore, LocalHighScore } from "@/services/yatzy/types";

const firebaseStore = useFirebaseStore();

interface Props {
  isGameFinished: boolean;
  scores: LocalHighScore[];
}
defineProps<Props>();

const isHighScoreActive = ref(false);
const isLocalHighScoreActive = ref(true);
const isOnlineHighScoreActive = ref(false);

const highScoreArrow = computed(() => (isHighScoreActive.value ? "▼" : "▲"));

const turnCorrectScores = (online: boolean, local: boolean) => {
  if (online) {
    local = false;
  } else if (local) {
    online = false;
  }
};
</script>

<template>
  <div></div>
  <div class="high-score-header">
    <button @click="isHighScoreActive = !isHighScoreActive">
      {{ highScoreArrow }}
    </button>
    <h3 class="green">Toppresultater</h3>
  </div>
  <button @click="turnCorrectScores(false, true)">Lokalt</button>
  <button @click="turnCorrectScores(true, false)">Online</button>
  <div>
    <div class="high-score online" v-if="isHighScoreActive && isOnlineHighScoreActive">
      <ol v-if="firebaseStore.highScores.length > 0">
        <li v-for="(score, index) in firebaseStore.highScores" :key="index">
          {{ score.displayName }} : {{ score.score }} Poeng -
          {{ score.date }}
        </li>
      </ol>
      <div v-else>
        <h3>Ingen Online Toppresultater</h3>
      </div>
    </div>
    <div class="high-score local" v-if="isHighScoreActive && isLocalHighScoreActive">
      <ol v-if="scores.length > 0">
        <li v-for="(score, index) in scores" :key="index">
          {{ score.name }} : {{ score.score }} Poeng -
          {{ score.date }}
        </li>
      </ol>
      <div v-else>
        <h3>Ingen Lokale Toppresultater</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.high-score {
  background: #222;
  color: #fff;
  padding: 0.5em;
  border-radius: 8px;
  /* width: 380px; */
}
.high-score-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5em;
  width: 400px;
}
h3 {
  font-weight: 600;
  font-size: 1.3em;
}
</style>
