# ResCraft Backend Setup

This backend provides SQLite database support for user authentication and resume storage.

## Prerequisites

- Python 3.7+
- pip (Python package manager)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

The SQLite database file (`resumemaker.db`) will be created automatically on first run.

### Optional email setup
If you want OTP emails to be sent from the server, set these environment variables before starting the app:

- `SMTP_HOST`
- `SMTP_PORT` (default `587`)
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM` (optional, defaults to SMTP_USER)

If SMTP is not configured, OTP codes are still generated and printed to the backend console for local testing.

## API Endpoints

### Authentication

- **POST /api/auth/signup** - Register a new user
  - Body: `{name, email, password, confirmPassword}`
  
- **POST /api/auth/login** - Login user
  - Body: `{email, password, rememberMe}`
  
- **POST /api/auth/verify** - Check if email exists
  - Body: `{email}`

- **POST /api/auth/forgot-password** - Send OTP to registered email
  - Body: `{email}`

- **POST /api/auth/reset-password** - Reset password using OTP
  - Body: `{email, otp, password, confirmPassword}`

### Resumes

- **POST /api/resumes/save** - Save a resume
  - Body: `{email, id, title, html}`
  
- **GET /api/resumes/get** - Get all saved resumes
  - Query: `?email=user@example.com`
  
- **DELETE /api/resumes/delete** - Delete a resume
  - Body: `{id, email}`

### Health Check

- **GET /api/health** - Check if server is running

## Database Schema

### Users Table
- id (PRIMARY KEY)
- email (UNIQUE)
- name
- password_hash
- created_at

### Saved Resumes Table
- id (PRIMARY KEY)
- user_email (FOREIGN KEY)
- title
- resume_html
- timestamp

## Notes

- Passwords are hashed using SHA256
- All requests should include proper JSON content-type header
- CORS is enabled for frontend requests from any origin
