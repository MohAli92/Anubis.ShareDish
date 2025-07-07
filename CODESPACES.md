# Share Dish - GitHub Codespaces Setup

This project is configured to run seamlessly in GitHub Codespaces with zero local installation required.

## Quick Start

1. **Open in Codespaces**: Click the green "Code" button and select "Open with Codespaces"
2. **Wait for Setup**: The devcontainer will automatically:
   - Install Node.js 18
   - Install all npm dependencies
   - Set up VS Code extensions
   - Configure port forwarding
3. **Start the Application**: Once the container is ready, run:
   ```bash
   npm run dev
   ```
4. **Access the App**: 
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## If You Get Recovery Mode Error

If you see a "Recovery Mode" error when opening Codespaces:

1. **Rebuild the Container**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Rebuild Container"
   - Select "Dev Containers: Rebuild Container"
   - Wait for the rebuild to complete

2. **Alternative Method**:
   - Close the Codespace
   - Reopen it from the GitHub repository
   - This will trigger a fresh container build

## What's Included

The devcontainer configuration includes:
- Node.js 18
- All npm dependencies
- VS Code extensions for development
- Automatic port forwarding

## Environment Variables

The following environment variables are pre-configured:
- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/share-dish`
- `JWT_SECRET=your-secret-key`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

## Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm start` - Start only the backend server
- `npm run build` - Build the React frontend for production
- `npm run install-all` - Install all dependencies

## Troubleshooting

If the container fails to start:
1. Rebuild the container (Ctrl+Shift+P → "Rebuild Container")
2. Check the devcontainer logs for errors
3. Try opening in a new Codespace

## Database Setup

For persistent data storage:
1. Set up MongoDB Atlas (free tier available)
2. Update the `MONGODB_URI` in your environment variables
3. The app will automatically connect to your database

## Features Available

The application includes:
- User authentication (works without Firebase)
- Food post sharing
- Real-time messaging
- User profiles
- Responsive design
- Image uploads (with Cloudinary or local storage)

## Development Tips

- Use the integrated terminal in VS Code
- Check the Ports tab to see running services
- Use the Problems tab to see any errors
- Try rebuilding the container if needed 