import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SocketProvider } from '../context/SocketContext.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import ChatWindow from '../components/Chat/ChatWindow.jsx';
import Loading from '../components/UI/Loading.jsx';

const Chat = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SocketProvider>
      <div className="h-screen flex overflow-hidden">
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <Sidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
        </div>
        <div className="flex-1 min-w-0">
          <ChatWindow chat={selectedChat} />
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;




