# PWD Automated Application System - API Documentation

## Overview
This document provides comprehensive documentation for all API integrations in the PWD Automated Application System, covering both **Pre-React Migration** (HTML/Vanilla JS) and **Post-React Migration** (React) implementations.

---

## Table of Contents
1. [SheetDB API Overview](#sheetdb-api-overview)
2. [Authentication APIs](#authentication-apis)
3. [Pre-React Migration API Implementation](#pre-react-migration-api-implementation)
4. [Post-React Migration API Implementation](#post-react-migration-api-implementation)
5. [API Error Handling](#api-error-handling)
6. [API Security Considerations](#api-security-considerations)

---

## SheetDB API Overview

### Base URL
The application uses SheetDB as a backend-as-a-service (BaaS) to store and retrieve user authentication data.

**API Endpoint:**
```
https://sheetdb.io/api/v1/duayfvx2u7zh9
```

### Supported Operations
- **Search/Query** - Search for records matching specific criteria
- **Create** - Add new records to the sheet
- **Read** - Retrieve all records
- **Update** - Modify existing records
- **Delete** - Remove records

---

## Authentication APIs

### 1. User Login API

#### Endpoint
```
GET /search?username={username}&password={password}
```

#### Purpose
Verify user credentials against the database and authenticate users.

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | User's username |
| password | string | Yes | User's password (plain text - not recommended for production) |

#### Success Response
```json
[
  {
    "username": "testuser",
    "password": "testpass",
    "id": "1"
  }
]
```

**Status Code:** `200 OK`

**Response Structure:**
- Returns an array of matching records
- If credentials are valid, array contains 1 object
- If credentials are invalid, array is empty `[]`

#### Error Response
```json
{
  "error": "Internal Server Error"
}
```

**Status Code:** `500 Internal Server Error`

#### Usage Examples

**Pre-React (Vanilla JS):**
```javascript
const sheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";

fetch(`${sheetdbUrl}/search?username=${username}&password=${password}`)
    .then(res => res.json())
    .then(data => {
        if (data.length > 0) {
            // Login successful
            sessionStorage.setItem("loggedInUser", username);
            window.location.href = "userHomepage.html";
        } else {
            // Invalid credentials
            console.log("Login failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
```

**Post-React (React/JSX):**
```javascript
const sheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";

const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${sheetdbUrl}/search?username=${username}&password=${password}`);
        const data = await response.json();
        
        if (data.length > 0) {
            sessionStorage.setItem("loggedInUser", username);
            navigate('/testuser', { replace: true });
        } else {
            setLoginMessage('Invalid credentials');
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
```

---

### 2. Admin Login API

#### Endpoint
```
GET /search?username={adminEmail}&password={adminPassword}
```

#### Purpose
Verify administrator credentials and provide elevated access.

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | Admin email address |
| password | string | Yes | Admin password |

#### Success Response
```json
[
  {
    "username": "admin@dasma.gov.ph",
    "password": "adminpass",
    "role": "admin",
    "id": "2"
  }
]
```

**Status Code:** `200 OK`

#### Usage Examples

**Pre-React (Vanilla JS):**
```javascript
const adminSheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";

fetch(`${adminSheetdbUrl}/search?username=${adminEmail}&password=${adminPassword}`)
    .then(res => res.json())
    .then(data => {
        if (data.length > 0) {
            if (adminRemember) {
                localStorage.setItem("adminLoggedIn", adminEmail);
            } else {
                sessionStorage.setItem("adminLoggedIn", adminEmail);
            }
            window.location.href = "adminPage.html";
        }
    });
```

**Post-React (React/JSX):**
```javascript
const adminSheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";

const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${adminSheetdbUrl}/search?username=${adminEmail}&password=${adminPassword}`);
        const data = await response.json();
        
        if (data.length > 0) {
            if (adminRemember) {
                localStorage.setItem("adminLoggedIn", adminEmail);
            } else {
                sessionStorage.setItem("adminLoggedIn", adminEmail);
            }
            navigate('/testadmin', { replace: true });
        }
    } catch (error) {
        console.error("Admin login error:", error);
    }
};
```

---

### 3. User Registration API (Example)

#### Endpoint
```
POST /
```

#### Purpose
Create a new user account in the system.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "data": [
    {
      "username": "newuser",
      "password": "password123"
    }
  ]
}
```

#### Success Response
```json
{
  "created": 1
}
```

**Status Code:** `201 Created`

#### Usage Example (React)
```javascript
const sheetdbUrl = "https://sheetdb.io/api/v1/f5xhho4okmn2x";

const handleSignup = async (e) => {
    e.preventDefault();
    
    // Check if username exists
    const checkResponse = await fetch(`${sheetdbUrl}/search?username=${username}`);
    const existingUsers = await checkResponse.json();
    
    if (existingUsers.length > 0) {
        setMessage("Username already exists.");
        return;
    }
    
    // Create new user
    const newUser = {
        data: [
            {
                username: username,
                password: password
            }
        ]
    };
    
    const addResponse = await fetch(sheetdbUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    });
    
    if (addResponse.ok) {
        navigate("/login");
    }
};
```

---

## Pre-React Migration API Implementation

### File Location
```
Pre-React-Migration/pages/user/userLogin.html
```

### Implementation Details

#### User Login Handler
```javascript
// API URL constant
const sheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";

// Event listener for form submission
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i> Logging in...';
    
    // API call
    fetch(`${sheetdbUrl}/search?username=${username}&password=${password}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                sessionStorage.setItem("loggedInUser", username);
                window.location.href = "userHomepage.html";
            } else {
                // Show error message
                messageDiv.innerHTML = '<div class="alert alert-danger">Invalid credentials</div>';
                loginBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            loginBtn.disabled = false;
        });
});
```

#### Admin Login Handler
```javascript
const adminSheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";

document.getElementById("adminLoginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const adminEmail = document.getElementById('adminEmail').value;
    const adminPassword = document.getElementById('adminPassword').value;
    const adminRemember = document.getElementById('adminRememberMe').checked;
    
    adminLoginBtn.disabled = true;
    
    fetch(`${adminSheetdbUrl}/search?username=${adminEmail}&password=${adminPassword}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                if (adminRemember) {
                    localStorage.setItem("adminLoggedIn", adminEmail);
                } else {
                    sessionStorage.setItem("adminLoggedIn", adminEmail);
                }
                window.location.href = "adminPage.html";
            } else {
                adminMessageDiv.innerHTML = '<div class="alert alert-danger">Invalid credentials</div>';
                adminLoginBtn.disabled = false;
            }
        });
});
```

#### Session Check
```javascript
// Redirect if already logged in
if (sessionStorage.getItem("loggedInUser")) {
    window.location.href = "userHomepage.html";
}
```

---

## Post-React Migration API Implementation

### File Location
```
Post-React-Migration/pwd-application-system/src/pages/login.jsx
```

### Implementation Details

#### State Management
```javascript
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [adminEmail, setAdminEmail] = useState('');
const [adminPassword, setAdminPassword] = useState('');
const [adminRemember, setAdminRemember] = useState(false);
const [loginMessage, setLoginMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

#### API Constants
```javascript
const sheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";
const adminSheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9";
```

#### User Login Handler (Async/Await)
```javascript
const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage('');
    
    if (!username || !password) {
        setLoginMessage('<div class="alert alert-danger">Please enter both username and password.</div>');
        setIsLoading(false);
        return;
    }
    
    try {
        const response = await fetch(`${sheetdbUrl}/search?username=${username}&password=${password}`);
        const data = await response.json();
        
        if (data.length > 0) {
            sessionStorage.setItem("loggedInUser", username);
            setLoginMessage('<div class="alert alert-success">Login successful! Redirecting...</div>');
            setTimeout(() => {
                navigate('/testuser', { replace: true });
            }, 1000);
        } else {
            setLoginMessage('<div class="alert alert-danger">Invalid username or password.</div>');
        }
    } catch (error) {
        console.error("Error:", error);
        setLoginMessage('<div class="alert alert-danger">Login service unavailable.</div>');
    } finally {
        setIsLoading(false);
    }
};
```

#### Admin Login Handler (Async/Await)
```javascript
const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminIsLoading(true);
    setAdminLoginMessage('');
    
    if (!adminEmail || !adminPassword) {
        setAdminLoginMessage('<div class="alert alert-danger">Please enter both email and password.</div>');
        setAdminIsLoading(false);
        return;
    }
    
    try {
        const response = await fetch(`${adminSheetdbUrl}/search?username=${adminEmail}&password=${adminPassword}`);
        const data = await response.json();
        
        if (data.length > 0) {
            if (adminRemember) {
                localStorage.setItem("adminLoggedIn", adminEmail);
            } else {
                sessionStorage.setItem("adminLoggedIn", adminEmail);
            }
            
            setAdminLoginMessage('<div class="alert alert-success">Admin login successful!</div>');
            setTimeout(() => {
                navigate('/testadmin', { replace: true });
            }, 1000);
        } else {
            setAdminLoginMessage('<div class="alert alert-danger">Invalid credentials.</div>');
        }
    } catch (error) {
        console.error("Admin login error:", error);
        setAdminLoginMessage('<div class="alert alert-danger">Service unavailable.</div>');
    } finally {
        setAdminIsLoading(false);
    }
};
```

#### useEffect Hook for Session Check
```javascript
useEffect(() => {
    if (sessionStorage.getItem("loggedInUser")) {
        navigate('/testuser', { replace: true });
        return;
    }
    if (sessionStorage.getItem("adminLoggedIn") || localStorage.getItem("adminLoggedIn")) {
        navigate('/testadmin', { replace: true });
        return;
    }
}, [navigate]);
```

---

## API Error Handling

### Common Error Scenarios

#### 1. Network Errors
```javascript
// Pre-React
.catch(error => {
    console.error("Error:", error);
    messageDiv.innerHTML = '<div class="alert alert-danger">Network error. Check your connection.</div>';
});

// Post-React
catch (error) {
    console.error("Error:", error);
    setLoginMessage('<div class="alert alert-danger">Network error. Check your connection.</div>');
}
```

#### 2. Invalid Credentials
```javascript
// Check if response array is empty
if (data.length > 0) {
    // Valid credentials
} else {
    // Invalid credentials
    setLoginMessage('Invalid username or password');
}
```

#### 3. Empty Form Fields
```javascript
// Pre-React
if (!username || !password) {
    messageDiv.innerHTML = '<div class="alert alert-danger">Please enter both username and password.</div>';
    return;
}

// Post-React
if (!username || !password) {
    setLoginMessage('<div class="alert alert-danger">Please enter both username and password.</div>');
    setIsLoading(false);
    return;
}
```

#### 4. Duplicate Username (Registration)
```javascript
const checkResponse = await fetch(`${sheetdbUrl}/search?username=${username}`);
const existingUsers = await checkResponse.json();

if (existingUsers.length > 0) {
    setMessage("Username already exists.");
    return;
}
```

---

## API Security Considerations

### Current Implementation Issues

⚠️ **WARNING:** The current implementation has several security vulnerabilities:

1. **Plain Text Passwords**
   - Passwords are transmitted and stored in plain text
   - No encryption or hashing
   - **Recommendation:** Implement bcrypt or similar hashing on backend

2. **Client-Side Authentication**
   - Authentication logic runs entirely on client
   - Credentials exposed in URL parameters
   - **Recommendation:** Move to server-side authentication with JWT tokens

3. **No HTTPS Enforcement**
   - API calls may be made over HTTP
   - **Recommendation:** Enforce HTTPS for all API calls

4. **Session Storage Vulnerabilities**
   - User credentials stored in browser storage
   - Vulnerable to XSS attacks
   - **Recommendation:** Use secure, httpOnly cookies

5. **API Key Exposure**
   - SheetDB API key visible in client code
   - **Recommendation:** Use environment variables and proxy server

### Recommended Security Improvements

```javascript
// Example: Environment variables (React)
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Example: Authorization header instead of URL params
const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, password })
});
```

---

## API Response Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication failed |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## Testing the APIs

### Using Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Perform login action
4. Inspect request/response

### Using curl
```bash
# User login
curl "https://sheetdb.io/api/v1/duayfvx2u7zh9/search?username=test&password=test"

# Create user
curl -X POST "https://sheetdb.io/api/v1/duayfvx2u7zh9" \
  -H "Content-Type: application/json" \
  -d '{"data": [{"username": "newuser", "password": "pass123"}]}'
```

### Using Postman
1. Create new GET request
2. URL: `https://sheetdb.io/api/v1/duayfvx2u7zh9/search?username=test&password=test`
3. Send request
4. View response

---

## Future API Enhancements

### Planned Features
1. **Registration Form Submission API**
   - Store PWD application data
   - File upload support
   - Email notifications

2. **Application Status API**
   - Check application status by registration number
   - Track approval workflow

3. **Admin Dashboard API**
   - Retrieve all applications
   - Update application status
   - Generate reports

4. **Password Reset API**
   - Forgot password functionality
   - Email verification

---

## Conclusion

This API documentation covers all current implementations of SheetDB API in both Pre-React and Post-React versions of the PWD Automated Application System. The documentation will be updated as new APIs are implemented.

**Last Updated:** October 12, 2025
**Version:** 1.0
**Maintainer:** Development Team
