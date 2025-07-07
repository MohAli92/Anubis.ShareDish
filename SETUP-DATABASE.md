# Database Setup Guide

## Quick Start (No Database Required)

The application works perfectly without any database setup! It uses in-memory storage by default.

**To run immediately:**
```bash
npm run dev
```

The app will:
- Store all data in memory
- Work for demos and testing
- Reset data when you restart the server

## Setting Up Your Own Database

If you want persistent data storage, follow these steps:

### Option 1: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment Variables**
   - Create a `.env` file in the `server` folder
   - Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/share-dish
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Install and start the MongoDB service

2. **Update Environment Variables**
   - Create a `.env` file in the `server` folder
   - Add local MongoDB connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/share-dish
   ```

## Environment Variables

Create a `.env` file in the `server` folder with these variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Troubleshooting

### "MongoDB connection failed"

This is normal if you haven't set up MongoDB. The app will use in-memory storage instead.

**To fix:**
1. Set up MongoDB Atlas (see above)
2. Add the connection string to your `.env` file
3. Restart the server

### "Module not found" errors

Make sure all dependencies are installed:
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Port already in use

If you see "address already in use" errors:
1. Stop any running servers
2. Check if ports 3000 and 5000 are free
3. Restart the application

## Testing Your Setup

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Check the console output:**
   - Should show "Connected to MongoDB" if using database
   - Should show "MongoDB connection failed, using in-memory storage" if not

3. **Test the application:**
   - Create a user account
   - Upload a food post
   - Send a message
   - Check if data persists after restart

## Data Persistence

- **With MongoDB**: Data persists between server restarts
- **Without MongoDB**: Data resets when you restart the server
- **In-memory mode**: Perfect for demos and testing

## Security Notes

- Never commit your `.env` file to version control
- Use strong JWT secrets in production
- Keep your MongoDB connection strings private
- Consider using environment variables in production 