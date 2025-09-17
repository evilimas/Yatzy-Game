# Yatzy Game

A web-based Yatzy game built with Vue 3, TypeScript, Pinia, and Firebase.

## Features

- Play Yatzy locally (1–4 players) or online with friends
- Interactive dice rolling and holding
- Automatic score calculation and multiplayer scoreboard
- High score tracking (local and online)
- Live chat with real-time updates (Firebase)
- User authentication (Google and Email/Password via Firebase)
- User profile editing (display name and avatar)
- Multiplayer game rooms (create/join)
- Real-time game state sync via Firestore

## Getting Started

1. **Install dependencies:**

   ```
   npm install
   ```

2. **Run the development server:**

   ```
   npm run dev
   ```

3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Project Structure

- `src/components/` – Vue components (Dice, Scoreboard, Player, HighScore, LiveChat, etc.)
- `src/stores/` – Pinia stores for game state and Firebase
- `src/services/` – Game logic and types
- `src/views/` – Main views (Home, GameRoom, Yatzy, Multiplayer, etc.)
- `src/router/` – Vue Router configuration
- `public/` – Static assets
- `src/images/` – Avatars and icons

## Multiplayer

- Create or join a game room to play Yatzy online with others.
- Game state, dice, and scoreboards are synced in real-time using Firebase Firestore.
- Live chat is available in each game room.

## Development Notes

- Uses [oh-vue-icons](https://oh-vue-icons.js.org/) for dice and UI icons.
- All multiplayer logic and chat use Firestore real-time listeners.
- Local and online high scores are tracked separately.
