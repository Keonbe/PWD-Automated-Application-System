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
            <p className="lead">Lorem ipsum dolor sit amet?</p>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            sollicitudin suscipit urna, vel feugiat ex aliquet a. Sed dapibus nisi
            mauris, nec aliquet dui posuere dictum. In nisi risus, vulputate
            posuere sagittis et, scelerisque iaculis enim.
            </p>

            <p className="lead">Lorem ipsum dolor sit amet?</p>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            sollicitudin suscipit urna, vel feugiat ex aliquet a. Sed dapibus nisi
            mauris, nec aliquet dui posuere dictum. In nisi risus, vulputate
            posuere sagittis et, scelerisque iaculis enim.
            </p>

            <p className="lead">Lorem ipsum dolor sit amet?</p>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            sollicitudin suscipit urna, vel feugiat ex aliquet a. Sed dapibus nisi
            mauris, nec aliquet dui posuere dictum. In nisi risus, vulputate
            posuere sagittis et, scelerisque iaculis enim.
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