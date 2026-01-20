import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored token and user
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        // Verify token is still valid
        authService.getMe()
          .then((user) => {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } catch (error) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login...');
      const data = await authService.login({ email, password });
      console.log('✅ Login successful');
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 Attempting registration...');
      const data = await authService.register({ name, email, password });
      console.log('✅ Registration successful');
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};




