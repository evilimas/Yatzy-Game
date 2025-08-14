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

const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  router.push("/home");
};

const signInWithEmail = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/home");
  } catch (error) {
    alert((error as Error).message);
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
        <input v-model="email" id="email-input" type="email" placeholder="Email" required />
        <input
          v-model="password"
          type="password"
          id="password-input"
          placeholder="Password"
          required
        />

        <button @click="signInWithEmail(email, password)" id="sign-in-btn" class="primary-btn">
          Sign in
        </button>
        <div>
          <h3>ikke har konto? <a @click="loginPage = false">Registrer deg her</a></h3>
        </div>
      </div>
    </section>
    <section>
      <h2 v-if="!loginPage">Opprett en konto</h2>
      <div class="container">
        <input v-model="name" id="name-input" type="text" placeholder="Navn" required />
        <input v-model="email" id="email-input" type="email" placeholder="Email" required />
        <input
          v-model="password"
          type="password"
          id="password-input"
          placeholder="Password"
          required
        />
        <button @click="createAccount(email, password)" id="create-account-btn" class="primary-btn">
          Opprett konto
        </button>
        <div>
          <h3>allerede har konto? <a @click="loginPage = true">Logg inn her</a></h3>
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
.google {
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
</style>
