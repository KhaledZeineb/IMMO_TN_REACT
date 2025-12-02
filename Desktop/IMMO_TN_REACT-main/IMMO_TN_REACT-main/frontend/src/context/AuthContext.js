import React, { createContext, useState, useContext, useEffect } from 'react';
import storage from '../services/storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
    
    // Set logout callback for API interceptor
    api.setLogoutCallback(() => {
      logout();
    });
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getItem('token');
      const storedUser = await storage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.setAuthToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      await storage.setItem('token', newToken);
      await storage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      api.setAuthToken(newToken);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      await storage.setItem('token', newToken);
      await storage.setItem('user', JSON.stringify(newUser));
      
      setToken(newToken);
      setUser(newUser);
      api.setAuthToken(newToken);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur d\'inscription' 
      };
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process');
      console.log('AuthContext: Current user:', user);
      console.log('AuthContext: Current token:', token);

      await storage.removeItem('token');
      await storage.removeItem('user');

      setToken(null);
      setUser(null);
      api.setAuthToken(null);

      console.log('AuthContext: Logout completed successfully');
      console.log('AuthContext: User after logout:', user);
      console.log('AuthContext: Token after logout:', token);
    } catch (error) {
      console.error('AuthContext: Error logging out:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      await storage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
