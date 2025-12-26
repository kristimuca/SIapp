# 🚀 START HERE - Getting Started Guide

Welcome to the Text Encryption App! This guide will get you up and running in minutes.

---

## ⚡ Fastest Way to Start (30 seconds)

### Windows Users:

**Just double-click one of these files:**

1. **`start.ps1`** (PowerShell - Recommended)
   - Right-click → "Run with PowerShell"
   - OR open PowerShell and run: `.\start.ps1`

2. **`start.bat`** (Command Prompt)
   - Double-click to run
   - OR open CMD and run: `start.bat`

**That's it!** The script will:
- ✅ Install everything automatically
- ✅ Start backend server
- ✅ Start frontend server
- ✅ Open your browser

---

## 🎯 What Each Startup Method Does

### Method 1: `start.ps1` or `start.bat` (Separate Windows)
```powershell
.\start.ps1
# OR
.\start.bat
```

**Pros:**
- Easiest - just double-click
- Opens separate windows for each service
- Easy to see logs separately
- Auto-opens browser

**Result:**
- Window 1: Backend server logs
- Window 2: Frontend server logs
- Browser opens automatically

---

### Method 2: `npm start` (Same Terminal)
```powershell
# First time setup
npm install
npm run setup

# Start application
npm start
```

**Pros:**
- Everything in one terminal
- Color-coded output
- Professional development experience

**Result:**
```
[BACKEND]  Server running on port 5000
[FRONTEND] Compiled successfully!
[FRONTEND] Local: http://localhost:3000
```

**To Stop:** Press `Ctrl+C` (stops both)

---

### Method 3: Docker (Containerized)
```powershell
docker-compose up --build
```

**Pros:**
- Isolated environment
- Production-like setup
- No local Node.js required

**Result:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

### Method 4: Manual (Two Terminals)
```powershell
# Terminal 1
cd backend
npm install
npm run dev

# Terminal 2
cd frontend
npm install
npm start
```

**Pros:**
- Full control
- Best for development/debugging
- See each service separately

---

## 📋 Prerequisites

### Required:
- **Node.js 18+** - [Download here](https://nodejs.org/)
  - Check: `node --version`
  
### Optional:
- **Docker Desktop** (for Docker method) - [Download here](https://www.docker.com/products/docker-desktop/)
  - Check: `docker --version`

---

## 🎬 Step-by-Step First Time Setup

### For Complete Beginners:

**Step 1: Open PowerShell**
- Press `Windows Key`
- Type "PowerShell"
- Click "Windows PowerShell"

**Step 2: Navigate to Project**
```powershell
cd C:\text-encryption-app
```

**Step 3: Run Start Script**
```powershell
.\start.ps1
```

**Step 4: Wait**
- Two windows will open
- Wait 10-15 seconds for servers to start
- Browser opens automatically

**Step 5: Use the App!**
- Enter text in the text area
- Click "Encrypt" button
- Click "Decrypt" button
- Enjoy! 🎉

---

## 🔧 All Available Start Commands

| Command | Description | Windows |
|---------|-------------|---------|
| `.\start.ps1` | Start both (separate windows) | Opens 2 PowerShell windows |
| `.\start.bat` | Start both (separate windows) | Opens 2 CMD windows |
| `npm start` | Start both (same terminal) | Color-coded in one terminal |
| `npm run start-backend` | Start only backend | Backend on port 5000 |
| `npm run start-frontend` | Start only frontend | Frontend on port 3000 |
| `docker-compose up` | Start with Docker | Containerized environment |

---

## 📱 Access the Application

After starting, open your browser to:

**Frontend:** http://localhost:3000
- This is the main app interface

**Backend API:** http://localhost:5000/api
- API endpoints for encryption/decryption

**Health Check:** http://localhost:5000/health
- Verify backend is running

---

## 🛑 How to Stop

### Method 1 (PowerShell/Batch Script):
- Close both windows
- OR press `Ctrl+C` in each window

### Method 2 (npm start):
- Press `Ctrl+C` in terminal

### Method 3 (Docker):
```powershell
docker-compose down
```

### Method 4 (Manual):
- Press `Ctrl+C` in each terminal

---

## ❓ Troubleshooting

### Problem: "Node.js not found"
**Solution:** Install Node.js from https://nodejs.org/

### Problem: "Port already in use"
**Solution:** 
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: "Cannot connect to backend"
**Solution:** 
1. Check backend is running: http://localhost:5000/health
2. Restart backend service
3. Check firewall settings

### Problem: PowerShell script won't run
**Solution:**
```powershell
# Run this once to allow scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problem: Dependencies not installing
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force backend\node_modules
Remove-Item -Recurse -Force frontend\node_modules
npm run setup
```

---

## 🎯 Quick Reference

### First Time Setup:
```powershell
.\start.ps1
```

### Daily Development:
```powershell
npm start
```

### Production Testing:
```powershell
docker-compose up
```

### Run Tests:
```powershell
npm test
```

---

## 📚 What to Read Next

1. **Just want to use it?** - You're done! Use the app.
2. **Want to understand more?** - Read `README.md`
3. **Want to develop/modify?** - Read `DEVELOPMENT.md`
4. **Need quick commands?** - Read `QUICK_REFERENCE.md`
5. **Need detailed examples?** - Read `SETUP_EXAMPLES.md`

---

## 🎉 Success Checklist

After starting, verify:
- [ ] Backend window/terminal shows: "Server running on port 5000"
- [ ] Frontend window/terminal shows: "Compiled successfully!"
- [ ] Browser opens to http://localhost:3000
- [ ] Can see the app interface with encrypt/decrypt buttons
- [ ] Can type in the text area
- [ ] Can encrypt text (shows encrypted data)
- [ ] Can decrypt text (shows original message)

If all checks pass: **✅ You're all set!**

---

## 💡 Pro Tips

1. **Use `start.ps1` for simplicity** - Best for first-time users
2. **Use `npm start` for development** - Best for daily work
3. **Use Docker for testing** - Best for deployment testing
4. **Keep terminals open** - Don't close while using the app
5. **Check browser console** - Press F12 for debugging

---

## 🔐 Your First Encryption

1. Start the app (any method above)
2. Type: "Hello, World!"
3. Click "Encrypt" button
4. See the encrypted data appear
5. Click "Decrypt" button
6. See "Hello, World!" again!

**Congratulations! You've successfully encrypted your first message! 🎉**

---

## 📞 Need Help?

1. Check `QUICK_REFERENCE.md` for common commands
2. Check `SETUP_EXAMPLES.md` for detailed examples
3. Check `README.md` for full documentation
4. Look at the troubleshooting section above
5. Check browser console (F12) for errors

---

**Ready to start? Run: `.\start.ps1` and begin encrypting! 🚀🔐**
