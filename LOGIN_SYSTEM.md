# Resume Maker - Login System Documentation

## Overview
A complete authentication system has been added to the Resume Maker project with login and signup functionality.

## Features

### 1. **User Authentication**
   - Secure login page with email and password
   - Signup form with name, email, password validation
   - Password strength requirements (minimum 6 characters)
   - Password visibility toggle
   - Input validation and error messages

### 2. **User Account Management**
   - User data stored in browser's localStorage
   - Remember me functionality
   - Session management
   - Automatic logout capability

### 3. **Security Features**
   - Email format validation
   - Password confirmation matching
   - Secure session tokens
   - Automatic redirect to login for unauthorized access

### 4. **User Interface**
   - Beautiful gradient design (purple/blue theme)
   - Responsive design (works on desktop, tablet, mobile)
   - Smooth animations and transitions
   - Professional form styling with icons
   - Social login button (ready for integration)
   - User welcome message on resume builder page
   - Easy logout button in navigation

## Files Added/Modified

### New Files Created:
1. **login.html** - Login and signup page interface
2. **login-script.js** - Authentication logic and user management

### Files Modified:
1. **index.html** - Added authentication check and user info section
2. **style.css** - Added login page and user info styling
3. **script.js** - Added code to display user name on resume page

## How to Use

### First Time Users (Signup)
1. Open `login.html` in browser
2. Click "Sign up" link if not visible
3. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
4. Accept the terms and conditions
5. Click "Create Account"
6. You'll be automatically logged in and redirected to the resume builder

### Existing Users (Login)
1. Open `login.html` in browser
2. Enter your email and password
3. Optional: Check "Remember me" to auto-fill email on next visit
4. Click "Login"
5. You'll be redirected to the resume builder

### From Resume Builder
1. The page displays your name in the top-right corner
2. Click the logout button (arrow icon) to logout
3. You'll be redirected to the login page

## Technical Details

### Data Storage
- User accounts are stored in `localStorage` under key: `resumeMakerUsers`
- Session data is stored in `localStorage` under key: `resumeMakerSession`
- Remember me data is stored in `resumeMakerRememberMe`

### Sample Data Structure
```javascript
// User Object
{
  "email@example.com": {
    name: "John Doe",
    email: "email@example.com",
    password: "hashedPassword",
    createdAt: "2026-03-24T10:30:00.000Z"
  }
}

// Session Object
{
  email: "email@example.com",
  name: "John Doe",
  loginTime: "2026-03-24T10:35:00.000Z",
  rememberMe: true
}
```

## Testing Credentials

You can test the application by:
1. Signing up with a new account
2. Logout and login with the same credentials
3. Test the "Remember me" functionality
4. Try invalid credentials to see error messages

## Future Enhancements

Potential improvements for production:
1. Backend authentication with secure password hashing
2. Database integration (MongoDB, Firebase, etc.)
3. OAuth integration (Google, GitHub, etc.)
4. Email verification
5. Password reset functionality
6. Two-factor authentication
7. User profile management
8. Save resume data per user

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

⚠️ **Important**: This login system uses localStorage which is suitable for demo/development purposes. For production use, implement:
- Backend authentication with secure password hashing
- HTTPS/SSL encryption
- Database for persistent storage
- Server-side session management
