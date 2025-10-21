import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/styles/register_result-styles.css";

export default function RegisterResult() {
  const location = useLocation(); /** @summary React Router location object for accessing navigation state. */
  /**
   * @summary State for storing registration form data from navigation or session storage.
   * 
   * @remarks
   * Holds the most recent registration data for display on the confirmation page.
   * Initially null until data is loaded from either location state or session storage.
   */
  const [data, setData] = useState(null);

  /**
   * @summary Effect hook for loading registration data from navigation state or session storage.
   * 
   * @remarks
   * Attempts to retrieve form data from React Router location state first (highest priority).
   * Falls back to sessionStorage if no location state is available.
   * Persists location state data to sessionStorage for page refresh resilience.
   */
  useEffect(() => {
    // Try location.state first (navigation), then sessionStorage fallback
    const fromState = location?.state?.formData;
    if (fromState) {
      setData(fromState);
      try { sessionStorage.setItem('lastRegistration', JSON.stringify(fromState)); } catch(e) {}
      return;
    }

    try {
      const stored = sessionStorage.getItem('lastRegistration');
      if (stored) setData(JSON.parse(stored));
    } catch (e) {
      // ignore parse errors
    }
  }, [location]);

  /**
   * @summary Safely displays registration data values with fallback handling.
   * 
   * @param {string} key - The property key to display from the registration data.
   * @param {string} fallback - Fallback text to display if data is missing or empty.
   * 
   * @returns {string} The formatted display value or fallback text.
   * 
   * @remarks
   * Handles array values by joining with commas for readable display.
   * Provides null-safe access to nested registration data properties.
   * Returns fallback when no data is available or specific key is missing.
   */
  const display = (key, fallback = '') => {
    if (!data) return fallback;
    const val = data[key];
    if (Array.isArray(val)) return val.join(', ');
    return val ?? fallback;
  };

  return (
    <section className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h1 className="h4 mb-0">Registration Submitted</h1>
            </div>
            <div className="card-body">
              <p className="mb-4">Thank you for submitting your application. Below is a summary of the values you provided.</p>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <h2 className="h6 text-black">Applicant</h2>
                    <p className="mb-1"><strong>Full Name:</strong> {`${display('lastName','')}${display('firstName','') ? ', ' + display('firstName') : ''}${display('middleName') ? ' ' + display('middleName') : ''}`.trim() || '—'}</p>
                    <p className="mb-1"><strong>Registration #:</strong> {display('regNumber','—')}</p>
                    <p className="mb-1"><strong>Temporary Password:</strong> {display('password', display('generatedPassword','—') )}</p>
                    <p className="mb-0"><strong>Date:</strong> {display('regDate','—')}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <h2 className="h6 text-black">Contact</h2>
                    <p className="mb-1"><strong>Mobile:</strong> {display('mobile','—')}</p>
                    <p className="mb-1"><strong>Email:</strong> {display('email','—')}</p>
                    <p className="mb-0"><strong>Address:</strong> {`${display('street','')}${display('barangay','') ? ', ' + display('barangay') : ''}${display('municipality') ? ', ' + display('municipality') : ''}${display('province') ? ', ' + display('province') : ''}${display('region') ? ', ' + display('region') : ''}` || '—'}</p>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <h2 className="h6 text-black">Disability</h2>
                    <p className="mb-1"><strong>Type:</strong> {display('disability','—')}</p>
                    <p className="mb-0"><strong>Medical Certificate:</strong> {display('proofDisabilityName', 'No file')}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <h2 className="h6 text-black">Documents</h2>
                    <p className="mb-1"><strong>ID Document:</strong> {display('proofIdentityName', 'No file')}</p>
                    <p className="mb-1"><strong>Uploaded Files:</strong> {display('uploadedFilenames', display('proofIdentityName','No file'))} {display('proofDisabilityName', 'No file')}</p>
                    <p className="mb-0"><strong>Blood Type:</strong> {display('blood','—')}</p>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row g-3">
                <div className="col-12">
                  <div className="border rounded p-3">
                    <h2 className="h6 text-black">Additional Details</h2>
                    <p className="mb-1"><strong>Sex:</strong> {display('sex','—')}</p>
                    <p className="mb-1"><strong>Date of Birth:</strong> {display('dob','—')}</p>
                    <p className="mb-1"><strong>Emergency Contact:</strong> {display('emergencyName','—')} — {display('emergencyPhone','—')} ({display('emergencyRelationship','—')})</p>
                    {/* <p className="mb-0 text-muted small">This is a temporary client-side preview. No data has been submitted to a server.</p> */}
                  </div>
                </div>
              </div>
            </div>
              <div className="card-footer bg-light footer-actions">
                <a href="/" className="btn btn-secondary me-2">Back to Home</a>
                <a href="/register" className="btn btn-success">New Registration</a>
                <button 
                  className="btn btn-success me-2 btn-print" 
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print me-2"></i>Print Results
                </button>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
