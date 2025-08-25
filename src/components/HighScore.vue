<script setup lang="ts">
import { ref, computed } from "vue";
import { useFirebaseStore } from "@/stores/firebaseStore";

const firebaseStore = useFirebaseStore();

// interface Props {
//   scores: { name: string; value: number; date: Date }[];
// }
interface Props {
  isGameFinished: boolean;
}
defineProps<Props>();

const isHighScoreActive = ref(false);

const highScoreArrow = computed(() => (isHighScoreActive.value ? "▼" : "▲"));
</script>

<template>
  <div class="high-score-header">
    <button @click="isHighScoreActive = !isHighScoreActive">
      {{ highScoreArrow }}
    </button>
    <h3 class="green">Toppresultater</h3>
  </div>
  <div class="high-score">
    <div v-if="isHighScoreActive">
      <ol v-if="firebaseStore.highScores.length > 0">
        <li v-for="(score, index) in firebaseStore.highScores" :key="index">
          {{ score.displayName }} : {{ score.score }} Poeng -
          {{ score.date }}
        </li>
      </ol>
      <div v-else>
        <h3>Ingen Toppresultater</h3>
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
  width: 380px;
}
.high-score-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5em;
}
</style>
