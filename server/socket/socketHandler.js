import { socketAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

// Store active users
const activeUsers = new Map();

export const initializeSocket = (io) => {
  // Socket authentication middleware
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    const user = socket.user;

    console.log(`✅ User connected: ${user.name} (${userId})`);

    // Add user to active users
    activeUsers.set(userId, {
      socketId: socket.id,
      userId,
      user,
    });

    // Update user online status
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: new Date(),
    });

    // Emit user online to all clients
    io.emit('user_online', {
      userId,
      isOnline: true,
      lastSeen: new Date(),
    });

    // Join user's personal room
    socket.join(`user_${userId}`);

    // Handle join room (chat)
    socket.on('join_room', async (chatId) => {
      try {
        // Verify user is participant
        const chat = await Chat.findOne({
          _id: chatId,
          participants: userId,
        });

        if (chat) {
          socket.join(`chat_${chatId}`);
          console.log(`📨 User ${user.name} joined chat ${chatId}`);

          // Mark messages as read
          await Message.updateMany(
            {
              chat: chatId,
              sender: { $ne: userId },
              isRead: false,
            },
            {
              isRead: true,
              readAt: new Date(),
            }
          );

          // Emit message seen event
          io.to(`chat_${chatId}`).emit('message_seen', {
            chatId,
            userId,
          });
        }
      } catch (error) {
        console.error('Join room error:', error);
      }
    });

    // Handle send message
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content } = data;

        if (!chatId || !content) {
          return socket.emit('error', { message: 'Chat ID and content are required' });
        }

        // Verify user is participant
        const chat = await Chat.findOne({
          _id: chatId,
          participants: userId,
        });

        if (!chat) {
          return socket.emit('error', { message: 'Chat not found' });
        }

        // Create message
        const message = await Message.create({
          chat: chatId,
          sender: userId,
          content: content.trim(),
        });

        await message.populate('sender', 'name avatar');

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          lastMessageAt: message.createdAt,
        });

        // Emit to all users in the chat room
        io.to(`chat_${chatId}`).emit('receive_message', message);

        console.log(`💬 Message sent in chat ${chatId} by ${user.name}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.to(`chat_${chatId}`).emit('typing', {
          chatId,
          userId,
          userName: user.name,
        });
      }
    });

    // Handle stop typing
    socket.on('stop_typing', (data) => {
      const { chatId } = data;
      if (chatId) {
        socket.to(`chat_${chatId}`).emit('stop_typing', {
          chatId,
          userId,
        });
      }
    });

    // Handle message seen
    socket.on('message_seen', async (data) => {
      try {
        const { chatId, messageId } = data;

        if (chatId && messageId) {
          // Mark message as read
          await Message.findByIdAndUpdate(messageId, {
            isRead: true,
            readAt: new Date(),
          });

          // Emit to chat room
          io.to(`chat_${chatId}`).emit('message_seen', {
            chatId,
            messageId,
            userId,
          });
        }
      } catch (error) {
        console.error('Message seen error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${user.name} (${userId})`);

      // Remove from active users
      activeUsers.delete(userId);

      // Update user offline status
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // Emit user offline to all clients
      io.emit('user_offline', {
        userId,
        isOnline: false,
        lastSeen: new Date(),
      });
    });
  });
};




