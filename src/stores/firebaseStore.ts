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
  const errorMsg = ref<string | null>(null);

  const allGameRooms = ref<{ id: string; data: GameRoomData }[]>([]);
  const gameData = ref<GameRoomData | null>(null);

  onAuthStateChanged(auth, (u) => {
    if (u) {
      user.value = u;
      fetchInRealTimeAndRenderMessagesFromDB();
      fetchOnlineUsers();
      fetchInRealTimeAndRenderScoresFromDB();
      fetchAllGameRooms();
      fetchAllHighScores();
      // listenToGameRoom();
      setUserOnline(u);
    } else {
      user.value = null;
      router.push("/");
    }
  });

  //   sign in functions

  const signInWithGoogle = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/home");
    } catch (error) {
      alert("Error signing in with Google");
      errorMsg.value = (error as Error).message || "Error signing in with Google";
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (error) {
      errorMsg.value = (error as Error).message || "Error signing in with email and password";
    }
  };

  //   create user functions

  const createAccount = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // sign out functions

  const signOutUser = async (): Promise<void> => {
    try {
      await setUserOffline(auth.currentUser!);
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //   update user functions

  const updateUserProfile = async (profileData: {
    displayName: string;
    photoURL: string;
  }): Promise<void> => {
    try {
      if (user.value) {
        await updateProfile(user.value, profileData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  //   fetch user online status functions

  const setUserOnline = async (user: User): Promise<void> => {
    try {
      await setDoc(doc(db, "usersStatus", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastOnline: serverTimestamp(),
        online: true,
      });
    } catch (error) {
      console.error("Error setting user online:", error);
    }
  };

  const fetchOnlineUsers = async (): Promise<void> => {
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

  const setUserOffline = async (user: User): Promise<void> => {
    await updateDoc(doc(db, "usersStatus", user.uid), {
      online: false,
    });
  };

  //   Live chat functions
  const addMessageToDB = async (message: string, user: User | null): Promise<void> => {
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
      console.error("Error adding message document: ", e);
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

  const fetchInRealTimeAndRenderMessagesFromDB = async (): Promise<void> => {
    const postsRef = collection(db, "messages");

    const q = query(postsRef, where("createdAt", "!=", null), orderBy("createdAt", "asc"));

    onSnapshot(q, (snapshot) => {
      messages.value = [];
      snapshot.forEach((doc) => {
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

  const editMessageInDB = async (docId: string, newText: string): Promise<void> => {
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

  const winner = (): string => {
    const scores = gameData.value?.scoreboards ?? [];
    const totals = scores.map((score) => scoreboardFunctions.total(score));
    const maxScore = Math.max(...totals);
    const winners = totals
      .map((score, index) => ({ player: index + 1, score }))
      .filter((entry) => entry.score === maxScore && maxScore > 0);

    const winnerDisplayName = winners
      .map(
        (winner) =>
          gameData.value?.players[winner.player - 1]?.displayName || `Player ${winner.player}`
      )
      .join(", ");

    if (winners.length === 0) {
      return "No winner";
    } else if (winners.length === 1) {
      return `${winnerDisplayName} wins!`;
    } else {
      return `It's a tie between: ${winnerDisplayName}`;
    }
  };

  // high score (multiplayer) functions

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

  const addAllHighScores = async () => {
    if (!gameData.value) return;
    gameData.value.players.forEach(async (player, index) => {
      const playerName = player.displayName || "Unknown Player";
      const score = gameData.value?.scoreboards[index] as CompleteScoreboard;
      const totalSum = scoreboardFunctions.total(score);
      await addHighScoreToDB(playerName, totalSum);
    });
  };
  const addHighScoreToDB = async (playerName: string, playerScore: number) => {
    try {
      await addDoc(collection(db, "highScores"), {
        user: playerName,
        score: playerScore,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchAllHighScores = async () => {
    const q = query(collection(db, "highScores"), orderBy("score", "desc"));
    onSnapshot(q, (snapshot) => {
      highScores.value = [];
      snapshot.forEach((doc) => {
        highScores.value.push({
          id: doc.id,
          user: doc.data().user,
          score: doc.data().score,
          createdAt: doc.data().createdAt,
        });
      });
    });
  };

  const fetchInRealTimeAndRenderScoresFromDB = async () => {
    const querySnapshot = await getDocs(collection(db, "highScores"));
    querySnapshot.forEach((doc) => {
      highScores.value.push({
        id: doc.id,
        user: doc.data().user,
        score: doc.data().score,
        createdAt: doc.data().createdAt,
      });
    });
  };

  // multiplayer functions

  const createGameRoom = async (user: User) => {
    const gameRef = await addDoc(collection(db, "games"), {
      createdBy: { uid: user.uid, displayName: user.displayName },
      players: [{ uid: user.uid, displayName: user.displayName, willRestart: false }],
      scoreboards: [emptyScoreboard()],
      dice: [1, 2, 3, 4, 5],
      holdDie: [false, false, false, false, false],
      activePlayer: { uid: user.uid, displayName: user.displayName },
      status: "waiting",
      gameStarted: false,
      throwCount: 3,
      createdAt: serverTimestamp(),
      uid: user?.uid,
      messages: [],
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
    // const player = gameData.value!.players.find((p) => p.uid === auth.currentUser?.uid);
    const gameDocRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameDocRef);
    if (!gameSnap.exists()) return;
    const data = gameSnap.data();
    const alreadyJoined = data.players.some((p: User) => p.uid === user.uid);
    if (gameData.value?.status === "playing" && !alreadyJoined) {
      alert("Spillet har allerede startet. Du kan ikke bli med nå.");
      router.push("/yatzy-mp");
    }

    if (!alreadyJoined) {
      await updateDoc(gameDocRef, {
        players: [
          ...data.players,
          { uid: user.uid, displayName: user.displayName, willRestart: false },
        ],
        scoreboards: [...data.scoreboards, emptyScoreboard()],
      });
    }
  };

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

  // place score and move to next turn function
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
    if (!gameData.value || gameData.value.throwCount <= 0) return;

    const newDice = gameData.value.dice.map((die, i) =>
      gameData.value?.holdDie[i] ? die : rollDie()
    );
    const newThrowCount = gameData.value.throwCount - 1;

    gameData.value.dice = newDice;
    gameData.value.throwCount = newThrowCount;

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

  // const resetHoldDie = () => {
  //   if (!gameData.value) return;
  //   gameData.value.holdDie = [false, false, false, false, false];

  // };
  const startGame = async (roomId: string) => {
    await updateDoc(doc(db, "games", roomId), {
      gameStarted: true,
      status: "playing",
    });
  };

  const confirmRestart = async (roomId: string) => {
    if (!gameData.value) return;
    const player = gameData.value.players.find((p) => p.uid === auth.currentUser?.uid);
    player!.willRestart = !player!.willRestart;
    await updateDoc(doc(db, "games", roomId), {
      players: gameData.value.players,
    });
    console.log("Player", player!.displayName, "willRestart set to", player!.willRestart);
    const allPlayersWantRestart = gameData.value.players.every((p) => p.willRestart === true);
    if (allPlayersWantRestart) {
      await restartGame(roomId);
      console.log("All players want to restart. Game is restarting...");
    }
  };

  const restartGame = async (roomId: string) => {
    if (!gameData.value) return;
    {
      await updateDoc(doc(db, "games", roomId), {
        gameStarted: false,
        status: "waiting",
        dice: [1, 2, 3, 4, 5],
        holdDie: [false, false, false, false, false],
        activePlayer: gameData.value.players[0],
        throwCount: 3,
        scoreboards: gameData.value.players.map(() => emptyScoreboard()),
        players: gameData.value.players.map((p) => ({ ...p, willRestart: false })),
      });
    }
  };

  // gameroom chat / messages functions

  const addRoomMessageToDB = async (message: string, gameId: string, user: User) => {
    // const player: Player | undefined = gameData.value!.players.find((p) => p.uid === auth.currentUser?.uid);
    const gameDocRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameDocRef);
    const messages = gameSnap.data()?.messages || [];
    if (!gameSnap.exists()) return;

    const data = gameSnap.data();
    await updateDoc(gameDocRef, {
      messages: [
        ...messages,
        {
          id: `${user.uid}-${Date.now()}`,
          // createdAt: serverTimestamp(),
          messageBody: message,
          uid: user.uid,
          displayName: user.displayName || user.email,
          profilePicture: user.photoURL,
        },
      ],
    });
    console.log("Room message added to DB for room ID:", gameId);
  };

  const postRoomMessage = (message: string, roomId: string) => {
    const messageBody = message;
    const user = auth.currentUser;

    if (messageBody) {
      addRoomMessageToDB(messageBody, roomId!, user!);
      console.log("Room message posted to room ID:", roomId, "Message:", messageBody);
    }
  };

  return {
    db,
    user,
    messages,
    onlineUsers,
    errorMsg,
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
    isGameFinished,
    rollDice,
    // resetHoldDie,
    holdDie,
    deleteGameRoom,
    startGame,
    restartGame,
    placeScoreAndNextTurn,
    winner,
    confirmRestart,
    postRoomMessage,
  };
});
