<script setup lang="ts">
interface Props {
  scores: { name: string; value: number }[];
}
const props = defineProps<Props>();
</script>

<template>
  <div class="high-score">
    <h2>High Scores</h2>
    <ul>
      <li v-for="(score, index) in props.scores" :key="index">
        {{ score.name }}: {{ score.value }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.high-score {
  background: #222;
  color: #fff;
  padding: 1em;
  border-radius: 8px;
  width: 250px;
}
</style>
