# Text Encryption Web App 🔐

A secure web application for encrypting and decrypting text using strong cryptographic algorithms (AES-256-GCM). Built with Node.js/Express backend and React frontend.

## Features

### Backend
- ✅ REST API for text encryption and decryption
- ✅ AES-256-GCM encryption algorithm
- ✅ Secure key management using environment variables
- ✅ Input validation and error handling
- ✅ Comprehensive logging
- ✅ Unit tests with Jest

### Frontend
- ✅ Clean and intuitive user interface
- ✅ Real-time encryption and decryption
- ✅ Responsive design for all devices
- ✅ Copy-to-clipboard functionality
- ✅ Error and success message displays
- ✅ Modern gradient design

### Security
- 🔒 AES-256-GCM authenticated encryption
- 🔒 Random IV generation for each encryption
- 🔒 Authentication tags for data integrity
- 🔒 Input validation on all endpoints
- 🔒 Helmet.js for security headers
- 🔒 CORS protection

## Project Structure

```
text-encryption-app/
├── backend/
│   ├── server.js                 # Express server setup
│   ├── routes.js                 # API routes
│   ├── encryptionService.js      # Encryption/decryption logic
│   ├── encryptionService.test.js # Unit tests for encryption
│   ├── routes.test.js            # Unit tests for API
│   ├── jest.config.js            # Jest configuration
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   └── Dockerfile                # Backend Docker configuration
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── App.js                # Main React component
│   │   ├── App.css               # Component styles
│   │   ├── api.js                # API service
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Frontend dependencies
│   ├── .env                      # Frontend environment variables
│   ├── nginx.conf                # Nginx configuration
│   └── Dockerfile                # Frontend Docker configuration
├── docker-compose.yml            # Docker Compose configuration
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

## Installation & Setup

### Option 1: Quick Start (Single Command) ⚡

The easiest way to start the application:

```powershell
# Using PowerShell script (opens in separate windows)
.\start.ps1

# OR using batch file
.\start.bat

# OR using npm with concurrently (same terminal)
npm install
npm start
```

This will automatically:
- Install all dependencies
- Start both backend and frontend
- Open your browser to http://localhost:3000

### Option 2: Local Development (Manual Setup)

#### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Generate a secure encryption key:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Create a `.env` file from the example:
```powershell
Copy-Item .env.example .env
```

5. Edit the `.env` file and add your generated encryption key:
```
PORT=5000
NODE_ENV=development
ENCRYPTION_KEY=your-generated-key-here
```

6. Start the backend server:
```powershell
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

#### Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. The `.env` file is already configured for local development. Verify it contains:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```powershell
npm start
```

The frontend will run on `http://localhost:3000`

### Option 3: Docker Deployment

1. Navigate to the project root directory:
```powershell
cd text-encryption-app
```

2. Generate a secure encryption key:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Create a `.env` file from the example:
```powershell
Copy-Item .env.example .env
```

4. Edit the `.env` file and add your generated encryption key:
```
ENCRYPTION_KEY=your-generated-key-here
PORT=5000
NODE_ENV=production
REACT_APP_API_URL=http://localhost:5000/api
```

5. Build and start the containers:
```powershell
docker-compose up --build
```

6. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

7. To stop the containers:
```powershell
docker-compose down
```

## Running Tests

### Backend Tests

```powershell
cd backend
npm test
```

Run tests with coverage:
```powershell
npm test -- --coverage
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Encrypt Text

**POST** `/api/encrypt`

Encrypts plaintext using AES-256-GCM.

**Request Body:**
```json
{
  "plaintext": "Your secret message"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ciphertext": "encrypted_hex_string",
    "iv": "initialization_vector_hex",
    "authTag": "authentication_tag_hex"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Plaintext is required and must be a string"
    }
  ]
}
```

#### 2. Decrypt Text

**POST** `/api/decrypt`

Decrypts ciphertext using AES-256-GCM.

**Request Body:**
```json
{
  "ciphertext": "encrypted_hex_string",
  "iv": "initialization_vector_hex",
  "authTag": "authentication_tag_hex"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plaintext": "Your secret message"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Decryption failed",
  "error": "Error description"
}
```

#### 3. Health Check

**GET** `/health`

Check server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-30T00:00:00.000Z"
}
```

## Usage

1. **Encrypt Text:**
   - Enter your plaintext message in the text area
   - Click the "Encrypt" button
   - The encrypted data will be displayed below

2. **Decrypt Text:**
   - After encrypting, click the "Decrypt" button
   - The original plaintext will be revealed

3. **Copy Results:**
   - Use the "Copy" buttons to copy encrypted data or decrypted text to clipboard

4. **Clear All:**
   - Click "Clear" to reset all fields

## Security Best Practices

1. **Encryption Key Management:**
   - Never commit `.env` files to version control
   - Use strong, randomly generated keys
   - Rotate keys periodically in production
   - Use key management services (AWS KMS, Azure Key Vault) in production

2. **Environment Variables:**
   - Keep `.env` files secure and private
   - Use different keys for development and production
   - Never expose keys in logs or error messages

3. **HTTPS in Production:**
   - Always use HTTPS in production
   - Configure SSL/TLS certificates
   - Enable HSTS headers

4. **Input Validation:**
   - All inputs are validated on the backend
   - Maximum text length: 10,000 characters
   - Sanitization to prevent injection attacks

## Troubleshooting

### Backend Issues

**Port already in use:**
```powershell
# Change the PORT in .env file or kill the process using port 5000
```

**ENCRYPTION_KEY error:**
```
Error: ENCRYPTION_KEY must be 64 hexadecimal characters (256 bits)
```
Generate a new key using:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env` file
- Check browser console for CORS errors

### Docker Issues

**Container build fails:**
```powershell
# Clean up and rebuild
docker-compose down -v
docker-compose up --build
```

**Permission issues on Windows:**
- Run PowerShell as Administrator
- Check Docker Desktop is running

## Production Deployment

### Environment Setup

1. Set production environment variables
2. Use a reverse proxy (Nginx, Apache)
3. Enable HTTPS with SSL/TLS certificates
4. Configure firewall rules
5. Set up monitoring and logging

### Docker Production Deployment

1. Update `.env` file with production values
2. Use Docker Swarm or Kubernetes for orchestration
3. Configure load balancing
4. Set up automated backups
5. Implement CI/CD pipeline

### Recommended Production Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    image: encryption-backend:latest
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
    environment:
      - NODE_ENV=production
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    networks:
      - encryption-network

  frontend:
    image: encryption-frontend:latest
    deploy:
      replicas: 2
    depends_on:
      - backend
    networks:
      - encryption-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx-prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - encryption-network
```

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **crypto (built-in)** - Cryptographic functions
- **helmet** - Security headers
- **cors** - Cross-Origin Resource Sharing
- **express-validator** - Input validation
- **jest** - Testing framework
- **supertest** - HTTP testing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling with gradients and animations

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server (in Docker)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review test cases for examples

## Acknowledgments

- AES-256-GCM encryption standard
- Node.js crypto module
- React community
- Open source contributors

---

**⚠️ Important Security Note:** This application is designed for educational purposes and demonstrations. For production use with sensitive data, consider additional security measures such as:
- User authentication and authorization
- Rate limiting
- Audit logging
- Key rotation mechanisms
- Compliance with data protection regulations (GDPR, HIPAA, etc.)
