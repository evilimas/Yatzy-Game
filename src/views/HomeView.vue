<script setup lang="ts">
import { yatzyStore } from "../stores/yatzyStore";
import { useFirebaseStore } from "../stores/firebaseStore";

const store = yatzyStore();
const firebaseStore = useFirebaseStore();
</script>

<template>
  <main>
    <h1 class="green">
      Velkommen <span>{{ firebaseStore.user?.displayName }}</span> til det beste Yatzy-spillet!
    </h1>
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
        <RouterLink to="/yatzy">Spill Yatzy Lokalt</RouterLink>
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
span {
  text-decoration: underline;
}
</style>
