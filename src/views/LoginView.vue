<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";

const email = ref("");
const password = ref("");
const name = ref("");
const user = ref<User | null>(null);
const loginPage = ref(true);
const error = ref<string | null>(null);

const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/home");
  } catch {
    alert("Error signing in with Google");
  }
};

const signInWithEmail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/home");
  } catch (error) {
    alert((error as Error).message);
    error.value = (error as Error).message;
  }
};

const createAccount = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    router.push("/home");
  } catch (error) {
    alert((error as Error).message);
  }
};
</script>

<template>
  <div>
    <section id="logged-out-view" v-if="loginPage">
      <h2>For å starte spillet, vennligst logg inn.</h2>
      <div class="container google">
        <div class="google-login">
          <button @click="signInWithGoogle" id="sign-in-with-google" class="provider-btn">
            <img src="/src/images/google.png" alt="google icon" /> Logg inn med Google
          </button>
        </div>
      </div>
      <div class="container">
        Eller med din Email
        <input v-model="email" id="email-input" type="email" placeholder="Email" required />
        <input
          v-model="password"
          type="password"
          id="password-input"
          placeholder="Passord"
          required
        />

        <button @click="signInWithEmail(email, password)" id="sign-in-btn" class="primary-btn">
          Logg inn
        </button>
        <div>
          <h3>Ikke har konto? <a @click="loginPage = false">Registrer deg her</a></h3>
        </div>
      </div>
    </section>
    <section id="logged-out-view">
      <h2 v-if="!loginPage">Opprett en konto</h2>
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
            @click="createAccount(email, password, name)"
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
