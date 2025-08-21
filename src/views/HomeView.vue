<script setup lang="ts">
import { useRouter } from "vue-router";
import { yatzyStore } from "../stores/yatzyStore";
import { useFirebaseStore } from "../stores/firebaseStore";

const router = useRouter();
const store = yatzyStore();
const firebaseStore = useFirebaseStore();

const userProfile = firebaseStore.user?.photoURL
  ? firebaseStore.user.photoURL
  : "./src/images/default-avatar.jpeg";

const userFirstName = firebaseStore.user?.displayName
  ? firebaseStore.user.displayName.split(" ")[0]
  : "";
</script>

<template>
  <nav class="navbar">
    <img :src="userProfile" alt="User Avatar" />
    <button @click="firebaseStore.signOutUser">Logg ut</button>
    <button @click="router.push('/edit-profile')">Rediger Profil</button>
  </nav>
  <main>
    <h1 class="green">
      Velkommen <span>{{ userFirstName }}</span> til det beste Yatzy-spillet!
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
.navbar {
  display: flex;
  gap: 10px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #222;
  color: #fff;
  padding: 0.8em;
  border-bottom: 2px solid #444;
}
img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
