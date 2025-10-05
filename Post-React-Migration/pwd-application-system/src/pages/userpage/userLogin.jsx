import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/userlogin-styles.css';
import placeholderImage from '../../assets/images/dasmarinas-holder.jpg';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/duayfvx2u7zh9'; // keep your API endpoint

export default function UserLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null); // { type: 'success'|'danger'|'info', text: '' }

    async function handleSubmit(e) {
        e.preventDefault();
        setAlert(null);

        if (!username || !password) {
        setAlert({ type: 'danger', text: 'Please enter both username and password.' });
        return;
        }

        setLoading(true);

        try {
        const res = await fetch(
            `${SHEETDB_URL}/search?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
            // success
            sessionStorage.setItem('loggedInUser', username);
            setAlert({ type: 'success', text: 'Login successful — redirecting...' });

            // close bootstrap modal if bootstrap bundle is present
            try {
            const modalEl = document.getElementById('userLoginModal');
            if (window.bootstrap && modalEl) {
                const inst = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
                inst.hide();
            }
            } catch (err) {
            // ignore if bootstrap not available
            }

            // navigate to user dashboard
            setTimeout(() => navigate('/user'), 600);
        } else {
            setAlert({ type: 'danger', text: 'Invalid username or password. Please try again.' });
        }
        } catch (error) {
        console.error('Login error:', error);
        setAlert({ type: 'danger', text: 'Login service temporarily unavailable. Try again later.' });
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="modal fade" id="userLoginModal" tabIndex="-1" aria-labelledby="userLoginModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header bg-success text-white">
                <h5 className="modal-title" id="userLoginModalLabel">User Login</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
                {alert && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.text}
                </div>
                )}

                <form onSubmit={handleSubmit} id="userLoginForm" noValidate>
                <div className="mb-3 text-center">
                    <img
                    src={placeholderImage}
                    alt="City of Dasmariñas"
                    className="brand-logo"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control"
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? (<><i className="fa fa-spinner fa-spin me-2" /> Logging in...</>) : (<><i className="fa fa-right-to-bracket me-2" /> Login</>)}
                    </button>
                </div>
                </form>

                <div className="assist-desc small text-muted mt-3">
                Need help? <a href="mailto:it@dasmarinas.gov.ph">it@dasmarinas.gov.ph</a>
                </div>
            </div>

            <div className="modal-footer">
                <small className="text-muted">Not registered? <a href="/consent">Create an account</a></small>
            </div>
            </div>
        </div>
        </div>
    );
}
