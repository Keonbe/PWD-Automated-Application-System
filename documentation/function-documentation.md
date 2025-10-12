# PWD Automated Application System - Function Documentation

## Overview
This document provides comprehensive documentation for all custom JavaScript functions that handle user interactions in the PWD Automated Application System. This excludes React default code (like `reportWebVitals`, `setupTests`, etc.) and focuses on business logic and user interaction handlers.

---

## Table of Contents

1. [Pre-React Migration Functions](#pre-react-migration-functions)
   - [User Login Functions](#pre-react-user-login-functions)
   - [Admin Login Functions](#pre-react-admin-login-functions)
   - [Registration Form Functions](#pre-react-registration-form-functions)
   - [Navigation Functions](#pre-react-navigation-functions)

2. [Post-React Migration Functions](#post-react-migration-functions)
   - [Login Page Functions](#post-react-login-page-functions)
   - [Registration Form Functions](#post-react-registration-form-functions)
    - [Registration Result Functions](#post-react-registration-result-functions)
   - [Consent Page Functions](#post-react-consent-page-functions)
   - [Navigation Functions](#post-react-navigation-functions)

3. [Shared Utility Functions](#shared-utility-functions)

---

## Pre-React Migration Functions

### Pre-React User Login Functions

#### File Location
```
Pre-React-Migration/pages/user/userLogin.html
```

---

#### Function: User Login Form Submit Handler

**Purpose:** Handles user authentication by validating credentials against SheetDB API and managing session storage.

**Trigger:** Form submission event on `#loginForm`

**Parameters:**
- `e` (Event) - Form submission event object

**Implementation:**
```javascript
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get DOM elements
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginBtn = document.getElementById("loginBtn");
    const messageDiv = document.getElementById("loginMessage");

    // Clear previous messages
    messageDiv.innerHTML = '';
    messageDiv.className = 'mt-3';

    // Basic validation
    if (!username || !password) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Please enter both username and password.</div>';
        return;
    }

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i> Logging in...';

    // Fetch API to verify credentials
    fetch(`${sheetdbUrl}/search?username=${username}&password=${password}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                sessionStorage.setItem("loggedInUser", username);
                messageDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
                setTimeout(() => {
                    window.location.href = "userHomepage.html";
                }, 1000);
            } else {
                messageDiv.innerHTML = '<div class="alert alert-danger">Invalid username or password.</div>';
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fa fa-right-to-bracket me-1"></i> Login';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            messageDiv.innerHTML = '<div class="alert alert-danger">Login service is temporarily unavailable.</div>';
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fa fa-right-to-bracket me-1"></i> Login';
        });
});
```

**Flow:**
1. Prevent default form submission
2. Get username and password from form inputs
3. Validate that both fields are filled
4. Show loading spinner on button
5. Make API call to SheetDB
6. If credentials match (array length > 0):
   - Store username in sessionStorage
   - Show success message
   - Redirect to user homepage after 1 second
7. If credentials don't match (empty array):
   - Show error message
   - Re-enable login button
8. If API call fails:
   - Show error message
   - Re-enable login button

**Side Effects:**
- Modifies DOM (button text, message div)
- Writes to sessionStorage
- Redirects to new page on success

**Dependencies:**
- SheetDB API
- Bootstrap alert classes
- Font Awesome icons

---

#### Function: Session Check on Page Load

**Purpose:** Redirect already logged-in users to their dashboard.

**Trigger:** Page load (script execution)

**Implementation:**
```javascript
if (sessionStorage.getItem("loggedInUser")) {
    window.location.href = "userHomepage.html";
}
```

**Flow:**
1. Check if `loggedInUser` exists in sessionStorage
2. If exists, immediately redirect to user homepage

**Side Effects:**
- Page redirect

---

### Pre-React Admin Login Functions

#### Function: Admin Login Form Submit Handler

**Purpose:** Handles administrator authentication and remembers login preference.

**Trigger:** Form submission event on `#adminLoginForm`

**Parameters:**
- `e` (Event) - Form submission event object

**Implementation:**
```javascript
document.getElementById("adminLoginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Get DOM elements
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminMessageDiv = document.getElementById('adminLoginMessage');
    const adminEmailInput = document.getElementById('adminEmail');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminRememberCheckbox = document.getElementById('adminRememberMe');

    // Get values
    const adminEmail = adminEmailInput.value;
    const adminPassword = adminPasswordInput.value;
    const adminRemember = adminRememberCheckbox.checked;

    // Clear previous messages
    adminMessageDiv.innerHTML = '';
    adminMessageDiv.className = 'mt-3';

    // Basic validation
    if (!adminEmail || !adminPassword) {
        adminMessageDiv.innerHTML = '<div class="alert alert-danger m-3 p-3">Please enter both email and password.</div>';
        return;
    }

    // Show loading state
    adminLoginBtn.disabled = true;
    adminLoginBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-1"></i> Logging in...';

    // Fetch API to verify admin credentials
    fetch(`${adminSheetdbUrl}/search?username=${adminEmail}&password=${adminPassword}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                // Store in sessionStorage (remember me not fully implemented)
                if (adminRemember) {
                    sessionStorage.setItem("adminLoggedIn", adminEmail);
                } else {
                    sessionStorage.setItem("adminLoggedIn", adminEmail);
                }
                
                adminMessageDiv.innerHTML = '<div class="alert alert-success m-3 p-3">Admin login successful! Redirecting...</div>';
                setTimeout(() => {
                    window.location.href = "adminPage.html";
                }, 1000);
            } else {
                adminMessageDiv.innerHTML = '<div class="alert alert-danger m-3 p-3">Invalid admin credentials.</div>';
                adminLoginBtn.disabled = false;
                adminLoginBtn.innerHTML = '<i class="fa fa-right-to-bracket me-1"></i> Login';
            }
        })
        .catch(error => {
            console.error("Admin login error:", error);
            adminMessageDiv.innerHTML = '<div class="alert alert-danger m-3 p-3">Admin login service is temporarily unavailable.</div>';
            adminLoginBtn.disabled = false;
            adminLoginBtn.innerHTML = '<i class="fa fa-right-to-bracket me-1"></i> Login';
        });
});
```

**Flow:**
1. Prevent default form submission
2. Get admin email, password, and remember checkbox value
3. Validate fields are not empty
4. Show loading state
5. Make API call to verify credentials
6. On success:
   - Store admin session
   - Show success message
   - Redirect to admin page
7. On failure:
   - Show error message
   - Re-enable button

**Side Effects:**
- Modifies DOM
- Writes to sessionStorage or localStorage
- Page redirect on success

---

### Pre-React Registration Form Functions

#### File Location
```
Pre-React-Migration/pages/homepage/register.html
```

---

#### Function: updateFileName

**Purpose:** Update file upload button text and styling when a file is selected.

**Parameters:**
- `inputId` (string) - ID of the file input element
- `buttonId` (string) - ID of the button element to update

**Implementation:**
```javascript
function updateFileName(inputId, buttonId) {
    const fileInput = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const fileName = fileInput.files[0]?.name;

    // Update button text and styles based on file selection
    if (fileName) {
        button.innerHTML = `<i class="fas fa-check me-2" aria-hidden="true"></i> ${fileName}`;
        button.classList.add("btn-success");
        button.classList.remove("upload-btn");
    } else {
        button.innerHTML = `<i class="fas fa-upload me-2" aria-hidden="true"></i> ${
            buttonId === "idBtn"
                ? "Upload ID Document"
                : "Upload Medical Certificate"
        }`;
        button.classList.remove("btn-success");
        button.classList.add("upload-btn");
    }
}
```

**Flow:**
1. Get file input and button elements by ID
2. Get selected file name (if any)
3. If file is selected:
   - Change button text to show filename with checkmark icon
   - Add success styling (green button)
4. If no file:
   - Reset button text to default upload message
   - Reset to default upload styling

**Usage:**
```html
<input type="file" id="proofIdentity" onchange="updateFileName('proofIdentity', 'idBtn')" />
<button type="button" id="idBtn" onclick="document.getElementById('proofIdentity').click();">
    Upload ID Document
</button>
```

**Side Effects:**
- Modifies button innerHTML
- Modifies button CSS classes

**Returns:** `undefined` (void function)

---

#### Function: Form Validation on Submit

**Purpose:** Validate all required fields before form submission.

**Trigger:** Form submission event

**Parameters:**
- `event` (Event) - Form submission event object

**Implementation:**
```javascript
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        const requiredFields = form.querySelectorAll("[required]");
        let valid = true;

        requiredFields.forEach((field) => {
            // Check if field is empty
            if (!field.value.trim()) {
                valid = false;
                field.classList.add("is-invalid");
            } else {
                field.classList.remove("is-invalid");
                field.classList.add("is-valid");
            }
        });

        if (!valid) {
            // Prevent submission if any required field is invalid
            event.preventDefault();
            alert("Please fill in all required fields marked with an asterisk (*).");
        }
    });
});
```

**Flow:**
1. Wait for DOM to be ready
2. Get reference to form element
3. Attach submit event listener
4. On submit:
   - Find all required fields
   - Loop through each field
   - Check if field value is empty (after trimming whitespace)
   - Add `is-invalid` class to empty fields
   - Add `is-valid` class to filled fields
5. If any field is invalid:
   - Prevent form submission
   - Show alert message

**Side Effects:**
- Prevents form submission if validation fails
- Adds/removes Bootstrap validation classes
- Shows browser alert

**Dependencies:**
- Bootstrap validation classes (`is-invalid`, `is-valid`)

---

### Pre-React Navigation Functions

#### Function: Navigate to Login Page

**Purpose:** Redirect user to login page when clicking login button.

**Usage:**
```html
<button class="btn btn-login" onclick="location.href='/Pre-React-Migration/pages/user/userLogin.html'">
    Login
