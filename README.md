# Share Dish - MongoDB Authentication

A food sharing platform where users can share and discover meals in their area. Now using MongoDB for authentication instead of Firebase.

## Features

- **User Authentication**: Secure login and registration with Firebase
- **Food Post Sharing**: Upload and share food photos with descriptions
- **Real-time Messaging**: Chat with other users about food
- **User Profiles**: Personalize your profile and view others
- **Post Management**: Create, edit, and delete your posts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Firebase Authentication
- CSS for styling

### Backend
- Node.js with Express
- MongoDB (with Mongoose)
- Cloudinary for image uploads
- Socket.io for real-time messaging

## Project Structure

```
share-dish-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── ...
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded images
│   └── ...
└── ...
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd share-dish-main
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string

4. **Configure environment variables**
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   ```

5. **Start the application**
   ```bash
   # Start both server and client (from root directory)
   npm run dev
   
   # Or start them separately:
   # Terminal 1 - Server
   cd server
   npm run dev
   
   # Terminal 2 - Client
   cd client
   npm start
   ```

## 🔐 Authentication Changes

### What Changed
- **Removed Firebase**: No more Firebase Authentication
- **MongoDB Authentication**: Users are now stored and authenticated directly in MongoDB
- **JWT Tokens**: Using JSON Web Tokens for session management
- **Password Hashing**: Passwords are securely hashed using bcrypt

### New Features
- ✅ User registration with MongoDB
- ✅ User login with JWT tokens
- ✅ Password change functionality
- ✅ Account deletion
- ✅ Secure password hashing
- ✅ Token-based authentication

### Database Schema
```javascript
// User Model
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  gender: String (enum),
  dateOfBirth: Date (required),
  emailVerified: Boolean (default: false),
  createdAt: Date (auto)
}
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/verify-password` - Verify password
- `POST /api/auth/check-email` - Check if email exists

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/reserve` - Reserve post

## 🔧 Development

### Project Structure
```
share-dish-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── api.ts          # API configuration
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── app.js              # Main server file
└── README.md
```

### Key Files Modified
- `server/models/User.js` - Updated user model with password
- `server/routes/auth.js` - New authentication routes
- `server/middleware/auth.js` - JWT authentication middleware
- `client/src/contexts/AuthContext.tsx` - Updated for MongoDB auth
- `client/src/pages/Login.tsx` - Updated login/register forms
- `client/src/api.ts` - Added token handling

## 🚀 Deployment

### Environment Variables
Make sure to set these environment variables in production:
- `MONGO_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A strong secret key for JWT tokens
- `PORT` - Server port (default: 5000)

### Security Notes
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt with salt rounds of 10
- All sensitive routes require authentication
- CORS is configured for security

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection Failed**
   - Check your connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify network connectivity

2. **JWT Token Issues**
   - Check that JWT_SECRET is set
   - Ensure tokens are being sent in Authorization header

3. **Password Issues**
   - Passwords must be at least 6 characters with at least one number
   - Check that bcrypt is properly installed

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This version uses MongoDB for authentication instead of Firebase, providing more control over user data and authentication flow.

## Contact

Anubis Team

