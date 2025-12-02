import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    updateUnreadCount();
  }, [notifications]);

  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data);
      
      // Also fetch unread count
      const countResponse = await api.get('/notifications/unread-count');
      setUnreadCount(countResponse.data.count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = () => {
    const count = notifications.filter(n => !n.is_read).length;
    setUnreadCount(count);
  };

  const addNotification = async (notification) => {
    if (!isAuthenticated) return;
    
    try {
      await api.post('/notifications', notification);
      await loadNotifications(); // Refresh the list
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (id) => {
    if (!isAuthenticated) return;
    
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      updateUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!isAuthenticated) return;
    
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    if (!isAuthenticated) return;
    
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      updateUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    if (!isAuthenticated) return;
    
    try {
      // Delete all notifications one by one
      await Promise.all(notifications.map(n => api.delete(`/notifications/${n.id}`)));
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refreshNotifications: loadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;
