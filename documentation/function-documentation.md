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

3. [Merged Features Function Documentation](#merged-features-function-documentation)
   - [User Dashboard Functions (userpage.jsx)](#user-dashboard-functions-userpagejsx)
   - [Admin Dashboard Functions (adminpage.jsx)](#admin-dashboard-functions-adminpagejsx)
   - [Enhanced Login Functions (login.jsx)](#enhanced-login-functions-loginjsx)
   - [Session Management Functions](#session-management-functions)
   - [Branch Merge Impact Summary](#branch-merge-impact-summary)

4. [Shared Utility Functions](#shared-utility-functions)

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
    fetch(`${adminSheetdbUrl}/search?adminEmail=${adminEmail}&adminPassword=${adminPassword}`)
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
        const response = await fetch(`${adminSheetdbUrl}/search?adminEmail=${adminEmail}&adminPassword=${adminPassword}`);
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
        // Collect form values manually to ensure all fields are captured properly
        // Note: FormData can miss fields in input-groups, so we collect manually
        const formData = {
            // Name fields - must match spreadsheet column names exactly (camelCase)
            lastName: form.lastName.value.trim(),
            firstName: form.firstName.value.trim(),
            middleName: form.middleName.value.trim(),
            
            // Disability - get selected radio button
            disability: form.querySelector('input[name="disability"]:checked')?.value || '',
            
            // Address
            street: form.street.value.trim(),
            barangay: form.barangay.value.trim(),
            
            // Contact
            tel: form.tel?.value?.trim() || '',
            mobile: form.mobile.value.trim(),
            email: form.email.value.trim(),
            
            // Personal info
            dob: form.dob.value,
            // `sex` is a select element in the form; read its value directly
            sex: form.sex?.value || '',
            nationality: form.nationality?.value?.trim() || 'Filipino',
            blood: form.blood?.value?.trim() || '',
            civil: form.querySelector('input[name="civil"]:checked')?.value || '',
            
            // Emergency contact
            emergencyName: form.emergencyName.value.trim(),
            emergencyPhone: form.emergencyPhone.value.trim(),
            emergencyRelationship: form.emergencyRelationship.value.trim(),
        };

        // Add generated registration number and date
        formData.regNumber = generateRegistrationNumber();
        formData.regDate = getTodayDate();

        // Set fixed location values
        formData.municipality = "Dasmariñas";
        formData.province = "Cavite";
        formData.region = "IV-A";

        // Generate password and set status
        formData.generatedPassword = generatePassword8();
        formData.status = 'Pending';
        formData.password = formData.generatedPassword;

        // Include selected file names
        formData.proofIdentity = identityRef.current?.files?.[0]?.name || '';
        formData.proofDisability = disabilityRef.current?.files?.[0]?.name || '';

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

**Important Notes:**
- ✓ **Fixed Oct 15, 2025**: Changed from FormData API to manual field collection
- ✓ FormData can miss fields in Bootstrap input-groups, causing data loss
- ✓ Manual collection ensures all fields are captured with correct names
- ✓ Field names use camelCase to match spreadsheet columns exactly (e.g., `lastName` not `lastname`)
- ✓ Radio buttons use `querySelector` with `:checked` selector
- ✓ Optional fields have fallback values to prevent undefined errors

**Flow:**
1. Prevent default form submission
2. Validate form using `validateForm` function
3. If validation fails:
   - Set error message
   - Exit function
4. Set loading state to true
5. Clear any previous messages
6. Manually collect form values from DOM elements:
   - Text inputs using `.value.trim()`
   - Radio buttons using `querySelector(':checked')`
   - Optional fields with fallback values
7. Ensure field names match spreadsheet columns exactly (camelCase)
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

## User Dashboard Functions

### File Location
```
Post-React-Migration/pwd-application-system/src/pages/userpage/userpage.jsx
```

---

#### Function: getStatusInfo

**Purpose:** Compute display information (label, progress percentage, CSS classes) based on application status.

**Type:** Pure Function

**Parameters:**
- `status` (string) - Application status from database

**Returns:** `Object` with properties:
- `label` (string) - Display-friendly status text
- `percent` (number) - Progress bar percentage (0-100)
- `badgeClass` (string) - CSS class for status badge styling
- `fillClass` (string) - CSS class for progress bar color

**Implementation:**
```javascript
const getStatusInfo = (status) => {
    // Only accept the three canonical statuses: pending, approved, denied
    // Normalize status to lowercase and trim whitespace
    const s = (status || '').toString().trim().toLowerCase();
    
    // Check if status is 'pending' or 'under review'
    if (s === 'pending' || s === 'under review') {
      // Return warning styling with 60% progress
      return { label: 'Under Review', percent: 60, badgeClass: 'status-warning', fillClass: 'fill-warning' };
    }
    
    // Check if status is 'approved'
    if (s === 'approved') {
      // Return success styling with 100% progress
      return { label: 'Approved', percent: 100, badgeClass: 'status-success', fillClass: 'fill-success' };
    }
    
    // Check if status is 'denied' or 'rejected'
    if (s === 'denied' || s === 'rejected') {
      // Return danger styling with 100% progress
      return { label: 'Denied', percent: 100, badgeClass: 'status-danger', fillClass: 'fill-danger' };
    }
    
    // Fallback for any other value: show Unknown with 0% and neutral styling
    return { label: status || 'Unknown', percent: 0, badgeClass: 'status-neutral', fillClass: 'fill-neutral' };
};
```

**Status Mapping Table:**
| Input Status | Output Label | Progress % | Badge Class | Fill Class |
|--------------|--------------|------------|-------------|------------|
| "pending" | "Under Review" | 60 | status-warning | fill-warning |
| "under review" | "Under Review" | 60 | status-warning | fill-warning |
| "approved" | "Approved" | 100 | status-success | fill-success |
| "denied" | "Denied" | 100 | status-danger | fill-danger |
| "rejected" | "Denied" | 100 | status-danger | fill-danger |
| null/other | original or "Unknown" | 0 | status-neutral | fill-neutral |

**Usage Example:**
```jsx
// Get status info for current user
const info = getStatusInfo(userData.status);

// Render progress bar with dynamic color
<div className={`user-progress-fill ${info.fillClass}`} 
     style={{width: `${info.percent}%`}} />

// Render status badge with dynamic styling
<span className={`user-status-badge ${info.badgeClass}`}>
  {info.label}
</span>
```

**Edge Cases:**
- `null` or `undefined` → Returns "Unknown" with neutral styling
- Empty string → Returns "Unknown" with neutral styling
- Unrecognized status → Returns original status text with neutral styling
- Case-insensitive matching (handles "PENDING", "Pending", "pending")

---

#### Function: useEffect - loadUserData

**Purpose:** Fetch user data from API on component mount and handle authentication.

**Type:** React Hook Effect

**Dependencies:** `[navigate]`

**Implementation:**
```javascript
useEffect(() => {
    // Define async function to load user data
    const loadUserData = async () => {
      try {
        console.log('[UserPage] Starting to fetch user data...');
        
        // Check if user is logged in by checking userId in storage
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        
        // If no userId found, user is not logged in
        if (!userId) {
          console.warn('[UserPage] No userId found, redirecting to login');
          // Redirect to login page and replace history
          navigate('/login', { replace: true });
          return;
        }
        
        console.log('[UserPage] Found userId:', userId);
        
        // Fetch user data from API using userApi
        const data = await getCurrentUserData();
        console.log('[UserPage] User data loaded successfully:', data);
        
        // Update state with fetched data
        setUserData(data);
        // Clear any previous errors
        setError(null);
        
      } catch (err) {
        console.error('[UserPage] Failed to load user data:', err.message);
        // Set error message for display
        setError(err.message);
        
        // If API fails, use demo data for development
        console.log('[UserPage] Using demo data as fallback');
        setUserData(getDemoUserData());
        
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    // Execute the async function
    loadUserData();
}, [navigate]);
```

**Flow Diagram:**
```
1. Component mounts
2. Check for userId in sessionStorage or localStorage
   ├─ If not found → Navigate to /login (replace history)
   └─ If found → Continue
3. Call getCurrentUserData() API
4. Wait for API response
5. Check API result
   ├─ Success → Update userData state, clear error
   └─ Error → Set error state, load demo data as fallback
6. Finally → Set loading to false
```

**State Updates:**
- `setUserData(data)` - Sets the fetched user data
- `setError(message)` - Sets error message if API fails
- `setLoading(false)` - Removes loading spinner

**Side Effects:**
- May redirect to `/login` if not authenticated
- Makes network request to SheetDB API
- Writes console logs for debugging
- Falls back to demo data if API fails

**Error Handling:**
- No userId → Redirects to login
- API error → Shows error banner, uses demo data
- Network error → Caught and handled gracefully

---

#### Function: getDemoUserData

**Purpose:** Provide fallback demo data for development when API is unavailable.

**Type:** Pure Function

**Parameters:** None

**Returns:** `Object` - Demo user data object

**Implementation:**
```javascript
const getDemoUserData = () => {
    return {
      // Use same formats as register.jsx: 12-digit numeric regNumber
      regNumber: '252175464394',
      // Use YYYY-MM-DD date format
      regDate: '2025-10-13',
      // Personal information
      lastName: 'Dela Cruz',
      firstName: 'Juan',
      middleName: 'M',
      disability: 'Physical Disability',
      // Address information
      street: '123 Main St',
      barangay: 'Sample Barangay',
      // Match register.jsx defaults (disabled inputs)
      municipality: 'Dasmariñas',
      province: 'Cavite',
      region: 'IV-A',
      // Contact information
      tel: '(02) 8123-4567',
      mobile: '0917-123-4567',
      email: 'juan.delacruz@email.com',
      // Personal details
      dob: '1985-01-15',
      sex: 'Male',
      nationality: 'Filipino',
      blood: 'O+',
      civil: 'Single',
      // Emergency contact
      emergencyName: 'Maria Dela Cruz',
      emergencyPhone: '0918-765-4321',
      emergencyRelationship: 'Mother',
      // Match upload fields: filenames are stored in proofIdentity/proofDisability
      proofIdentityName: 'sample-id.png',
      proofDisabilityName: 'sample-medcert.png',
      proofIdentity: 'sample-id.png',
      proofDisability: 'sample-medcert.png',
      // Registration flow fields
      generatedPassword: '12345678',
      password: '12345678',
      // Default status used by the registration form
      status: 'Pending'
    };
};
```

**Purpose:** Allows testing and development without live API connection.

**Usage:** Called automatically when `getCurrentUserData()` fails.

---

#### Function: handleNavClick

**Purpose:** Handle sidebar navigation clicks and execute corresponding actions.

**Type:** Event Handler

**Parameters:**
- `index` (number) - Index of clicked navigation item

**Returns:** `void`

**Implementation:**
```javascript
const handleNavClick = (index) => {
    // Update active navigation state
    setActiveNav(index);
    
    // Close sidebar on mobile after navigation
    if (isSidebarActive) {
      setSidebarActive(false);
    }

    // Handle navigation actions based on index
    switch(index) {
      case 1: // Help
        showHelp();
        break;
      case 2: // Logout
        handleLogout();
        break;
      default:
        // no-op for other indices (e.g., 0 = Dashboard)
        break;
    }
};
```

**Navigation Items:**
- `0` - Dashboard (default view, no action)
- `1` - Help (shows help information)
- `2` - Logout (logs out and redirects)

**Flow:**
1. Set clicked item as active
2. Close mobile sidebar if open
3. Check navigation index
   - Index 1 → Call `showHelp()`
   - Index 2 → Call `handleLogout()`
   - Other → No action

**State Updates:**
- `setActiveNav(index)` - Updates active navigation item
- `setSidebarActive(false)` - Closes mobile sidebar

**Side Effects:**
- Updates UI highlighting
- May close sidebar
- May trigger help modal or logout

---

#### Function: showHelp

**Purpose:** Display help information to the user.

**Type:** Event Handler

**Parameters:** None

**Returns:** `void`

**Implementation:**
```javascript
const showHelp = () => {
    // Show help modal or page
    // Currently displays a simple alert (placeholder)
    alert('Help information will be displayed here.');
};
```

**Status:** Placeholder implementation

**Future Enhancement:** Should open a modal or navigate to help page with:
- FAQ section
- Application process guide
- Contact information
- Document requirements

---

#### Function: handleLogout

**Purpose:** Log out the current user and redirect to login page.

**Type:** Async Event Handler

**Parameters:** None

**Returns:** `Promise<void>`

**Implementation:**
```javascript
const handleLogout = async () => {
    try {
      console.log('[UserPage] Logging out...');
      // Call API function to clear session data
      logoutUser();
      // Redirect to login page (replace history to prevent back button)
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('[UserPage] Logout error:', err);
      // Force redirect even if error occurs
      navigate('/login', { replace: true });
    }
};
```

**Flow:**
1. Log logout action
2. Call `logoutUser()` to clear storage
3. Navigate to `/login` with replace flag
4. If error occurs → Still redirect to login

**Side Effects:**
- Clears localStorage and sessionStorage
- Redirects to login page
- Replaces history (prevents back button returning to dashboard)

**Error Handling:**
- Catches any logout errors
- Forces redirect even if error occurs
- Logs error to console

---

### Component Structure

**UserPage Component Overview:**

**State Variables:**
- `isSidebarActive` (boolean) - Controls mobile sidebar visibility
- `activeNav` (number) - Currently selected navigation item
- `userData` (Object|null) - User data from API or demo data
- `loading` (boolean) - Loading state for initial data fetch
- `error` (string|null) - Error message if API fails

**Key Features:**
1. **Authentication Check** - Redirects if not logged in
2. **API Integration** - Fetches user data from SheetDB
3. **Fallback Data** - Uses demo data if API fails
4. **Responsive Design** - Mobile sidebar with overlay
5. **Status Visualization** - Dynamic progress bars and badges
6. **Activity Timeline** - Shows recent application updates

**UI Sections:**
- Header with mobile menu button
- Sidebar with user info and navigation
- Main content area with cards:
  - Application summary
  - Progress tracker
  - Personal information
  - Contact information
  - Emergency contact
  - Disability information
  - Recent activity timeline

---

## Recent Activity `user` Feature Implementation

### Overview
The Recent Activity feature displays a dynamic timeline of application-related events that adapts based on the user's current application status. This provides users with contextual, status-aware information about their PWD application progress.

### What It Does
- **Dynamic Content**: Shows different activities based on application status (pending, accepted, denied)
- **Real Dates**: Uses actual registration date for "Application Submitted" activity
- **User Context**: Provides relevant information and next steps based on current status
- **Timeline Format**: Displays activities in reverse chronological order (most recent first)

### Implementation Using React JS

#### File Location
```
Post-React-Migration/pwd-application-system/src/pages/userpage/userpage.jsx
```

#### React Patterns Used
1. **Conditional Rendering**: Uses Immediately Invoked Function Expression (IIFE) for status-based rendering
2. **Data Binding**: Binds user data (`userData.status`, `userData.regDate`) to display real information
3. **JSX Fragments**: Returns complete JSX elements from conditional logic
4. **String Manipulation**: Uses optional chaining and toLowerCase() for safe status checking

#### Complete Implementation with Line-by-Line Comments

```jsx
{/* Recent Activity Section - Main container for activity timeline */}
<div className="user-card">
  {/* Section title */}
  <h3 className="user-card-title">Recent Activity</h3>
  
  {/* Dynamic activity based on status: Uses IIFE for conditional rendering */}
  {(() => {
    // Get user status and convert to lowercase for case-insensitive comparison
    const status = userData.status?.toLowerCase();
    
    // Conditional rendering based on application status
    if (status === 'pending') {
      // Status: Pending - Show "Under Review" activity
      return (
        <div className="user-activity-item">
          <div className="user-activity-header">
            {/* Activity title for pending applications */}
            <span className="user-activity-title">Application Under Review</span>
            {/* Time stamp - hardcoded for now, could be dynamic */}
            <span className="user-activity-time">Today, 10:30 AM</span>
          </div>
          {/* Description explaining current status */}
          <p className="user-activity-desc">Your application is currently being reviewed by our team.</p>
        </div>
      );
    } else if (status === 'accepted') {
      // Status: Accepted - Show approval activity
      return (
        <div className="user-activity-item">
          <div className="user-activity-header">
            {/* Activity title for approved applications */}
            <span className="user-activity-title">Application Approved</span>
            {/* Time stamp for approval */}
            <span className="user-activity-time">Today, 9:15 AM</span>
          </div>
          {/* Congratulatory message for approved applications */}
          <p className="user-activity-desc">Congratulations! Your PWD application has been approved.</p>
        </div>
      );
    } else if (status === 'denied') {
      // Status: Denied - Show status update activity
      return (
        <div className="user-activity-item">
          <div className="user-activity-header">
            {/* Neutral title for denied applications */}
            <span className="user-activity-title">Application Status Updated</span>
            {/* Time stamp for status update */}
            <span className="user-activity-time">Today, 11:45 AM</span>
          </div>
          {/* Instructions to contact support */}
          <p className="user-activity-desc">Your application status has been updated. Please contact support for details.</p>
        </div>
      );
    } else {
      // Fallback: Default to "Under Review" for unknown statuses
      return (
        <div className="user-activity-item">
          <div className="user-activity-header">
            {/* Default activity title */}
            <span className="user-activity-title">Application Under Review</span>
            {/* Default time stamp */}
            <span className="user-activity-time">Today, 10:30 AM</span>
          </div>
          {/* Default description */}
          <p className="user-activity-desc">Your application is currently being reviewed by our team.</p>
        </div>
      );
    }
  })()}
  
  {/* Static activity: Documents Verified - Always shown */}
  <div className="user-activity-item">
    <div className="user-activity-header">
      {/* Fixed activity title */}
      <span className="user-activity-title">Documents Verified</span>
      {/* Uses registration date for testing - could be dynamic verification date */}
      <span className="user-activity-time">{userData.regDate}</span>
    </div>
    {/* Description of document verification */}
    <p className="user-activity-desc">All submitted documents have been verified.</p>
  </div>

  {/* Static activity: Application Submitted - Always shown last */}
  <div className="user-activity-item">
    <div className="user-activity-header">
      {/* Fixed activity title */}
      <span className="user-activity-title">Application Submitted</span>
      {/* Uses actual registration date from user data */}
      <span className="user-activity-time">{userData.regDate}</span>
    </div>
    {/* Confirmation message */}
    <p className="user-activity-desc">Your PWD application has been successfully submitted.</p>
  </div>
</div>
```

### How the React Implementation Works

#### 1. IIFE (Immediately Invoked Function Expression)
```jsx
{(() => {
  // Logic here
})()}
```
- **Purpose**: Allows conditional rendering of different JSX based on user status
- **Why IIFE**: Enables complex logic and variable declarations within JSX return
- **Execution**: Runs immediately when component renders, returns appropriate JSX

#### 2. Safe Status Checking
```jsx
const status = userData.status?.toLowerCase();
```
- **Optional Chaining (`?.`)**: Prevents errors if `userData.status` is null/undefined
- **toLowerCase()**: Ensures case-insensitive comparison
- **Fallback**: If status is falsy, conditional checks will fail to else block

#### 3. Conditional Logic Flow
```
Check status === 'pending' → Return "Under Review" activity
Check status === 'accepted' → Return "Approved" activity  
Check status === 'denied' → Return "Status Updated" activity
Default (else) → Return "Under Review" activity
```

#### 4. Data Binding
- **Dynamic Dates**: `{userData.regDate}` binds actual registration date
- **Status-Based Content**: Activity title and description change based on status
- **CSS Classes**: Uses existing `user-activity-*` classes for consistent styling

### Benefits of This Implementation

#### User Experience
- **Contextual Information**: Users see relevant updates based on their application status
- **Real Data**: Registration date provides authentic timeline
- **Clear Next Steps**: Status-appropriate messages guide user actions

#### Developer Experience
- **Maintainable**: Single location for activity logic
- **Extensible**: Easy to add new status conditions
- **Type-Safe**: Uses optional chaining to prevent runtime errors
- **Reusable**: Pattern can be applied to other dynamic content areas

### Future Enhancements

#### Planned Improvements
1. **Dynamic Timestamps**: Replace hardcoded times with actual event timestamps from database
2. **More Status Types**: Add support for "under review", "rejected", etc.
3. **Activity History**: Store and display complete activity timeline
4. **Real-time Updates**: Auto-refresh when status changes
5. **Admin Actions**: Show admin review actions in timeline

#### Technical Enhancements
1. **Custom Hook**: Extract activity logic into `useActivityTimeline()` hook
2. **Component**: Create `<ActivityItem>` component for reusability
3. **Date Formatting**: Use date libraries for better formatting
4. **Animation**: Add smooth transitions between status changes

### Testing the Implementation

#### Status Scenarios
- **Pending**: Shows "Application Under Review" with review message
- **Accepted**: Shows "Application Approved" with congratulations
- **Denied**: Shows "Application Status Updated" with support contact info
- **Unknown/Default**: Falls back to "Under Review" status

#### Data Dependencies
- **userData.status**: Determines which activity to show first
- **userData.regDate**: Used for "Application Submitted" timestamp
- **CSS Classes**: Requires `user-activity-*` classes for styling

This implementation provides a dynamic, user-centric activity feed that enhances the user experience by showing relevant, status-appropriate information in a clean timeline format.

---

---

## Merged Features (User & Admin) Function Documentation

### Overview
This section documents the new functions and features merged from the `borromeobranch` into the `react-migration` branch. These functions enhance user authentication, data management, and admin dashboard capabilities.

---

### User Dashboard Functions (userpage.jsx)

**File Location:** `Post-React-Migration/pwd-application-system/src/pages/userpage/userpage.jsx`

---

#### Function: `loadUserData()`

**Purpose:** Asynchronously loads user data from the API and handles authentication redirects.

**Trigger:** `useEffect` hook on component mount

**Parameters:**
- None (uses `userId` from sessionStorage/localStorage)

**Implementation:**
```javascript
const loadUserData = async () => {
    try {
        console.log('[UserPage] Starting to fetch user data...');
        
        // Check if user is logged in
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        if (!userId) {
            console.warn('[UserPage] No userId found, redirecting to login');
            navigate('/login', { replace: true });
            return;
        }
        
        console.log('[UserPage] Found userId:', userId);
        
        // Fetch user data from API
        const data = await getCurrentUserData();
        console.log('[UserPage] User data loaded successfully:', data);
        
        setUserData(data);
        setError(null);
        
    } catch (err) {
        console.error('[UserPage] Failed to load user data:', err.message);
        setError(err.message);
        
        // If API fails, use demo data for development
        console.log('[UserPage] Using demo data as fallback');
        setUserData(getDemoUserData());
        
    } finally {
        setLoading(false);
    }
};
```

**Flow:**
1. Check for `userId` in sessionStorage or localStorage
2. Redirect to login if not authenticated
3. Call `getCurrentUserData()` API
4. Update state with user data
5. Fallback to demo data if API fails
6. Set loading to false

**Dependencies:**
- `getCurrentUserData()` from userApi.js
- `navigate()` from react-router-dom
- State: `setUserData`, `setError`, `setLoading`

**Error Handling:**
- Redirects to login if no userId found
- Catches API errors and uses demo data as fallback
- Logs all operations for debugging

---

#### Function: `getStatusInfo(status)`

**Purpose:** Computes display label, progress percentage, and CSS classes based on application status.

**Parameters:**
- `status` (string) - Application status (pending, accepted, denied, etc.)

**Returns:**
```javascript
{
    label: string,      // Display label for status
    percent: number,    // Progress percentage (0-100)
    badgeClass: string, // CSS class for status badge
    fillClass: string   // CSS class for progress fill
}
```

**Implementation:**
```javascript
const getStatusInfo = (status) => {
    const s = (status || '').toString().trim().toLowerCase();
    
    if (s === 'pending' || s === 'under review') {
        return { 
            label: 'Under Review', 
            percent: 60, 
            badgeClass: 'status-warning', 
            fillClass: 'fill-warning' 
        };
    }
    
    if (s === 'accepted') {
        return { 
            label: 'Accepted', 
            percent: 100, 
            badgeClass: 'status-success', 
            fillClass: 'fill-success' 
        };
    }
    
    if (s === 'denied' || s === 'rejected') {
        return { 
            label: 'Denied', 
            percent: 100, 
            badgeClass: 'status-danger', 
            fillClass: 'fill-danger' 
        };
    }
    
    // Fallback for unknown status
    return { 
        label: status || 'Unknown', 
        percent: 0, 
        badgeClass: 'status-neutral', 
        fillClass: 'fill-neutral' 
    };
};
```

**Status Mapping:**

| Input Status | Label | Progress | Badge Class | Fill Class |
|-------------|-------|----------|-------------|------------|
| pending, under review | Under Review | 60% | status-warning | fill-warning |
| accepted | Accepted | 100% | status-success | fill-success |
| denied, rejected | Denied | 100% | status-danger | fill-danger |
| (any other) | {status}/Unknown | 0% | status-neutral | fill-neutral |

**Usage:**
```javascript
const statusInfo = getStatusInfo(userData.status);
// Display: statusInfo.label
// Progress bar: statusInfo.percent
// CSS: statusInfo.badgeClass, statusInfo.fillClass
```

---

#### Function: `handleNavClick(index)`

**Purpose:** Handles navigation menu clicks in the user sidebar.

**Parameters:**
- `index` (number) - Navigation menu item index

**Implementation:**
```javascript
const handleNavClick = (index) => {
    setActiveNav(index);
    
    // Close sidebar on mobile
    if (isSidebarActive) {
        setSidebarActive(false);
    }

    // Handle navigation actions
    switch(index) {
        case 1: // Help
            showHelp();
            break;
        case 2: // Logout
            handleLogout();
            break;
        default:
            // Dashboard or other pages
            break;
    }
};
```

**Navigation Index Mapping:**
- `0` - Dashboard
- `1` - Help (shows modal)
- `2` - Logout (clears session)

**Side Effects:**
- Updates active navigation state
- Closes mobile sidebar
- Triggers action based on menu item

---

#### Function: `showHelp()`

**Purpose:** Displays the help modal with user guide information.

**Implementation:**
```javascript
const showHelp = () => {
    handleShowHelpModal();
};
```

**Dependencies:**
- `handleShowHelpModal()` - React-Bootstrap modal handler

---

#### Function: `handleLogout()`

**Purpose:** Logs out the user and redirects to login page.

**Implementation:**
```javascript
const handleLogout = async () => {
    try {
        console.log('[UserPage] Logging out...');
        logoutUser();
        navigate('/login', { replace: true });
    } catch (err) {
        console.error('[UserPage] Logout error:', err);
    }
};
```

**Flow:**
1. Call `logoutUser()` API to clear storage
2. Navigate to login page with replace flag
3. Handle any errors gracefully

**Dependencies:**
- `logoutUser()` from userApi.js
- `navigate()` from react-router-dom

---

#### Function: `getDemoUserData()`

**Purpose:** Provides fallback demo data when API is unavailable.

**Returns:**
```javascript
{
    regNumber: '252175464394',
    regDate: '2025-10-13',
    lastName: 'Dela Cruz',
    firstName: 'Juan',
    // ... (complete user object with all fields)
    status: 'Denied'
}
```

**Usage:**
- Fallback when API fails
- Development/testing purposes
- Ensures UI remains functional

---

### Admin Dashboard Functions (adminpage.jsx)

**File Location:** `Post-React-Migration/pwd-application-system/src/pages/adminpage/adminpage.jsx`

---

#### Function: `fetchData()`

**Purpose:** Fetches all user applications from SheetDB and computes statistics.

**Trigger:** `useEffect` hook on component mount

**Implementation:**
```javascript
const fetchData = async () => {
    try {
        const response = await fetch(SHEETDB_URL);
        const data = await response.json();

        // Format and normalize data
        const formattedData = data.map((row) => {
            const normalizedStatus = normalizeStatus(row.status);
            return {
                ...row,
                fullName: `${row.lastName || ""}, ${row.firstName || ""} ${row.middleName || ""}`.trim(),
                status: normalizedStatus,
            };
        });

        setApplications(formattedData);

        // Compute status counts
        const counts = formattedData.reduce((acc, row) => {
            acc[row.status] = (acc[row.status] || 0) + 1;
            return acc;
        }, {});

        // Format for chart
        const chartData = Object.entries(counts).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            Applications: count,
        }));

        setStatusData(chartData);
    } catch (error) {
        console.error("Error fetching data from SheetDB:", error);
    }
};
```

**Flow:**
1. Fetch all applications from SheetDB
2. Normalize status values
3. Format full names
4. Compute status counts
5. Format data for Recharts visualization
6. Update state

**Data Transformations:**
- Status normalization (accepted, pending, rejected)
- Full name concatenation
- Count aggregation by status
- Chart data formatting

---

#### Function: `normalizeStatus(status)`

**Purpose:** Normalizes various status string formats to standardized values.

**Parameters:**
- `status` (string) - Raw status value from database

**Returns:**
- `string` - Normalized status (accepted, pending, rejected, unknown)

**Implementation:**
```javascript
const normalizeStatus = (status) => {
    if (!status) return "unknown";
    const s = status.trim().toLowerCase();
    if (s.includes("accept")) return "accepted";
    if (s.includes("pending") || s.includes("wait")) return "pending";
    if (s.includes("reject") || s.includes("denied")) return "rejected";
    return "unknown";
};
```

**Status Mapping:**

| Input | Output |
|-------|--------|
| "Accepted", "Accept", "ACCEPTED" | "accepted" |
| "Pending", "Under Review", "Waiting" | "pending" |
| "Rejected", "Denied", "DENIED" | "rejected" |
| null, "", "Other" | "unknown" |

**Purpose:**
- Handles case variations
- Matches partial strings
- Provides fallback for unknown statuses
- Ensures consistent data for visualization

---

#### Function: `getColor(status)`

**Purpose:** Returns the appropriate color code for a given status.

**Parameters:**
- `status` (string) - Application status

**Returns:**
- `string` - Hex color code

**Implementation:**
```javascript
const barColors = {
    accepted: "#198754",  // green
    pending: "#ffc107",   // yellow
    rejected: "#dc3545",  // red
    unknown: "#6c757d",   // gray
};

const getColor = (status) => barColors[normalizeStatus(status)];
```

**Color Scheme:**
- Accepted: Green (#198754)
- Pending: Yellow (#ffc107)
- Rejected: Red (#dc3545)
- Unknown: Gray (#6c757d)

---

### Enhanced Login Functions (login.jsx)

**File Location:** `Post-React-Migration/pwd-application-system/src/pages/login.jsx`

---

#### Function: `handleUserLogin(e)`

**Purpose:** Handles user authentication with email and password.

**Parameters:**
- `e` (Event) - Form submission event

**Implementation:**
```javascript
const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage('');

    // Validation
    if (!email || !password) {
        setLoginMessage('<div class="alert alert-danger">Please enter both username and password.</div>');
        setIsLoading(false);
        return;
    }

    try {
        // API call with encoded parameters
        const qEmail = encodeURIComponent(email.trim().toLowerCase());
        const qPassword = encodeURIComponent(password);
        const response = await fetch(`${sheetdbUrl}/search?email=${qEmail}&password=${qPassword}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const userRecord = data[0];
            
            // Store session data
            if (userRecord.regNumber) {
                sessionStorage.setItem('userId', userRecord.regNumber);
            }
            sessionStorage.setItem("loggedInUser", qEmail);
            sessionStorage.setItem('userData', JSON.stringify(userRecord));

            // Success feedback and redirect
            setLoginMessage('<div class="alert alert-success">Login successful! Redirecting...</div>');
            setTimeout(() => {
                navigate('/userpage', { replace: true });
            }, 1000);
        } else {
            setLoginMessage('<div class="alert alert-danger">Invalid email or password. Please try again.</div>');
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
2. Validate email and password fields
3. Encode and lowercase email
4. Make API request to SheetDB
5. Check if user exists
6. Store session data (userId, email, userData)
7. Show success message
8. Redirect to user dashboard after 1 second

**Session Storage:**
- `userId` - Registration number (primary key)
- `loggedInUser` - Email (legacy support)
- `userData` - Full user object (JSON)

---

#### Function: `handleAdminLogin(e)`

**Purpose:** Handles admin authentication with email and password via modal.

**Parameters:**
- `e` (Event) - Form submission event

**Implementation:**
```javascript
const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminIsLoading(true);
    setAdminLoginMessage('');

    // Validation
    if (!adminEmail || !adminPassword) {
        setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Please enter both email and password.</div>');
        setAdminIsLoading(false);
        return;
    }

    try {
        // API call with admin credentials
        const qadminEmail = encodeURIComponent(adminEmail.trim().toLowerCase());
        const qadminPassword = encodeURIComponent(adminPassword);
        const response = await fetch(`${adminSheetdbUrl}/search?adminEmail=${qadminEmail}&adminPassword=${qadminPassword}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            // Store based on "Remember Me" preference
            if (adminRemember) {
                localStorage.setItem("adminLoggedIn", adminEmail);
            } else {
                sessionStorage.setItem("adminLoggedIn", adminEmail);
            }
            
            setAdminLoginMessage('<div class="alert alert-success m-3 p-3">Admin login successful! Redirecting...</div>');
            setTimeout(() => {
                navigate('/adminpage', { replace: true });
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
2. Validate admin credentials
3. Make API request to admin SheetDB
4. Check if admin exists
5. Store in localStorage (remember) or sessionStorage
6. Show success message
7. Redirect to admin dashboard

**Storage Strategy:**
- If "Remember Me" checked: `localStorage.setItem("adminLoggedIn", adminEmail)`
- Otherwise: `sessionStorage.setItem("adminLoggedIn", adminEmail)`

---

#### Function: `handleShowAdminModal()` & `handleCloseAdminModal()`

**Purpose:** Manages the admin login modal visibility and state cleanup.

**Implementation:**
```javascript
const handleShowAdminModal = () => setShowAdminModal(true);

const handleCloseAdminModal = () => {
    setShowAdminModal(false);
    // Clear admin form when modal closes
    setAdminEmail('');
    setAdminPassword('');
    setAdminLoginMessage('');
};
```

**Features:**
- Opens/closes React-Bootstrap modal
- Clears form fields on close
- Resets error messages
- Maintains clean state

---

### Session Management Functions

#### useEffect: Authentication Check

**Purpose:** Checks if user is already logged in on page load and redirects accordingly.

**Implementation (login.jsx):**
```javascript
useEffect(() => {
    // Check user login
    if (sessionStorage.getItem("userId") || sessionStorage.getItem("loggedInUser")) {
        navigate('/userpage', { replace: true });
        return;
    }
    
    // Check admin login
    if (sessionStorage.getItem("adminLoggedIn") || localStorage.getItem("adminLoggedIn")) {
        navigate('/adminpage', { replace: true });
        return;
    }
}, [navigate]);
```

**Flow:**
1. Check for user session keys
2. Redirect to userpage if user logged in
3. Check for admin session keys
4. Redirect to adminpage if admin logged in
5. Stay on login page if no session found

---

### Branch Merge Impact Summary

**Merged Functions by Feature:**

1. **User Data Management**
   - `getCurrentUserData()` - API call to fetch user profile
   - `logoutUser()` - Clear all session data
   - `loadUserData()` - Load and display user data
   - `getDemoUserData()` - Fallback demo data

2. **Status Management**
   - `getStatusInfo()` - Status display formatting
   - `normalizeStatus()` - Status string normalization
   - `getColor()` - Status color mapping

3. **Admin Dashboard**
   - `fetchData()` - Load all applications
   - Statistics computation functions
   - Chart data formatting

4. **Authentication**
   - `handleUserLogin()` - Enhanced user login
   - `handleAdminLogin()` - Admin modal login
   - `handleShowAdminModal()` / `handleCloseAdminModal()` - Modal management
   - Auto-redirect on existing session

5. **Navigation & UI**
   - `handleNavClick()` - Sidebar navigation
   - `showHelp()` - Help modal trigger
   - `handleLogout()` - Logout and redirect

---

## Conclusion

This function documentation provides comprehensive coverage of all custom JavaScript/JSX functions that handle user interactions in the PWD Automated Application System. The documentation includes both Pre-React (Vanilla JS) and Post-React (React) implementations with detailed explanations of parameters, return values, flow, side effects, and dependencies.

**Key Takeaways:**
- Pre-React uses event listeners and direct DOM manipulation
- Post-React uses hooks, state management, and React Router
- API integration uses fetch with async/await patterns
- Form validation handles multiple input types including checkbox/radio groups
- Registration data persists using sessionStorage for result page display
- User dashboard displays real-time application status with fallback data
- All functions include proper error handling and user feedback