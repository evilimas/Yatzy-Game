import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { auth } from "@/services/firebase";
import type { Message, HighScore } from "@/services/yatzy/types";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  Timestamp,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import router from "@/router";

export const useFirebaseStore = defineStore("firebase", () => {
  const db = getFirestore();
  const provider = new GoogleAuthProvider();

  const user = ref<User | null>(null);
  const messages = ref<Message[]>([]);
  const highScores = ref<HighScore[]>([]);

  onAuthStateChanged(auth, (u) => {
    if (u) {
      user.value = u;
      fetchInRealTimeAndRenderMessagesFromDB();
    } else {
      user.value = null;
      router.push("/");
    }
  });

  //   sign in functions

  const signInWithGoogle = async () => {
    try {
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
    }
  };

  //   create user functions

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

  // sign out functions

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //   update user functions

  const updateUserProfile = async (profileData: { displayName: string; photoURL: string }) => {
    if (user.value) {
      await updateProfile(user.value, profileData);
    }
  };

  //   Live chat functions
  const addMessageToDB = async (message: string, user: User | null) => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        messageBody: message,
        uid: user?.uid,
        displayName: user?.displayName || user?.email,
        profilePicture: user?.photoURL,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //   const fetchOnceAndRenderMessagesFromDB = async () => {
  //     messages.value = [];
  //     const querySnapshot = await getDocs(collection(db, "messages"));
  //     querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id}: ${doc.data().messageBody}`);
  //       messages.value.unshift({
  //         // displayName: doc.data().name,
  //         id: doc.id,
  //         user: doc.data().uid,
  //         displayName: doc.data().displayName,
  //         text: doc.data().messageBody,
  //         createdAt: doc.data().createdAt,
  //       });
  //     });
  //   };

  const fetchInRealTimeAndRenderMessagesFromDB = async () => {
    const postsRef = collection(db, "messages");

    const q = query(postsRef, where("createdAt", "!=", null), orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      messages.value = [];
      querySnapshot.forEach((doc) => {
        messages.value.push({
          id: doc.id,
          user: doc.data().uid,
          displayName: doc.data().displayName,
          text: doc.data().messageBody,
          createdAt: doc.data().createdAt,
          profilePicture: doc.data().profilePicture,
        });
      });
    });
  };

  // const sortedMessagesByDate = computed(() => {
  //   return messages.value.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
  // });

  const postMessage = (message: string) => {
    const messageBody = message;
    const user = auth.currentUser;

    if (messageBody) {
      addMessageToDB(messageBody, user);
    }
  };

  const displayDate = (firebaseDate: Timestamp) => {
    if (!firebaseDate) return "Date processing";
    const date = firebaseDate.toDate();
    const day = date.getDate();
    const year = date.getFullYear();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const paddedHours = hours < 10 ? "0" + hours : hours.toString();
    const paddedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();

    return `${day} ${month} ${year} - ${paddedHours}:${paddedMinutes}`;
  };

  // high score functions

  const addHighScoresToDB = async (score: string, user: User | null) => {
    try {
      const docRef = await addDoc(collection(db, "highScores"), {
        user: user?.uid,
        score: score,
        displayName: user?.displayName,
        date: serverTimestamp(),
        profilePicture: user?.photoURL,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchHighScores = async () => {
    const querySnapshot = await getDocs(collection(db, "highScores"));
    querySnapshot.forEach((doc) => {
      highScores.value.push({
        id: doc.id,
        user: doc.data().uid,
        score: doc.data().score,
        displayName: doc.data().displayName,
        date: doc.data().date,
        profilePicture: doc.data().profilePicture,
      });
    });
  };

  return {
    user,
    messages,
    // sortedMessagesByDate,
    highScores,
    fetchHighScores,
    updateUserProfile,
    addMessageToDB,
    postMessage,
    // fetchOnceAndRenderMessagesFromDB,
    fetchInRealTimeAndRenderMessagesFromDB,
    displayDate,
    signInWithGoogle,
    signInWithEmail,
    createAccount,
    signOutUser,
  };
});