</button>
```

**Implementation:**
```javascript
onclick="location.href='/Pre-React-Migration/pages/user/userLogin.html'"
```

**Flow:**
1. User clicks button
2. Browser navigates to specified URL

**Side Effects:**
- Full page reload
- Browser history entry added

---

#### Function: Navigate to Consent Page

**Purpose:** Start PWD application process by navigating to consent page.

**Usage:**
```html
<button class="btn btn-primary" onclick="location.href='consent.html'">
    Start Application
</button>
```

**Implementation:**
```javascript
onclick="location.href='consent.html'"
```

---

#### Function: Navigate to Registration Form

**Purpose:** Proceed from consent page to registration form.

**Usage:**
```html
<button type="button" class="btn btn-primary" id="proceedBtn" onclick="location.href='register.html'">
    Proceed to Registration
</button>
```

**Implementation:**
```javascript
onclick="location.href='register.html'"
```

---

## Post-React Migration Functions

### Post-React Login Page Functions

#### File Location
```
Post-React-Migration/pwd-application-system/src/pages/login.jsx
```

---

#### Function: handleUserLogin

**Purpose:** Async function to handle user authentication with modern React patterns.

**Type:** Async Function

**Parameters:**
- `e` (Event) - Form submission event

**Returns:** `Promise<void>`

**Implementation:**
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
            setLoginMessage('<div class="alert alert-danger">Invalid username or password. Please try again.</div>');
        }
    } catch (error) {
        console.error("Error:", error);
        setLoginMessage('<div class="alert alert-danger">Login service is temporarily unavailable. Please try again later.</div>');
    } finally {
        setIsLoading(false);
    }
};
```

