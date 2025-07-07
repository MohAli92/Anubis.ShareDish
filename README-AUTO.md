# 🍽️ Share Dish - Auto Setup

Food sharing project with complete automatic setup!

## 🚀 Quick Start

### For the Doctor (or anyone):
```bash
npm start
```

**That's it!** This is all you need. The system will work automatically:
- ✅ Install all libraries
- ✅ Create environment files (.env)
- ✅ Run server and frontend
- ✅ Automatic URL detection in codespace
- ✅ **No need to manually enter URL**

## 🔧 Manual Setup (Optional)

If you want to set up the project manually:

```bash
# Install libraries and create environment files
npm run setup

# or
npm run install-all

# Run the project
npm run dev
```

## 🌐 Supported Environments

### 1. GitHub Codespaces
- ✅ Automatic URL detection
- ✅ Automatic setup
- ✅ Instant running

### 2. Local Environment
- ✅ Automatic localhost
- ✅ Quick setup

### 3. Other Cloud Environments
- ✅ Gitpod
- ✅ StackBlitz
- ✅ Any cloud environment

## 📁 Project Structure

```
share-dish-Anubis/
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Node.js Backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── package.json
├── setup-auto.js          # 🆕 Automatic Setup
├── .devcontainer/         # 🆕 Codespace Setup
└── package.json
```

## 🔄 What Happens When Running

When you run `npm start`:

1. **Environment Detection**: The system detects if you're in a codespace or not
2. **Create .env files**: 
   - `server/.env` - Server settings
   - `client/.env` - Frontend settings
3. **Install libraries**: npm install for all folders
4. **Run the application**: Server on 5000 and frontend on 3000

## 🌍 Automatic URL Detection

The system automatically detects the appropriate URL:

- **Codespace**: `https://your-codespace-5000.app.github.dev`
- **Local**: `http://localhost:5000`
- **Cloud**: Any other cloud environment

### 🚫 No need to manually enter URL!
- You don't need to write `REACT_APP_API_URL` in `.env` file
- You don't need to know the codespace URL
- The system detects everything automatically

## 🛠️ Available Commands

```bash
npm start          # 🚀 Complete Run (Preferred)
npm run dev        # 🔧 Development Mode
npm run setup      # ⚙️ Setup Only
npm run build      # 📦 Production Build
```

## 🔒 Security

- `.env` files are not uploaded to Git
- Secure default settings
- JWT tokens are protected

## 🐛 Troubleshooting

### If the run doesn't work:
1. Make sure you have Node.js 14+
2. Make sure you have npm
3. Try `npm run setup` first

### If the connection doesn't work:
1. Check that port 5000 is available
2. Check MongoDB settings
3. Check console for messages

## 📞 Support

If you encounter any problem:
1. Check console for messages
2. Make sure environment settings are correct
3. Try `npm run setup` again

---

**🎉 Now the Doctor only needs `npm start`!** 