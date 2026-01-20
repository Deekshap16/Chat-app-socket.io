import { motion } from 'framer-motion';
import Avatar from '../UI/Avatar.jsx';
import { formatDistanceToNow } from 'date-fns';

const ChatListItem = ({ chat, isSelected, onClick, isOnline }) => {
  const participant = chat.participant;
  const lastMessage = chat.lastMessage;

  const formatTime = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2
        ${isSelected
          ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <Avatar
        src={participant?.avatar}
        alt={participant?.name}
        size="md"
        online={isOnline}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium truncate">{participant?.name}</p>
          {lastMessage && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
              {formatTime(lastMessage.createdAt)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {lastMessage?.content || 'No messages yet'}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatListItem;




