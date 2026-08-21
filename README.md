# LiveMatch Pro - Real-Time Football Match Center

LiveMatch Pro is a production-grade, real-time football match center built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Socket.IO client**. It connects directly to the production backend API at `https://profootball.srv883830.hstgr.cloud` and `wss://profootball.srv883830.hstgr.cloud`.

---

## 🌟 Key Features

### 1. 📊 Real-Time Match Dashboard (`/`)
- Displays all current, live, upcoming, and completed football matches.
- Real-time score updates via Socket.IO (`score_update`) with animated visual highlights on goal changes.
- Live status indicators (`1ST HALF`, `HALF_TIME`, `2ND HALF`, `FULL_TIME`) with pulsing badges.
- Filter matches by tab (`All Matches`, `🔴 Live Now`, `Upcoming`, `Finished`) and instant live search by team name or short code.
- Automatic fallback REST polling every 12s to ensure newly spawned matches appear seamlessly.

### 2. 🏟️ Match Detail View (`/match/[id]`)
- **Live Scoreboard**: Big match banner with team logos/badges, live minute counter, and status pill.
- **Match Timeline**: Chronological event feed displaying goals (⚽), yellow cards (🟨), red cards (🟥), substitutions (🔄), fouls (⚡), and shots (🎯) separated by home vs away team.
- **Visual Match Statistics**: Real-time progress bars comparing Ball Possession %, Shots, Shots on Target, Corners, Fouls, Yellow Cards, and Red Cards.
- Subscribes to match room updates on mount (`subscribe_match`) and cleans up on navigate-away (`unsubscribe_match`).

### 3. 💬 Live Fan Chat Room
- Dedicated real-time chat room for each match (`join_chat` / `leave_chat`).
- User identity stored in `localStorage` with prompt modal and top navbar handle customizer.
- **Typing Indicators**: Displays live typing status (`typing_start` / `typing_stop`) with dynamic debouncing.
- **500-Character Limit & Rate Limiting**: Character counter validation and visual toast notifications when server rate limits or errors occur.
- System notifications when users join or leave the chat room.

### 4. ⚡ Connection Resilience & Audio Alerts
- **Connection Status Badge & Banner**: Tracks socket connection state (`connected`, `reconnecting`, `disconnected`, `error`) with a manual "Reconnect Now" option.
- **Automatic Reconnection Strategy**: Configured with automatic retries and fallback polling.
- **Web Audio API Goal Fanfare & Card Alerts**: Synthesizes stadium goal fanfare audio without external audio asset dependencies. Includes a top navigation mute/unmute toggle.

---

## 🛠️ Architecture & Technical Decisions

- **Framework**: Next.js 14 (App Router) for hybrid SSR and client-side reactivity.
- **State & Socket Architecture**: `SocketContext` provides a unified WebSocket manager across the app, ensuring single-socket connection reuse, topic subscriptions, and global toast management.
- **Audio Synthesis**: Used Web Audio API oscillators (`AudioContext`) to generate custom goal fanfare and warning chimes directly in code, eliminating broken audio assets or external CORS audio issues.
- **Styling**: Tailwind CSS with custom glassmorphism utilities, dark mode palette, and CSS keyframe animations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open browser at http://localhost:3000
```

### Production Build & Verification

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## ⚖️ Trade-offs & Decisions

1. **Client Context Socket Provider**: Socket.IO client connection is encapsulated inside a Client Component (`SocketContext`) wrapped around `RootLayout`. This allows page transitions between `/` and `/match/[id]` to retain the active WebSocket connection without re-authenticating or re-establishing TCP handshakes.
2. **REST Polling Fallback**: While WebSocket is the primary real-time transport, a low-frequency REST poll (every 12 seconds) runs in the background on the dashboard to discover newly created simulation matches without forcing a full page reload.
3. **Web Audio API vs Audio Files**: Synthesizing audio via the Web Audio API ensures zero network latency, zero missing audio asset errors, and instant sound playback across browser security policies.
