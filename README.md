# Share Dish - Food Sharing Platform

A modern web application for sharing food and connecting with neighbors. Built with React, Node.js, and MongoDB.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/register system with email verification
- **Food Posts**: Create, edit, and manage food sharing posts with photos
- **Real-time Messaging**: Instant messaging between users using Socket.IO
- **Real-time Notifications**: Live notifications for new messages and updates
- **User Profiles**: Complete user profile management
- **Responsive Design**: Works perfectly on desktop and mobile devices

### Real-time Features
- **Live Notifications**: Get instant notifications when you receive new messages
- **Real-time Chat**: Messages appear instantly without page refresh
- **Notification Badges**: See unread message counts in the navigation
- **Toast Notifications**: Pop-up notifications for new messages
- **Notification History**: View all notifications in a dedicated page

### Technical Features
- **Socket.IO Integration**: Real-time communication between users
- **Image Upload**: Cloudinary integration for photo storage
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Database**: Scalable NoSQL database
- **Material-UI**: Modern, responsive UI components
- **TypeScript**: Type-safe development

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Socket.IO Client** for real-time features
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time communication
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd share-dish
   ```

2. **Run the automatic setup**
   ```bash
   node setup-auto.js
   ```

3. **Start the application**
   ```bash
   npm start
   ```

### Manual Setup

1. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Environment Configuration**
   
   Create `.env` files in both `server/` and `client/` directories:

   **Server (.env)**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/share-dish
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   **Client (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start the application**
   ```bash
   # Start server (from server directory)
   npm start
   
   # Start client (from client directory)
   npm start
   ```

## 🚀 Usage

### For Users
1. **Register/Login**: Create an account or sign in
2. **Browse Posts**: View available food posts on the home page
3. **Create Posts**: Share your own food with photos and details
4. **Send Messages**: Contact post owners through the messaging system
5. **Manage Profile**: Update your personal information
6. **View Notifications**: Check your notification center for updates

### Real-time Features
- **Instant Messaging**: Messages appear in real-time
- **Live Notifications**: Get notified immediately when receiving messages
- **Notification Badges**: See unread counts in the navigation
- **Auto-clear**: Notifications clear when visiting the messages page

## 🔧 Development

### Project Structure
```
share-dish/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Notifications)
│   │   ├── pages/          # Page components
│   │   └── api.ts          # API configuration
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── uploads/            # File uploads
│   └── app.js              # Main server file
├── setup-auto.js           # Automatic setup script
└── README.md
```

### Key Components

#### Real-time Notification System
- **NotificationContext**: Manages notification state and Socket.IO connection
- **Socket.IO Integration**: Real-time communication between users
- **Toast Notifications**: Pop-up alerts for new messages
- **Notification Badges**: Visual indicators for unread content

#### Authentication System
- **JWT Tokens**: Secure authentication
- **Protected Routes**: Route protection for authenticated users
- **AuthContext**: Global authentication state management

#### Messaging System
- **Real-time Chat**: Instant message delivery
- **Chat Rooms**: Organized conversations by post
- **Message History**: Persistent message storage

## 🌐 Deployment

### GitHub Codespaces
The project is optimized for GitHub Codespaces with automatic setup:
- Environment detection
- Automatic dependency installation
- Port forwarding configuration
- Database setup

### Production Deployment
1. Set up environment variables for production
2. Configure MongoDB Atlas or production database
3. Set up Cloudinary for image storage
4. Deploy to your preferred hosting platform

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Messages & Chat
- `GET /api/chat/user/chats` - Get user conversations
- `POST /api/chat/:postId/message` - Send message
- `GET /api/messages/unread` - Get unread count

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/block` - Block user

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Server-side validation
- **CORS Configuration**: Cross-origin request handling
- **File Upload Security**: Secure image upload handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Share Dish** - Connecting communities through food sharing! 🍽️

