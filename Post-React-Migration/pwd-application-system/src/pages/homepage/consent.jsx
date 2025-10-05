import React  from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

export default function Consent() {
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
            value=""
            id="checkDefault"
            />
            <label className="form-check-label" htmlFor="checkDefault">
            I agree and certify that I have read the above instructions and fully
            understand my participation in the registration process.
            </label>
        </div>

        {/* NOT WORKING CHECKBOX */}
        <div className="d-flex gap-2 mb-5">
            <Link to="/register" className="btn btn-primary"  id="proceedBtn">Proceed</Link>
            <Link to="/" className="btn btn-secondary"  id="proceedBtn">Decline</Link>
        </div>
        </div>
    );
}