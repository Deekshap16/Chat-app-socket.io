import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { chatService } from '../../services/chatService.js';
import { userService } from '../../services/userService.js';
import Avatar from '../UI/Avatar.jsx';
import ProfileModal from '../Modals/ProfileModal.jsx';
import ChatListItem from './ChatListItem.jsx';

const Sidebar = ({ selectedChat, onSelectChat }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { onlineUsers } = useSocket();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'users'

  useEffect(() => {
    loadChats();
    loadUsers();
  }, []);

  const loadChats = async () => {
    try {
      const data = await chatService.getChats();
      setChats(data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers(searchQuery);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && searchQuery) {
      loadUsers();
    }
  }, [searchQuery, activeTab]);

  const handleUserSelect = async (userId) => {
    try {
      const chat = await chatService.createOrGetChat(userId);
      await loadChats();
      onSelectChat(chat);
      setActiveTab('chats');
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="h-full flex flex-col glass-strong border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Chat App
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar} alt={user?.name} size="md" online={true} />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'chats'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {/* Chat/User List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'chats' ? (
          <div className="p-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No chats yet. Start a conversation!
              </div>
            ) : (
              chats.map((chat) => (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  isSelected={selectedChat?._id === chat._id}
                  onClick={() => onSelectChat(chat)}
                  isOnline={onlineUsers.has(chat.participant?._id)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="p-2">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No users found
              </div>
            ) : (
              users.map((userItem) => (
                <motion.div
                  key={userItem._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserSelect(userItem._id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors mb-2"
                >
                  <Avatar
                    src={userItem.avatar}
                    alt={userItem.name}
                    size="md"
                    online={onlineUsers.has(userItem._id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{userItem.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {userItem.email}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
};

export default Sidebar;




