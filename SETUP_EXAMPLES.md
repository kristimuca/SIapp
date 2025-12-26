# Setup and Usage Examples

## 🎬 Getting Started - Step by Step

### Prerequisites Check
Before starting, verify you have the required software:

```powershell
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Docker (if using Docker)
docker --version
docker-compose --version
```

If any are missing, install:
- **Node.js**: https://nodejs.org/ (Download LTS version)
- **Docker Desktop**: https://www.docker.com/products/docker-desktop/

---

## 🚀 Option 1: Quick Setup with Script (EASIEST!)

### Method A: PowerShell Script
```powershell
# Navigate to project directory
cd C:\text-encryption-app

# Run the start script
.\start.ps1
```

**What it does:**
- ✅ Checks for Node.js
- ✅ Installs dependencies automatically
- ✅ Generates encryption key
- ✅ Starts backend in new window
- ✅ Starts frontend in new window
- ✅ Opens browser automatically

**Expected Result:**
- Two PowerShell windows open (backend & frontend)
- Browser opens to http://localhost:3000
- App is ready to use!

### Method B: Batch File
```powershell
.\start.bat
```
Same as PowerShell script, but works in Command Prompt too.

### Method C: NPM Concurrent (Same Terminal)
```powershell
# First time only
npm install
npm run setup

# Start both services
npm start
```

**What you'll see:**
```
[BACKEND] Server running on port 5000
[FRONTEND] Compiled successfully!
[FRONTEND] You can now view text-encryption-frontend in the browser.
```

**To stop:** Press `Ctrl+C` once (stops both services)

---

## 🚀 Option 2: Quick Setup with Manual Commands
```powershell
# Navigate to project directory
cd C:\text-encryption-app

# Run setup script (this will install everything)
.\setup.ps1
```

### Step 2: Start Backend
```powershell
# Open first terminal
cd backend
npm run dev
```

Expected output:
```
> text-encryption-backend@1.0.0 dev
> nodemon server.js

[nodemon] starting `node server.js`
Server running on port 5000
Environment: development
```

### Step 3: Start Frontend
```powershell
# Open second terminal
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view text-encryption-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 4: Use the App
1. Open browser to http://localhost:3000
2. Enter text: "Hello, World!"
3. Click "Encrypt"
4. See encrypted data
5. Click "Decrypt"
6. See original text

---

## 🐳 Option 3: Docker Setup

### Step 1: Generate Encryption Key
```powershell
# Navigate to project directory
cd C:\text-encryption-app

# Generate key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64-character hex string)

### Step 2: Configure Environment
```powershell
# Edit .env file
notepad .env
```

Replace the ENCRYPTION_KEY value with your generated key:
```env
ENCRYPTION_KEY=your-generated-key-here
PORT=5000
NODE_ENV=production
REACT_APP_API_URL=http://localhost:5000/api
```

Save and close.

### Step 3: Start with Docker
```powershell
# Build and start containers
docker-compose up --build
```

Expected output:
```
Creating encryption-backend  ... done
Creating encryption-frontend ... done
Attaching to encryption-backend, encryption-frontend
backend_1   | Server running on port 5000
frontend_1  | Nginx started successfully
```

### Step 4: Access the App
Open browser to http://localhost:3000

### Step 5: Stop Docker
```powershell
# Press Ctrl+C, then:
docker-compose down
```

---

## 📝 Option 4: Manual Setup (Advanced)

### Backend Setup

```powershell
# 1. Navigate to backend
cd C:\text-encryption-app\backend

# 2. Install dependencies
npm install

# 3. Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Create .env file
notepad .env
```

Add to .env:
```env
PORT=5000
NODE_ENV=development
ENCRYPTION_KEY=your-generated-key-here
```

```powershell
# 5. Start backend
npm run dev
```

### Frontend Setup

```powershell
# 1. Open new terminal
cd C:\text-encryption-app\frontend

# 2. Install dependencies
npm install

# 3. Verify .env file exists
type .env
```

Should show:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```powershell
# 4. Start frontend
npm start
```

---

## 🧪 Testing the Application

### Backend Tests

```powershell
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

Expected output:
```
PASS  ./encryptionService.test.js
PASS  ./routes.test.js

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
```

### Frontend Tests

```powershell
cd frontend

# Run tests
npm test

# Run once (for CI/CD)
npm test -- --watchAll=false
```

Expected output:
```
PASS  src/App.test.js
  ✓ renders the app title (50ms)
  ✓ can encrypt text (120ms)
  ✓ can decrypt text (110ms)
  
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

---

## 💡 Usage Examples

### Example 1: Encrypt Simple Text

**Input:**
```
Hello, World!
```

**Steps:**
1. Type in text area
2. Click "Encrypt"

**Output:**
```json
{
  "ciphertext": "a3b5c7d9e1f3...",
  "iv": "1234567890abcdef...",
  "authTag": "fedcba0987654321..."
}
```

### Example 2: Encrypt and Decrypt

**Input:**
```
This is a secret message!
```

**Steps:**
1. Type message
2. Click "Encrypt" (encrypted data appears)
3. Click "Decrypt" (original message appears)

**Result:**
```
Decrypted Text: This is a secret message!
```

