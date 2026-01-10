import React, { useState, useEffect } from 'react';
import '@assets/styles/login-styles.css';
import logo from '@assets/images/dasma-logo-only.png';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { userLogin, adminLogin, forgotPassword } from '@api/loginApi'; // Import login API functions from xampp-php-mysql-files/api

export default function Login() {

    /**
     * @summary Main login component handling both user and admin authentication flows.
     * 
     * @returns {JSX.Element} Returns a login interface with user form and admin modal.
     * 
     * @remarks
     * This component manages dual login systems with separate API endpoints.
     * Includes session management and automatic redirection for authenticated users.
     * Uses Bootstrap for responsive design and modal functionality.
     */
    const navigate = useNavigate();
    const [email, setEmail] = useState(''); /**  @summary User email input state for login form. */
    const [password, setPassword] = useState(''); /** @summary User password input state for login form. */
    const [adminEmail, setAdminEmail] = useState(''); /**  @summary Admin email input state for admin login modal. */
    const [adminPassword, setAdminPassword] = useState(''); /**  @summary Admin password input state for admin login modal. */
     /* Commented out adminRemember state to avoid triggering user form when admin modal is open. */
     // const [adminRemember, setAdminRemember] = useState(false); /** @summary Remember me toggle state for admin login persistence. */
    const [loginMessage, setLoginMessage] = useState(''); /** @summary User login status message display state. */
    const [adminLoginMessage, setAdminLoginMessage] = useState(''); /**  @summary Admin login status message display state. */
    const [isLoading, setIsLoading] = useState(false); /**  @summary User login loading state for form submission. */
    const [adminIsLoading, setAdminIsLoading] = useState(false); /**  @summary Admin login loading state for form submission. */
    const [showAdminModal, setShowAdminModal] = useState(false); /**  @summary Admin modal visibility control state. */
    const [showForgotModal, setShowForgotModal] = useState(false); /**  @summary Forgot password modal visibility control state. */
    const [forgotRegNumber, setForgotRegNumber] = useState(''); /**  @summary Registration number input for forgot password form. */
    const [forgotEmail, setForgotEmail] = useState(''); /**  @summary Email input for forgot password form. */
    const [forgotNewPassword, setForgotNewPassword] = useState(''); /**  @summary New password input for forgot password form. */
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState(''); /**  @summary Confirm password input for forgot password form. */
    const [forgotIsLoading, setForgotIsLoading] = useState(false); /**  @summary Forgot password loading state for form submission. */
    const [forgotMessage, setForgotMessage] = useState(''); /**  @summary Forgot password status message display state. */

    /**
     * @summary SheetDB API URL for user authentication data (LEGACY - COMMENTED OUT).
     * @summary SheetDB API URL for admin authentication data (LEGACY - COMMENTED OUT).
     * 
     * @remarks
     * Original API endpoint for user registration data email-based login authentication system.
     * Admin database using username-based authentication system.
     * 
     * MIGRATION NOTE: Now using PHP/MySQL backend with XAMPP.
     * API endpoints moved to loginApi.js which calls user-login.php and admin-login.php
    // ============== SheetDB URLs (Legacy - Commented Out) ==============
    // const sheetdbUrl = "https://sheetdb.io/api/v1/wgjit0nprbfxe"; //user 
    // const sheetdbUrl = "https://sheetdb.io/api/v1/ljqq6umrhu60o"; //Backup SheetsDB
    // const adminSheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9"; //admin (username)
    // ============== End SheetDB Legacy Code ==============
    */
    

    /**
     * @summary Checks for existing user sessions and redirects authenticated users.
     * 
     * @remarks
     * Supports both legacy 'loggedInUser' (email) and new 'userId' (regNumber) session keys.
     * Prevents authenticated users from accessing login page unnecessarily.
     */
    useEffect(() => { // Check if already logged in
        // Support either legacy key 'loggedInUser' (email) or new key 'userId' (regNumber)
        if (sessionStorage.getItem("userId") || sessionStorage.getItem("loggedInUser")) {
            // SPA navigation (avoid full page reload)
            navigate('/userpage', { replace: true });
            return;
        }
        if (sessionStorage.getItem("adminLoggedIn") || localStorage.getItem("adminLoggedIn")) {
            navigate('/adminpage', { replace: true });
            return;
        }
    }, [navigate]);


    /**
     * @summary Handles user login form submission and authentication.
     * 
     * @param {Event} e - Form submission event object.
     * 
     * @returns {Promise<void>}
     * 
     * @throws {Error} Throws error if API request fails or network issues occur.
     * 
     * @remarks
     * Validates credentials against user database and stores session data.
     * Includes protection against submission when admin modal is open.
     */
    const handleUserLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginMessage('');

        // Prevent user login if admin modal is open
        if (showAdminModal) {
        console.log('Admin modal is open - ignoring user form submission');
        return;
        }

        // Basic validation
        if (!email || !password) {
            setLoginMessage('<div class="alert alert-danger">Please enter both username and password.</div>');
            setIsLoading(false);
            return;
        }

        try {
            // ============== PHP/MySQL Backend (XAMPP) ==============
            console.log('[Login] Attempting user login via PHP backend...');
            
            // Call userLogin API from loginApi.js
            const result = await userLogin(email, password);
            
            if (result.success && result.user) {
                const userRecord = result.user;
                console.log('[Login] User found:', userRecord);
                
                // Store the regNumber as userId
                if (userRecord.regNumber) {
                    sessionStorage.setItem('userId', userRecord.regNumber);
                    console.log('[Login] Stored userId in sessionStorage:', userRecord.regNumber);
                } else {
                    console.error('[Login] User record missing regNumber!', userRecord);
                }

                // Keep legacy email key
                sessionStorage.setItem("loggedInUser", email.trim().toLowerCase());

                // Store the full user data for immediate use
                try { 
                    sessionStorage.setItem('userData', JSON.stringify(userRecord)); 
                    console.log('[Login] Stored full user data in sessionStorage');
                } catch (e) {
                    console.warn('[Login] Could not store userData:', e);
                }

                setLoginMessage('<div class="alert alert-success">Login successful! Redirecting...</div>');
                setTimeout(() => {
                    navigate('/userpage', { replace: true });
                }, 1000);
            } else {
                const errorMsg = result.message || 'Invalid email or password. Please try again.';
                setLoginMessage(`<div class="alert alert-danger">${errorMsg}</div>`);
                console.error('[Login] Authentication failed:', errorMsg);
            }

            /* ============== SheetDB Backend (Legacy - Commented Out) ==============
            // Use the 'email' and 'password' columns from the sheet
            const qEmail = encodeURIComponent(email.trim().toLowerCase());
            const qPassword = encodeURIComponent(password);
            const response = await fetch(`${sheetdbUrl}/search?email=${qEmail}&password=${qPassword}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const userRecord = data[0];
                console.log('[Login] User found:', userRecord);
                
                // Store the regNumber as userId
                if (userRecord.regNumber) {
                    sessionStorage.setItem('userId', userRecord.regNumber);
                    console.log('[Login] Stored userId in sessionStorage:', userRecord.regNumber);
                } else {
                    console.error('[Login] User record missing regNumber!', userRecord);
                }

                // Keep legacy email key
                sessionStorage.setItem("loggedInUser", qEmail);

                // Store the full user data for immediate use
                try { 
                    sessionStorage.setItem('userData', JSON.stringify(userRecord)); 
                    console.log('[Login] Stored full user data in sessionStorage');
                } catch (e) {
                    console.warn('[Login] Could not store userData:', e);
                }

                setLoginMessage('<div class="alert alert-success">Login successful! Redirecting...</div>');
                setTimeout(() => {
                    navigate('/userpage', { replace: true });
                }, 1000);
            } else {
                setLoginMessage('<div class="alert alert-danger">Invalid email or password. Please try again.</div>');
            }
            ============== End SheetDB Legacy Code ============== */

        } catch (error) {
            console.error("Error:", error);
            setLoginMessage('<div class="alert alert-danger">Login service is temporarily unavailable. Please try again later.</div>');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * @summary Handles admin login form submission and authentication.
     * 
     * @param {Event} e - Form submission event object.
     * 
     * @returns {Promise<void>}
     * 
     * @throws {Error} Throws error if API request fails or network issues occur.
     * 
     * @remarks
     * Supports "remember me" functionality using localStorage for persistence.
     * Uses admin-specific API endpoint with email/password authentication.
     */
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
            // ============== PHP/MySQL Backend (XAMPP) ==============
            console.log('[AdminLogin] Attempting admin login via PHP backend...');
            
            // Call adminLogin API from loginApi.js
            const result = await adminLogin(adminEmail, adminPassword);
            
            if (result.success && result.admin) {
                const adminRecord = result.admin;
                console.log('[AdminLogin] Admin authenticated:', adminRecord);
                
                // Default to session persistence for admin login to avoid unexpected background effects.
                sessionStorage.setItem("adminLoggedIn", adminEmail.trim().toLowerCase());

                // Store admin data for potential future use
                try {
                    sessionStorage.setItem('adminData', JSON.stringify(adminRecord));
                    console.log('[AdminLogin] Stored admin data in sessionStorage');
                } catch (e) {
                    console.warn('[AdminLogin] Could not store adminData:', e);
                }

                setAdminLoginMessage('<div class="alert alert-success m-3 p-3">Admin login successful! Redirecting...</div>');
                setTimeout(() => {
                    navigate('/adminpage', { replace: true });
                }, 1000);
            } else {
                const errorMsg = result.message || 'Invalid admin credentials. Please try again.';
                setAdminLoginMessage(`<div class="alert alert-danger m-3 p-3">${errorMsg}</div>`);
                console.error('[AdminLogin] Authentication failed:', errorMsg);
            }

            /* ============== SheetDB Backend (Legacy - Commented Out) ==============
            const qadminEmail = encodeURIComponent(adminEmail.trim().toLowerCase());
            const qadminPassword = encodeURIComponent(adminPassword);
            const response = await fetch(`${adminSheetdbUrl}/search?adminEmail=${qadminEmail}&adminPassword=${qadminPassword}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                // Default to session persistence for admin login to avoid unexpected background effects.
                sessionStorage.setItem("adminLoggedIn", adminEmail);

                setAdminLoginMessage('<div class="alert alert-success m-3 p-3">Admin login successful! Redirecting...</div>');
                setTimeout(() => {
                    navigate('/adminpage', { replace: true });
                }, 1000);
            } else {
                setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Invalid admin credentials. Please try again.</div>');
            }
            ============== End SheetDB Legacy Code ============== */

        } catch (error) {
            console.error("Admin login error:", error);
            setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Admin login service is temporarily unavailable.</div>');
        } finally {
            setAdminIsLoading(false);
        }
    };

    /**
     * @summary Opens the admin login modal dialog.
     * 
     * @remarks
     * Triggered by admin login button click in the main interface.
     */
    const handleShowAdminModal = () => setShowAdminModal(true);
    /**
     * @summary Closes the admin login modal and resets form state.
     * 
     * @remarks
     * Clears admin form fields and messages to ensure clean state on next open.
     */
    const handleCloseAdminModal = () => {
        setShowAdminModal(false);
        // Clear admin form when modal closes
        setAdminEmail('');
        setAdminPassword('');
        setAdminLoginMessage('');
    };

    /**
     * @summary Opens the forgot password modal dialog.
     * 
     * @remarks
     * Triggered by "Forgot Password?" link click in the login form.
     */
    const handleShowForgotModal = () => setShowForgotModal(true);

    /**
     * @summary Closes the forgot password modal and resets form state.
     * 
     * @remarks
     * Clears forgot password form fields and messages to ensure clean state on next open.
     */
    const handleCloseForgotModal = () => {
        setShowForgotModal(false);
        // Clear forgot password form when modal closes
        setForgotRegNumber('');
        setForgotEmail('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotMessage('');
    };

    /**
     * @summary Handles forgot password form submission.
     * 
     * @param {Event} e - Form submission event object.
     * 
     * @returns {Promise<void>}
     * 
     * @remarks
     * Validates form inputs, calls forgotPassword API, and displays result message.
     * On success, closes modal and allows user to log in with new password.
     */
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setForgotIsLoading(true);
        setForgotMessage('');

        // Validation
        if (!forgotRegNumber || !forgotEmail || !forgotNewPassword || !forgotConfirmPassword) {
            setForgotMessage('<div class="alert alert-danger">Please fill in all fields.</div>');
            setForgotIsLoading(false);
            return;
        }

        if (forgotNewPassword !== forgotConfirmPassword) {
            setForgotMessage('<div class="alert alert-danger">Passwords do not match.</div>');
            setForgotIsLoading(false);
            return;
        }

        if (forgotNewPassword.length < 6) {
            setForgotMessage('<div class="alert alert-danger">Password must be at least 6 characters long.</div>');
            setForgotIsLoading(false);
            return;
        }

        try {
            console.log('[ForgotPassword] Attempting password reset...');
            
            // Call forgotPassword API from loginApi.js
            const result = await forgotPassword(forgotRegNumber.trim(), forgotEmail.trim(), forgotNewPassword);
            
            if (result.success) {
                console.log('[ForgotPassword] Password reset successful');
                setForgotMessage('<div class="alert alert-success">Password reset successful! You can now log in with your new password.</div>');
                
                // Close modal after showing success message
                setTimeout(() => {
                    handleCloseForgotModal();
                }, 2000);
            } else {
                const errorMsg = result.message || 'Password reset failed. Please try again.';
                setForgotMessage(`<div class="alert alert-danger">${errorMsg}</div>`);
                console.error('[ForgotPassword] Password reset failed:', errorMsg);
            }
        } catch (error) {
            console.error('[ForgotPassword] Error:', error);
            setForgotMessage('<div class="alert alert-danger">Password reset service is temporarily unavailable. Please try again later.</div>');
        } finally {
            setForgotIsLoading(false);
        }
    };

    return (
        <main className="container d-flex align-items-center justify-content-center py-5 login-section">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    {/* Logo + Title */}
                    <div className="text-center mb-3">
                        <Link to="/"><img src={logo} alt="City of Dasmariñas Logo" className="brand-logo mb-2" /></Link>
                        <h1 className="h4 mb-0 text-success">City of Dasmariñas — PWD Services Portal</h1>
                        <p className="h5 text-black mt-1">Login Form</p>
                    </div>

                    {/* Card Form */}
                    <div className="card shadow-sm">
                        <div className="card-body" id="loginCard">
                            <form id="loginForm" onSubmit={handleUserLogin} aria-describedby="login-desc" noValidate>
                                <p id="login-desc" className="small text-black">
                                    <i className="fa fa-info-circle me-1" aria-hidden="true"></i> 
                                    <em>Sign in as <strong>user</strong>.</em> For admin, use the Admin Login link below.
                                </p>

                                {/* Username */}
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="username-addon" aria-hidden="true">
                                            <i className="fa fa-circle-user" title="username icon" aria-hidden="true"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            placeholder="Enter your username (email address)"
                                            aria-describedby="username-addon"
                                            autoComplete="off"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="password-addon" aria-hidden="true">
                                            <i className="fa fa-lock" title="password icon" aria-hidden="true"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            aria-describedby="password-addon"
                                            autoComplete="off"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Login button */}
                                <div className="d-grid mb-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success" 
                                        id="loginBtn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin me-1" aria-hidden="true"></i> Logging in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-right-to-bracket me-1" aria-hidden="true"></i> Login
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Assistance */}
                                <div id="assist-contact" className="assist-desc small text-black mb-3">
                                    For assistance, contact IT Department: <br />
                                    <a href="tel:+63461234567" aria-label="Call IT Department at (046) 123-4567">(046) 123-4567</a>
                                    &nbsp;|&nbsp; <a href="mailto:it@dasmarinas.gov.ph" aria-label="Email IT Department">it@dasmarinas.gov.ph</a>
                                </div>

                                {/* Links: Register, Forgot Password & Admin */}
                                <div id="register-admin-links">
                                    <div className="register-section">
                                        <span className="small text-black">Not registered?</span>
                                        <Link to="/consent" className="small text-primary fw-semibold">Create an account</Link>
                                    </div>
                                    <div className="forgot-password-section">
                                        <button 
                                            type="button"
                                            className="small text-primary fw-semibold border-0 bg-transparent p-0"
                                            onClick={handleShowForgotModal}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="admin-section">
                                        <span className="small text-black">Are you an Admin?</span>
                                        <button 
                                            type="button"
                                            className="small text-danger fw-semibold border-0 bg-transparent p-0"
                                            onClick={handleShowAdminModal}
                                        >
                                            Admin login
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Message display area */}
                            <div 
                                id="loginMessage" 
                                className="mt-3" 
                                role="status" 
                                aria-live="polite"
                                dangerouslySetInnerHTML={{ __html: loginMessage }}
                            />

                            {/* Footer Quick Links */}
                            <p className="alert alert-warning small text-black fw-semibold mt-3 mb-0">
                                This portal is for registered users and authorized personnel. Unauthorized use is prohibited.
                            </p>
                        </div>
                    </div>

                    {/* Footer Quick Links */}
                    <div className="text-center mt-3" id="footer-links">
                        <a href="https://dasmacitygov.weebly.com/" className="small me-2">City of Dasmariñas</a>
                        <Link to="/FAQ" className="small me-2">Privacy & FAQ</Link>
                    </div>
                </div>
            </div>

            {/* React-Bootstrap Admin Login Modal */}
            <Modal show={showAdminModal} onHide={handleCloseAdminModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Admin Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="adminLoginForm" onSubmit={handleAdminLogin} noValidate>
                        <div className="mb-3">
                            <label htmlFor="adminEmail" className="form-label">Email address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="adminEmail" 
                                required
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="adminPassword" className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="adminPassword" 
                                required
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                            />
                        </div>
                        {/* Admin "Remember me" checkbox removed from UI to avoid background user form interference.
                            If persistence is required later, reintroduce with proper state and isolated behavior. */}
                        {/* <div className="mb-3 form-check">
                            <input 
                                type="checkbox" 
                                className="form-check-input" 
                                id="adminRememberMe"
                                checked={adminRemember}
                                onChange={(e) => setAdminRemember(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="adminRememberMe">Remember me</label>
                        </div> */}
                        <button 
                            type="submit" 
                            className="btn btn-success" 
                            id="adminLoginBtn"
                            disabled={adminIsLoading}
                        >
                            {adminIsLoading ? (
                                <>
                                    <i className="fa fa-spinner fa-spin me-1" aria-hidden="true"></i> Logging in...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-right-to-bracket me-1" aria-hidden="true"></i> Login
                                </>
                            )}
                        </button>
                    </form>

                    {/* Admin message display area */}
                    <div 
                        id="adminLoginMessage" 
                        className="mt-3 p-3" 
                        role="status" 
                        aria-live="polite"
                        dangerouslySetInnerHTML={{ __html: adminLoginMessage }}
                    />
                </Modal.Body>
                <Modal.Footer className="flex-nowrap justify-content-around">
                    <Button variant="secondary" onClick={handleCloseAdminModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* React-Bootstrap Forgot Password Modal */}
            <Modal show={showForgotModal} onHide={handleCloseForgotModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="forgotPasswordForm" onSubmit={handleForgotPasswordSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="forgotRegNumber" className="form-label">Registration Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="forgotRegNumber" 
                                placeholder="Enter your registration number"
                                required
                                value={forgotRegNumber}
                                onChange={(e) => setForgotRegNumber(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="forgotEmail" className="form-label">Email address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="forgotEmail" 
                                placeholder="Enter your email address"
                                required
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="forgotNewPassword" className="form-label">New Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="forgotNewPassword" 
                                placeholder="Enter your new password"
                                required
                                value={forgotNewPassword}
                                onChange={(e) => setForgotNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="forgotConfirmPassword" className="form-label">Confirm Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="forgotConfirmPassword" 
                                placeholder="Confirm your new password"
                                required
                                value={forgotConfirmPassword}
                                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-success w-100" 
                            id="forgotPasswordBtn"
                            disabled={forgotIsLoading}
                        >
                            {forgotIsLoading ? (
                                <>
                                    <i className="fa fa-spinner fa-spin me-1" aria-hidden="true"></i> Resetting...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-key me-1" aria-hidden="true"></i> Reset Password
                                </>
                            )}
                        </button>
                    </form>

                    {/* Forgot password message display area */}
                    <div 
                        id="forgotPasswordMessage" 
                        className="mt-3" 
                        role="status" 
                        aria-live="polite"
                        dangerouslySetInnerHTML={{ __html: forgotMessage }}
                    />
                </Modal.Body>
                <Modal.Footer className="flex-nowrap justify-content-around">
                    <Button variant="secondary" onClick={handleCloseForgotModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
};