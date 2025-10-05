import React  from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Register() {
    return (
        <div className="container my-4">
        <p className="h3 mb-4">Registration Form</p>

        {/* Registration Number */}
        <div className="row g-3 mb-3">
            <div className="col-md-6">
            <div className="form-floating">
                <input
                type="text"
                className="form-control"
                id="regNumber"
                placeholder="Registration Number"
                />
                <label htmlFor="regNumber">Registration Number</label>
            </div>
            </div>

            <div className="col-md-6">
            <div className="form-floating">
                <input
                type="text"
                className="form-control"
                id="regDate"
                placeholder="YYYY-MM-DD"
                data-coreui-toggle="date-picker"
                data-coreui-locale="en-US"
                />
                <label htmlFor="regDate">Date</label>
            </div>
            </div>
        </div>

        {/* Name */}
        <div className="input-group mb-3">
            <span className="input-group-text">Surname, First, Middle</span>
            <input
            type="text"
            aria-label="Last name"
            className="form-control"
            placeholder="Last Name"
            />
            <input
            type="text"
            aria-label="First name"
            className="form-control"
            placeholder="First Name"
            />
            <input
            type="text"
            aria-label="Middle name"
            className="form-control"
            placeholder="Middle Name"
            />
        </div>

        {/* Type of Disability */}
        <div className="mb-3">
            <label className="form-label fw-bold">Type of Disability (check one):</label>
            <div className="row">
            <div className="col-md-6">
                <div className="form-check">
                <input className="form-check-input" type="checkbox" id="psycho" />
                <label className="form-check-label" htmlFor="psycho">
                    Psychosocial Disability
                </label>
                </div>

                <div className="form-check">
                <input className="form-check-input" type="checkbox" id="mental" />
                <label className="form-check-label" htmlFor="mental">
                    Mental Disability
                </label>
                </div>

                <div className="form-check">
                <input className="form-check-input" type="checkbox" id="hearing" />
                <label className="form-check-label" htmlFor="hearing">
                    Hearing Disability
                </label>
                </div>

                <div className="form-check">
                <input className="form-check-input" type="checkbox" id="speech" />
                <label className="form-check-label" htmlFor="speech">
                    Speech Impairment
                </label>
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-check">
                <input className="form-check-input" type="checkbox" id="visual" />
                <label className="form-check-label" htmlFor="visual">
                    Visual Disability
                </label>
                </div>

                <div className="form-check">
                <input className="form-check-input" type="checkbox" id="learning" />
                <label className="form-check-label" htmlFor="learning">
                    Learning Disability
                </label>
                </div>

                <div className="form-check">
                <input className="form-check-input" type="checkbox" id="ortho" />
                <label className="form-check-label" htmlFor="ortho">
                    Orthopedic (Musculoskeletal) Disability
                </label>
                </div>
            </div>
            </div>
        </div>

        {/* Address */}
        <div className="mb-3">
            <label className="form-label fw-bold">Address:</label>
            <div className="row g-2">
            <div className="col-md-6">
                <input type="text" className="form-control" placeholder="House No. and Street" />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Barangay" />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Municipality" />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Province" />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Region" />
            </div>
            </div>
        </div>

        {/* Contact Info */}
        <div className="row g-3 mb-3">
            <div className="col-md-4">
            <div className="form-floating">
                <input type="tel" className="form-control" id="tel" placeholder="Telephone" />
                <label htmlFor="tel">Tel. No.</label>
            </div>
            </div>

            <div className="col-md-4">
            <div className="form-floating">
                <input type="tel" className="form-control" id="mobile" placeholder="09XXXXXXXXX" />
                <label htmlFor="mobile">Mobile No.</label>
            </div>
            </div>

            <div className="col-md-4">
            <div className="form-floating">
                <input type="email" className="form-control" id="email" placeholder="Email" />
                <label htmlFor="email">Email Address</label>
            </div>
            </div>
        </div>

        {/* Date of Birth / Sex / Nationality / Blood Type */}
        <div className="row g-3 mb-3">
            <div className="col-md-3">
            <div className="form-floating">
                <input
                type="text"
                className="form-control"
                id="dob"
                placeholder="YYYY-MM-DD"
                data-coreui-toggle="date-picker"
                data-coreui-locale="en-US"
                />
                <label htmlFor="dob">Date of Birth</label>
            </div>
            </div>

            <div className="col-md-3">
            <div className="form-floating">
                <select className="form-select" id="sex" defaultValue="">
                <option value="" disabled>
                    Select
                </option>
                <option>Male</option>
                <option>Female</option>
                </select>
                <label htmlFor="sex">Sex</label>
            </div>
            </div>

            <div className="col-md-3">
            <div className="form-floating">
                <input type="text" className="form-control" id="nationality" placeholder="Nationality" />
                <label htmlFor="nationality">Nationality</label>
            </div>
            </div>

            <div className="col-md-3">
            <div className="form-floating">
                <select className="form-select" id="blood" defaultValue="">
                <option value="" disabled>
                    Select
                </option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
                </select>
                <label htmlFor="blood">Blood Type</label>
            </div>
            </div>
        </div>

        {/* Civil Status */}
        <div className="mb-3">
            <label className="form-label fw-bold">Civil Status:</label>
            <div className="row">
            <div className="col-md-12 d-flex flex-wrap">
                <div className="form-check me-3">
                <input className="form-check-input" type="radio" name="civil" id="single" />
                <label className="form-check-label" htmlFor="single">
                    Single
                </label>
                </div>

                <div className="form-check me-3">
                <input className="form-check-input" type="radio" name="civil" id="married" />
                <label className="form-check-label" htmlFor="married">
                    Married
                </label>
                </div>

                <div className="form-check me-3">
                <input className="form-check-input" type="radio" name="civil" id="widow" />
                <label className="form-check-label" htmlFor="widow">
                    Widow/er
                </label>
                </div>

                <div className="form-check me-3">
                <input className="form-check-input" type="radio" name="civil" id="separated" />
                <label className="form-check-label" htmlFor="separated">
                    Separated
                </label>
                </div>

                <div className="form-check me-3">
                <input className="form-check-input" type="radio" name="civil" id="cohab" />
                <label className="form-check-label" htmlFor="cohab">
                    Co-Habitation
                </label>
                </div>
            </div>
            </div>
        </div>

        {/* Proof of Identity */}
        <label className="form-label fw-bold">Proof of Identity: (ID, Barangay Certificate, etc)</label>
        <div className="input-group mb-3">
            <input
            type="file"
            className="form-control"
            id="proofIdentity"
            accept="image/*,application/pdf"
            />
            <label className="input-group-text" htmlFor="proofIdentity">
            Upload
            </label>
        </div>

        {/* Proof of Disability */}
        <label className="form-label fw-bold">Proof of Disability: (Medical Certificate)</label>
        <div className="input-group mb-3">
            <input
            type="file"
            className="form-control"
            id="proofDisability"
            accept="image/*,application/pdf"
            />
            <label className="input-group-text" htmlFor="proofDisability">
            Upload
            </label>
        </div>
        </div>

        /* INCOMPLETE; NO BUTTON YET */
    );
}
