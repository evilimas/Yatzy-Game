import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "@/services/firebase";
import { onAuthStateChanged, type User, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, serverTimestamp, getDocs, onSnapshot } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export const useFirebaseStore = defineStore("firebase", () => {
  const db = getFirestore();

  const user = ref<User | null>(null);
  const messages = ref<
    { id: string; user: string; text: string; createdAt: Timestamp; displayName: string }[]
  >([]);

  onAuthStateChanged(auth, (u) => {
    user.value = u;
    fetchInRealTimeAndRenderMessagesFromDB();
  });

  //   update profile functions

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
    onSnapshot(collection(db, "messages"), (querySnapshot) => {
      messages.value = [];
      querySnapshot.forEach((doc) => {
        messages.value.unshift({
          // displayName: doc.data().name,
          id: doc.id,
          user: doc.data().uid,
          displayName: doc.data().displayName,
          text: doc.data().messageBody,
          createdAt: doc.data().createdAt,
        });
      });
    });
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

  return {
    user,
    messages,
    updateUserProfile,
    addMessageToDB,
    // fetchOnceAndRenderMessagesFromDB,
    fetchInRealTimeAndRenderMessagesFromDB,
    displayDate,
  };
});
