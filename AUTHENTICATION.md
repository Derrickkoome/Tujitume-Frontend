# Firebase Authentication Implementation

## Overview
Tujitume Frontend now includes complete Firebase Google OAuth authentication with token management and secure API integration.

## ✅ Completed Features

### 1. Firebase SDK Setup (✓)
- **File**: `src/firebaseConfig.js`
- Firebase Web SDK (modular) initialized
- Google Authentication Provider configured
- Supports environment variables: `VITE_FIREBASE_*`

### 2. Google OAuth Configuration (✓)
- Google OAuth provider configured via `GoogleAuthProvider`
- Sign-in via popup (OAuth flow)
- Automatic user session management

### 3. Enhanced Login Page (✓)
- **File**: `src/pages/Login.jsx`
- Modern design matching app color scheme (orange/cream background)
- Google Sign-in button with loading state
- Error handling with toast notifications
- Automatic redirect on successful login (preserves intended destination)
- Loading spinner for better UX

### 4. Google Login Flow (✓)
- **File**: `src/hooks/useAuth.js`
- `signIn()` function: Triggers Google OAuth popup
- Error handling for popup cancellations
- Automatic user state management with `onAuthStateChanged`

### 5. Firebase Token Management (✓)
- **File**: `src/hooks/useAuth.js`
- Automatic token retrieval on login
- **Local Storage**: Tokens stored for API requests (`firebaseToken`, `userId`)
- **Token Refresh**: Automatic refresh every 50 minutes (tokens expire after 1 hour)
- **API Headers**: Firebase token automatically added to all API requests via Axios interceptor

### 6. Logout Functionality (✓)
- **File**: `src/components/Navbar.jsx`
- Sign-out button in user dropdown menu
- Toast notification on successful logout
- Automatic cleanup of stored credentials
- Redirect to home page

### 7. Route Protection (✓)
- **File**: `src/routes/AppRoutes.jsx`
- `ProtectedRoute` component guards authenticated routes
- Routes requiring login:
  - `/post-gig` - Create new gig
  - `/profile` - User profile
  - `/dashboard` - User dashboard
  - `/applications` - View applications
- Automatic redirect to `/login` if not authenticated
- Preserves intended destination after login

## Setup Instructions

### 1. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Google Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add authorized redirect URIs (e.g., `http://localhost:5173`, your deployment URL)
4. Get your configuration from Project Settings

### 2. Set Environment Variables
Create `.env.local` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Backend Integration
If you have a backend API that needs to verify Firebase tokens:

```javascript
// Example backend verification (Node.js with Firebase Admin SDK)
const admin = require('firebase-admin');

app.get('/api/protected', authenticate, (req, res) => {
  // req.user contains decoded Firebase token
  res.json({ message: 'Protected data', user: req.user });
});

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## File Structure

```
src/
├── firebaseConfig.js          # Firebase initialization
├── hooks/
│   └── useAuth.js             # Auth hook with token management
├── components/
│   └── Navbar.jsx             # Navbar with sign-out
├── pages/
│   └── Login.jsx              # Enhanced login page
├── routes/
│   └── AppRoutes.jsx          # ProtectedRoute component
└── lib/
    └── api.js                 # Axios with auth header interceptor
```

## Key Features

### Automatic Token Refresh
```javascript
// Tokens refreshed every 50 minutes automatically
// Uses Firebase's built-in token refresh mechanism
```

### Secure API Requests
```javascript
// All requests include: Authorization: Bearer {token}
// Automatic 401 handling redirects to login
const token = localStorage.getItem('firebaseToken');
```

### Session Persistence
```javascript
// User remains logged in across page refreshes
// Firebase handles session via browser storage
```

## Testing

### Test Login Flow
1. Click "Login" button in navbar
2. Sign in with Google account
3. Should redirect to previous page or home
4. User name should appear in navbar

### Test Protected Routes
1. Try accessing `/post-gig` without logging in
2. Should redirect to login page
3. After login, should access protected route

### Test Logout
1. Click user dropdown in navbar
2. Click "Sign out"
3. Should redirect to home
4. Protected routes should be inaccessible

## Security Considerations

✅ **Implemented**
- Firebase tokens managed securely
- Tokens sent only over HTTPS in production
- 401 responses trigger automatic re-authentication
- User UID stored for reference

🔒 **Recommended for Backend**
- Verify Firebase tokens server-side
- Use Firebase Admin SDK
- Set up CORS properly
- Use HTTPS everywhere
- Implement rate limiting on auth endpoints

## Troubleshooting

### "Configuration not found"
- Check `.env.local` has all `VITE_FIREBASE_*` variables
- Restart dev server after adding `.env.local`

### "Popup closed by user"
- Normal behavior when user cancels OAuth
- Toast shows "Sign-in cancelled"

### "Token not in requests"
- Check browser DevTools > Application > Local Storage
- Should see `firebaseToken` with current token
- Check Axios request headers have `Authorization`

### Production Deploy Issues
- Add production Firebase domain to Google OAuth authorized URIs
- Update `VITE_FIREBASE_*` in production environment variables
- Ensure HTTPS enabled

## Next Steps

- [ ] Implement backend token verification
- [ ] Add user profile data sync to backend
- [ ] Implement account deletion
- [ ] Add email link authentication option
- [ ] Set up password reset flow
