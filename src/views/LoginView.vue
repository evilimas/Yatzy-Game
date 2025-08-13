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
} from "firebase/auth";
import type { User } from "firebase/auth";

const email = ref("");
const password = ref("");
const user = ref<User | null>(null);

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

const createAccount = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    router.push("/home");
  } catch (error) {
    alert((error as Error).message);
  }
};
</script>

<template>
  <div>
    <section v-show="!user" id="logged-out-view">
      <h2>To start playing, please log in.</h2>
      <div class="container google">
        <div class="google-login">
          <button @click="signInWithGoogle" id="sign-in-with-google" class="provider-btn">
            <img src="/src/images/google.png" alt="google icon" /> Login with Google
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
        <button
          @click="createAccount(email, password)"
          id="create-account-btn"
          class="secondary-btn"
        >
          Create Account
        </button>
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
