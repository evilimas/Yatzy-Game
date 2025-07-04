<script setup lang="ts">
import { yatzyStore } from "../stores/yatzyStore";

const store = yatzyStore();
</script>

<template>
  <main>
    <h1>Velkommen til det beste Yatzy-spillet!</h1>
    <div>
      <h2 v-for="(die, index) in store.diceChars" :key="index">
        {{ die }}
      </h2>
    </div>
    <div>
      <label for="players"
        >Hvor Mange spillere?
        <input
          id="players"
          type="number"
          min="1"
          max="4"
          placeholder="Antall spillere"
          v-model="store.players"
        />
      </label>
    </div>
    <div class="wrapper">
      <nav>
        <RouterLink to="/yatzy">Spill Yatzy</RouterLink>
      </nav>
    </div>
  </main>
</template>

<style scoped>
div {
  display: flex;
}
h2 {
  font-size: 2rem;
}
</style>
