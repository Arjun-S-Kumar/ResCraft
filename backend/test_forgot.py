import requests
import json

response = requests.post('http://localhost:5000/api/auth/forgot-password', json={'email': 'test@example.com'})
print('Status:', response.status_code)
print('Response:', response.json())