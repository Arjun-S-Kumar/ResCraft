import sqlite3
import hashlib
import json
import os
import random
import string
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

SMTP_HOST = os.environ.get('SMTP_HOST', '')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASS = os.environ.get('SMTP_PASS', '')
EMAIL_FROM = os.environ.get('EMAIL_FROM', SMTP_USER if SMTP_USER else 'noreply@rescraft.local')
OTP_EXPIRATION_MINUTES = 10

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

    # Create password reset table for OTP flows
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            otp TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
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

def generate_otp(length=6):
    """Generate a numeric OTP"""
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(to_email, otp):
    """Send verification code email to user if SMTP is configured"""
    subject = 'Your ResCraft password reset code'
    body = f"Your ResCraft verification code is: {otp}\n\nThis code is valid for {OTP_EXPIRATION_MINUTES} minutes."

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        print(f'Verification code for {to_email}: {otp} (SMTP not configured)')
        return True

    try:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM
        msg['To'] = to_email
        msg.set_content(body)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.send_message(msg)

        return True
    except Exception as e:
        print('Failed to send verification code email:', e)
        return False

def verify_reset_otp(email, otp):
    """Check whether the provided verification code is valid and not expired"""
    conn = get_db()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        SELECT * FROM password_resets 
        WHERE email = ? AND otp = ? AND used = 0 AND expires_at >= ?
        ORDER BY created_at DESC
        LIMIT 1
    ''', (email, otp, now_iso))
    record = cursor.fetchone()
    conn.close()
    return record is not None

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

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Send verification code to registered email for password reset"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()

        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({'success': False, 'message': 'Email is not registered'}), 404

        otp = generate_otp()
        expires_at = (datetime.now() + timedelta(minutes=OTP_EXPIRATION_MINUTES)).isoformat()

        cursor.execute('UPDATE password_resets SET used = 1 WHERE email = ?', (email,))
        cursor.execute('''
            INSERT INTO password_resets (email, otp, expires_at)
            VALUES (?, ?, ?)
        ''', (email, otp, expires_at))
        conn.commit()
        conn.close()

        email_sent = send_otp_email(email, otp)
        if not email_sent:
            return jsonify({'success': False, 'message': 'Unable to send verification code email. Check server configuration.'}), 500

        response = {'success': True, 'message': 'Verification code sent to registered email'}
        if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
            response['otp'] = otp  # Include OTP in response for development when SMTP not configured
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    """Verify the verification code before resetting password"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        otp = data.get('otp', '').strip()

        if not email or not otp:
            return jsonify({'success': False, 'message': 'Email and OTP are required'}), 400

        valid = verify_reset_otp(email, otp)
        return jsonify({'success': True, 'valid': valid}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset a user password"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        otp = data.get('otp', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirmPassword', '')

        if not email or not password or not confirm_password:
            return jsonify({'success': False, 'message': 'Email and passwords are required'}), 400

        if password != confirm_password:
            return jsonify({'success': False, 'message': 'Passwords do not match'}), 400

        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400

        # Check if user exists
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({'success': False, 'message': 'Email is not registered'}), 404

        # If OTP is provided, verify it
        if otp:
            if not verify_reset_otp(email, otp):
                conn.close()
                return jsonify({'success': False, 'message': 'Invalid or expired verification code'}), 401
            # Mark OTP as used
            cursor.execute('UPDATE password_resets SET used = 1 WHERE email = ? AND otp = ?', (email, otp))

        # Update password
        password_hash = hash_password(password)
        cursor.execute('UPDATE users SET password_hash = ? WHERE email = ?', (password_hash, email))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Password reset successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/change-password', methods=['POST'])
def change_password():
    """Change password for authenticated user"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        current_password = data.get('currentPassword', '')
        new_password = data.get('newPassword', '')
        confirm_password = data.get('confirmPassword', '')

        if not email or not current_password or not new_password or not confirm_password:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400

        if new_password != confirm_password:
            return jsonify({'success': False, 'message': 'New passwords do not match'}), 400

        if len(new_password) < 6:
            return jsonify({'success': False, 'message': 'New password must be at least 6 characters'}), 400

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT password_hash FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({'success': False, 'message': 'User not found'}), 404

        if not verify_password(current_password, user['password_hash']):
            conn.close()
            return jsonify({'success': False, 'message': 'Current password is incorrect'}), 401

        new_password_hash = hash_password(new_password)
        cursor.execute('UPDATE users SET password_hash = ? WHERE email = ?', (new_password_hash, email))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'Password changed successfully'}), 200
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

@app.route('/api/jd/process', methods=['POST'])
def process_jd_file():
    """Process uploaded JD file"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'}), 400
        
        # Extract text based on file type
        filename = secure_filename(file.filename)
        file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        
        if file_ext == 'pdf':
            pdf_reader = PyPDF2.PdfReader(file)
            text = ''
            for page in pdf_reader.pages:
                text += page.extract_text() + '\n'
        elif file_ext == 'txt':
            text = file.read().decode('utf-8')
        else:
            return jsonify({'success': False, 'message': 'Unsupported file type'}), 400
        
        return jsonify({'success': True, 'text': text}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/resumes/match', methods=['POST'])
def match_resumes():
    """Match resumes against job description"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        jd_text = data.get('jd_text', '').strip()
        
        if not email or not jd_text:
            return jsonify({'success': False, 'message': 'Email and job description required'}), 400
        
        # Get user's resumes
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
        
        if not resumes:
            return jsonify({'success': True, 'best_match': None, 'score': 0}), 200
        
        # Improved matching logic
        jd_keywords = extract_keywords(jd_text)
        best_match = None
        best_score = 0
        match_details = []
        
        for resume in resumes:
            resume_text = extract_text_from_html(resume['html'])
            score = calculate_match_score(jd_keywords, resume_text)
            match_details.append({
                'title': resume['title'],
                'score': score,
                'keywords_found': [kw for kw in jd_keywords if kw in resume_text.lower()]
            })
            if score > best_score:
                best_score = score
                best_match = resume
        
        return jsonify({
            'success': True,
            'best_match': best_match,
            'score': best_score,
            'debug': {
                'jd_keywords': jd_keywords,
                'match_details': match_details
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

def extract_keywords(text):
    """Extract keywords from text with improved filtering"""
    import re
    
    # Common words to exclude
    common_words = set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 
        'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 
        'must', 'can', 'shall', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 
        'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
        'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 
        'same', 'so', 'than', 'too', 'very', 'just', 'also', 'as', 'if', 'then', 'else', 'while', 'from', 'up', 'down', 
        'out', 'into', 'over', 'under', 'above', 'below', 'after', 'before', 'during', 'through', 'across', 'against', 
        'along', 'among', 'around', 'behind', 'beside', 'between', 'beyond', 'inside', 'outside', 'within', 'without'
    ])
    
    # Important keywords to always keep (programming languages, technologies, roles)
    important_keywords = set([
        # Programming Languages
        'python', 'java', 'javascript', 'js', 'c++', 'cpp', 'c#', 'csharp', 'php', 'ruby', 'go', 'golang', 'rust', 'swift', 
        'kotlin', 'scala', 'perl', 'lua', 'r', 'matlab', 'sql', 'html', 'css', 'typescript', 'ts', 'bash', 'shell', 'powershell',
        # Frameworks & Libraries
        'react', 'angular', 'vue', 'django', 'flask', 'spring', 'hibernate', 'nodejs', 'express', 'jquery', 'bootstrap',
        'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit', 'keras', 'opencv', 'docker', 'kubernetes', 'aws', 'azure',
        'gcp', 'git', 'linux', 'windows', 'macos', 'android', 'ios',
        # Job Roles
        'developer', 'engineer', 'analyst', 'scientist', 'architect', 'manager', 'lead', 'senior', 'junior', 'intern',
        'consultant', 'administrator', 'specialist', 'coordinator', 'director', 'vp', 'ceo', 'cto', 'cfo', 'hr',
        # Skills
        'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'testing', 'qa', 'api', 'database', 'frontend', 'backend', 'fullstack',
        'mobile', 'web', 'cloud', 'ai', 'ml', 'data', 'analytics', 'security', 'networking', 'system', 'software', 'hardware'
    ])
    
    # Extract words
    words = re.findall(r'\b\w+\b', text.lower())
    
    # Filter keywords
    keywords = []
    for word in words:
        if len(word) > 1:  # Allow 2+ characters
            if word in important_keywords or word not in common_words:
                keywords.append(word)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_keywords = []
    for keyword in keywords:
        if keyword not in seen:
            unique_keywords.append(keyword)
            seen.add(keyword)
    
    return unique_keywords

def extract_text_from_html(html):
    """Extract text from HTML"""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, 'html.parser')
    return soup.get_text()

def calculate_match_score(keywords, resume_text):
    """Calculate match score with improved algorithm"""
    if not resume_text or not keywords:
        return 0
    
    resume_lower = resume_text.lower()
    resume_words = resume_lower.split()
    
    score = 0
    matched_keywords = set()
    
    # Exact matches (highest weight)
    for keyword in keywords:
        if keyword in resume_words:
            score += 10
            matched_keywords.add(keyword)
    
    # Partial matches in text (medium weight)
    for keyword in keywords:
        if keyword not in matched_keywords and keyword in resume_lower:
            score += 5
            matched_keywords.add(keyword)
    
    # Bonus for multiple matches
    if len(matched_keywords) > 3:
        score += len(matched_keywords) * 2
    
    # Bonus for important keywords
    important_terms = ['python', 'java', 'javascript', 'developer', 'engineer', 'react', 'django', 'aws', 'docker']
    for term in important_terms:
        if term in matched_keywords:
            score += 3
    
    return score

@app.route('/api/test/match', methods=['POST'])
def test_match():
    """Test matching with sample data"""
    try:
        # Sample JD
        sample_jd = """
        We are looking for a Python Developer with experience in Django, React, and AWS.
        The candidate should have knowledge of JavaScript, HTML, CSS, and database management.
        Experience with Docker and Git is a plus.
        """
        
        jd_keywords = extract_keywords(sample_jd)
        
        # Sample resume
        sample_resume = """
        John Doe
        Python Developer
        
        Skills: Python, Django, JavaScript, React, AWS, Docker, Git, HTML, CSS, SQL
        Experience: 3 years as Python Developer using Django framework
        """
        
        score = calculate_match_score(jd_keywords, sample_resume)
        
        return jsonify({
            'success': True,
            'jd_keywords': jd_keywords,
            'sample_resume_text': sample_resume,
            'score': score
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
