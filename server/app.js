const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow CORS for any origin (be careful in production!)
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Import and use routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Share Dish API is running');
});

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/share-dish';

// Connect to MongoDB with updated options
mongoose.connect(MONGO_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: true, // ✅ Allow any origin for sockets as well
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });

  // Store user socket mappings
  const userSockets = new Map();

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join user's personal room for notifications
    socket.on('joinUserRoom', ({ userId }) => {
      socket.join(`user_${userId}`);
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} joined their notification room`);
    });

    // Join a chat room for a specific post
    socket.on('joinRoom', ({ postId, userId }) => {
      socket.join(postId);
      socket.userId = userId; // Store user ID for this socket
      console.log(`User ${userId} joined post room: ${postId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ postId, receiverId, text }) => {
      try {
        const senderId = socket.userId;
        if (!senderId) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        // Save message to DB
        const Chat = require('./models/Chat');
        const User = require('./models/User');
        
        let chat = await Chat.findOne({ 
          post: postId,
          users: { $all: [senderId, receiverId], $size: 2 }
        });
        
        if (!chat) {
          chat = new Chat({ 
            post: postId, 
            users: [senderId, receiverId], 
            messages: [] 
          });
        }
        
        chat.messages.push({ sender: senderId, text });
        await chat.save();

        // Get sender info for notification
        const sender = await User.findById(senderId).select('firstName lastName');
        const senderName = sender ? `${sender.firstName} ${sender.lastName}` : 'Someone';

        // Emit message to all users in the room
        io.to(postId).emit('receiveMessage', {
          sender: senderId,
          text,
          createdAt: new Date()
        });

        // Send real-time notification to receiver
        io.to(`user_${receiverId}`).emit('newMessage', {
          senderId,
          senderName,
          postId,
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          timestamp: new Date()
        });

        console.log(`Notification sent to user ${receiverId} from ${senderName}`);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove user from socket mapping
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} removed from socket mapping`);
          break;
        }
      }
    });
  });

  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('Please make sure MongoDB is installed and running, or provide a valid MONGO_URI in the .env file');
  console.log('For local development, install MongoDB: https://docs.mongodb.com/manual/installation/');
  process.exit(1);
});
