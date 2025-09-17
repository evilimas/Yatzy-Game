import { defineStore } from "pinia";
import { ref, computed, type ComputedRef, watch } from "vue";
import { emptyScoreboard, scoreboardFunctions, scoreFunctions } from "@/services/yatzy/scoreboard";
import { auth } from "@/services/firebase";
import type {
  Message,
  HighScore,
  GameRoomData,
  CompleteScoreboard,
  CompleteScoreboardWithUser,
} from "@/services/yatzy/types";
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
import {
  getFirestore,
  Timestamp,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  setDoc,
  Firestore,
  arrayUnion,
  doc,
} from "firebase/firestore";
import router from "@/router";
import type { YatzyCombination } from "@/yatzyLogic";

export const useFirebaseStore = defineStore("firebase", () => {
  const db = getFirestore();
  const provider = new GoogleAuthProvider();

  const user = ref<User | null>(null);
  const messages = ref<Message[]>([]);
  const highScores = ref<HighScore[]>([]);
  const onlineUsers = ref<User[]>([]);

  const allGameRooms = ref<{ id: string; data: GameRoomData }[]>([]);
  const gameData = ref<GameRoomData | null>(null);

  onAuthStateChanged(auth, (u) => {
    if (u) {
      user.value = u;
      setUserOnline(u);
      fetchInRealTimeAndRenderMessagesFromDB();
      fetchOnlineUsers();
      // fetchHighScores();
      fetchAllGameRooms();
      // listenToGameRoom();
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
      await setUserOffline(auth.currentUser!);
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

  //   fetch user online status functions

  const setUserOnline = async (user: User) => {
    await setDoc(doc(db, "usersStatus", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastOnline: serverTimestamp(),
      online: true,
    });
  };

  const fetchOnlineUsers = async () => {
    const onlineUsersRef = collection(db, "usersStatus");
    const q = query(onlineUsersRef, where("online", "==", true));
    onSnapshot(q, (querySnapshot) => {
      onlineUsers.value = [];
      querySnapshot.forEach((doc) => {
        onlineUsers.value.push(doc.data() as User);
      });
    });
  };

  // set user status to offline

  const setUserOffline = async (user: User) => {
    await updateDoc(doc(db, "usersStatus", user.uid), {
      online: false,
    });
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

  // const fetchOnceAndRenderMessagesFromDB = async () => {
  //   messages.value = [];
  //   const querySnapshot = await getDocs(collection(db, "messages"));
  //   querySnapshot.forEach((doc) => {
  //     console.log(`${doc.id}: ${doc.data().messageBody}`);
  //     messages.value.unshift({
  //       displayName: doc.data().name,
  //       id: doc.id,
  //       user: doc.data().uid,
  //       displayName: doc.data().displayName,
  //       text: doc.data().messageBody,
  //       createdAt: doc.data().createdAt,
  //     });
  //   });
  // };

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

  const editMessageInDB = async (docId: string, newText: string) => {
    const messageDoc = doc(db, "messages", docId);
    await updateDoc(messageDoc, { messageBody: newText });
  };

  const editMessage = (docId: string, messageUserUid: string) => {
    if (auth.currentUser?.uid === messageUserUid) {
      const editedMessage = prompt("Endre meldingen:", "");
      if (editedMessage) {
        editMessageInDB(docId, editedMessage);
      }
    } else {
      alert("du kan ikke endre andres meldinger");
    }
  };

  const deleteMessagefromDB = async (docId: string) => {
    await deleteDoc(doc(db, "messages", docId));
  };

  const deleteMessage = (docId: string, messageUserUid: string) => {
    if (auth.currentUser?.uid === messageUserUid) {
      if (confirm("Er du sikker på at du vil slette meldingen?")) {
        deleteMessagefromDB(docId);
      }
    } else {
      alert("Du kan ikke slette andres meldinger");
    }
  };

  const deleteGameRoomfromDB = async (roomId: string) => {
    await deleteDoc(doc(db, "games", roomId));
  };

  const deleteGameRoom = (roomId: string, roomUserUid: string) => {
    if (auth.currentUser?.uid === roomUserUid) {
      if (confirm("Er du sikker på at du vil slette spillrommet?")) {
        deleteGameRoomfromDB(roomId);
      }
    } else {
      alert("Du kan ikke slette andres spillrom");
    }
  };

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

  const isGameFinished = computed(() => {
    return gameData.value?.scoreboards.every((board) =>
      Object.values(board).every((score) => score !== null)
    );
  });

  watch(isGameFinished, (finished) => {
    if (finished) {
      addAllHighScores();
    }
  });
  const addAllHighScores = () => {
    if (!gameData.value) return;
    gameData.value.players.forEach((player, index) => {
      const playerName = player.displayName || "Unknown Player";
      const score = gameData.value?.scoreboards[index].total || 0;

      // Add the high score to the database
      addHighScoreToDB(playerName, score);
    });
  };
  const addHighScoreToDB = async (playerName: string, playerScore: number) => {
    try {
      await addDoc(collection(db, "highScores"), {
        user: playerName,
        score: playerScore,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // const addHighScoresToDB = async () => {
  //   try {
  //     const docRef = await addDoc(collection(db, "highScores"), {
  //       user: gameData.value?.displayName,
  //       score: score,
  //       displayName: gameData.value?.displayName,
  //       date: serverTimestamp(),
  //       profilePicture: gameData.value?.profilePicture,
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  // const fetchHighScores = async () => {
  //   const querySnapshot = await getDocs(collection(db, "highScores"));
  //   querySnapshot.forEach((doc) => {
  //     highScores.value.push({
  //       id: doc.id,
  //       user: doc.data().uid,
  //       score: doc.data().score,
  //       displayName: doc.data().displayName,
  //       date: doc.data().date,
  //       profilePicture: doc.data().profilePicture,
  //     });
  //   });
  // };

  // multiplayer functions

  const createGameRoom = async (user: User) => {
    const gameRef = await addDoc(collection(db, "games"), {
      createdBy: { uid: user.uid, displayName: user.displayName },
      players: [{ uid: user.uid, displayName: user.displayName }],
      scoreboards: [emptyScoreboard()],
      dice: [1, 2, 3, 4, 5],
      holdDie: [false, false, false, false, false],
      activePlayer: { uid: user.uid, displayName: user.displayName },
      status: "waiting",
      gameStarted: false,
      throwCount: 3,
      createdAt: serverTimestamp(),
      uid: user?.uid,
    });
    console.log("Game room created with ID:", gameRef.id);
    return gameRef.id;
  };

  // const joinGameRoom = async (gameId: string, user: User) => {
  //   await updateDoc(doc(db, "games", gameId), {
  //     players: arrayUnion({ uid: user.uid, displayName: user.displayName }),
  //     scoreboards: arrayUnion({ board: emptyScoreboard(), userId: user.uid }),
  //     // status: "playing",
  //   });
  // };

  const joinGameRoom = async (gameId: string, user: User) => {
    const gameDocRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameDocRef);
    if (!gameSnap.exists()) return;

    const data = gameSnap.data();
    const players = data.players || [];
    const scoreboards = data.scoreboards || [];

    if (!players.some((p: User) => p.uid === user.uid)) {
      players.push({ uid: user.uid, displayName: user.displayName });
      scoreboards.push(emptyScoreboard());
      await updateDoc(gameDocRef, {
        players,
        scoreboards,
      });
    }
  };

  // const listenToGameRoom = (gameId: string, callback: (gameData: GameRoomData) => void) => {
  //   return onSnapshot(doc(db, "games", gameId), (docSnap) => {
  //     const data = docSnap.data();
  //     if (data) {
  //       callback(data as GameRoomData);
  //     }
  //   });
  // };
  const listenToGameRoom = (gameId: string) => {
    const gameRef = doc(db, "games", gameId);
    return onSnapshot(gameRef, (snap) => {
      if (snap.exists()) {
        gameData.value = snap.data() as GameRoomData;
      } else {
        gameData.value = null;
      }
    });
  };

  const fetchAllGameRooms = async () => {
    const q = query(
      collection(db, "games"),
      where("createdAt", "!=", null),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      allGameRooms.value = [];
      snapshot.forEach((doc) => {
        allGameRooms.value.push({
          id: doc.id,
          data: doc.data() as GameRoomData,
        });
      });
    });
  };

  const completeScoreboards = computed<CompleteScoreboard[]>(() => {
    return (
      gameData.value?.scoreboards.map((sb) => {
        const complete: CompleteScoreboard = { ...sb };
        complete.sum = scoreboardFunctions.sum(sb);
        complete.bonus = scoreboardFunctions.bonus(sb);
        complete.total = scoreboardFunctions.total(sb);
        return complete;
      }) ?? []
    );
  });

  // place score and move to next turn
  const placeScoreAndNextTurn = async (combination: string | null, roomId: string) => {
    if (!gameData.value) return;
    const combo = combination as YatzyCombination;
    const playerIndex = gameData.value.players.findIndex(
      (p) => p.uid === gameData.value?.activePlayer.uid
    );
    if (!gameData.value.gameStarted || gameData.value.throwCount == 3) return;
    const scoreboard = gameData.value.scoreboards[playerIndex];
    const scoreFunction = scoreFunctions[combo];
    scoreboard[combo] = scoreFunction(gameData.value.dice as (1 | 2 | 3 | 4 | 5 | 6)[]);
    // move to next player
    const isLastPlayer = playerIndex >= gameData.value.players.length - 1;
    const nextPlayer = isLastPlayer
      ? gameData.value.players[0]
      : gameData.value.players[playerIndex + 1];
    // reset for next turn
    gameData.value.activePlayer = nextPlayer;
    gameData.value.throwCount = 3;
    gameData.value.holdDie = [false, false, false, false, false];
    gameData.value.dice = [1, 2, 3, 4, 5];
    await updateDoc(doc(db, "games", roomId), {
      scoreboards: gameData.value.scoreboards,
      activePlayer: gameData.value.activePlayer,
      throwCount: gameData.value.throwCount,
      holdDie: gameData.value.holdDie,
      dice: gameData.value.dice,
    });
  };

  // Dice functions

  const rollDie = () => Math.floor(Math.random() * 6) + 1;

  const rollDice = async (roomId?: string) => {
    const g = gameData.value;
    if (!g || g.throwCount <= 0) return;

    const newDice = g.dice.map((die, i) => (g.holdDie[i] ? die : rollDie()));
    const newThrowCount = g.throwCount - 1;

    // update local state
    g.dice = newDice;
    g.throwCount = newThrowCount;

    if (roomId) {
      await updateDoc(doc(db, "games", roomId), {
        dice: newDice,
        throwCount: newThrowCount,
      });
      console.log("Game room updated with ID:", roomId, "Dice:", newDice);
    }
  };

  const holdDie = async (index: number, roomId?: string) => {
    if (!gameData.value) return;
    gameData.value.holdDie[index] = !gameData.value.holdDie[index];

    if (roomId) {
      await updateDoc(doc(db, "games", roomId), {
        holdDie: gameData.value.holdDie,
      });
      console.log("Game room updated with ID:", roomId, "Hold Die:", gameData.value.holdDie);
    }
  };

  const resetHoldDie = () => {
    if (!gameData.value) return;
    gameData.value.holdDie = [false, false, false, false, false];
    // gameData.value.dice = [1, 2, 3, 4, 5];
  };
  const startGame = async (roomId: string) => {
    if (!gameData.value) return;
    await updateDoc(doc(db, "games", roomId), {
      gameStarted: true,
      status: "playing",
    });
  };
  const restartGame = async (roomId: string) => {
    if (!gameData.value) return;
    await updateDoc(doc(db, "games", roomId), {
      gameStarted: false,
      status: "waiting",
      dice: [1, 2, 3, 4, 5],
      holdDie: [false, false, false, false, false],
      activePlayer: gameData.value.players[0],
      throwCount: 3,
      scoreboards: gameData.value.players.map(() => emptyScoreboard()),
    });
  };

  return {
    db,
    user,
    messages,
    onlineUsers,
    // sortedMessagesByDate,
    highScores,
    // fetchHighScores,
    // addHighScoresToDB,
    updateUserProfile,
    addMessageToDB,
    postMessage,
    // fetchOnceAndRenderMessagesFromDB,
    fetchInRealTimeAndRenderMessagesFromDB,
    deleteMessage,
    editMessage,
    displayDate,
    signInWithGoogle,
    signInWithEmail,
    createAccount,
    signOutUser,
    createGameRoom,
    joinGameRoom,
    listenToGameRoom,
    fetchAllGameRooms,
    allGameRooms,
    completeScoreboards,
    gameData,
    rollDice,
    resetHoldDie,
    holdDie,
    deleteGameRoom,
    startGame,
    restartGame,
    placeScoreAndNextTurn,
  };
});
