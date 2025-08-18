import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "@/services/firebase";
import { onAuthStateChanged, type User, updateProfile } from "firebase/auth";

export const useFirebaseStore = defineStore("firebase", () => {
  const user = ref<User | null>(null);

  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });

  const updateUserProfile = async (profileData: { displayName: string; photoURL: string }) => {
    if (user.value) {
      await updateProfile(user.value, profileData);
    }
  };

  return { user, updateUserProfile };
});
