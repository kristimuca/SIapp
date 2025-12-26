# Text Encryption Web App - Development Guide

## Quick Start for Developers

### Initial Setup

1. Run the setup script:
```powershell
.\setup.ps1
```

This will:
- Check Node.js installation
- Generate a secure encryption key
- Install all dependencies for backend and frontend
- Create necessary `.env` files

### Development Workflow

#### Backend Development

```powershell
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

The backend runs on: `http://localhost:5000`

**Available Commands:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests
- `npm test -- --coverage` - Run tests with coverage report

#### Frontend Development

```powershell
cd frontend
npm start  # Starts React development server
```

The frontend runs on: `http://localhost:3000`

**Available Commands:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Code Structure

#### Backend Architecture

```
backend/
├── server.js              # Express app setup and middleware
├── routes.js              # API route handlers
├── encryptionService.js   # Encryption/decryption logic
└── *.test.js              # Test files
```

**Key Components:**

1. **server.js** - Express server with:
   - Security middleware (Helmet, CORS)
   - Request logging
   - Error handling
   - Health check endpoint

2. **encryptionService.js** - Encryption service with:
   - AES-256-GCM implementation
   - Key validation
   - Error handling

3. **routes.js** - API routes with:
   - Input validation
   - Request/response handling
   - Error responses

#### Frontend Architecture

```
frontend/src/
├── App.js      # Main component with encryption UI
├── api.js      # API service layer
├── App.css     # Component styles
└── index.css   # Global styles
```

**Key Components:**

1. **App.js** - Main React component with:
   - State management
   - Event handlers
   - UI rendering

2. **api.js** - API client with:
   - Axios configuration
   - API methods
   - Error handling

### Testing

#### Backend Tests

Located in `backend/*.test.js`:

- `encryptionService.test.js` - Unit tests for encryption logic
- `routes.test.js` - Integration tests for API endpoints

Run tests:
```powershell
cd backend
npm test
```

Coverage report:
```powershell
npm test -- --coverage
```

#### Writing New Tests

Example test structure:
```javascript
describe('Feature Name', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### API Endpoints

#### POST /api/encrypt

Encrypt plaintext:
```javascript
{
  plaintext: "Your message"
}
```

Returns:
```javascript
{
  success: true,
  data: {
    ciphertext: "...",
    iv: "...",
    authTag: "..."
  }
}
```

#### POST /api/decrypt

Decrypt ciphertext:
```javascript
{
  ciphertext: "...",
  iv: "...",
  authTag: "..."
}
```

Returns:
```javascript
{
  success: true,
  data: {
    plaintext: "Your message"
  }
}
```

### Security Considerations

#### Encryption

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Size**: 256 bits (32 bytes)
- **IV**: Randomly generated for each encryption (16 bytes)
- **Authentication**: GCM provides built-in authentication

#### Best Practices

1. **Never log sensitive data**:
   - Don't log plaintext
   - Don't log encryption keys
   - Be careful with error messages

2. **Input validation**:
   - Validate all inputs on the backend
   - Sanitize user inputs
   - Set reasonable limits (max 10,000 characters)

3. **Error handling**:
   - Don't expose internal errors to clients
   - Log errors securely
   - Return generic error messages

### Environment Variables

#### Backend (.env)

```
PORT=5000
NODE_ENV=development
ENCRYPTION_KEY=<64-character-hex-string>
```

Generate new key:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Docker Development

#### Build and run:
```powershell
docker-compose up --build
```

#### Run in detached mode:
```powershell
docker-compose up -d
```

#### View logs:
```powershell
docker-compose logs -f
```

#### Stop containers:
```powershell
docker-compose down
```

#### Rebuild specific service:
```powershell
docker-compose build backend
docker-compose up backend
```

### Debugging

#### Backend Debugging

1. Add console.log statements
2. Use Node.js debugger:
   ```powershell
   node --inspect server.js
   ```
3. Check logs for errors

#### Frontend Debugging

1. Use browser DevTools (F12)
2. Check Console for errors
3. Use React DevTools extension
4. Check Network tab for API calls

#### Common Issues

**CORS errors:**
- Check CORS configuration in backend
- Verify frontend API_URL
- Check browser console for details

**Encryption errors:**
- Verify ENCRYPTION_KEY is set
- Check key format (64 hex characters)
- Ensure key is same for encrypt/decrypt

**Connection errors:**
- Check backend is running
- Verify port numbers
- Check firewall settings

### Performance Tips

1. **Backend:**
   - Use connection pooling for databases (if added)
   - Implement rate limiting
   - Cache frequently used data
   - Use compression middleware

2. **Frontend:**
   - Lazy load components
   - Optimize images
   - Minimize bundle size
   - Use production builds

### Adding New Features

#### Backend Feature

1. Create new service file if needed
2. Add routes in `routes.js`
3. Add validation
4. Write tests
5. Update API documentation

#### Frontend Feature

1. Create new component
2. Add API method in `api.js`
3. Update UI in `App.js`
4. Add styles
5. Test functionality

### Git Workflow

1. Create feature branch:
   ```powershell
   git checkout -b feature/my-feature
   ```

2. Make changes and commit:
   ```powershell
   git add .
   git commit -m "Add my feature"
   ```

3. Push and create PR:
   ```powershell
   git push origin feature/my-feature
   ```

### Resources

- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [AES-GCM Explanation](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [Docker Documentation](https://docs.docker.com/)

### Getting Help

- Review test cases for examples
- Check README.md for setup instructions
- Look at error logs for debugging
- Review code comments
