import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';
import { useAd } from '../contexts/AdContext';
import api from '../api';
import Tooltip from '@mui/material/Tooltip';
import { io, Socket } from 'socket.io-client';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { adMargin } = useAd();
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      
      try {
        const response = await api.get('/api/chat/user/unread');
        setUnreadCount(response.data.count);
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
    
    // Set up polling for unread messages
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    
    // Listen for custom event when messages are read
    const handleMessagesRead = () => {
      fetchUnreadCount();
    };
    
    window.addEventListener('messagesRead', handleMessagesRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener('messagesRead', handleMessagesRead);
    };
  }, [user]);

  // Socket.IO for real-time updates
  useEffect(() => {
    if (!user) return;

    // Connect to Socket.IO server
    const newSocket = io(api.defaults.baseURL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      // Join user's personal room for receiving messages
      newSocket.emit('joinUserRoom', { userId: user._id });
    });

    newSocket.on('newMessage', (data) => {
      // Update unread count when new message is received for current user
      console.log('New message received:', data);
      setUnreadCount(prev => prev + 1);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    newSocket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      // Close socket connection before logout
      if (socket) {
        socket.close();
      }
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={1}
      sx={{ 
        marginRight: adMargin, 
        transition: 'margin-right 0.5s ease-out',
        width: `calc(100% - ${adMargin}px)`
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          color="primary"
          sx={{ flexGrow: 1, fontWeight: 700, textDecoration: 'none' }}
        >
          Share Dish
        </Typography>
        <Box>
          <Tooltip title="Home" arrow>
            <Button
              color={location.pathname === '/' ? 'primary' : 'inherit'}
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/' ? 'primary.main' : 'transparent',
                color: location.pathname === '/' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={<RestaurantIcon sx={{ fontSize: 26 }} />}
            >
              Home
            </Button>
          </Tooltip>
          <Tooltip title="Add Post" arrow>
            <Button
              color={location.pathname === '/add' ? 'primary' : 'inherit'}
              component={Link}
              to="/add"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/add' ? 'primary.main' : 'transparent',
                color: location.pathname === '/add' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/add' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={<AddIcon sx={{ fontSize: 26 }} />}
            >
              Add Post
            </Button>
          </Tooltip>
          <Tooltip title="Messages" arrow>
            <Button
              color={location.pathname === '/messages' ? 'primary' : 'inherit'}
              component={Link}
              to="/messages"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/messages' ? 'primary.main' : 'transparent',
                color: location.pathname === '/messages' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/messages' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={
                <Badge 
                  badgeContent={unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : null} 
                  color={unreadCount > 5 ? "error" : "warning"}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: unreadCount > 99 ? '0.6rem' : '0.75rem',
                      minWidth: unreadCount > 99 ? '16px' : '20px',
                      height: unreadCount > 99 ? '16px' : '20px',
                    }
                  }}
                >
                  <MessageIcon sx={{ fontSize: 26 }} />
                </Badge>
              }
            >
              Messages
            </Button>
          </Tooltip>
          <Tooltip title="Profile" arrow>
            <Button
              color={location.pathname === '/profile' ? 'primary' : 'inherit'}
              component={Link}
              to="/profile"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/profile' ? 'primary.main' : 'transparent',
                color: location.pathname === '/profile' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/profile' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={<PersonIcon sx={{ fontSize: 26 }} />}
            >
              Profile
            </Button>
          </Tooltip>
          <Button
            color="secondary"
            onClick={handleLogout}
            sx={{ fontWeight: 600, ml: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;