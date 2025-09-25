<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  userPhoto?: string | null | undefined;
}>();

const emit = defineEmits<{
  (e: "signOut"): void;
}>();

const userProfile = props.userPhoto ? props.userPhoto : "./src/images/default-avatar.jpeg";
</script>
<template>
  <nav class="navbar" v-if="route.path == '/home'">
    <img :src="userProfile" alt="User Avatar" />
    <button @click="emit('signOut')">
      Logg ut <v-icon name="co-account-logout" scale="0.9" />
    </button>
    <button @click="router.push('/edit-profile')">
      Rediger Profil <v-icon name="la-user-edit-solid" scale="0.9" />
    </button>
  </nav>
  <nav
    class="navbar"
    v-else-if="route.path !== '/login' && route.path !== '/register' && route.path !== '/'"
  >
    <button @click="router.push('/home')">
      <v-icon name="bi-arrow-return-left" scale="0.7" /> Tilbake
    </button>
  </nav>
</template>

<style>
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
.navbar {
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
