import React, { useState }  from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';

export default function Consent() {
    //First use of state hook: managing checkbox state
    //useState lets you add a state variable to your component.
    const [agreed, setAgreed] = useState(false);
    const [errorMsg, setErrorMsg] = useState(""); // State for error message - errorMsg; default, setErrorMsg is function to update it
    const navigate = useNavigate();

    //Now using inline error than alert() for better accessibility
    const handleProceed = () => {
        if (!agreed) {
        // setErrorMsg sets "message" to be displayed in the error div: see below in return()
        setErrorMsg("Wait! You have not checked the checkbox yet.");
        return;
        }

        // clear any previous error
        setErrorMsg("");

        navigate("/register");
    };

    // go back to home
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