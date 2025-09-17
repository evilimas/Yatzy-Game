<script setup lang="ts">
import { ref, computed } from "vue";
import type { HighScore, LocalHighScore } from "@/services/yatzy/types";

interface Props {
  isGameFinished: boolean;
  scores: LocalHighScore[];
  onlineScores: HighScore[];
}
defineProps<Props>();

const isHighScoreActive = ref(false);
const isLocalHighScoreActive = ref(true);
const isOnlineHighScoreActive = ref(false);

const highScoreArrow = computed(() => (isHighScoreActive.value ? "▼" : "▲"));

const turnCorrectScores = (online: boolean, local: boolean) => {
  isOnlineHighScoreActive.value = online;
  isLocalHighScoreActive.value = local;
};
</script>

<template>
  <div class="high-score-header">
    <button @click="isHighScoreActive = !isHighScoreActive">
      {{ highScoreArrow }}
    </button>
    <h3 class="green">Toppresultater <v-icon name="gi-trophy-cup" scale="1.3" /></h3>
  </div>

  <div>
    <div class="high-score online" v-if="isHighScoreActive && isOnlineHighScoreActive">
      <button @click="turnCorrectScores(false, true)" :class="{ active: isLocalHighScoreActive }">
        Lokale
      </button>
      <button @click="turnCorrectScores(true, false)" :class="{ active: isOnlineHighScoreActive }">
        Online
      </button>
      <ol v-if="onlineScores.length > 0">
        <li v-for="(score, index) in onlineScores" :key="index">
          {{ score.displayName }} : {{ score.score }} Poeng -
          {{ score.date }}
        </li>
      </ol>
      <div v-else>
        <h3>Ingen Online Toppresultater</h3>
      </div>
    </div>
    <div class="high-score local" v-if="isHighScoreActive && isLocalHighScoreActive">
      <button @click="turnCorrectScores(false, true)" :class="{ active: isLocalHighScoreActive }">
        Lokale
      </button>
      <button @click="turnCorrectScores(true, false)" :class="{ active: isOnlineHighScoreActive }">
        Online
      </button>
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
button.active {
  border: solid 3px #cfcfcf;
}
</style>
