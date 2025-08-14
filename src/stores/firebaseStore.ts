import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "@/services/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export const useFirebaseStore = defineStore("firebase", () => {
  const user = ref<User | null>(null);

  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });

  return { user };
});
