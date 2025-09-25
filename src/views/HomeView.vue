<script setup lang="ts">
// import { useRouter } from "vue-router";
import { yatzyStore } from "../stores/yatzyStore";
import { useFirebaseStore } from "../stores/firebaseStore";
// import NavComponent from "@/components/NavComponent.vue";

// const router = useRouter();
const store = yatzyStore();
const firebaseStore = useFirebaseStore();

// const userProfile = firebaseStore.user?.photoURL
//   ? firebaseStore.user.photoURL
//   : "./src/images/default-avatar.jpeg";

const userFirstName = firebaseStore.user?.displayName
  ? firebaseStore.user.displayName.split(" ")[0]
  : "";
</script>

<template>
  <!-- <nav class="navbar">
    <img :src="userProfile" alt="User Avatar" />
    <button @click="firebaseStore.signOutUser">
      Logg ut <v-icon name="co-account-logout" scale="0.9" />
    </button>
    <button @click="router.push('/edit-profile')">
      Rediger Profil <v-icon name="la-user-edit-solid" scale="0.9" />
    </button>
  </nav> -->
  <main>
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
          <p>- Under utvikling</p>
        </div>
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
