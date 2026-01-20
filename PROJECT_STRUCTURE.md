# Project Structure

```
chat-app/
│
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   └── ChatWindow.jsx   # Main chat interface
│   │   │   ├── Message/
│   │   │   │   └── MessageBubble.jsx # Individual message component
│   │   │   ├── Modals/
│   │   │   │   └── ProfileModal.jsx  # Profile editing modal
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx       # Chat list sidebar
│   │   │   │   └── ChatListItem.jsx  # Individual chat item
│   │   │   └── UI/
│   │   │       ├── Avatar.jsx        # User avatar component
│   │   │       ├── Button.jsx       # Reusable button
│   │   │       ├── Input.jsx        # Reusable input
│   │   │       └── Loading.jsx      # Loading spinner
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   ├── SocketContext.jsx    # Socket.IO connection
│   │   │   └── ThemeContext.jsx      # Dark mode state
│   │   ├── pages/
│   │   │   ├── Chat.jsx              # Main chat page
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Register.jsx          # Registration page
│   │   ├── services/
│   │   │   ├── api.js                # Axios configuration
│   │   │   ├── authService.js        # Auth API calls
│   │   │   ├── chatService.js        # Chat API calls
│   │   │   └── userService.js        # User API calls
│   │   ├── utils/
│   │   │   └── constants.js          # App constants
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   └── database.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Auth logic
│   │   ├── chatController.js         # Chat logic
│   │   └── userController.js         # User logic
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Chat.js                   # Chat schema
│   │   └── Message.js                # Message schema
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── chatRoutes.js             # Chat endpoints
│   │   └── userRoutes.js             # User endpoints
│   ├── socket/
│   │   └── socketHandler.js          # Socket.IO event handlers
│   ├── index.js                      # Server entry point
│   └── package.json
│
├── .env.example                      # Environment variables template
├── .gitignore
├── package.json                      # Root package.json
├── README.md                         # Project documentation
├── SETUP.md                          # Setup instructions
└── PROJECT_STRUCTURE.md              # This file
```

## Key Features Implemented

### Authentication
✅ User registration with name, email, password, and avatar
✅ JWT-based login
✅ Password hashing with bcrypt
✅ Protected routes middleware
✅ Persistent login with localStorage

### Chat Features
✅ Real-time 1-to-1 messaging with Socket.IO
✅ Online/Offline user status
✅ Typing indicators
✅ Message timestamps
✅ Read receipts (Seen/Delivered)
✅ Emoji support
✅ Sound notifications
✅ Auto-scroll to latest message
✅ Chat search (by user & message)

### UI/UX
✅ Glassmorphism design with gradient backgrounds
✅ Dark mode toggle
✅ Responsive design (Mobile + Desktop)
✅ Profile management modal
✅ User list with avatars
✅ Smooth animations with Framer Motion
✅ Modern typography and spacing

### Socket.IO Events
✅ `connection` - Socket connection
✅ `join_room` - Join chat room
✅ `send_message` - Send message
✅ `receive_message` - Receive message
✅ `typing` - Typing indicator
✅ `stop_typing` - Stop typing
✅ `user_online` - User online status
✅ `user_offline` - User offline status
✅ `message_seen` - Message seen confirmation

### Database Models
✅ User model with indexing
✅ Chat model with participant references
✅ Message model with chat and sender references
✅ All models include timestamps

## Technology Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS
- Socket.IO Client
- Context API
- Framer Motion
- Lucide Icons
- Emoji Picker React
- Date-fns

**Backend:**
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- JWT
- Bcrypt

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Chats
- `GET /api/chats` - Get all chats (protected)
- `POST /api/chats` - Create or get chat (protected)
- `GET /api/chats/:chatId` - Get specific chat (protected)
- `GET /api/chats/:chatId/messages` - Get messages (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:userId` - Get specific user (protected)
- `PUT /api/users/profile` - Update profile (protected)