**Flow:**
1. Prevent default form submission
2. Set loading state to true
3. Clear previous messages
4. Validate username and password are not empty
5. Make async API call using fetch
6. Parse JSON response
7. If credentials valid:
   - Store username in sessionStorage
   - Show success message
   - Navigate to user page after 1 second
8. If credentials invalid:
   - Show error message
9. If API error:
   - Log error
   - Show error message
10. Finally: Set loading state to false

**State Updates:**
- `setIsLoading(true/false)` - Controls loading spinner
- `setLoginMessage(string)` - Controls message display

**Side Effects:**
- Writes to sessionStorage
- Navigates to different route
- Updates component state

**Dependencies:**
- `useNavigate` hook from react-router-dom
- State variables: `username`, `password`, `isLoading`, `loginMessage`

---

#### Function: handleAdminLogin

**Purpose:** Async function to handle administrator authentication.

**Type:** Async Function

**Parameters:**
- `e` (Event) - Form submission event

**Returns:** `Promise<void>`

**Implementation:**
```javascript
const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminIsLoading(true);
    setAdminLoginMessage('');

    if (!adminEmail || !adminPassword) {
        setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Please enter both email and password.</div>');
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
            
            setAdminLoginMessage('<div class="alert alert-success m-3 p-3">Admin login successful! Redirecting...</div>');
            setTimeout(() => {
                navigate('/testadmin', { replace: true });
            }, 1000);
        } else {
            setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Invalid admin credentials. Please try again.</div>');
        }
    } catch (error) {
        console.error("Admin login error:", error);
        setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Admin login service is temporarily unavailable.</div>');
    } finally {
        setAdminIsLoading(false);
    }
};
```

