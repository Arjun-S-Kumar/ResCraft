# Quick Start Guide - SQLite Database

## ⚡ 30 Second Setup

### 1. One-Time Setup
Open Command Prompt, go to the backend folder, and run:
```
backend\setup.bat
```

### 2. Start Backend Every Time
```
backend\run.bat
```

### 3. Use the App
- Frontend: `http://localhost/ResCraft/`
- Backend: `http://localhost:5000`

**That's it!** Your login and resumes now save to the database.

---

## 📋 What Happens Behind the Scenes

✅ **Setup.bat** does this automatically:
- Checks if Python is installed
- Creates a `venv` folder (virtual environment)
- Installs Flask and required packages

✅ **Run.bat** starts the backend:
- Activates the virtual environment
- Starts the Flask server

✅ **When you login or save a resume:**
- Frontend sends data to backend
- Backend stores in SQLite database (`resumemaker.db`)
- Data persists forever (even after restart)

---

## 🔐 Security Features

- ✅ Passwords hashed with SHA256 (not stored as plain text)
- ✅ User data linked to email only
- ✅ Database file not accessible from web

---

## 🆘 Common Issues

### "Python not found"
- Download Python from https://python.org
- **Important**: Check "Add Python to PATH" during install
- Restart Command Prompt

### "Port 5000 already in use"
- Edit `backend/app.py` line 233 and change `port=5000` to `port=5001`

### "Module not found" error
- Run `setup.bat` again
- Make sure you activated the virtual environment

---

## 📁 Complete File Structure

After running setup.bat, you'll have:

```
backend/
├── app.py ........................ Main backend application
├── requirements.txt ............. Dependency list
├── setup.bat ..................... Setup script (run once)
├── run.bat ....................... Run script (run every time)
├── venv/ ......................... Virtual environment (created by setup)
├── resumemaker.db ................ Database file (created at first run)
└── README.md ..................... Full documentation
```

---

## 👨‍💻 For Developers

### Manual Setup (No setup.bat)
```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run
python app.py
```

### Change Backend Port
Edit `backend/app.py` at the bottom:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Change 5000 to your port
```

---

## ✅ Verification Checklist

- [ ] Python 3.7+ installed
- [ ] Run backend/setup.bat successfully
- [ ] Backend running on http://localhost:5000
- [ ] Frontend accessible at http://localhost/ResCraft/
- [ ] Can create new account
- [ ] Can save resume
- [ ] Data persists after refresh

---

## 📊 What's Stored in Database

### Users Table
- Email (unique)
- Name
- Password (hashed)
- Registration date

### Resumes Table
- Resume ID
- User email
- Title
- Full HTML content
- Save date

---

## 🌍 Key Differences from Old System

| Feature | Before | After |
|---------|--------|-------|
| Storage | Browser only | Secure database |
| Password | Plain text | SHA256 hashed |
| Persistence | Clears on cache clear | Permanent |
| Multi-device | No | Yes (with login) |
| Security | Low | High |

---

## 🚀 You're Ready to Go!

Just run:
1. `backend\setup.bat` (once)
2. `backend\run.bat` (every session)
3. Visit http://localhost/ResCraft/login.html

Enjoy using ResCraft with database storage! 🎉
