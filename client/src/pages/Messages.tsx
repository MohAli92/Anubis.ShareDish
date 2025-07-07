import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Message as MessageIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import api from '../api';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface Chat {
  _id: string;
  post: {
    _id: string;
    title: string;
    photo: string;
  };
  users: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
  messages: Array<{
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    text: string;
    createdAt: string;
  }>;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const { clearNotifications } = useNotifications();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (user?._id) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Join user's personal room for notifications
      newSocket.emit('joinUserRoom', { userId: user._id });

      // Listen for new messages
      newSocket.on('receiveMessage', (data) => {
        if (selectedChat && data.sender !== user._id) {
          // Update the selected chat with new message
          const updatedChat = {
            ...selectedChat,
            messages: [...selectedChat.messages, {
              sender: { _id: data.sender, firstName: 'Unknown', lastName: 'User' },
              text: data.text,
              createdAt: data.createdAt
            }]
          };
          setSelectedChat(updatedChat);

          // Update chats list
          setChats(prevChats => 
            prevChats.map(chat => 
              chat._id === selectedChat._id ? updatedChat : chat
            )
          );
        }
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user?._id, selectedChat]);

  // Clear notifications when entering messages page
  useEffect(() => {
    if (user) {
      clearNotifications();
    }
  }, [user, clearNotifications]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user || !user._id) {
        console.log('⚠️ No user or user ID found');
        return;
      }
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching chats for user:', user._id);
        console.log('🔍 API base URL:', api.defaults.baseURL);
        const response = await api.get('/api/chat/user/chats');
        console.log('✅ Chats response:', response.data);
        setChats(response.data);
      } catch (err: any) {
        console.error('❌ Error fetching chats:', err);
        console.error('❌ Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load conversations. Please try again later.');
        } else {
          setError('Failed to load conversations. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user?._id || !socket) return;

    setSending(true);
    try {
      const otherUser = selectedChat.users.find(u => u._id !== user._id);
      if (!otherUser) {
        console.error('Could not find other user in chat');
        setError('Could not find the other user in this conversation.');
        return;
      }

      // Send message via Socket.IO
      socket.emit('sendMessage', {
        postId: selectedChat.post._id,
        receiverId: otherUser._id,
        text: message
      });

      // Add message to UI immediately
      const newMessage = {
        sender: { _id: user._id, firstName: user.firstName, lastName: user.lastName },
        text: message,
        createdAt: new Date().toISOString()
      };

      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage]
      };

      setSelectedChat(updatedChat);
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === selectedChat._id ? updatedChat : chat
        )
      );

      setMessage('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      if (axios.isAxiosError(err)) {
        setActionError(err.response?.data?.error || 'Failed to send message.');
      } else {
        setActionError('Failed to send message.');
      }
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (chat: Chat) => {
    return chat.users.find(u => u._id !== user?._id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDeleteConversation = async () => {
    if (!selectedChat) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/api/chat/${selectedChat._id}`);
      setChats(prevChats => prevChats.filter(chat => chat._id !== selectedChat._id));
      setSelectedChat(null);
      setActionSuccess('Conversation deleted successfully');
      handleMenuClose();
    } catch (err: any) {
      setActionError('Failed to delete conversation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (!selectedChat || !user?._id) return;
    
    setActionLoading(true);
    try {
      const otherUser = getOtherUser(selectedChat);
      if (!otherUser) throw new Error('User not found');
      
      await api.post(`/api/users/${user._id}/block`, { blockedUserId: otherUser._id });
      setActionSuccess('User blocked successfully');
      setBlockDialogOpen(false);
      handleMenuClose();
    } catch (err: any) {
      setActionError('Failed to block user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReport = async () => {
    if (!selectedChat || !user?._id) return;
    
    setActionLoading(true);
    try {
      const otherUser = getOtherUser(selectedChat);
      if (!otherUser) throw new Error('User not found');
      
      await api.post(`/api/chat/${selectedChat._id}/report`, {
        reportedUserId: otherUser._id,
        message: reportMessage
      });
      setActionSuccess('Report submitted successfully');
      setReportDialogOpen(false);
      setReportMessage('');
      handleMenuClose();
    } catch (err: any) {
      setActionError('Failed to submit report');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1, border: '2px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff', boxShadow: 1 }}>
          <MessageIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700} color="primary">
            Messages
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              Conversations ({chats.length})
            </Typography>
            {chats.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No conversations yet. Start by contacting a post publisher!
                </Typography>
              </Box>
            ) : (
              <List>
                {chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  return (
                    <React.Fragment key={chat._id}>
                      <ListItem
                        button
                        selected={selectedChat?._id === chat._id}
                        onClick={() => setSelectedChat(chat)}
                        alignItems="flex-start"
                      >
                        <ListItemAvatar>
                          <Avatar src={otherUser?.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography fontWeight={600}>{otherUser?.firstName} {otherUser?.lastName}</Typography>
                            </Box>
                          }
                          secondary={
                            chat.messages.length > 0
                              ? chat.messages[chat.messages.length - 1].text
                              : 'No messages yet.'
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedChat && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={getOtherUser(selectedChat)?.avatar} />
                  <Typography variant="h6">
                    {getOtherUser(selectedChat)?.firstName} {getOtherUser(selectedChat)?.lastName}
                  </Typography>
                </Box>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleDeleteConversation}>Delete Conversation</MenuItem>
                  <MenuItem onClick={() => { setBlockDialogOpen(true); handleMenuClose(); }}>Block User</MenuItem>
                  <MenuItem onClick={() => { setReportDialogOpen(true); handleMenuClose(); }}>Report</MenuItem>
                </Menu>
              </Box>
            )}

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {selectedChat ? (
                <>
                  {selectedChat.messages.length === 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedChat.messages.map((msg, index) => {
                        const isSent = msg.sender._id === user?._id;
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: isSent ? 'flex-end' : 'flex-start',
                              mb: 1,
                            }}
                          >
                            <Paper
                              sx={{
                                p: 1.5,
                                borderRadius: 3,
                                boxShadow: 2,
                                backgroundColor: isSent ? 'primary.main' : 'grey.200',
                                color: isSent ? 'white' : 'text.primary',
                                borderTopRightRadius: isSent ? 0 : 12,
                                borderTopLeftRadius: isSent ? 12 : 0,
                                maxWidth: '70%',
                              }}
                            >
                              {isSent && (
                                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>
                                  You
                                </Typography>
                              )}
                              <Typography variant="body2">{msg.text}</Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {formatDate(msg.createdAt)}
                              </Typography>
                            </Paper>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography color="text.secondary">
                    Select a conversation to start messaging
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                >
                  {sending ? <CircularProgress size={20} /> : 'Send'}
                </Button>
              </Box>
            </Box>

            <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
              <DialogTitle>Block User</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to block this user? You will not receive messages from them.</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleBlockUser} color="error" disabled={actionLoading}>Block</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
              <DialogTitle>Report User</DialogTitle>
              <DialogContent>
                <Typography sx={{ mb: 2 }}>Describe the issue or misbehavior:</Typography>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  value={reportMessage}
                  onChange={e => setReportMessage(e.target.value)}
                  placeholder="Write your report here..."
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleReport} color="error" disabled={actionLoading || !reportMessage.trim()}>Submit Report</Button>
              </DialogActions>
            </Dialog>
            {actionSuccess && <Alert severity="success" sx={{ mt: 2 }}>{actionSuccess}</Alert>}
            {actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
