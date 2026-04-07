# SQLite Database Integration - Complete Setup

## Overview

Your ResCraft application now has a complete Python backend with SQLite database integration. This provides secure, persistent storage for user login details and resumes.

## What Was Created

### Backend Files

1. **`backend/app.py`** - Main Flask application
   - Handles user registration and authentication
   - Manages resume storage in SQLite
   - Provides REST API endpoints
   - Includes password hashing with SHA256

2. **`backend/requirements.txt`** - Python dependencies
   - Flask 2.3.0
   - Flask-CORS 4.0.0
   - flask-restx 0.5.1

3. **`backend/README.md`** - Backend documentation with API endpoints

4. **`backend/setup.bat`** - Automated setup script (Windows)

5. **`backend/run.bat`** - Quick start script (Windows)

### Updated Frontend Files

1. **`login-script.js`**
   - Updated to call backend APIs
   - Fallback to localStorage if database offline
   - Password hashing support

2. **`script.js`**
   - Resume save/load now uses database
   - Fetch from database with fallback to localStorage
   - Delete from database functionality

## Quick Start (Windows)

### Step 1: Run Setup
```bash
cd backend
setup.bat
```

This will:
- Install Python dependencies
- Create virtual environment
- Install Flask and required packages

### Step 2: Start Backend
```bash
run.bat
```

You should see:
```
Starting ResCraft Backend...
Backend will run on http://localhost:5000
...
 * Running on http://127.0.0.1:5000
```

### Step 3: Use Application
1. Open `http://localhost/ResCraft/login.html` in your browser
2. Create a new account or login
3. Resumes are now saved to SQLite database!

## Database Architecture

### SQLite Database File
- **Location**: `backend/resumemaker.db`
- Created automatically on first run

### Database Tables

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Saved Resumes Table
```sql
CREATE TABLE saved_resumes (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    title TEXT NOT NULL,
    resume_html TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
)
```

## API Endpoints

### Authentication

**POST** `/api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123",
  "rememberMe": true
}
```

### Resume Management

**POST** `/api/resumes/save`
```json
{
  "email": "john@example.com",
  "id": "resume-1234567890",
  "title": "John Doe - Software Engineer",
  "html": "<div>resume content...</div>"
}
```

**GET** `/api/resumes/get?email=john@example.com`

**DELETE** `/api/resumes/delete`
```json
{
  "id": "resume-1234567890",
  "email": "john@example.com"
}
```

## Features

✅ **Secure Authentication**
- Email validation
- Password hashing (SHA256)
- Session management

✅ **Resume Storage**
- Save unlimited resumes
- Edit existing resumes
- Delete resumes
- Timestamps for all saves

✅ **Fallback System**
- If backend offline, uses localStorage
- Automatic sync when backend comes online

✅ **Cross-Origin Support**
- CORS enabled for frontend-backend communication
- Works with different ports

## Architecture

```
Frontend (HTML/CSS/JavaScript)
         |
         | HTTP Requests
         | (JSON)
         V
Backend (Flask/Python)
         |
         V
Database (SQLite)
```

## Development vs Production

### Development (Current)
- Backend runs on `http://localhost:5000`
- Frontend communicates with API
- Good for testing and development

### For Production
1. Consider using a more robust web server (Gunicorn, uWSGI)
2. Deploy to cloud hosting (Heroku, AWS, DigitalOcean, etc.)
3. Use HTTPS for encrypted communication
4. Add authentication tokens (JWT)
5. Implement rate limiting
6. Use environment variables for configuration

## Troubleshooting

### Backend Won't Start
```
ERROR: No module named 'flask'
```
Solution: Run `setup.bat` again to install dependencies

### Port Already in Use
If port 5000 is busy, edit `backend/app.py`:
```python
# Change this line:
app.run(debug=True, port=5000)

# To:
app.run(debug=True, port=5001)
```

### CORS Errors
Make sure backend is running before accessing frontend

### Database Locked
Stop the backend and delete `backend/resumemaker.db`, then restart

## File Structure

```
ResCraft/
├── index.html
├── login.html
├── dashboard.html
├── script.js (updated)
├── login-script.js (updated)
├── style.css
├── SETUP_DATABASE.md
├── DB_INTEGRATION_SUMMARY.md (this file)
└── backend/
    ├── app.py (new)
    ├── requirements.txt (new)
    ├── setup.bat (new)
    ├── run.bat (new)
    ├── README.md (new)
    ├── venv/ (created by setup)
    └── resumemaker.db (created on first run)
```

## Next Steps

1. ✅ Run `backend/setup.bat`
2. ✅ Run `backend/run.bat` to start server
3. ✅ Visit `http://localhost/ResCraft/login.html`
4. ✅ Create account and use application

## Support

For issues or questions:
1. Check error messages in backend console
2. Verify backend is running on port 5000
3. Check browser console for frontend errors (F12)
4. Ensure Python 3.7+ is installed

## Summary

Your ResCraft application now has:
- ✅ Professional database storage
- ✅ Secure password management
- ✅ Persistent user sessions
- ✅ Reliable resume storage
- ✅ Fallback to localStorage
- ✅ Easy setup process

Users can now login with confidence knowing their data is securely stored in the SQLite database!
