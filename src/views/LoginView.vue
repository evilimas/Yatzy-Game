<script lang="ts" setup>
import { ref } from "vue";
import { useFirebaseStore } from "@/stores/firebaseStore";
const firebaseStore = useFirebaseStore();

const email = ref<string>("");
const password = ref<string>("");
const name = ref<string>("");
const loginPage = ref<boolean>(true);
</script>

<template>
  <div>
    <section id="logged-out-view" v-if="loginPage">
      <h2>For å starte spillet, vennligst logg inn.</h2>
      <div class="container google">
        <div class="google-login">
          <button
            @click="firebaseStore.signInWithGoogle"
            id="sign-in-with-google"
            class="provider-btn"
          >
            <img src="/src/images/google.png" alt="google icon" /> Logg inn med Google
          </button>
        </div>
      </div>
      <div class="container">
        Eller med din Epost
        <form action="" @submit.prevent>
          <input v-model="email" id="email-input" type="email" placeholder="Epost" required />
          <input
            v-model="password"
            type="password"
            id="password-input"
            placeholder="Passord"
            required
          />
          <button
            @click="firebaseStore.signInWithEmail(email, password)"
            @keypress.enter="firebaseStore.signInWithEmail(email, password)"
            id="sign-in-btn"
            class="primary-btn"
          >
            Logg inn
          </button>
        </form>
        <div>
          <h3>Ikke har konto? <a @click="loginPage = false">Registrer deg her</a></h3>
        </div>
      </div>
    </section>
    <section id="logged-out-view" v-if="!loginPage">
      <h2>Opprett en konto</h2>
      <div class="container">
        <form action="">
          <input v-model="name" id="create-name-input" type="text" placeholder="Navn" required />
          <input
            v-model="email"
            id="create-email-input"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="password"
            type="password"
            id="create-password-input"
            placeholder="Passord"
            min="6"
            required
          />
          <button
            @click="firebaseStore.createAccount(email, password, name)"
            id="create-account-btn"
            class="primary-btn"
          >
            Opprett konto
          </button>
        </form>
        <div>
          <h3>Allerede har konto? <a @click="loginPage = true">Logg inn her</a></h3>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 420px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
}
input {
  width: 200px;
  padding: 10px;
  margin: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.google-login {
  display: flex;
}
a {
  cursor: pointer;
}
img {
  width: 20px;
  height: 20px;
  align-self: center;
}
.google-login button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  gap: 10px;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
