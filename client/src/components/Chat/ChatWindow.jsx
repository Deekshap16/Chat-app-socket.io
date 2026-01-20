import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { chatService } from '../../services/chatService.js';
import { SOCKET_EVENTS } from '../../utils/constants.js';
import Avatar from '../UI/Avatar.jsx';
import MessageBubble from '../Message/MessageBubble.jsx';
import Loading from '../UI/Loading.jsx';

const ChatWindow = ({ chat }) => {
  const { user } = useAuth();
  const { socket, isConnected, joinRoom, sendMessage, typing, stopTyping } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chat?._id) {
      loadMessages();
      joinRoom(chat._id);
    }

    return () => {
      if (socket) {
        socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
        socket.off(SOCKET_EVENTS.TYPING);
        socket.off(SOCKET_EVENTS.STOP_TYPING);
      }
    };
  }, [chat?._id]);

  useEffect(() => {
    if (socket && chat?._id) {
      const handleReceiveMessage = (message) => {
        if (message.chat === chat._id || message.chat._id === chat._id) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
          playNotificationSound();
        }
      };

      const handleTyping = (data) => {
        if (data.chatId === chat._id && data.userId !== user._id) {
          setIsTyping(true);
        }
      };

      const handleStopTyping = (data) => {
        if (data.chatId === chat._id && data.userId !== user._id) {
          setIsTyping(false);
        }
      };

      socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.on(SOCKET_EVENTS.TYPING, handleTyping);
      socket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);

      return () => {
        socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
        socket.off(SOCKET_EVENTS.TYPING, handleTyping);
        socket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
      };
    }
  }, [socket, chat?._id, user._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!chat?._id) return;
    setLoading(true);
    try {
      const data = await chatService.getMessages(chat._id);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZijYIGmS37+OcTgwOUKfk8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yo2CBpkt+/jnE4MDlCn5PC2YxwGOJHX8sx5LAUkd8fw3ZBAC');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {
      // Ignore audio errors
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected || !chat?._id) return;

    sendMessage(chat._id, newMessage.trim());
    setNewMessage('');
    setShowEmojiPicker(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTyping(chat._id);
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (e.target.value.trim() && isConnected && chat?._id) {
      typing(chat._id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(chat._id);
      }, 1000);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center glass-strong">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  const participant = chat.participant;

  return (
    <div className="h-full flex flex-col glass-strong">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <Avatar src={participant?.avatar} alt={participant?.name} size="md" />
        <div className="flex-1">
          <p className="font-medium">{participant?.name}</p>
          {isTyping && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">typing...</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.sender._id === user._id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 pr-12 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!isConnected}
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 z-10"
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;




