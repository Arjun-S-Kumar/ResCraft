// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkAuthenticationStatus();
});

function toggleForms(event) {
    event.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.toggle('active-form');
    signupForm.classList.toggle('active-form');
    
    // Clear form fields when switching
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
    closeAlert();
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = event.target.closest('.toggle-password');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        field.type = 'password';
        icon.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    // Call API
    fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            rememberMe: rememberMe
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store session
            const sessionData = {
                email: data.user.email,
                name: data.user.name,
                loginTime: data.user.loginTime,
                rememberMe: data.user.rememberMe
            };
            
            localStorage.setItem('resumeMakerSession', JSON.stringify(sessionData));
            
            if (rememberMe) {
                localStorage.setItem('resumeMakerRememberMe', JSON.stringify({
                    email: email,
                    name: data.user.name
                }));
            }
            
            showAlert('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showAlert(data.message || 'Login failed', 'danger');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showAlert('Connection error. Trying local authentication...', 'warning');
        // Fallback to localStorage
        fallbackLogin(email, password, rememberMe);
    });
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    if (name.length < 2) {
        showAlert('Name must be at least 2 characters long', 'danger');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    // Call API
    fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Auto login after signup
            const sessionData = {
                email: data.user.email,
                name: data.user.name,
                loginTime: new Date().toISOString(),
                rememberMe: false
            };
            
            localStorage.setItem('resumeMakerSession', JSON.stringify(sessionData));
            
            showAlert('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showAlert(data.message || 'Signup failed', 'danger');
        }
    })
    .catch(error => {
        console.error('Signup error:', error);
        showAlert('Connection error. Trying local storage...', 'warning');
        // Fallback to localStorage
        fallbackSignup(name, email, password);
    });
}

function handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (!email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'danger');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }

    fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Password reset successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1400);
        } else {
            showAlert(data.message || 'Reset failed', 'danger');
        }
    })
    .catch(error => {
        console.error('Forgot password error:', error);
        showAlert('Connection error. Please try again.', 'warning');
    });
}

function handleOtpReset(event) {
    event.preventDefault();

    const emailField = document.getElementById('resetEmail');
    const email = emailField ? emailField.value.trim() : (sessionStorage.getItem('passwordResetEmail') || '');
    const otp = document.getElementById('otpCode').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (!email || !otp || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'danger');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }

    fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            otp,
            password,
            confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Password reset successful! Redirecting to login...', 'success');
            setTimeout(() => {
                sessionStorage.removeItem('passwordResetEmail');
                window.location.href = 'login.html';
            }, 1400);
        } else {
            showAlert(data.message || 'Reset failed', 'danger');
        }
    })
    .catch(error => {
        console.error('Reset password error:', error);
        showAlert('Connection error. Please try again.', 'warning');
    });
}

function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters long', 'danger');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match', 'danger');
        return;
    }

    const session = JSON.parse(localStorage.getItem('resumeMakerSession'));
    if (!session) {
        showAlert('Session expired. Please login again.', 'danger');
        window.location.href = 'login.html';
        return;
    }

    fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: session.email,
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Password changed successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1400);
        } else {
            showAlert(data.message || 'Password change failed', 'danger');
        }
    })
    .catch(error => {
        console.error('Change password error:', error);
        showAlert('Connection error. Please try again.', 'warning');
    });
}

function populateResetEmail() {
    const emailField = document.getElementById('resetEmail');
    if (!emailField) return;

    const savedEmail = sessionStorage.getItem('passwordResetEmail');
    if (savedEmail) {
        emailField.value = savedEmail;
    }
}

function fallbackLogin(email, password, rememberMe) {
    const users = JSON.parse(localStorage.getItem('resumeMakerUsers')) || {};
    
    if (!users[email]) {
        showAlert('Email not found. Please sign up first.', 'danger');
        return;
    }
    
    if (users[email].password !== password) {
        showAlert('Invalid password. Please try again.', 'danger');
        return;
    }
    
    // Login successful
    const user = users[email];
    const sessionData = {
        email: email,
        name: user.name,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };
    
    localStorage.setItem('resumeMakerSession', JSON.stringify(sessionData));
    
    if (rememberMe) {
        localStorage.setItem('resumeMakerRememberMe', JSON.stringify({
            email: email,
            name: user.name
        }));
    }
    
    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function fallbackSignup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('resumeMakerUsers')) || {};
    
    if (users[email]) {
        showAlert('Email already registered. Please login instead.', 'danger');
        return;
    }
    
    // Create new user
    users[email] = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('resumeMakerUsers', JSON.stringify(users));
    
    // Auto login after signup
    const sessionData = {
        email: email,
        name: name,
        loginTime: new Date().toISOString(),
        rememberMe: false
    };
    
    localStorage.setItem('resumeMakerSession', JSON.stringify(sessionData));
    
    showAlert('Account created successfully! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('alertMessage');
    const alertText = document.getElementById('alertText');
    
    alertText.textContent = message;
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

function closeAlert() {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.style.display = 'none';
}

function checkAuthenticationStatus() {
    // This function can be called from index.html to verify login
    const session = JSON.parse(localStorage.getItem('resumeMakerSession'));
    return session ? true : false;
}

function logout() {
    localStorage.removeItem('resumeMakerSession');
    window.location.href = 'login.html';
}

function changePassword() {
    window.location.href = 'change-password.html';
}

function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem('resumeMakerSession'));
    return session ? session.name : null;
}

function getCurrentUserEmail() {
    const session = JSON.parse(localStorage.getItem('resumeMakerSession'));
    return session ? session.email : null;
}

// Auto-fill email if "Remember me" was checked
window.addEventListener('load', function() {
    const rememberMeData = localStorage.getItem('resumeMakerRememberMe');
    if (rememberMeData) {
        const data = JSON.parse(rememberMeData);
        const loginEmail = document.getElementById('loginEmail');
        const rememberMeCheckbox = document.getElementById('rememberMe');

        if (loginEmail) {
            loginEmail.value = data.email;
        }

        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }

    populateResetEmail();
});
