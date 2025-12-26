# Quick Reference Guide

## 🚀 Quick Start Commands

### Single Command Start (Easiest!) ⚡

**Option 1: PowerShell Script (Separate Windows)**
```powershell
.\start.ps1
```
- Opens 2 separate windows (backend + frontend)
- Auto-installs dependencies
- Auto-opens browser

**Option 2: Batch File (Separate Windows)**
```powershell
.\start.bat
```
- Same as Option 1, but uses .bat file
- Works in Command Prompt too

**Option 3: NPM Concurrently (Same Terminal)**
```powershell
# First time setup
npm install
npm run setup

# Start both services
npm start
```
- Runs both in same terminal window
- Color-coded output (green=backend, blue=frontend)

### Manual Start (Separate Terminals)

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm start
```

**Access App:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Docker (Recommended for Testing/Deployment)

```powershell
# Start
docker-compose up --build

# Start in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
```

**Access App:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🔑 Generate Encryption Key

**If you have Node.js installed:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**If Node.js is not installed:**
- Install Node.js from: https://nodejs.org/
- Or use the default key for development (not recommended for production)

## 📋 Common Commands

### Root Level Commands (Recommended)
```powershell
# Setup everything
npm install          # Install concurrently
npm run setup        # Install all dependencies (backend + frontend)

# Start application
npm start            # Start both backend and frontend
npm run dev          # Same as npm start

# Start individually
npm run start-backend   # Start only backend
npm run start-frontend  # Start only frontend

# Testing
npm test             # Run all tests (backend + frontend)
npm run test-backend    # Run only backend tests
npm run test-frontend   # Run only frontend tests

# Docker
npm run docker-up    # Start with Docker
npm run docker-down  # Stop Docker containers
npm run docker-logs  # View Docker logs
```

### Backend Commands
```powershell
cd backend

# Install dependencies
npm install

# Run development server (with auto-reload)
npm run dev

# Run production server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Frontend Commands
```powershell
cd frontend

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test -- --watchAll
```

### Docker Commands
```powershell
# Build and start all services
docker-compose up --build

# Start services in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Restart specific service
docker-compose restart backend

# Execute command in running container
docker-compose exec backend sh
docker-compose exec frontend sh
```

## 🧪 Testing

### Run All Tests
```powershell
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test with Coverage
```powershell
# Backend
cd backend
npm test -- --coverage

# Frontend
cd frontend
npm test -- --coverage --watchAll=false
```

## 🔧 Troubleshooting

### Port Already in Use

**Backend (Port 5000):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Cannot Connect to Backend

1. Check backend is running: http://localhost:5000/health
2. Verify REACT_APP_API_URL in frontend/.env
3. Check browser console for CORS errors
4. Restart both services

### Encryption Key Error

Error: `ENCRYPTION_KEY must be 64 hexadecimal characters`

**Solution:**
1. Generate new key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Update backend/.env file
3. Restart backend server

### Docker Issues

**Container won't start:**
```powershell
# View container logs
docker-compose logs backend

# Remove all containers and rebuild
docker-compose down -v
docker-compose up --build
```

**Docker not running:**
- Start Docker Desktop
- Wait for it to fully start
- Try again

## 📱 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Encrypt Text
```http
POST /api/encrypt
Content-Type: application/json

{
  "plaintext": "Your secret message"
}
```

### Decrypt Text
```http
POST /api/decrypt
Content-Type: application/json

{
  "ciphertext": "...",
  "iv": "...",
  "authTag": "..."
}
```

### Health Check
```http
GET /health
```

## 📦 Project URLs

### Local Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Docker
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🛠️ Environment Files

### backend/.env
```env
PORT=5000
NODE_ENV=development
ENCRYPTION_KEY=<your-64-char-hex-key>
```

### frontend/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### .env (root, for Docker)
```env
ENCRYPTION_KEY=<your-64-char-hex-key>
PORT=5000
NODE_ENV=production
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 Documentation Files

- **README.md** - Full documentation and setup guide
- **DEVELOPMENT.md** - Developer guide and best practices
- **PROJECT_SUMMARY.md** - Project overview and completion status
- **QUICK_REFERENCE.md** - This file

## 🎯 Key Features

### Backend
- ✅ AES-256-GCM encryption
- ✅ Input validation
- ✅ Error handling
- ✅ Security headers
- ✅ CORS protection
- ✅ Comprehensive tests

### Frontend
- ✅ Modern UI design
- ✅ Responsive layout
- ✅ Real-time feedback
- ✅ Copy to clipboard
- ✅ Error messages
- ✅ Loading states

## 💡 Tips

1. **Always use HTTPS in production**
2. **Never commit .env files** (they're in .gitignore)
3. **Generate unique keys** for each environment
4. **Keep Node.js updated** to latest LTS version
5. **Review logs** for debugging issues
6. **Use Docker** for consistent deployments

## 🔒 Security Checklist

- [ ] Generated unique encryption key
- [ ] Updated all .env files
- [ ] Never committed .env to git
- [ ] Using HTTPS in production
- [ ] Configured firewall rules
- [ ] Set up monitoring
- [ ] Enabled logging
- [ ] Regular security updates

## 📞 Getting Help

1. Check error logs in terminal
2. Review README.md for detailed docs
3. Look at DEVELOPMENT.md for dev guide
4. Check test files for examples
5. Review browser console for frontend issues

## ⚡ Performance Tips

### Backend
- Use `npm start` for production (not `npm run dev`)
- Enable compression middleware
- Implement rate limiting
- Use connection pooling

### Frontend
- Use `npm run build` for production bundle
- Enable gzip compression in Nginx
- Optimize images and assets
- Use production React build

### Docker
- Use multi-stage builds (already configured)
- Minimize image sizes (using Alpine)
- Use .dockerignore files
- Implement health checks (already configured)

## 🎓 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [AES-GCM Encryption](https://en.wikipedia.org/wiki/Galois/Counter_Mode)

---

**Need more help?** Check the comprehensive guides:
- Full Setup: README.md
- Development: DEVELOPMENT.md
- Overview: PROJECT_SUMMARY.md
