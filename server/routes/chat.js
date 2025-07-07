const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get chat messages for a post
router.get('/:postId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ post: req.params.postId }).populate('messages.sender');
    res.json(chat ? chat.messages : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get private chat messages for a post between two users
router.get('/:postId/:userId1/:userId2', auth, async (req, res) => {
  try {
    const { postId, userId1, userId2 } = req.params;
    
    // Check if current user is one of the participants
    if (req.user._id.toString() !== userId1 && req.user._id.toString() !== userId2) {
      return res.status(403).json({ error: 'Not authorized to view this chat' });
    }
    
    const chat = await Chat.findOne({
      post: postId,
      users: { $all: [userId1, userId2], $size: 2 }
    }).populate('messages.sender');
    res.json(chat ? chat.messages : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a new message to a chat
router.post('/:postId/message', auth, async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const sender = req.user._id;
    console.log('Received message POST:', { postId: req.params.postId, sender, receiver, text });
    
    if (!receiver || !text) {
      console.error('Missing required fields:', { receiver, text });
      return res.status(400).json({ error: 'Missing required fields: receiver, text' });
    }

    let chat = await Chat.findOne({
      post: req.params.postId,
      users: { $all: [sender, receiver], $size: 2 }
    });
    
    console.log('Found existing chat:', chat ? chat._id : 'none');
    
    if (!chat) {
      console.log('Creating new chat for post:', req.params.postId);
      chat = new Chat({ post: req.params.postId, users: [sender, receiver], messages: [] });
    }
    
    // Block check
    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);
    if (receiverUser?.blocked?.includes(sender)) {
      return res.status(403).json({ error: 'You are blocked by this user.' });
    }
    if (senderUser?.blocked?.includes(receiver)) {
      return res.status(403).json({ error: 'You have blocked this user.' });
    }
    
    chat.messages.push({ sender, text });
    console.log('Saving chat with new message...');
    await chat.save();
    
    console.log('Message saved successfully');
    res.status(201).json(chat.messages[chat.messages.length - 1]);
  } catch (err) {
    console.error('Error in POST /:postId/message:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all private chats for current user
router.get('/user/chats', auth, async (req, res) => {
  console.log('GET /chat/user/chats called for user:', req.user._id);
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ users: userId })
      .populate('users', 'firstName lastName avatar')
      .populate('post', 'title photo');
    
    // Filter out chats with null posts (deleted posts)
    const validChats = chats.filter(chat => chat.post !== null);
    
    console.log(`Found ${chats.length} chats for user ${userId}, ${validChats.length} with valid posts`);
    res.json(validChats);
  } catch (err) {
    console.error('Error fetching user chats:', err);
    res.status(500).json({ error: 'Failed to fetch user chats' });
  }
});

// Create or fetch a private chat for a post between two users
router.post('/start', auth, async (req, res) => {
  try {
    const { postId, userId2 } = req.body;
    const userId1 = req.user._id;
    
    if (!postId || !userId2) {
      return res.status(400).json({ error: 'Missing required fields: postId, userId2' });
    }
    
    let chat = await Chat.findOne({
      post: postId,
      users: { $all: [userId1, userId2], $size: 2 }
    });
    if (!chat) {
      chat = new Chat({ post: postId, users: [userId1, userId2], messages: [] });
      await chat.save();
    }
    await chat.populate('users', 'firstName lastName avatar');
    await chat.populate('post', 'title photo');
    res.json(chat);
  } catch (err) {
    console.error('Error in POST /start:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a chat by ID
router.delete('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    
    // Check if user is part of the chat
    if (!chat.users.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this chat' });
    }
    
    await Chat.findByIdAndDelete(req.params.chatId);
    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report a chat
router.post('/:chatId/report', auth, async (req, res) => {
  try {
    const { reportedUserId, message } = req.body;
    const reporterId = req.user._id;
    
    // Save the report (you may want to use a Report model)
    // For now, just log it
    console.log('Report received:', { chatId: req.params.chatId, reporterId, reportedUserId, message });
    res.json({ message: 'Report submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;