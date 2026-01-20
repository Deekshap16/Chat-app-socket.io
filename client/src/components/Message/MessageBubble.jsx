import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import Avatar from '../UI/Avatar.jsx';

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isOwn && (
        <Avatar src={message.sender?.avatar} alt={message.sender?.name} size="sm" />
      )}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {!isOwn && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-2">
            {message.sender?.name}
          </p>
        )}
        <div
          className={`
            px-4 py-2 rounded-2xl break-words
            ${isOwn
              ? 'bg-indigo-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            <span className="text-xs">
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;




