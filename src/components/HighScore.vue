<script setup lang="ts">
import { ref, computed } from "vue";
interface Props {
  scores: { name: string; value: number; date: Date }[];
}
const props = defineProps<Props>();
const isHighScoreActive = ref(false);

const highScoreArrow = computed(() => (isHighScoreActive.value ? "▼" : "▲"));
</script>

<template>
  <div class="high-score-header">
    <button @click="isHighScoreActive = !isHighScoreActive">
      {{ highScoreArrow }}
    </button>
    <h2 class="green">High Scores</h2>
  </div>
  <div class="high-score">
    <div v-if="isHighScoreActive">
      <ol v-if="props.scores.length > 0">
        <li v-for="(score, index) in props.scores" :key="index">
          {{ score.name }} : {{ score.value }} Poeng - {{ score.date }}
        </li>
      </ol>
      <div v-else>
        <h3>Ingen high scores</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.high-score {
  background: #222;
  color: #fff;
  padding: 1em;
  border-radius: 8px;
  width: 350px;
}
.high-score-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5em;
}
</style>
