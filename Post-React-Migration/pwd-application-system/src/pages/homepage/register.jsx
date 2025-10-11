import React, { useRef } from "react";
import "../../assets/styles/register-styles.css";
import id from "../../assets/images/sample-id.png";
import medCert from "../../assets/images/sample-medcert.png";
import { Link } from "react-router-dom";

export default function Register() {


  /*Above Code: After API(API Integration not yet done) - Below Code: Before API*/

  //File input function
  const identityRef = useRef(null);
  const disabilityRef = useRef(null);
  const updateFileName = (inputRef, buttonId) => {
    const fileInput = inputRef.current;
    const button = document.getElementById(buttonId);
    const fileName = fileInput?.files[0]?.name;

    if (fileName) {
      button.innerHTML = `<i class="fas fa-check me-2" aria-hidden="true"></i> ${fileName}`;
      button.classList.add("btn-success");
      button.classList.remove("upload-btn");
    } else {
      button.innerHTML = `<i class="fas fa-upload me-2" aria-hidden="true"></i> ${
        buttonId === "idBtn"
          ? "Upload ID Document"
          : "Upload Medical Certificate"
      }`;
      button.classList.remove("btn-success");
      button.classList.add("upload-btn");
    }
  };

  //Form validation
  const handleSubmit = (event) => {
    const form = event.target;
    const requiredFields = form.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        valid = false;
        field.classList.add("is-invalid");
      } else {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
      }
    });

    if (!valid) {
      event.preventDefault();
      alert("Please fill in all required fields marked with an asterisk (*).");
    }
  };

  //Generate random 12-digit registration number
  const generateRegistrationNumber = () => {
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10); //Random number 0-9
    }
    return result;
  };

  //Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <main className="container my-5">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 mb-2 text-success">PWD Registration Form</h1>
          <p className="lead text-muted">
            Complete this form to apply for Persons with Disabilities services
            and benefits.
          </p>
          <div className="alert alert-info" role="alert">
            <i className="fas fa-info-circle me-2" aria-hidden="true"></i>
            Please fill out all required fields marked with an asterisk (
            <span className="text-danger">*</span>). Your information will be
            kept confidential and secure.
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form
        action="submit.php"
        method="post"
        encType="multipart/form-data"
        aria-labelledby="form-title"
        onSubmit={handleSubmit}
      >
        <span id="form-title" className="visually-hidden">
          PWD Registration Form
        </span>

        {/* Registration Number + Date */}
        <section className="form-section" aria-labelledby="registration-info">
          <h2 id="registration-info" className="section-title h4">
            Registration Information
          </h2>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="regNumber"
                  name="regNumber"
                  placeholder="Registration Number"
                  aria-describedby="regNumberHelp"
                  disabled
                  value={generateRegistrationNumber()}
                  readOnly
                />
                <label htmlFor="regNumber" className="required-field">
                  Registration Number
                </label>
                <div id="regNumberHelp" className="form-text">
                  Your unique registration identifier
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="regDate"
                  name="regDate"
                  aria-describedby="regDateHelp"
                  disabled
                  value={getTodayDate()}
                  readOnly
                />
                <label htmlFor="regDate" className="required-field">
                  Date of Registration
                </label>
                <div id="regDateHelp" className="form-text">
                  Today's date
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="form-section" aria-labelledby="personal-info">
          <h2 id="personal-info" className="section-title h4">
            Personal Information
          </h2>

          {/* Name */}
          <div className="form-group-enhanced">
            <label className="form-label fw-bold required-field">
              Full Name
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light">Name Format</span>
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                aria-label="Last Name"
                required
              />
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First Name"
                aria-label="First Name"
                required
              />
              <input
                type="text"
                name="middleName"
                className="form-control"
                placeholder="Middle Name"
                aria-label="Middle Name"
              />
            </div>
            <div className="form-text">
              Enter your name as it appears on your official documents
            </div>
          </div>

          {/* Type of Disability */}
          <div className="form-group-enhanced">
            <fieldset>
              <legend className="form-label fw-bold required-field">
                Type of Disability
              </legend>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="speech"
                      value="Speech Impairment"
                      required
                    />
                    <label className="form-check-label" htmlFor="speech">
                      Speech Impairment
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="learning"
                      value="Learning Disability"
                    />
                    <label className="form-check-label" htmlFor="learning">
                      Learning Disability
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="intellectual"
                      value="Intellectual Disability"
                    />
                    <label className="form-check-label" htmlFor="intellectual">
                      Intellectual Disability
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="mental"
                      value="Mental Disability"
                    />
                    <label className="form-check-label" htmlFor="mental">
                      Mental Disability
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="visual"
                      value="Visual Disability"
                    />
                    <label className="form-check-label" htmlFor="visual">
                      Visual Disability
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="psychosocial"
                      value="Psychosocial Disability"
                    />
                    <label className="form-check-label" htmlFor="psychosocial">
                      Psychosocial Disability
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="physical"
                      value="Physical Disability"
                    />
                    <label className="form-check-label" htmlFor="physical">
                      Physical Disability
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="hearing"
                      value="Deaf and Hard of Hearing"
                    />
                    <label className="form-check-label" htmlFor="hearing">
                      Deaf and Hard of Hearing
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="cancer"
                      value="Cancer"
                    />
                    <label className="form-check-label" htmlFor="cancer">
                      Cancer
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="disability"
                      id="rare"
                      value="Rare Diseases"
                    />
                    <label className="form-check-label" htmlFor="rare">
                      Rare Diseases
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          {/* Address */}
          <div className="form-group-enhanced">
            <label className="form-label fw-bold required-field">
              Complete Address
            </label>
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  type="text"
                  name="street"
                  id="street"
                  className="form-control"
                  placeholder="House No. and Street"
                  aria-label="Street Address"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="barangay"
                  id="barangay"
                  className="form-control"
                  placeholder="Barangay"
                  aria-label="Barangay"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="municipality"
                  id="municipality"
                  className="form-control"
                  placeholder="Municipality/City"
                  aria-label="Municipality or City"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="province"
                  id="province"
                  className="form-control"
                  placeholder="Province"
                  aria-label="Province"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="region"
                  id="region"
                  className="form-control"
                  placeholder="Region"
                  aria-label="Region"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="row g-3">
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="tel"
                  className="form-control"
                  id="tel"
                  name="tel"
                  placeholder="Telephone"
                  aria-describedby="telHelp"
                />
                <label htmlFor="tel">Telephone Number</label>
                <div id="telHelp" className="form-text">
                  Optional
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="tel"
                  className="form-control"
                  id="mobile"
                  name="mobile"
                  placeholder="09XXXXXXXXX"
                  pattern="09[0-9]{9}"
                  aria-describedby="mobileHelp"
                  required
                />
                <label htmlFor="mobile" className="required-field">
                  Mobile Number
                </label>
                <div id="mobileHelp" className="form-text">
                  Format: 09XXXXXXXXX
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  aria-describedby="emailHelp"
                  required
                />
                <label htmlFor="email" className="required-field">
                  Email Address
                </label>
                <div id="emailHelp" className="form-text">
                  We'll never share your email
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Personal Details */}
        <section className="form-section" aria-labelledby="additional-info">
          <h2 id="additional-info" className="section-title h4">
            Additional Information
          </h2>

          {/* Date of Birth / Sex / Nationality / Blood Type */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  name="dob"
                  aria-describedby="dobHelp"
                  required
                />
                <label htmlFor="dob" className="required-field">
                  Date of Birth
                </label>
                <div id="dobHelp" className="form-text">
                  Your birth date
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="sex"
                  name="sex"
                  aria-describedby="sexHelp"
                  required
                >
                  <option value="" disabled selected>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <label htmlFor="sex" className="required-field">
                  Gender
                </label>
                <div id="sexHelp" className="form-text">
                  Select your gender
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="nationality"
                  name="nationality"
                  placeholder="Filipino"
                  defaultValue="Filipino"
                  aria-describedby="nationalityHelp"
                  required
                />
                <label htmlFor="nationality" className="required-field">
                  Nationality
                </label>
                <div id="nationalityHelp" className="form-text">
                  Your citizenship
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="blood"
                  name="blood"
                  aria-describedby="bloodHelp"
                >
                  <option value="" disabled selected>
                    Select Blood Type
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
                <div id="bloodHelp" className="form-text">
                  Optional
                </div>
              </div>
            </div>
          </div>

          {/* Civil Status */}
          <div className="form-group-enhanced">
            <fieldset>
              <legend className="form-label fw-bold required-field">
                Civil Status
              </legend>
              <div className="d-flex flex-wrap gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="civil"
                    id="single"
                    value="Single"
                    required
                  />
                  <label className="form-check-label" htmlFor="single">
                    Single
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="civil"
                    id="married"
                    value="Married"
                  />
                  <label className="form-check-label" htmlFor="married">
                    Married
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="civil"
                    id="widow"
                    value="Widow/er"
                  />
                  <label className="form-check-label" htmlFor="widow">
                    Widow/er
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="civil"
                    id="separated"
                    value="Separated"
                  />
                  <label className="form-check-label" htmlFor="separated">
                    Separated
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="civil"
                    id="cohab"
                    value="Co-Habitation"
                  />
                  <label className="form-check-label" htmlFor="cohab">
                    Co-Habitation
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          {/* Emergency Contact */}
          <div className="form-group-enhanced">
            <label className="form-label fw-bold required-field">
              Emergency Contact Information
            </label>
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  type="text"
                  name="emergencyName"
                  className="form-control"
                  placeholder="Full Name of Emergency Contact"
                  aria-label="Emergency Contact Full Name"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="tel"
                  name="emergencyPhone"
                  className="form-control"
                  placeholder="Contact Number - Format: 09XXXXXXXXX"
                  aria-label="Emergency Contact Phone Number"
                  pattern="09[0-9]{9}"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="emergencyRelationship"
                  className="form-control"
                  placeholder="Relationship to You"
                  aria-label="Relationship to Emergency Contact"
                  required
                />
              </div>
            </div>
            <div className="form-text">
              Please provide someone we can contact in case of emergency
            </div>
          </div>
        </section>

        {/* Proof Upload Section */}
        <section className="form-section" aria-labelledby="document-upload">
          <h2 id="document-upload" className="section-title h4">
            Required Documents
          </h2>
          <p className="text-secondary mb-4">
            Please upload clear images or scans of the following required
            documents.
          </p>

          <div className="row">
            {/* Proof of Identity */}
            <div className="col-md-6 mb-4">
              <div className="upload-section h-100">
                <h5 className="fw-bold text-success mb-3">Proof of Identity</h5>
                <img
                  src={id}
                  alt="Sample Government ID showing proper format"
                  className="sample-image mb-3"
                  style={{ maxWidth: "250px" }}
                />
                <p className="mb-2">
                  Upload a clear image of your latest government-issued ID
                  (Passport, PhilHealth, UMID, or any valid ID with photo and
                  signature).
                </p>
                <p className="text-danger small mb-3">
                  <i
                    className="fas fa-exclamation-circle me-1"
                    aria-hidden="true"
                  ></i>
                  Ensure all details are readable and the ID is not expired.
                </p>
                <input
                  type="file"
                  className="form-control d-none"
                  id="proofIdentity"
                  name="proofIdentity"
                  accept="image/*,application/pdf"
                  required
                  ref={identityRef}
                  onChange={() => updateFileName(identityRef, "idBtn")}
                />
                <button
                  type="button"
                  className="btn upload-btn"
                  id="idBtn"
                  onClick={() => identityRef.current?.click()}
                >
                  <i className="fas fa-upload me-2" aria-hidden="true"></i>
                  Upload ID Document
                </button>
              </div>
            </div>

            {/* Proof of Disability */}
            <div className="col-md-6 mb-4">
              <div className="upload-section h-100">
                <h5 className="fw-bold text-success mb-3">
                  Medical Certificate
                </h5>
                <img
                  src={medCert}
                  alt="Sample medical certificate showing proper format"
                  className="sample-image mb-3"
                  style={{ maxWidth: "250px" }}
                />
                <p className="mb-2">
                  Upload a recent medical certificate or proof of disability,
                  signed by a licensed physician or specialist.
                </p>
                <p className="text-danger small mb-3">
                  <i
                    className="fas fa-exclamation-circle me-1"
                    aria-hidden="true"
                  ></i>
                  Certificate must be issued within the last 6 months and
                  clearly state your diagnosis.
                </p>
                <input
                  type="file"
                  className="form-control d-none"
                  id="proofDisability"
                  name="proofDisability"
                  accept="image/*,application/pdf"
                  required
                  ref={disabilityRef}
                  onChange={() => updateFileName(disabilityRef, "medBtn")}
                />
                <button
                  type="button"
                  className="btn upload-btn"
                  id="medBtn"
                  onClick={() => disabilityRef.current?.click()}
                >
                  <i className="fas fa-upload me-2" aria-hidden="true"></i>
                  Upload Medical Certificate
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Section */}
        <section className="form-section text-center">
          <div className="alert alert-warning" role="alert">
            <i className="fas fa-shield-alt me-2" aria-hidden="true"></i>
            Your information is protected and will only be used for PWD services
            and benefits processing.
          </div>

          <button type="submit" className="btn btn-success btn-lg px-5">
            <i className="fas fa-paper-plane me-2" aria-hidden="true"></i>
            Submit Application
          </button>

          <p className="text-muted mt-3 small">
            By submitting this form, you agree to our
            <Link to="/faq" className="p-1 text-decoration-none">Privacy Policy</Link>
          </p>
        </section>
      </form>
    </main>
  );
}
