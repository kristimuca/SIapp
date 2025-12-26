# 🐳 Docker Quick Start Guide

## ✅ All Docker Files Are Ready!

Your project includes complete Docker configuration:
- ✅ `docker-compose.yml` - Multi-container orchestration
- ✅ `backend/Dockerfile` - Backend container
- ✅ `frontend/Dockerfile` - Frontend container (multi-stage build)
- ✅ `frontend/nginx.conf` - Nginx web server config
- ✅ `.env` - Environment variables

---

## 🚀 Quick Start with Docker

### Step 1: Ensure Docker is Running
```powershell
# Check Docker is installed and running
docker --version
docker-compose --version
```

### Step 2: Start the Application
```powershell
# Navigate to project root
cd C:\text-encryption-app

# Build and start containers
docker-compose up --build
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Step 4: Stop the Application
Press `Ctrl+C` in the terminal, then:
```powershell
docker-compose down
```

---

## 📋 Docker Commands

### Basic Commands
```powershell
# Start services (build if needed)
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart
```

### Viewing Logs
```powershell
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Follow specific service
docker-compose logs -f backend
```

### Managing Containers
```powershell
# List running containers
docker-compose ps

# Stop specific service
docker-compose stop backend

# Start specific service
docker-compose start backend

# Restart specific service
docker-compose restart frontend
```

### Rebuilding
```powershell
# Rebuild all containers
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and start
docker-compose up --build
```

### Cleaning Up
```powershell
# Remove stopped containers
docker-compose rm

# Remove everything (containers, networks, volumes)
docker-compose down -v

# Remove all unused Docker data
docker system prune -a
```

---

## 🔧 Configuration Files

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports: "5000:5000"
    environment:
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    networks:
      - encryption-network
    healthcheck: enabled

  frontend:
    build: ./frontend
    ports: "3000:80"
    depends_on: backend
    networks:
      - encryption-network
```

### Backend Dockerfile
- Base: `node:18-alpine`
- Installs dependencies with `npm ci`
- Runs on port 5000
- Production optimized

### Frontend Dockerfile
- Multi-stage build
- Stage 1: Build React app
- Stage 2: Serve with Nginx
- Runs on port 80 (mapped to 3000)
- Production optimized

### Nginx Configuration
- Serves static files
- Handles React routing
- Gzip compression enabled
- Security headers configured
- Cache control for assets

---

## 🔐 Environment Variables

The `.env` file contains:
```env
ENCRYPTION_KEY=<your-64-char-hex-key>
PORT=5000
NODE_ENV=production
REACT_APP_API_URL=http://localhost:5000/api
```

**Important**: Generate a new encryption key for production:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then update the `.env` file with your new key.

---

## 🩺 Health Checks

Docker Compose includes automatic health checks:

### Backend Health Check
- **URL**: http://localhost:5000/health
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

Check health manually:
```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","timestamp":"2025-11-30T..."}
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use

**Error**: `Bind for 0.0.0.0:5000 failed: port is already allocated`

**Solution**:
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
# Change "5000:5000" to "5001:5000"
```

### Problem: Build Fails

**Solution**:
```powershell
# Clean everything and rebuild
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Problem: Container Won't Start

**Solution**:
```powershell
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart backend
```

### Problem: Frontend Can't Connect to Backend

**Solution**:
1. Check backend is running:
   ```powershell
   docker-compose ps
   ```

2. Check backend health:
   ```powershell
   curl http://localhost:5000/health
   ```

3. Verify network connectivity:
   ```powershell
   docker network ls
   docker network inspect text-encryption-app_encryption-network
   ```

### Problem: Environment Variables Not Loading

**Solution**:
1. Ensure `.env` file exists in project root
2. Check file format (no spaces around `=`)
3. Restart containers:
   ```powershell
   docker-compose down
   docker-compose up
   ```

---

## 📊 Container Information

### Backend Container
- **Name**: encryption-backend
- **Port**: 5000
- **Network**: encryption-network
- **Restart Policy**: unless-stopped
- **Health Check**: ✅ Enabled
- **Size**: ~150MB (Alpine-based)

### Frontend Container
- **Name**: encryption-frontend
- **Port**: 3000 (host) → 80 (container)
- **Network**: encryption-network
- **Restart Policy**: unless-stopped
- **Size**: ~50MB (Nginx Alpine)

---

## 🚀 Production Deployment

### Before Deploying to Production:

1. **Generate Secure Key**:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update .env File**:
   ```env
   ENCRYPTION_KEY=<your-production-key>
   NODE_ENV=production
   REACT_APP_API_URL=https://your-domain.com/api
   ```

3. **Use HTTPS** (add reverse proxy):
   - Nginx or Apache
   - Let's Encrypt SSL certificate
   - Configure SSL in docker-compose

4. **Security Considerations**:
   - Use Docker secrets for sensitive data
   - Enable firewall rules
   - Regular security updates
   - Monitor logs
   - Set up backups

5. **Scale Services** (optional):
   ```powershell
   docker-compose up --scale backend=3 --scale frontend=2
   ```

---

## 📈 Monitoring

### View Resource Usage
```powershell
# All containers
docker stats

# Specific container
docker stats encryption-backend
docker stats encryption-frontend
```

### View Container Details
```powershell
# Inspect backend
docker inspect encryption-backend

# Inspect frontend
docker inspect encryption-frontend
```

### Execute Commands in Container
```powershell
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Run command without entering shell
docker-compose exec backend node --version
```

---

## 🎯 Quick Commands Cheat Sheet

```powershell
# START
docker-compose up --build        # Build and start
docker-compose up -d             # Start in background

# STOP
docker-compose down              # Stop all
docker-compose down -v           # Stop and remove volumes

# LOGS
docker-compose logs -f           # Follow all logs
docker-compose logs backend      # Backend logs only

# RESTART
docker-compose restart           # Restart all
docker-compose restart backend   # Restart backend only

# BUILD
docker-compose build             # Rebuild all
docker-compose build --no-cache  # Rebuild without cache

# STATUS
docker-compose ps                # Container status
docker stats                     # Resource usage

# CLEAN
docker-compose down -v           # Remove everything
docker system prune -a           # Clean Docker system
```

---

## ✅ Verification Steps

After running `docker-compose up --build`:

1. **Check Containers Running**:
   ```powershell
   docker-compose ps
   ```
   Both should show "Up"

2. **Check Backend Health**:
   ```powershell
   curl http://localhost:5000/health
   ```
   Should return `{"status":"OK"}`

3. **Access Frontend**:
   Open browser: http://localhost:3000

4. **Test Encryption**:
   - Enter text
   - Click Encrypt
   - Click Decrypt
   - Verify it works!

---

## 🎉 You're Ready!

All Docker files are configured and ready to use. Just run:

```powershell
docker-compose up --build
```

And you're encrypting with Docker! 🐳🔐

---

**For more help**: Check the main README.md or QUICK_REFERENCE.md
