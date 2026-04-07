import sqlite3
import hashlib
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE = 'resumemaker.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Create users table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create saved_resumes table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS saved_resumes (
            id TEXT PRIMARY KEY,
            user_email TEXT NOT NULL,
            title TEXT NOT NULL,
            resume_html TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, password_hash):
    """Verify password against hash"""
    return hash_password(password) == password_hash

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')
        
        # Validation
        if not name or not email or not password:
            return jsonify({'success': False, 'message': 'Please fill in all fields'}), 400
        
        if len(name) < 2:
            return jsonify({'success': False, 'message': 'Name must be at least 2 characters'}), 400
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        if password != confirm_password:
            return jsonify({'success': False, 'message': 'Passwords do not match'}), 400
        
        # Check if email already exists
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': 'Email already registered'}), 409
        
        # Insert new user
        password_hash = hash_password(password)
        cursor.execute('''
            INSERT INTO users (email, name, password_hash)
            VALUES (?, ?, ?)
        ''', (email, name, password_hash))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True, 
            'message': 'Account created successfully',
            'user': {'email': email, 'name': name}
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login a user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        remember_me = data.get('rememberMe', False)
        
        # Validation
        if not email or not password:
            return jsonify({'success': False, 'message': 'Please fill in all fields'}), 400
        
        # Find user
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'success': False, 'message': 'Email not found'}), 401
        
        if not verify_password(password, user['password_hash']):
            return jsonify({'success': False, 'message': 'Invalid password'}), 401
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'email': user['email'],
                'name': user['name'],
                'loginTime': datetime.now().isoformat(),
                'rememberMe': remember_me
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/verify', methods=['POST'])
def verify_user():
    """Verify if a user exists (for email validation)"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({'success': False, 'message': 'Email required'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return jsonify({'success': True, 'exists': True}), 200
        else:
            return jsonify({'success': True, 'exists': False}), 200
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/resumes/save', methods=['POST'])
def save_resume():
    """Save a resume"""
    try:
        data = request.get_json()
        
        user_email = data.get('email', '').strip()
        resume_id = data.get('id', '')
        title = data.get('title', 'Untitled')
        resume_html = data.get('html', '')
        
        if not user_email or not resume_id or not resume_html:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if resume already exists
        cursor.execute('SELECT * FROM saved_resumes WHERE id = ?', (resume_id,))
        existing = cursor.fetchone()
        
        if existing:
            # Update existing
            cursor.execute('''
                UPDATE saved_resumes 
                SET title = ?, resume_html = ?, timestamp = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (title, resume_html, resume_id))
        else:
            # Insert new
            cursor.execute('''
                INSERT INTO saved_resumes (id, user_email, title, resume_html)
                VALUES (?, ?, ?, ?)
            ''', (resume_id, user_email, title, resume_html))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Resume saved successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/resumes/get', methods=['GET'])
def get_resumes():
    """Get all saved resumes for a user"""
    try:
        email = request.args.get('email', '').strip()
        
        if not email:
            return jsonify({'success': False, 'message': 'Email required'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, title, resume_html, timestamp 
            FROM saved_resumes 
            WHERE user_email = ? 
            ORDER BY timestamp DESC
        ''', (email,))
        
        resumes = []
        for row in cursor.fetchall():
            resumes.append({
                'id': row['id'],
                'title': row['title'],
                'html': row['resume_html'],
                'timestamp': row['timestamp']
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'resumes': resumes
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/resumes/delete', methods=['DELETE'])
def delete_resume():
    """Delete a saved resume"""
    try:
        data = request.get_json()
        resume_id = data.get('id', '')
        email = data.get('email', '').strip()
        
        if not resume_id or not email:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Verify ownership
        cursor.execute('SELECT * FROM saved_resumes WHERE id = ? AND user_email = ?', (resume_id, email))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'success': False, 'message': 'Resume not found or access denied'}), 404
        
        # Delete
        cursor.execute('DELETE FROM saved_resumes WHERE id = ?', (resume_id,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Resume deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    print("Initializing database...")
    init_db()
    print("Starting Flask server...")
    app.run(debug=True, port=5000)
