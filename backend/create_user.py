import sqlite3
import hashlib

conn = sqlite3.connect('resumemaker.db')
c = conn.cursor()
email = 'test@example.com'
name = 'Test User'
password_hash = hashlib.sha256('password123'.encode()).hexdigest()
c.execute('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)', (email, name, password_hash))
conn.commit()
conn.close()
print('User created')