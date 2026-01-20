import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get all chats for current user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })
      .lean();

    // Filter out current user from participants and format response
    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      return {
        _id: chat._id,
        participant: otherParticipant,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });

    res.json(formattedChats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error fetching chats' });
  }
};

// @desc    Create or get existing chat
// @route   POST /api/chats
// @access  Private
export const createOrGetChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot create chat with yourself' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
    })
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('lastMessage');

    if (chat) {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      return res.json({
        _id: chat._id,
        participant: otherParticipant,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [currentUserId, userId],
    });

    await chat.populate('participants', 'name email avatar isOnline lastSeen');

    const otherParticipant = chat.participants.find(
      (p) => p._id.toString() !== userId.toString()
    );

    res.status(201).json({
      _id: chat._id,
      participant: otherParticipant,
      lastMessage: null,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error creating chat' });
  }
};

// @desc    Get specific chat
// @route   GET /api/chats/:chatId
// @access  Private
export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    })
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('lastMessage');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const otherParticipant = chat.participants.find(
      (p) => p._id.toString() !== userId.toString()
    );

    res.json({
      _id: chat._id,
      participant: otherParticipant,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Server error fetching chat' });
  }
};

// @desc    Get messages for a chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Reverse to get chronological order
    messages.reverse();

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};




