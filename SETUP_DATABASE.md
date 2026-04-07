# ResCraft - SQLite Database Setup Guide

This guide explains how to set up and run the Python backend with SQLite database for storing user login details and resumes.

## What's New

The application now uses a SQLite database for persistent storage instead of just browser localStorage:
- User credentials are stored securely in the database
- Passwords are hashed using SHA256
- Resumes are saved to the database
- Includes fallback to localStorage if database is unavailable

## Prerequisites

- **Python 3.7 or higher** - [Download here](https://www.python.org/downloads/)
- **pip** (comes with Python)

## Installation Steps

### 1. Navigate to Backend Directory

```bash
cd c:\xampp\htdocs\ResCraft\backend
```

### 2. Create Virtual Environment (Recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Server

```bash
python app.py
```

You should see:
```
Initializing database...
Database initialized successfully!
Starting Flask server...
 * Running on http://127.0.0.1:5000
```

## Database Files

The SQLite database will be created in the `backend` directory:
- `resumemaker.db` - Main database file

## How It Works

1. **Frontend** (HTML/CSS/JavaScript) runs on `http://localhost:8080` (or XAMPP port)
2. **Backend** (Python Flask) runs on `http://localhost:5000`
3. **Frontend makes API calls** to the backend for:
   - User registration
   - User login
   - Saving resumes
   - Loading resumes
   - Deleting resumes

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Check if email exists

### Resumes
- `POST /api/resumes/save` - Save resume
- `GET /api/resumes/get` - Get all user's resumes
- `DELETE /api/resumes/delete` - Delete resume

### Health
- `GET /api/health` - Check if server is running

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Deactivating Virtual Environment

```bash
# Windows
deactivate

# macOS/Linux
deactivate
```

## Troubleshooting

### Port 5000 Already in Use
If port 5000 is already in use, modify `app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change to different port
```

### Module Not Found Error
Make sure virtual environment is activated and dependencies installed:
```bash
pip install -r requirements.txt
```

### CORS Issues
CORS is already enabled in the app. If you get CORS errors:
1. Make sure the backend is running
2. Check that the API_BASE_URL in `login-script.js` is correct

### Database Errors
Delete `resumemaker.db` to reset the database:
```bash
rm resumemaker.db  # macOS/Linux
del resumemaker.db  # Windows
```

## Features

✅ User registration with email validation
✅ Secure password hashing (SHA256)
✅ User login with session management
✅ Save unlimited resumes per user
✅ Edit and delete saved resumes
✅ Automatic fallback to localStorage if database is offline
✅ CORS enabled for cross-origin requests

## Data Security

- Passwords are hashed with SHA256
- Each user's resumes are linked to their email
- No sensitive data stored in browser localStorage (except session token)
- Database file is not accessible from the web

## Next Steps

1. Start the backend server (this guide)
2. Access the application at http://localhost:8080 (or your XAMPP URL)
3. Create a new account or login
4. Start using ResCraft with database storage!
