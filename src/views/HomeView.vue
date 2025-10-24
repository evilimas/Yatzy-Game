<script setup lang="ts">
import { yatzyStore } from "../stores/yatzyStore";
import { useFirebaseStore } from "../stores/firebaseStore";

const store = yatzyStore();
const firebaseStore = useFirebaseStore();

const userFirstName = firebaseStore.user?.displayName
  ? firebaseStore.user.displayName.split(" ")[0]
  : "";
</script>

<template>
  <main>
    <img class="dice-img" src="../images/blue-dice.png" alt="dice" />
    <h1 class="green">
      Velkommen <span>{{ userFirstName }}</span> til det beste Yatzy-spillet!
    </h1>
    <div>
      <h2 v-for="(die, index) in store.diceChars" :key="index">
        {{ die }}
      </h2>
    </div>
    <div class="input-container">
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
        <p>eller</p>
        <div class="mp-container">
          <RouterLink to="/yatzy-mp">Spill Yatzy Online</RouterLink>
        </div>
      </nav>
    </div>
  </main>
</template>

<style scoped>
a {
  font-size: 1.3em;
  margin-left: -10px;
}
.dice-img {
  max-width: 400px;
  width: 100%;
  height: auto;
  margin-bottom: -20px;
}
div {
  display: flex;
}
h2 {
  font-size: 2rem;
}
span {
  text-decoration: underline;
}

input {
  width: 20%;
}

.mp-container {
  align-items: center;
}
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
}
</style>
