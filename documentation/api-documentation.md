# PWD Automated Application System - API Documentation

## Overview
This document provides comprehensive documentation for all API integrations in the PWD Automated Application System, covering both **Pre-React Migration** (HTML/Vanilla JS) and **Post-React Migration** (React) implementations.

---

## Table of Contents
1. [SheetDB API Overview](#sheetdb-api-overview)
2. [Authentication APIs](#authentication-apis)
3. [Pre-React Migration API Implementation](#pre-react-migration-api-implementation)
4. [Post-React Migration API Implementation](#post-react-migration-api-implementation)
5. [Registration Submission API](#registration-submission-api)
    - [submitRegistration(formData)](#function-submitregistration)
    - [checkEmailExists(email)](#function-checkemailexists)
6. [API Error Handling](#api-error-handling)
7. [API Security Considerations](#api-security-considerations)

---

## SheetDB API Overview

### Base URL
The application uses SheetDB as a backend-as-a-service (BaaS) to store and retrieve user authentication data.

**API Endpoint:**
```
https://sheetdb.io/api/v1/duayfvx2u7zh9 (Admin)
https://sheetdb.io/api/v1/wgjit0nprbfxe (User)
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
GET /search?adminEmail={adminEmail}&adminPassword={adminPassword}
```

#### Purpose
Verify administrator credentials and provide elevated access.

#### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| adminEmail | string | Yes | Admin email address |
| adminPassword | string | Yes | Admin password |

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

fetch(`${adminSheetdbUrl}/search?adminEmail=${adminEmail}&adminPassword=${adminPassword}`)
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
        const response = await fetch(`${adminSheetdbUrl}/search?adminEmail=${adminEmail}&adminPassword=${adminPassword}`);
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

## Common Issues and Troubleshooting

### Issue: Data Inserted Into Wrong Columns

**Symptoms:**
- Form submissions appear successful but data is in wrong spreadsheet columns
- Registration number appears in mobile column
- Names appear in wrong order or missing
- Blood type or other fields shifted

**Root Cause:**
Column name mismatch between API and spreadsheet headers. SheetDB is case-sensitive and requires exact column name matches.

**Solution:**
Ensure API field names match spreadsheet column names exactly (including camelCase):
```javascript
// ❌ WRONG - lowercase will create new columns
{
  lastname: "Doe",
  firstname: "John", 
  bloodtype: "O+"
}

// ✓ CORRECT - matches spreadsheet camelCase
{
  lastName: "Doe",
  firstName: "John",
  blood: "O+"
}
```

**Prevention:**
1. Always verify spreadsheet column headers before API integration
2. Use exact column names from spreadsheet (case-sensitive)
3. Test with a single submission before bulk operations
4. Check SheetDB response for column creation warnings

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
   - **Recommendation:** Implement hashing on backend

2. **Client-Side Authentication**
   - Authentication logic runs entirely on client
   - Credentials exposed in URL parameters

3. **No HTTPS Enforcement**
   - API calls may be made over HTTP
   - **Recommendation:** Enforce HTTPS for all API calls

4. **Session Storage Vulnerabilities**
   - User credentials stored in browser storage
   - Vulnerable to XSS attacks
   - **Recommendation:** Use secure, httpOnly cookies

5. **API Key Exposure**
   - SheetDB API key visible in client code
   - **Recommendation:** Use environment variables(env) and proxy server

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

## Registration Submission API

### File Location
```
Post-React-Migration/pwd-application-system/src/api/registrationApi.js
```

### Overview
The Registration API handles PWD application form submissions to SheetDB, including duplicate registration number checks and data validation.

---

### Function: submitRegistration

#### Purpose
Submit a completed PWD registration form to SheetDB database after validating the registration number is unique.

#### Endpoint
```
POST https://sheetdb.io/api/v1/wgjit0nprbfxe
GET  https://sheetdb.io/api/v1/wgjit0nprbfxe/search?regNumber={regNumber}
```

#### Parameters
- `formData` (Object) - Registration form data object containing all applicant information

**Required Fields:**
```javascript
{
  regNumber: string,        // 12-digit registration number
  regDate: string,          // Registration date (YYYY-MM-DD)
  lastName: string,         // Applicant's last name
  firstName: string,        // Applicant's first name
  middleName: string,       // Applicant's middle name (optional)
  disability: string|Array, // Type(s) of disability
  street: string,           // Street address
  barangay: string,         // Barangay
  municipality: string,     // Municipality/City
  province: string,         // Province
  region: string,           // Region
  tel: string,              // Telephone (optional)
  mobile: string,           // Mobile number
  email: string,            // Email address
  dob: string,              // Date of birth
  sex: string,              // Gender
  nationality: string,      // Nationality
  blood: string,            // Blood type (optional)
  civil: string,            // Civil status
  emergencyName: string,    // Emergency contact name
  emergencyPhone: string,   // Emergency contact phone
  emergencyRelationship: string, // Relationship to applicant
  proofIdentity: string,         // ID document filename (optional)
  proofDisability: string        // Medical cert filename (optional)
  password: string, // Password in 8 Character Numeric form (Planned: Alphanumeric password soon)
  status: string // Statuses: Pending, Denied, Approved/Accepted
}
```

#### 🔴 CRITICAL: Column Name Mapping Issue (Fixed Oct 15, 2025)

**Issue:** Data was being inserted into wrong columns due to column name case mismatch between form data and spreadsheet headers.

**Root Cause:** 
- Spreadsheet columns use camelCase: `lastName`, `firstName`, `middleName`, `blood`
- API was sending lowercase: `lastname`, `firstname`, `middlename`, `bloodtype`
- SheetDB treats these as different columns, causing data misalignment

**Solution:**
The API now uses **EXACT** column name matches with the spreadsheet:

| Form Field | Spreadsheet Column | Previous (Wrong) | Current (Fixed) |
|------------|-------------------|------------------|-----------------|
| lastName   | lastName          | lastname         | lastName ✓      |
| firstName  | firstName         | firstname        | firstName ✓     |
| middleName | middleName        | middlename       | middleName ✓    |
| blood      | blood             | bloodtype        | blood ✓         |

**Spreadsheet Column Order:**
```
regNumber, regDate, lastName, firstName, middleName, disability, street, barangay, 
municipality, province, region, tel, mobile, email, dob, sex, nationality, blood, 
civil, emergencyName, emergencyPhone, emergencyRelationship, proofIdentity, 
proofDisability, password, status
```

**Important Notes:**
- Always use camelCase for column names matching spreadsheet headers
- Field names in `formData` object must match spreadsheet column names exactly
- SheetDB is case-sensitive and does NOT automatically map similar column names

#### Returns
`Promise<Object>` - Response object with success status and message

**Success Response:**
```javascript
{
  success: true,
  message: "Registration submitted successfully!"
}
```

**Error Responses:**
```javascript
// Duplicate registration number
{
  success: false,
  message: "Registration number already exists. Please try again."
}

// Submission failure
{
  success: false,
  message: "Registration failed. Please try again."
}

// Network/server error
{
  success: false,
  message: "Something went wrong. Please try again later."
}
```

#### Implementation
```javascript
const sheetdbUrl = "https://sheetdb.io/api/v1/wgjit0nprbfxe";

export const submitRegistration = async (formData) => {
    try {
        // Check if registration number already exists
        const checkResponse = await fetch(`${sheetdbUrl}/search?regNumber=${formData.regNumber}`);
        const existingRegistrations = await checkResponse.json();

        if (existingRegistrations.length > 0) {
            return {
                success: false,
                message: "Registration number already exists. Please try again."
            };
        }

        // Prepare data for SheetDB - MUST match spreadsheet column names EXACTLY (camelCase)
        const registrationData = {
            data: [
                {
                    regNumber: formData.regNumber,
                    regDate: formData.regDate,
                    lastName: formData.lastName,        // ✓ EXACT match with spreadsheet
                    firstName: formData.firstName,      // ✓ EXACT match with spreadsheet
                    middleName: formData.middleName || '', // ✓ EXACT match with spreadsheet
                    disability: formData.disability,
                    street: formData.street,
                    barangay: formData.barangay,
                    municipality: formData.municipality,
                    province: formData.province,
                    region: formData.region,
                    tel: formData.tel || '',
                    mobile: formData.mobile,
                    email: formData.email,
                    dob: formData.dob,
                    sex: formData.sex,
                    nationality: formData.nationality || 'Filipino',
                    blood: formData.blood || '',        // ✓ EXACT match with spreadsheet (not "bloodtype")
                    civil: formData.civil,
                    emergencyName: formData.emergencyName,
                    emergencyPhone: formData.emergencyPhone,
                    emergencyRelationship: formData.emergencyRelationship,
                    proofIdentity: formData.proofIdentity || '',     // ✓ Column name in sheet
                    proofDisability: formData.proofDisability || '', // ✓ Column name in sheet
                    password: formData.password || formData.generatedPassword || '',
                    status: formData.status || 'Pending'
                }
            ]
        };

        // Submit registration data
        const addResponse = await fetch(sheetdbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        });

        if (addResponse.ok) {
            return {
                success: true,
                message: "Registration submitted successfully!"
            };
        } else {
            return {
                success: false,
                message: "Registration failed. Please try again."
            };
        }
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message: "Something went wrong. Please try again later."
        };
    }
};
```

#### Flow Diagram
```
1. Receive formData from registration form
2. Check if regNumber exists in database
   ├─ If exists → Return error (duplicate)
   └─ If not exists → Continue
3. Format data for SheetDB API
4. Send POST request with registration data
5. Check response status
   ├─ If OK → Return success message
   └─ If error → Return failure message
6. Handle any network/API errors
```

#### Usage Example (React Component)
```javascript
import { submitRegistration } from '../../api/registrationApi';

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    
    // Validate form
    if (!validateForm(form)) {
        setSubmitMessage("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);
    
    try {
        // Collect form data
        const formData = {
            regNumber: generateRegistrationNumber(),
            regDate: getTodayDate(),
            // ... other form fields
        };

        // Submit to API
        const result = await submitRegistration(formData);

        if (result.success) {
            setSubmitMessage(result.message);
            // Navigate to result page
            navigate('/register/result', { state: { formData } });
        } else {
            setSubmitMessage(result.message);
        }
    } catch (error) {
        console.error(error);
        setSubmitMessage("An error occurred while submitting the form.");
    } finally {
        setIsSubmitting(false);
    }
};
```

---

### Function: checkEmailExists

#### Purpose
Check if an email address already exists in the registration database.

#### Endpoint
```
GET https://sheetdb.io/api/v1/wgjit0nprbfxe/search?email={email}
```

#### Parameters
- `email` (string) - Email address to check

#### Returns
`Promise<boolean>` - `true` if email exists, `false` otherwise

#### Implementation
```javascript
export const checkEmailExists = async (email) => {
    try {
        const response = await fetch(`${sheetdbUrl}/search?email=${email}`);
        const existingUsers = await response.json();
        return existingUsers.length > 0;
    } catch (error) {
        console.error("Error checking email:", error);
        return false;
    }
};
```

#### Usage Example
```javascript
import { checkEmailExists } from '../../api/registrationApi';

const validateEmail = async (email) => {
    const exists = await checkEmailExists(email);
    if (exists) {
        alert("This email is already registered.");
        return false;
    }
    return true;
};
```

---

---

## User Data APIs

### Function: getCurrentUserData

#### Purpose
Retrieve the current logged-in user's complete registration data from SheetDB.

#### Endpoint
```
GET https://sheetdb.io/api/v1/wgjit0nprbfxe/search?regNumber={userId}
```

#### Parameters
- None (reads `userId` from sessionStorage or localStorage internally)

#### Returns
`Promise<Object>` - Complete user data object with normalized field names

#### Response Structure
```javascript
{
  regNumber: string,        // 12-digit registration number
  regDate: string,          // Registration date (YYYY-MM-DD)
  lastName: string,         // User's last name
  firstName: string,        // User's first name
  middleName: string,       // User's middle name
  disability: string,       // Type of disability
  street: string,           // Street address
  barangay: string,         // Barangay
  municipality: string,     // Municipality
  province: string,         // Province
  region: string,           // Region
  tel: string,             // Telephone number
  mobile: string,          // Mobile number
  email: string,           // Email address
  dob: string,             // Date of birth (YYYY-MM-DD)
  sex: string,             // Sex/gender
  nationality: string,     // Nationality
  blood: string,           // Blood type
  civil: string,           // Civil status
  emergencyName: string,   // Emergency contact name
  emergencyPhone: string,  // Emergency contact phone
  emergencyRelationship: string, // Emergency contact relationship
  proofIdentity: string,   // Identity document filename
  proofDisability: string, // Disability certificate filename
  password: string,        // User password
  status: string,          // Application status (Pending/Approved/Denied)
  _raw: Object            // Original API response for debugging
}
```

#### Implementation
```javascript
const SHEETDB_URL = 'https://sheetdb.io/api/v1/wgjit0nprbfxe';

export const getCurrentUserData = async () => {
    try {
        console.log('[userApi] Starting getCurrentUserData');
        
        // Try to get userId from both sessionStorage and localStorage
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        
        console.log('[userApi] Retrieved userId:', userId);
        
        // If no userId found, throw error
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }

        // Build API URL to search by regNumber
        const searchUrl = `${SHEETDB_URL}/search?regNumber=${encodeURIComponent(userId)}`;
        console.log('[userApi] Fetching from:', searchUrl);
        
        // Fetch data from SheetDB
        const response = await fetch(searchUrl);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        console.log('[userApi] Raw API response:', data);
        
        // SheetDB returns an array of matching rows
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error(`No user found with registration number: ${userId}`);
        }
        
        // Get the first matching user
        const userData = data[0];
        
        // Map and normalize the data structure
        const normalizedData = {
            regNumber: userData.regNumber || '',
            regDate: userData.regDate || '',
            lastName: userData.lastName || '',
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            disability: userData.disability || '',
            street: userData.street || '',
            barangay: userData.barangay || '',
            municipality: userData.municipality || '',
            province: userData.province || '',
            region: userData.region || '',
            tel: userData.tel || '',
            mobile: userData.mobile || '',
            email: userData.email || '',
            dob: userData.dob || '',
            sex: userData.sex || '',
            nationality: userData.nationality || '',
            blood: userData.blood || '',
            civil: userData.civil || '',
            emergencyName: userData.emergencyName || '',
            emergencyPhone: userData.emergencyPhone || '',
            emergencyRelationship: userData.emergencyRelationship || '',
            proofIdentity: userData.proofIdentity || '',
            proofDisability: userData.proofDisability || '',
            proofIdentityName: userData.proofIdentityName || '',
            proofDisabilityName: userData.proofDisabilityName || '',
            password: userData.password || '',
            generatedPassword: userData.generatedPassword || '',
            status: userData.status || 'Pending',
            _raw: userData // Keep original for debugging
        };
        
        console.log('[userApi] Normalized user data:', normalizedData);
        return normalizedData;
        
    } catch (error) {
        console.error('[userApi] Error in getCurrentUserData:', error.message);
        console.error('[userApi] Storage check:', {
            sessionUserId: sessionStorage.getItem('userId'),
            localUserId: localStorage.getItem('userId')
        });
        throw error;
    }
};
```

#### Flow Diagram
```
1. Read userId from sessionStorage or localStorage
   ├─ If not found → Throw error "No user ID found"
   └─ If found → Continue
2. Encode userId for URL safety
3. Build search URL with regNumber parameter
4. Send GET request to SheetDB API
5. Check response status
   ├─ If not ok → Throw error with status code
   └─ If ok → Continue
6. Parse JSON response
7. Validate response is array with data
   ├─ If empty/invalid → Throw error "No user found"
   └─ If valid → Continue
8. Extract first matching user from array
9. Normalize all fields with fallback to empty strings
10. Add _raw field with original data for debugging
11. Return normalized user object
```

#### Usage Example
```javascript
import { getCurrentUserData } from '../../api/userApi';

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Fetch current user data
        const data = await getCurrentUserData();
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  return (
    <div>
      {loading ? 'Loading...' : (
        <div>
          <h1>{userData.firstName} {userData.lastName}</h1>
          <p>Status: {userData.status}</p>
        </div>
      )}
    </div>
  );
};
```

#### Error Handling
- **No userId**: Throws `"No user ID found. Please log in again."`
- **API Error**: Throws `"API responded with status {statusCode}"`
- **No Match**: Throws `"No user found with registration number: {userId}"`
- **Network Error**: Caught by try-catch, re-thrown with error details

---

### Function: logoutUser

#### Purpose
Clear all stored user authentication data from browser storage.

#### Endpoint
None (client-side only)

#### Parameters
None

#### Returns
`void`

#### Implementation
```javascript
/**
 * Logout user by clearing all stored data
 */
export const logoutUser = () => {
    console.log('[userApi] Logging out user');
    // Remove userId from localStorage
    localStorage.removeItem('userId');
    // Remove userId from sessionStorage
    sessionStorage.removeItem('userId');
    // Remove cached userData from sessionStorage
    sessionStorage.removeItem('userData');
    // Clear all sessionStorage (if needed)
    sessionStorage.clear();
};
```

#### Flow Diagram
```
1. Log logout action to console
2. Remove 'userId' from localStorage
3. Remove 'userId' from sessionStorage
4. Remove 'userData' from sessionStorage
5. Clear all remaining sessionStorage data
```

#### Usage Example
```javascript
import { logoutUser } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

const handleLogout = async () => {
  try {
    // Clear user session
    logoutUser();
    // Redirect to login page
    navigate('/login', { replace: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Force redirect even if error occurs
    navigate('/login', { replace: true });
  }
};
```

#### Side Effects
- Removes data from `localStorage`
- Clears all data from `sessionStorage`
- User must log in again to access protected pages

---

## Future API Enhancements

### Planned Features
1. **File Upload API**
   - Upload actual files to cloud storage
   - Store file URLs in database

2. **Application Status Update API**
   - Admin can update application status
   - Track approval workflow

3. **Admin Dashboard API**
   - Retrieve all applications
   - Filter by status, date, etc.
   - Generate reports

4. **Password Reset API**
   - Forgot password functionality
   - Email verification
