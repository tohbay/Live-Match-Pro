# LiveMatch Pro - Real-Time Football Match Center

LiveMatch Pro is a production-grade, real-time football match center built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Socket.IO client**. It connects directly to the production backend API at `https://profootball.srv883830.hstgr.cloud` and `wss://profootball.srv883830.hstgr.cloud`.

**🚀 Deployed URL:** [https://live-match-pro.onrender.com/](https://live-match-pro.onrender.com/)

---

## 🌟 Key Features

### 1. 📊 Real-Time Match Dashboard (`/`)

- Displays all current, live, upcoming, and completed football matches.
- Real-time score updates via Socket.IO (`score_update`) with animated visual highlights on goal changes.
- Live status indicators (`NOT_STARTED`, `FIRST_HALF`, `HALF_TIME`, `SECOND_HALF`, `FULL_TIME`) with pulsing badges.
- Filter matches by tab (`All Matches`, `🔴 Live Now`, `Upcoming`, `Finished`) and instant live search by team name or short code.
- Automatic fallback REST polling every 12s to ensure newly spawned matches appear seamlessly.

### 2. 🏟️ Match Detail View (`/match/[id]`)

- **Live Scoreboard**: Big match banner with team logos/badges, live minute counter, and status pill with amber accent for ended matches.
- **Match Timeline**: Chronological event feed displaying goals (⚽), yellow cards (🟨), red cards (🟥), substitutions (🔄), fouls (⚡), and shots (🎯) separated by home vs away team.
- **Visual Match Statistics**: Real-time progress bars comparing Ball Possession %, Shots, Shots on Target, Corners, Fouls, Yellow Cards, and Red Cards.
- **Match Ended Modal**: Displays final score and goal scorers when match concludes, with dismissible UI.
- Subscribes to match room updates on mount (`subscribe_match`) and cleans up on navigate-away (`unsubscribe_match`).
- Graceful error handling with toast notifications for 404 errors and automatic redirect countdown.

### 3. 💬 Live Fan Chat Room

- Dedicated real-time chat room for each match (`join_chat` / `leave_chat`).
- User identity stored in `localStorage` with prompt modal and handle customizer.
- **Typing Indicators**: Displays live typing status (`typing_start` / `typing_stop`) with dynamic debouncing.
- **Client-Side Rate Limiting**: Sliding window algorithm (5 messages per 10 seconds) with visual counter and wait time feedback.
- **Chat Persistence**: Messages persist in localStorage across page reloads for the same match.
- **Chat History**: Fetches complete message history from REST API and socket on join, ensuring new users see all previous messages.
- Chat continues to work after match ends (not restricted by match status).
- **500-Character Limit**: Character counter validation with visual feedback.
- System notifications when users join or leave the chat room.
- Separate visual feedback for client-side (amber) and server-side (rose) rate limit errors.

### 4. ⚡ Connection Resilience & Audio Alerts

- **Connection Status Badge & Banner**: Tracks socket connection state (`connected`, `reconnecting`, `disconnected`, `error`) with manual "Reconnect Now" option.
- **Automatic Reconnection Strategy**: Configured with automatic retries and fallback polling.
- **Web Audio API Goal Fanfare & Card Alerts**: Synthesizes stadium goal fanfare audio without external audio asset dependencies. Includes top navigation mute/unmute toggle.
- **Toast Notifications**: Global toast system for goals, cards, errors, and status updates with auto-dismiss.

---

## 🛠️ Architecture & Technical Decisions

### Framework & Stack

- **Framework**: Next.js 16 (App Router) for hybrid SSR and client-side reactivity
- **Language**: TypeScript for type safety and better developer experience
- **Styling**: Tailwind CSS with custom glassmorphism utilities, dark mode palette, and CSS keyframe animations
- **Real-Time**: Socket.IO client for WebSocket communication with production backend

### State Management & Architecture

- **SocketContext**: Unified WebSocket manager ensuring single-socket connection reuse, topic subscriptions, and global toast management across the app
- **Modular Hooks**: Custom hooks (`useMatchData`, `useMatchSocketEvents`) encapsulate data fetching, error handling, and socket event processing
- **Component Modularization**: Separated concerns with dedicated components (`MatchScoreboard`, `MatchTimeline`, `MatchStatistics`, `MatchChat`, `MatchTabSelector`, `MatchLoadingError`, `MatchEndedModal`)

### Data Persistence & Caching

- **localStorage**: Stores user identity, chat messages per match, and username for persistence across sessions
- **REST API Fallback**: Chat history fetched from `/api/matches/{matchId}/chat` when socket doesn't provide history
- **Multi-Layer Fallback**: localStorage → REST API → socket for reliable chat history loading

### Audio & Notifications

- **Web Audio API**: Synthesizes goal fanfare and card chimes using oscillators (`AudioContext`) to eliminate external audio asset dependencies and CORS issues
- **Toast System**: Global toast notifications for goals, cards, errors, and match status changes

### Error Handling & UX

- **Graceful Degradation**: Automatic redirect countdown for 404 errors with user-friendly toast messages
- **Rate Limiting**: Client-side throttling prevents server errors with visual feedback
- **Connection Resilience**: Manual reconnect option and automatic retry strategies

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

4. **Client-Side Rate Limiting**: Implementing rate limiting on the client side proactively prevents server errors and provides immediate user feedback, improving UX over waiting for server rejections.

5. **Chat History Multi-Fallback**: Using localStorage, REST API, and socket for chat history ensures reliability even if one mechanism fails, providing the best chance for users to see complete conversation history.

6. **Modular Architecture**: Breaking down large components into smaller, focused hooks and components improves maintainability, testability, and code reusability across the application.
