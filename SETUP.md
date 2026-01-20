# Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation Steps

### 1. Install Root Dependencies
```bash
npm install
```

### 2. Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Install Client Dependencies
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 4. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/chat-app
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:5173
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:
- **Local MongoDB**: Start the MongoDB service
- **MongoDB Atlas**: Use the connection string in `.env`

### 6. Run the Application

Start both server and client:
```bash
npm run dev
```

Or start them separately:

**Terminal 1 (Server):**
```bash
npm run server
```

**Terminal 2 (Client):**
```bash
npm run client
```

### 7. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify network access for MongoDB Atlas

### Port Already in Use
- Change `PORT` in `.env` for server
- Change port in `vite.config.js` for client

### Socket.IO Connection Issues
- Ensure `CLIENT_URL` in `.env` matches your frontend URL
- Check CORS settings in `server/index.js`

## Production Build

### Build Client
```bash
cd client
npm run build
```

### Start Production Server
```bash
cd server
NODE_ENV=production node index.js
```




