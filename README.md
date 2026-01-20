![Demo image ]

# 💬 Real-Time Chat Application

A modern, full-stack real-time chat application built with MERN Stack and Socket.IO.

## 🚀 Features

### Authentication
- User registration with profile avatar
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes
- Persistent login with localStorage

### Chat Features
- Real-time 1-to-1 messaging
- Online/Offline user status
- Typing indicators
- Message timestamps
- Read receipts (Seen/Delivered)
- Emoji support
- Sound notifications
- Auto-scroll to latest message
- Chat search (by user & message)

### UI/UX
- Modern glassmorphism design
- Dark mode toggle
- Responsive design (Mobile + Desktop)
- Smooth animations with Framer Motion
- Profile management
- User list with avatars

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Socket.IO Client
- Context API
- Framer Motion
- Lucide Icons

**Backend:**
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- JWT Authentication

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB URI and JWT secret.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 5173).

## 📁 Project Structure

```
chat-app/
├── client/          # React frontend
├── server/          # Node.js backend
├── .env.example    # Environment variables template
└── README.md       # This file
```

## 🔌 Socket.IO Events

### Client → Server
- `join_room` - Join a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `message_seen` - Mark message as seen

### Server → Client
- `receive_message` - Receive a new message
- `user_online` - User came online
- `user_offline` - User went offline
- `typing` - Typing indicator
- `stop_typing` - Stop typing indicator
- `message_seen` - Message seen confirmation

## 🗄️ Database Models

- **User**: Stores user information (name, email, password, avatar)
- **Chat**: Stores chat conversations between users
- **Message**: Stores individual messages with references to chat and sender

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Chats
- `GET /api/chats` - Get all chats for current user
- `POST /api/chats` - Create or get existing chat
- `GET /api/chats/:chatId` - Get specific chat
- `GET /api/chats/:chatId/messages` - Get messages for a chat

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get specific user
- `PUT /api/users/profile` - Update user profile (protected)

## 🎨 UI Features

- Glassmorphism design with gradient backgrounds
- Smooth animations and transitions
- Dark mode support
- Fully responsive layout
- Modern typography and spacing

## 📝 License

ISC

## 👨‍💻 Author

Built for MERN Stack internship project.



