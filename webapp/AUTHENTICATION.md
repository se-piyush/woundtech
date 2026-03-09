# Authentication Guide

The WoundTech application now includes authentication to protect the frontend and ensure only authorized users can access the patient visit tracking system.

## Overview

- **Login Required**: Users must authenticate before accessing the application
- **JWT-Based**: Uses JSON Web Tokens for secure authentication
- **Token Storage**: Tokens are stored in browser localStorage
- **Auto-Logout**: Automatically logs out users when tokens expire (401 errors)

## User Roles

The backend supports three user roles:

- `SUPER` - Super admin with full access
- `CLINICIAN` - Healthcare providers
- `PATIENT` - Patients

## Default Credentials

For testing and development, use these credentials:

```
Email: super@woundtech.com
Password: SuperPassword123
```

## How It Works

### 1. Login Flow

1. User visits the application
2. If not authenticated, the login screen is displayed
3. User enters email and password
4. Frontend sends credentials to `/api/auth/signin`
5. Backend validates and returns JWT token
6. Token is stored in localStorage
7. User is redirected to the main application

### 2. Authenticated Requests

All API requests automatically include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### 3. Token Expiration

- Tokens expire after 1 hour (configurable in backend)
- When a 401 Unauthorized response is received, the user is automatically logged out
- User must log in again to continue

### 4. Logout

Users can manually logout by clicking the "Logout" button in the header. This:

- Removes the token from localStorage
- Clears the Authorization header
- Returns to the login screen

## Security Features

- **Password Protection**: Passwords are hashed with bcrypt
- **JWT Tokens**: Secure, stateless authentication
- **Auto-Logout**: Invalid/expired tokens trigger automatic logout
- **HTTPS Ready**: Works with secure connections in production

## For Developers

### Adding New Users

Use the backend auth endpoints or database seeding:

```bash
cd server
npm run prisma:seed
```

### Checking Auth Status

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.email}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import api from "./api";

// Token is automatically included
const data = await api.get("/clinicians");
```

## Configuration

### Backend Configuration

Token settings in `server/.env`:

```env
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRY="1d"  # Token expires after 1 day
```

### Frontend Configuration

Token storage key in `webapp/src/api.ts`:

```typescript
const TOKEN_KEY = "woundtech_token";
```

## Troubleshooting

### "Invalid credentials" error

- Verify email and password are correct
- Check backend is running
- Ensure database has user records

### Automatically logged out

- Token may have expired (default: 1 hour)
- Backend may have restarted with new secret
- Clear localStorage and login again

### Login button not responding

- Check browser console for errors
- Verify backend API is accessible
- Check network tab in dev tools

## Production Deployment

Before deploying to production:

1. **Change JWT Secret**: Use a strong, random secret
2. **Use HTTPS**: Always use secure connections
3. **Set Secure Cookies**: Consider using httpOnly cookies instead of localStorage
4. **Enable CORS**: Configure proper CORS settings
5. **Rate Limiting**: Add rate limiting to prevent brute force attacks

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

(Other auth endpoints like registration may be available - check backend docs)

---

For more information, see the backend authentication documentation in `server/docs/AUTHENTICATION.md`.
