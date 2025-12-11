import React, { useState }  from "react";
import { useNavigate } from 'react-router-dom';

export default function Consent() {
    /**
     * @summary Terms and conditions agreement component with validation and navigation.
     * 
     * @returns {JSX.Element} Returns a terms agreement interface with validation and navigation controls.
     * 
     * @remarks
     * This component handles user agreement to terms before proceeding to registration.
     * Uses inline error messaging instead of alert() for better accessibility.
     * Implements proper state management for checkbox validation.
     */
    //First use of state hook: managing checkbox state
    //useState lets you add a state variable to your component.
    const [agreed, setAgreed] = useState(false);
    /**
     * @summary Error message state for validation feedback.
     * 
     * @remarks
     * Stores and displays validation messages when user attempts to proceed without agreement.
     */
    const [errorMsg, setErrorMsg] = useState(""); // State for error message - errorMsg; default, setErrorMsg is function to update it
    const navigate = useNavigate(); /** @summary React Router navigation hook for programmatic routing. */

    /**
     * @summary Validates agreement and navigates to registration page.
     * 
     * @remarks
     * Checks if user has agreed to terms before allowing navigation to registration.
     * Provides inline error feedback for better user experience and accessibility.
     * Clears previous error messages on successful validation.
     */
    //Now using inline error than alert() for better accessibility
    const handleProceed = () => {
        if (!agreed) {
        // setErrorMsg sets "message" to be displayed in the error div: see below in return()
        setErrorMsg("Wait! You have not checked the checkbox yet.");
        return;
        }

        //Clear any previous error
        setErrorMsg("");

        navigate("/register");
    };

    /**
     * @summary Navigates back to the home page when user declines terms.
     * 
     * @remarks
     * Provides an exit path for users who do not wish to agree to terms and conditions.
     * Uses React Router's navigation for seamless single-page application routing.
     */
    //Go back to home
    const handleDecline = () => {
        navigate("/");
    };

    return (
        <div className="container my-5">
        <h1 className="display-3">Registration Consent</h1>

        {/* Questions Section */}
        <section className="my-4">
            <p className="lead">What is the PWD ID Application System?</p>
            <p>
            The PWD ID Application System is an online platform designed to streamline 
            the registration process for Persons with Disabilities (PWD) in the City of 
            Dasmariñas, Cavite. This system allows you to submit your application for a 
            PWD Identification Card, which provides access to various benefits and services 
            mandated by Republic Act No. 7277, also known as the Magna Carta for Persons 
            with Disabilities.
            </p>

            <p className="lead">What information will be collected?</p>
            <p>
            During registration, we will collect your personal information including your 
            full name, date of birth, address, contact details, type of disability, and 
            emergency contact information. You will also be required to upload supporting 
            documents such as a valid government-issued ID and a medical certificate or 
            proof of disability. All information collected will be used solely for the 
            purpose of processing your PWD ID application.
            </p>

            <p className="lead">How will my data be protected?</p>
            <p>
            Your personal data will be handled in accordance with the Data Privacy Act of 
            2012 (Republic Act No. 10173). We are committed to protecting your privacy and 
            ensuring the security of your personal information. Your data will only be 
            accessed by authorized personnel of the City Social Welfare and Development 
            Office (CSWDO) and will not be shared with third parties without your consent, 
            except as required by law.
            </p>

            <p className="lead">What are my rights as a data subject?</p>
            <p>
            Under the Data Privacy Act, you have the right to be informed about how your 
            data is being processed, to access your personal data, to correct inaccurate 
            information, to object to certain types of processing, and to request deletion 
            of your data under certain circumstances. If you have any concerns about your 
            data privacy, you may contact our Data Protection Officer through the contact 
            information provided on this website.
            </p>
        </section>

        {/* Registration Consent */}
        <h1 className="display-4 mt-5">Register Now</h1>
        
            <div className="form-check my-3">
                <input
                className="form-check-input"
                type="checkbox"
                id="checkDefault"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="checkDefault">
                I agree and certify that I have read the above instructions and fully
                understand my participation in the registration process.
                </label>
            </div>

            {/* Accessible inline error message - replacing alert from legacy code*/}
            {errorMsg && (
                <div
                role="alert"
                aria-live="assertive"
                className="alert alert-danger"
                style={{ maxWidth: 600 }}
                >
                {errorMsg} 
                </div>
            )} 

            <div className="d-flex gap-2 mb-5">
            <button
                type="button"
                id="proceedBtn"
                className="btn btn-primary"
                onClick={handleProceed}
            >
                Proceed
            </button>

            <button
                type="button"
                id="declineBtn"
                className="btn btn-secondary"
                onClick={handleDecline}
            >
            Decline
            </button>
            
            </div>
        </div>
    );
}