### Example 3: Using the API Directly

**Encrypt Request:**
```powershell
# Using PowerShell
$body = @{
    plaintext = "Hello from API"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/encrypt" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ciphertext": "encrypted_data_here",
    "iv": "iv_here",
    "authTag": "tag_here"
  }
}
```

**Decrypt Request:**
```powershell
$body = @{
    ciphertext = "encrypted_data_here"
    iv = "iv_here"
    authTag = "tag_here"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/decrypt" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plaintext": "Hello from API"
  }
}
```

### Example 4: Using cURL (if installed)

**Encrypt:**
```bash
curl -X POST http://localhost:5000/api/encrypt \
  -H "Content-Type: application/json" \
  -d "{\"plaintext\":\"Hello from cURL\"}"
```

**Decrypt:**
```bash
curl -X POST http://localhost:5000/api/decrypt \
  -H "Content-Type: application/json" \
  -d "{\"ciphertext\":\"...\",\"iv\":\"...\",\"authTag\":\"...\"}"
```

---

## 🔍 Troubleshooting Examples

### Problem 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Example output:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345

# Kill the process (replace 12345 with your PID)
taskkill /PID 12345 /F
```

### Problem 2: Cannot Connect to Backend

**Error in browser console:**
```
Failed to fetch: ERR_CONNECTION_REFUSED
```

**Solution:**
1. Check backend is running:
```powershell
curl http://localhost:5000/health
```

2. Should return:
```json
{"status":"OK","timestamp":"2025-11-30T..."}
```

3. If not running, start backend:
```powershell
cd backend
npm run dev
```

### Problem 3: Encryption Key Error

**Error:**
```
Error: ENCRYPTION_KEY must be 64 hexadecimal characters (256 bits)
```

**Solution:**
```powershell
# Generate new key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output:
# abc123def456...xyz (64 characters)

# Update backend/.env
notepad backend\.env
```

### Problem 4: Frontend Won't Start

**Error:**
```
Module not found: Can't resolve 'axios'
```

**Solution:**
```powershell
# Reinstall dependencies
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

### Problem 5: Docker Container Won't Start

**Error:**
```
Error response from daemon: driver failed
```

**Solution:**
```powershell
# Stop all containers
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

---

## 📊 Monitoring and Logs

### Backend Logs

**In development mode:**
```
2025-11-30T12:00:00.000Z - POST /api/encrypt
2025-11-30T12:00:01.000Z - POST /api/decrypt
```

**View logs in real-time:**
```powershell
# The logs appear in the terminal where you ran npm run dev
```

### Frontend Logs

**In browser console (F12):**
```
React App
Compiled successfully!
```

### Docker Logs

```powershell
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service
docker-compose logs backend
docker-compose logs frontend
```

---

## 🎯 Performance Testing

### Test Encryption Speed

```powershell
# In backend directory
node -e "
const EncryptionService = require('./encryptionService');
process.env.ENCRYPTION_KEY = '0'.repeat(64);
const service = new EncryptionService();

console.time('encrypt');
for(let i = 0; i < 1000; i++) {
  service.encrypt('Test message');
}
console.timeEnd('encrypt');
"
```

Expected: ~50-100ms for 1000 encryptions

### Test API Response Time

```powershell
# Measure-Command in PowerShell
Measure-Command {
  Invoke-RestMethod -Uri "http://localhost:5000/health"
}
```

Expected: <100ms

---

## 🔐 Security Testing

### Test with Invalid Data

```powershell
# Test with missing plaintext
Invoke-RestMethod -Uri "http://localhost:5000/api/encrypt" `
    -Method POST `
    -Body '{}' `
    -ContentType "application/json"
```

Expected response:
```json
{
  "success": false,
  "errors": [
    {"msg": "Plaintext is required and must be a string"}
  ]
}
```

### Test with Invalid Decryption Data

```powershell
# Test with invalid ciphertext
$body = @{
    ciphertext = "invalid"
    iv = "invalid"
    authTag = "invalid"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/decrypt" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

Expected: Error response with "Decryption failed"

---

## 📚 Additional Resources

### Generate Multiple Keys

```powershell
# Generate 5 different keys
1..5 | ForEach-Object {
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}
```

### Check Application Health

```powershell
# Create a health check script
# save as check-health.ps1

$backendHealth = Invoke-RestMethod -Uri "http://localhost:5000/health" -ErrorAction SilentlyContinue
$frontendHealth = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction SilentlyContinue

if($backendHealth.status -eq "OK") {
  Write-Host "✓ Backend is healthy" -ForegroundColor Green
} else {
  Write-Host "✗ Backend is down" -ForegroundColor Red
}

if($frontendHealth.StatusCode -eq 200) {
  Write-Host "✓ Frontend is healthy" -ForegroundColor Green
} else {
  Write-Host "✗ Frontend is down" -ForegroundColor Red
}
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/health
- [ ] Can encrypt text in UI
- [ ] Can decrypt text in UI
- [ ] Copy buttons work
- [ ] Clear button works
- [ ] Error messages display correctly
- [ ] Backend tests pass (npm test)
- [ ] Frontend tests pass (npm test)

---

**🎉 You're all set! Start encrypting securely! 🔐**
