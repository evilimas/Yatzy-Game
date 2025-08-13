import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB9dqKoArRqK0bDt5XUdCydpRnVYSdGIlI",
  authDomain: "yatzy-spill.firebaseapp.com",
  projectId: "yatzy-spill",
  storageBucket: "yatzy-spill.firebasestorage.app",
  messagingSenderId: "3688327025",
  appId: "1:3688327025:web:7cae6e28ee13724df1f8d0",
  measurementId: "G-9HJ06BN7GV",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
