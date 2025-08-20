# Yatzy Game

A web-based Yatzy game built with Vue 3, TypeScript, Pinia, and Firebase.

## Features

- Play Yatzy localy with 1–4 players
- Interactive dice rolling and holding
- Automatic score calculation and scoreboard
- High score tracking (top 10, saved in browser)
- Live chat with real-time updates (Firebase)
- User authentication (Google and Email/Password via Firebase)
- User profile editing (display name and avatar)

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

- `src/components/` – Vue components (Dice, Scoreboard, Player, HighScore, etc.)
- `src/stores/` – Pinia store for game state
- `src/services/` – Game logic and types
- `src/views/` – Main views
- `public/` – Static assets
