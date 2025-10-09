import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Testadmin() {
    return ( /* placeholder content,to be replace with actual login form and logic */
        <div className="container my-5">
            <h1 className="display-3">Admin Login</h1>
            <form id="loginForm">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}