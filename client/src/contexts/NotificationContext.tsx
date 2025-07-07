import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface Notification {
  id: string;
  type: 'message' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentAlert, setCurrentAlert] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const { user } = useAuth();

  // Initialize Socket.IO connection
  useEffect(() => {
    if (user?._id) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Join user's personal room for notifications
      newSocket.emit('joinUserRoom', { userId: user._id });

      // Listen for new messages
      newSocket.on('newMessage', (data) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'message',
          title: 'New Message',
          message: `You have a new message from ${data.senderName}`,
          timestamp: new Date()
        };

        addNotification(notification);
        setUnreadCount(prev => prev + 1);
        
        // Show toast notification
        setCurrentAlert({
          open: true,
          message: `New message from ${data.senderName}`,
          severity: 'info'
        });
      });

      // Listen for other notifications
      newSocket.on('notification', (data) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: data.type || 'info',
          title: data.title || 'Notification',
          message: data.message,
          timestamp: new Date()
        };

        addNotification(notification);
        
        // Show toast notification
        setCurrentAlert({
          open: true,
          message: data.message,
          severity: data.type === 'error' ? 'error' : 
                   data.type === 'success' ? 'success' : 
                   data.type === 'warning' ? 'warning' : 'info'
        });
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user?._id]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50 notifications
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleAlertClose = () => {
    setCurrentAlert(prev => ({ ...prev, open: false }));
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={currentAlert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={currentAlert.severity}
          sx={{ width: '100%' }}
        >
          {currentAlert.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}; 