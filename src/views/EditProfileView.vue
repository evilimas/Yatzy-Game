<script lang="ts" setup>
import { ref } from "vue";
import { useFirebaseStore } from "../stores/firebaseStore";
import { useRouter } from "vue-router";

const router = useRouter();

const firebaseStore = useFirebaseStore();
const displayName = ref(firebaseStore.user?.displayName || "");
const photoURL = ref(firebaseStore.user?.photoURL || "");

const updateProfile = async () => {
  const profileData: { displayName: string; photoURL: string } = {
    displayName: displayName.value,
    photoURL: photoURL.value,
  };
  try {
    await firebaseStore.updateUserProfile(profileData);
    alert("Profil oppdatert!");
    router.push("/home");
  } catch (error) {
    alert("Det oppstod en feil under oppdatering av profil.");
    console.error(error);
  }
};
</script>

<template>
  <div class="top-section">
    <img :src="firebaseStore.user?.photoURL || './default-avatar.jpeg'" alt="" />
    <p>{{ firebaseStore.user?.displayName || "Uten navn" }}</p>
  </div>
  <div class="container">
    <h1>Rediger Profil</h1>
    <form @submit.prevent="updateProfile">
      <div>
        <p>Visningsnavn:</p>
        <input type="text" id="displayName" v-model="displayName" />

        <p>Profilbilde URL:</p>
        <input type="text" id="photoURL" v-model="photoURL" />
      </div>
      <button type="submit">Oppdater Profil</button>
      <button @click="router.push('/home')">Tilbake til Hjem</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
form div {
  display: flex;
  flex-direction: column;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
input {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  gap: 0.5em;
}
label {
  font-weight: bold;
}
.top-section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 1em;
  align-items: center;
}
img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1em;
}
.top-section p {
  font-size: 1.8em;
  font-weight: 600;
}
</style>