**Flow:**
1. Prevent default form submission
2. Set admin loading state
3. Validate email and password
4. Make async API call
5. If valid:
   - Check "Remember Me" checkbox
   - Store in localStorage (persistent) or sessionStorage (session only)
   - Show success message
   - Navigate to admin page
6. If invalid:
   - Show error message
7. Finally: Reset loading state

**State Updates:**
- `setAdminIsLoading(true/false)`
- `setAdminLoginMessage(string)`

**Side Effects:**
- Writes to localStorage or sessionStorage based on remember preference
- Navigates to admin route

---

#### Function: useEffect - Session Check

**Purpose:** Check if user is already logged in on component mount and redirect if necessary.

**Type:** React Hook Effect

**Parameters:** None (uses dependencies array)

**Dependencies:** `[navigate]`

**Implementation:**
```javascript
useEffect(() => {
    // Check if already logged in
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

**Flow:**
1. Run on component mount
2. Check sessionStorage for `loggedInUser`
3. If found, navigate to user page and exit
4. Check sessionStorage and localStorage for `adminLoggedIn`
5. If found, navigate to admin page and exit

**Side Effects:**
- May trigger immediate navigation
- Prevents logged-in users from accessing login page

**When It Runs:**
- On component mount
- When `navigate` function changes (rarely)

---

### Post-React Registration Form Functions

#### File Location
```
Post-React-Migration/pwd-application-system/src/pages/homepage/register.jsx
```

---

#### Function: validateForm

**Purpose:** Validate all required form fields including checkboxes and radio button groups.

**Parameters:**
- `form` (HTMLFormElement) - The form element to validate

**Returns:** `boolean` - `true` if form is valid, `false` otherwise

**Implementation:**
```javascript
const validateForm = (form) => {
    const requiredFields = form.querySelectorAll("[required]");
    let valid = true;
    const validatedGroups = new Set();

    requiredFields.forEach((field) => {
        // For checkboxes/radios, check checked status
        if (field.type === 'radio' || field.type === 'checkbox') {
            // Validate group once per name
            if (validatedGroups.has(field.name)) return;
            validatedGroups.add(field.name);

            const group = form.querySelectorAll(`input[name="${field.name}"]`);
            const anyChecked = Array.from(group).some(g => g.checked);
            if (!anyChecked) {
                valid = false;
                group.forEach(g => g.classList.add('is-invalid'));
            } else {
                group.forEach(g => g.classList.remove('is-invalid'));
                group.forEach(g => g.classList.add('is-valid'));
            }
            return;
        }
        
        // For other input types
        if (!field.value || !field.value.toString().trim()) {
            valid = false;
            field.classList.add("is-invalid");
        } else {
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");
        }
    });

    return valid;
};
```

**Flow:**
1. Get all elements with `required` attribute
2. Initialize validation state and tracking set
3. For each required field:
   - **If checkbox/radio:**
     - Skip if group already validated (prevents duplicate checks)
     - Find all inputs with same name (radio/checkbox group)
     - Check if at least one is checked
     - Mark entire group as valid or invalid
   - **If other input type:**
     - Check if value exists and is not empty
     - Add validation classes accordingly
4. Return overall validation status

**Features:**
- Handles radio button groups
- Handles checkbox groups
- Handles text/email/etc inputs
- Prevents duplicate group validation
- Adds Bootstrap validation classes

**Side Effects:**
- Adds/removes CSS classes (`is-invalid`, `is-valid`)

**Returns:** `boolean`

---

#### Function: handleFormSubmit (with API Integration)

**Purpose:** Process form submission, validate data, submit to SheetDB API, and navigate to result page upon success.

**Type:** Async Event Handler Function

**Parameters:**
- `event` (Event) - Form submission event

**Returns:** `Promise<void>`

**Implementation:**
```javascript
const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!validateForm(form)) {
        setSubmitMessage("Please fill in all required fields marked with an asterisk (*). Please check highlighted fields.");
        return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
        // Collect form values using FormData
        const fd = new FormData(form);
        const formData = {};
        
        for (const [key, value] of fd.entries()) {
            // Handle multiple entries with same name
            if (formData.hasOwnProperty(key)) {
                if (Array.isArray(formData[key])) {
                    formData[key].push(value);
                } else {
                    formData[key] = [formData[key], value];
                }
            } else {
                formData[key] = value;
            }
        }

        // Add generated registration number and date
        formData.regNumber = generateRegistrationNumber();
        formData.regDate = getTodayDate();

        // Include selected file names
        formData.proofIdentityName = identityRef.current?.files?.[0]?.name || '';
        formData.proofDisabilityName = disabilityRef.current?.files?.[0]?.name || '';

        // Submit to API
        const result = await submitRegistration(formData);

        if (result.success) {
            setSubmitMessage(result.message);
            
            // Store in sessionStorage for result page
            try {
                sessionStorage.setItem('lastRegistration', JSON.stringify(formData));
            } catch (e) {
                console.warn('Could not save to sessionStorage:', e);
            }

            // Navigate to result page after a short delay
            setTimeout(() => {
                navigate('/register/result', { state: { formData } });
            }, 2000);
        } else {
            setSubmitMessage(result.message);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        setSubmitMessage('Something went wrong. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};
```

**Flow:**
1. Prevent default form submission
2. Validate form using `validateForm` function
3. If validation fails:
   - Set error message
   - Exit function
4. Set loading state to true
5. Clear any previous messages
6. Create FormData object from form
7. Convert FormData to plain object:
   - Handle multiple values for same key (checkboxes/radios)
   - Store as array if multiple values exist
8. Add generated data:
   - Registration number (12 random digits)
   - Current date (YYYY-MM-DD)
   - Uploaded file names (from refs)
9. **Submit to API:**
   - Call `submitRegistration(formData)` API function
   - Wait for response
10. If submission successful:
    - Display success message
    - Save data to sessionStorage
    - Navigate to result page after 2-second delay
11. If submission failed:
    - Display error message from API
12. If network/API error:
    - Log error to console
    - Display generic error message
13. Finally: Reset loading state

**State Management:**
- `isSubmitting` - Controls loading spinner and button disabled state
- `submitMessage` - Controls success/error message display
- Uses FormData API for form data collection
- Stores in sessionStorage as JSON string
- Passes data via React Router location state

**Side Effects:**
- Updates component state (loading, message)
- Writes to sessionStorage
- Makes async API call
- Triggers navigation (on success)
- Shows success/error messages

**Dependencies:**
- `validateForm` function
- `generateRegistrationNumber` function
- `getTodayDate` function
- `submitRegistration` from `../../api/registrationApi`
- `navigate` from react-router-dom
- `identityRef` and `disabilityRef` refs
- State hooks: `setIsSubmitting`, `setSubmitMessage`

**API Integration:**
- Endpoint: `https://sheetdb.io/api/v1/wgjit0nprbfxe`
- Method: POST (via `submitRegistration`)
- Response handling:
  - `{ success: true, message: "..." }` - Success
  - `{ success: false, message: "..." }` - Failure (duplicate regNumber, network error, etc.)

**Error Handling:**
- Validation errors: Display inline message, prevent submission
- Duplicate registration number: Display API error message
- Network errors: Display generic error message
- All errors: Reset loading state in `finally` block

---

#### Function: updateFileName

**Purpose:** React version of file upload button updater using refs.

**Parameters:**
- `inputRef` (React.RefObject) - Ref to file input element
- `buttonId` (string) - ID of button to update

**Returns:** `void`

**Implementation:**
```javascript
const updateFileName = (inputRef, buttonId) => {
    const fileInput = inputRef.current;
    const button = document.getElementById(buttonId);
    const fileName = fileInput?.files[0]?.name;

    if (fileName) {
        button.innerHTML = `<i class="fas fa-check me-2" aria-hidden="true"></i> ${fileName}`;
        button.classList.add("btn-success");
        button.classList.remove("upload-btn");
    } else {
        button.innerHTML = `<i class="fas fa-upload me-2" aria-hidden="true"></i> ${
            buttonId === "idBtn"
                ? "Upload ID Document"
                : "Upload Medical Certificate"
        }`;
        button.classList.remove("btn-success");
        button.classList.add("upload-btn");
    }
};
```

**Usage:**
```jsx
<input
    type="file"
    ref={identityRef}
    onChange={() => updateFileName(identityRef, "idBtn")}
/>
<button
    type="button"
    id="idBtn"
    onClick={() => identityRef.current?.click()}
>
    Upload ID Document
</button>
```

**Differences from Pre-React:**
- Uses React refs instead of direct DOM queries
- Same logic and behavior

---

#### Function: generateRegistrationNumber

**Purpose:** Generate a random 12-digit registration number.

**Parameters:** None

**Returns:** `string` - 12-digit numeric string

**Implementation:**
```javascript
const generateRegistrationNumber = () => {
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += Math.floor(Math.random() * 10); // Random number 0-9
    }
    return result;
};
```

**Flow:**
1. Initialize empty string
2. Loop 12 times
3. Generate random digit (0-9)
4. Append to result string
5. Return completed string

**Example Output:** `"847293016542"`

**Use Case:** Assign unique registration number to PWD applications

---

#### Function: getTodayDate

**Purpose:** Get current date in YYYY-MM-DD format.

**Parameters:** None

**Returns:** `string` - Date in YYYY-MM-DD format

**Implementation:**
```javascript
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
```

**Flow:**
1. Create new Date object
2. Get year as 4-digit number
3. Get month (add 1 since months are 0-indexed), pad with leading zero
4. Get day, pad with leading zero
5. Return formatted string

**Example Output:** `"2025-10-12"`

**Use Case:** Set registration date automatically

---

### Post-React Consent Page Functions

#### File Location
```
Post-React-Migration/pwd-application-system/src/pages/homepage/consent.jsx
```

---

#### Function: handleProceed

**Purpose:** Navigate to registration form when user agrees to terms.

**Parameters:** None

**Returns:** `void`

**Implementation:**
```javascript
const handleProceed = () => {
    if (!agreed) {
        alert("Please read and agree to the terms before proceeding.");
        return;
    }
    navigate('/register');
};
```

**Flow:**
1. Check if `agreed` state is true (checkbox checked)
2. If not agreed:
   - Show alert message
   - Exit function
3. If agreed:
   - Navigate to registration page

**State Dependencies:**
- `agreed` (boolean) - Controlled by checkbox

**Side Effects:**
- May show alert
- Triggers navigation

---

#### Function: handleDecline

**Purpose:** Navigate back to homepage when user declines terms.

**Parameters:** None

**Returns:** `void`

**Implementation:**
```javascript
const handleDecline = () => {
    navigate('/');
};
```

**Flow:**
1. Navigate to home page

**Side Effects:**
- Triggers navigation

---

### Post-React Navigation Functions

#### Function: React Router Navigation

**Purpose:** Navigate between pages in React SPA without full page reload.

**Usage Examples:**

```javascript
// Navigate to user page
navigate('/testuser', { replace: true });

// Navigate to admin page
navigate('/testadmin', { replace: true });

// Navigate with state data
navigate('/register/result', { state: { formData: entries } });

// Navigate back
navigate(-1);
```

**Features:**
- No full page reload
- Maintains application state
- Can pass data via state
- Preserves browser history
- Can replace history entry

**Comparison with Pre-React:**

| Pre-React | Post-React |
|-----------|-----------|
| `window.location.href = "page.html"` | `navigate('/page')` |
| Full page reload | SPA navigation |
| Loses React state | Maintains state |
| Slower | Faster |

---

## Shared Utility Functions

### Function: Session Storage Management

#### setItem
**Purpose:** Store data in session storage

**Usage:**
```javascript
sessionStorage.setItem("loggedInUser", username);
```

#### getItem
**Purpose:** Retrieve data from session storage

**Usage:**
```javascript
const user = sessionStorage.getItem("loggedInUser");
```

#### removeItem
**Purpose:** Remove data from session storage

**Usage:**
```javascript
sessionStorage.removeItem("loggedInUser");
```

---

### Function: Local Storage Management

#### setItem
**Purpose:** Store data persistently across browser sessions

**Usage:**
```javascript
localStorage.setItem("adminLoggedIn", adminEmail);
```

#### getItem
**Purpose:** Retrieve persistent data

**Usage:**
```javascript
const admin = localStorage.getItem("adminLoggedIn");
```

---

## Function Comparison: Pre-React vs Post-React

### Authentication Flow

| Aspect | Pre-React | Post-React |
|--------|-----------|-----------|
| **API Calls** | Promise chains (`.then()`) | Async/await |
| **State Management** | Direct DOM manipulation | React state hooks |
| **Loading States** | Manual button disable/enable | State-controlled rendering |
| **Error Handling** | Try-catch in `.catch()` | Try-catch-finally |
| **Form Handling** | Event listeners | Form onSubmit handlers |
| **Validation** | Direct class manipulation | State + class manipulation |
| **Navigation** | `window.location.href` | `navigate()` hook |

### Form Validation

| Aspect | Pre-React | Post-React |
|--------|-----------|-----------|
| **Validation Trigger** | Submit event listener | Form onSubmit handler |
| **Field Selection** | `querySelectorAll` | `querySelectorAll` (same) |
| **Error Display** | Direct class addition | Class addition via function |
| **Alert Messages** | Browser `alert()` | Browser `alert()` (same) |
| **Checkbox Groups** | Not supported initially | Fully supported with tracking |

---

## Best Practices

### Pre-React Functions
1. ✅ Use event listeners for interactivity
2. ✅ Validate user input before submission
3. ✅ Provide visual feedback (loading states, success/error messages)
4. ✅ Handle errors gracefully
5. ⚠️ Avoid global variables where possible
6. ⚠️ Use proper error handling in promises

### Post-React Functions
1. ✅ Use React hooks for state management
2. ✅ Use async/await for cleaner async code
3. ✅ Leverage useEffect for side effects
4. ✅ Use controlled components for forms
5. ✅ Implement proper loading states
6. ✅ Use React Router for navigation
7. ✅ Keep functions pure when possible
8. ✅ Use refs for DOM access when needed

---

## Function Testing Examples

### Testing Login Function (Manual)

**Pre-React:**
```javascript
// Open browser console on userLogin.html
// Test with valid credentials
document.getElementById("username").value = "test";
document.getElementById("password").value = "test";
document.getElementById("loginForm").dispatchEvent(new Event('submit'));
```

**Post-React:**
```javascript
// In component, add test code temporarily
useEffect(() => {
    console.log("Login component mounted");
    console.log("SheetDB URL:", sheetdbUrl);
}, []);
```

---

## Security Considerations for Functions

### Input Validation
- ✅ Always validate user input
- ✅ Trim whitespace
- ✅ Check for empty fields
- ⚠️ Add regex validation for email, phone numbers
- ⚠️ Sanitize input to prevent XSS

### API Calls
- ⚠️ Passwords in URL parameters (security risk)
- ⚠️ No request throttling (vulnerable to abuse)
- ⚠️ API keys exposed in client code

### Session Management
- ⚠️ Storing sensitive data in sessionStorage
- ⚠️ No session timeout implementation

---

## Registration Result Page Functions

### File Location
```
Post-React-Migration/pwd-application-system/src/pages/homepage/register-result.jsx
```

---

#### Function: useEffect - Load Registration Data

**Purpose:** Load registration data from router state or sessionStorage fallback on component mount.

**Type:** React Hook Effect

**Dependencies:** `[location]`

**Implementation:**
```javascript
useEffect(() => {
    // Try location.state first (navigation), then sessionStorage fallback
    const fromState = location?.state?.formData;
    if (fromState) {
        setData(fromState);
        try { 
            sessionStorage.setItem('lastRegistration', JSON.stringify(fromState)); 
        } catch(e) {}
        return;
    }

    try {
        const stored = sessionStorage.getItem('lastRegistration');
        if (stored) setData(JSON.parse(stored));
    } catch (e) {
        // ignore parse errors
    }
}, [location]);
```

**Flow:**
1. Check if formData exists in router location.state
2. If found:
   - Set data state with formData
   - Backup to sessionStorage for page refresh
   - Exit early
3. If not found:
   - Try to retrieve from sessionStorage
   - Parse JSON string
   - Set data state if valid
4. Ignore any JSON parse errors (fail silently)

**State Updates:**
- `setData(formData)` - Sets the registration data object

**Side Effects:**
- Writes to sessionStorage (if data from router state)
- Reads from sessionStorage (as fallback)

**Use Cases:**
- User navigates from registration form (has location.state)
- User refreshes the page (uses sessionStorage fallback)

**Error Handling:**
- Silently catches JSON parse errors
- Silently catches sessionStorage errors

---

#### Function: display

**Purpose:** Safely display form field values with fallback for missing/empty data.

**Parameters:**
- `key` (string) - The field name to display
- `fallback` (string) - Default value if field is missing (default: `''`)

**Returns:** `string` - The field value or fallback

**Implementation:**
```javascript
const display = (key, fallback = '') => {
    if (!data) return fallback;
    const val = data[key];
    if (Array.isArray(val)) return val.join(', ');
    return val ?? fallback;
};
```

**Flow:**
1. Check if data object exists
2. If no data, return fallback
3. Get value for specified key
4. If value is array (e.g., multiple disabilities):
   - Join array elements with comma-space
5. If value is null/undefined:
   - Return fallback using nullish coalescing
6. Otherwise return the value

**Usage Examples:**
```jsx
// Simple field
<p><strong>Email:</strong> {display('email', '—')}</p>

// Array field (multiple checkboxes)
<p><strong>Disability:</strong> {display('disability', 'Not specified')}</p>

// Conditional display
<p><strong>Name:</strong> {`${display('lastName','')} ${display('firstName','')}`}</p>
```

**Edge Cases Handled:**
- Missing data object (returns fallback)
- Missing field (returns fallback via nullish coalescing)
- Array values (joins with comma)
- Empty strings (treated as valid, not replaced with fallback)
- null/undefined values (returns fallback)

**Return Type:** `string`

---

### Summary of Register-Result Functions

**Component Purpose:**
Display a formatted summary of submitted PWD registration data.

**Data Flow:**
1. Receive data from registration form via router state
2. Backup data to sessionStorage for page refresh support
3. Display all fields using the `display` helper function
4. Provide navigation back to home or new registration

**Key Features:**
- Handles array fields (multiple disabilities)
- Safe null/undefined handling
- Page refresh persistence via sessionStorage
- Fallback values for missing data
- Formatted display with Bootstrap styling

**State Management:**
- `data` - Stores the complete registration object
- Updated via `useEffect` on component mount/location change

**Component Structure:**
```
RegisterResult
├── useEffect (Load data)
├── display (Helper function)
└── JSX (Render formatted summary)
    ├── Applicant Info
    ├── Contact Info
    ├── Disability Info
    ├── Documents Info
    └── Additional Details
```

---

## Conclusion

This function documentation provides comprehensive coverage of all custom JavaScript/JSX functions that handle user interactions in the PWD Automated Application System. The documentation includes both Pre-React (Vanilla JS) and Post-React (React) implementations with detailed explanations of parameters, return values, flow, side effects, and dependencies.

**Key Takeaways:**
- Pre-React uses event listeners and direct DOM manipulation
- Post-React uses hooks, state management, and React Router
- API integration uses fetch with async/await patterns
- Form validation handles multiple input types including checkbox/radio groups
- Registration data persists using sessionStorage for result page display
- All functions include proper error handling and user feedback

**Last Updated:** October 12, 2025
**Version:** 1.1
**Maintainer:** Development Team
- ⚠️ No logout functionality documented

---

## Future Enhancements

### Planned Function Additions

1. **Logout Function**
   ```javascript
   const handleLogout = () => {
       sessionStorage.removeItem("loggedInUser");
       navigate('/login');
   };
   ```

2. **Password Reset Function**
   ```javascript
   const handlePasswordReset = async (email) => {
       // Send reset email
       // Generate reset token
       // Update password via API
   };
   ```

3. **Form Auto-save Function**
   ```javascript
   const autoSaveForm = useCallback(() => {
       const formData = new FormData(formRef.current);
       localStorage.setItem('draftApplication', JSON.stringify(formData));
   }, []);
   ```

4. **File Upload to Cloud Storage**
   ```javascript
   const uploadToCloud = async (file) => {
       // Upload to cloud storage service
       // Return file URL
   };
   ```

---

## Conclusion

This documentation covers all custom JavaScript functions that handle user interactions in both Pre-React and Post-React implementations of the PWD Automated Application System. Functions are organized by feature and implementation phase, with detailed explanations of purpose, flow, parameters, and side effects.

**Key Takeaways:**
- Pre-React uses vanilla JavaScript with event listeners
- Post-React uses modern React patterns (hooks, state, async/await)
- Both implementations provide similar user experiences
- Post-React offers better maintainability and scalability

**Last Updated:** October 12, 2025
**Version:** 1.0
**Maintainer:** Development Team
