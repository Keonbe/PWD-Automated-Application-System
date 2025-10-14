import React, { useState, useEffect } from 'react';
import '../assets/styles/login-styles.css';
import logo from '../assets/images/dasma-logo-only.png';
import { Link, useNavigate } from 'react-router-dom';


/** TODO: JS CODE*/ 
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminRemember, setAdminRemember] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [adminLoginMessage, setAdminLoginMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [adminIsLoading, setAdminIsLoading] = useState(false);

    const sheetdbUrl = "https://sheetdb.io/api/v1/wgjit0nprbfxe"; //user
    const adminSheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9"; //admin (username)
    //const adminSheetdbTestUrl = "https://sheetdb.io/api/v1/ljqq6umrhu60o"; //admin test (email)
    

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

    const handleUserLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginMessage('');

        if (!email || !password) {
            setLoginMessage('<div class="alert alert-danger">Please enter both username and password.</div>');
            setIsLoading(false);
            return;
        }

        try { // q = query to search
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
        } catch (error) {
            console.error("Error:", error);
            setLoginMessage('<div class="alert alert-danger">Login service is temporarily unavailable. Please try again later.</div>');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setAdminIsLoading(true);
        setAdminLoginMessage('');

        if (!adminEmail || !adminPassword) {
            setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Please enter both email and password.</div>');
            setAdminIsLoading(false);
            return;
        }

        try { //admin email or username
            const qadminEmail = encodeURIComponent(adminEmail.trim().toLowerCase());
            const qadminPassword = encodeURIComponent(adminPassword);
            const response = await fetch(`${adminSheetdbUrl}/search?adminEmail=${qadminEmail}&adminPassword=${qadminPassword}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
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
                                <div className="form-group mb-3">
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
                                            placeholder="Enter your username"
                                            aria-describedby="username-addon"
                                            autoComplete="username"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="form-group mb-3">
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
                                            autoComplete="current-password"
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

                                {/* Links: Register & Admin */}
                                <div id="register-admin-links" className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <span className="small text-black m-2">Not registered?</span>
                                        <Link to="/consent" className="small text-primary fw-semibold order-2">Create an account</Link>

                                    </div>
                                    <div>
                                        <span className="small text-black m-2">Are you an Admin?</span>
                                        {/* href here is a old code */}
                                        <a  href="admin-login.html"  className="small text-danger fw-semibold order-1"  data-bs-toggle="modal"  data-bs-target="#adminloginModal">Admin login</a>
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

                            {/* Admin Login Modal */}
                            <div className="modal fade" id="adminloginModal" tabIndex="-1" aria-labelledby="adminloginModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="adminloginModalLabel">Admin Login</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
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
                                                <div className="mb-3 form-check">
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-check-input" 
                                                        id="adminRememberMe"
                                                        checked={adminRemember}
                                                        onChange={(e) => setAdminRemember(e.target.checked)}
                                                    />
                                                    <label className="form-check-label" htmlFor="adminRememberMe">Remember me</label>
                                                </div>
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
                                        </div>

                                        {/* Admin message display area */}
                                        <div 
                                            id="adminLoginMessage" 
                                            className="mt-3 p-3" 
                                            role="status" 
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{ __html: adminLoginMessage }}
                                        />

                                        <div className="modal-footer flex-nowrap justify-content-around">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
        </main>
    );
};

