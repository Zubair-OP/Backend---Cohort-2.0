# Perplexity Clone / AI Chat Platform

Perplexity is a production-style AI chat application built to practice real-world backend architecture, streaming AI responses, authentication, and multi-service integration.

This project focuses on a conversational experience where users can sign in, start chats, stream AI responses, and view message history from the sidebar.

## What This Project Does

- Provides register and login flows
- Supports protected chat access
- Streams AI responses token by token
- Saves and loads chat history
- Allows switching between past chats
- Supports deleting chats
- Uses socket connections for realtime features
- Renders Markdown and code blocks in AI responses

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Cookie-based sessions
- Socket.IO
- LangChain
- Groq
- Google GenAI integration
- Tavily integration
- Multer
- Helmet, CORS, Morgan

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- Axios
- Socket.IO client
- React Markdown
- remark-gfm
- React Speech Recognition
- Tailwind CSS
- Highlight.js

## Main Flow

1. User opens the app.
2. App checks whether the current user is authenticated.
3. If not authenticated, user goes to login or register.
4. After login, user reaches the chat dashboard.
5. Sidebar loads previous chats.
6. User sends a message.
7. Backend streams the AI reply.
8. Frontend updates the message live as chunks arrive.
9. Final answer and sources are saved into chat history.

## Project Features

### Authentication

- Register new users
- Login existing users
- Protected routes
- Current-user bootstrap on app load

### Chat Experience

- Start a new chat
- Select old chats from sidebar
- Delete chats
- Stream assistant replies
- Stop generation mid-response
- Show sources when available

### Response Rendering

- Markdown support
- GitHub-flavored Markdown tables and lists
- Syntax-highlighted code blocks
- Clean dark-mode chat UI

### Realtime Layer

- Socket.IO connection initialization
- Realtime-ready architecture for chat events

## Routes

### Frontend Routes

- `/` - Chat dashboard
- `/login` - Login page
- `/register` - Register page

### Backend Routes

#### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/get-me`
- `GET /api/auth/logout`

#### Chat

- `POST /api/chat/message`
- `POST /api/chat/message/stream`
- `GET /api/chat`
- `GET /api/chat/messages/:Id`
- `DELETE /api/chat/delete/:Id`

## Repository Structure

```text
Perplexity/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── controller/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── sockets/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.routes.jsx
│   │   ├── config/
│   │   ├── features/
│   │   └── app.store.js
│   └── package.json
└── readme.md
```

## Local Setup

### 1) Backend

Install dependencies:

```bash
cd backend
npm install
```

Run backend:

```bash
npm run dev
```

The backend runs on port `3000` by default.

### 2) Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm run dev
```

The frontend typically runs on `http://localhost:5173`.

## Environment Variables

### Backend `.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
TAVILY_API_KEY=your_tavily_api_key
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000
```

For production, use your deployed backend URL in `VITE_API_URL`.

## Production / Deployment Notes

- Backend and frontend should point to the same deployed origin if they are served together.
- If deployed separately, set the frontend API URL to the backend domain.
- The socket server CORS list should include the deployed frontend URL.
- In production, make sure any proxy or hosting layer forwards the correct origin and protocol.

## How The App Works Internally

### Chat Lifecycle

1. The frontend initializes the socket connection.
2. The dashboard loads chat sessions from the backend.
3. When a user sends a message, the frontend creates a streaming request.
4. The backend processes the prompt and streams back chunks.
5. The UI appends chunks into the assistant message live.
6. When the stream finishes, the message is finalized and chat history is refreshed.

### Protected Access

- The dashboard is protected.
- Authentication is checked on app load.
- Users must be logged in to use the main chat experience.

## Good To Know

- Messages support Markdown rendering.
- Code blocks are highlighted automatically.
- Sources are shown when the AI response includes them.
- The stop button can cancel a running stream.

## Suggested Improvements For Future

- Add deployment screenshots
- Add architecture diagrams
- Add API request/response examples
- Add links to live app and demo video
- Add project-specific screenshots for the chat UI

## Summary

Perplexity is one of my key learning projects for building a production-style AI chat experience. It combines authentication, streaming AI responses, realtime architecture, and a polished frontend to simulate how a modern conversational app is structured and deployed.