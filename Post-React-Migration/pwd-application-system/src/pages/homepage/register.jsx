import React, { useRef, useState } from "react";
import "../../assets/styles/register-styles.css";
import id from "../../assets/images/sample-id.png";
import medCert from "../../assets/images/sample-medcert.png";
import { Link, useNavigate } from "react-router-dom";
import { submitRegistration } from "../../api/registrationApi";

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false); /** @summary Form submission loading state for registration process. */
  const [submitMessage, setSubmitMessage] = useState(''); /** @summary Form submission status message for user feedback. */
  const navigate = useNavigate();

  /** File input refs: @remarks Provides direct access to the identity proof file input for validation and file name retrieval. */
  const identityRef = useRef(null); /** @summary File input reference for identity document upload. */
  const disabilityRef = useRef(null); /** @summary File input reference for disability document upload. */

  /**
   * @summary Handles registration form submission with comprehensive data processing.
   * 
   * @param {Event} event - Form submission event object.
   * @returns {Promise<void>}
   * 
   * @throws {Error} Throws error if API submission fails or form validation errors occur.
   * 
   * @remarks
   * Manually collects form data to ensure all fields are captured properly, including radio buttons.
   * Generates registration number, date, and temporary password automatically.
   * Includes file name storage and session persistence for result page display.
   */
  //Handle form submit with API integration
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!validateForm(form)) {
      setSubmitMessage("Please fill in all required fields marked with an asterisk (*). Please check highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Collect form values manually to ensure all fields are captured properly
      const formData = {
        // Name fields - collect manually since FormData might miss input-group fields
        lastName: form.lastName.value.trim(),
        firstName: form.firstName.value.trim(),
        middleName: form.middleName.value.trim(),
        
        // Disability - get selected radio button
        disability: form.querySelector('input[name="disability"]:checked')?.value || '',
        
        // Address
        street: form.street.value.trim(),
        barangay: form.barangay.value.trim(),
        
        // Contact
        tel: form.tel?.value?.trim() || '',
        mobile: form.mobile.value.trim(),
        email: form.email.value.trim(),
        
  // Personal info
  dob: form.dob.value,
  // `sex` is a <select> element in the form, read its value directly
  sex: form.sex?.value || '',
  nationality: form.nationality?.value?.trim() || 'Filipino',
        blood: form.blood?.value?.trim() || '',
        civil: form.querySelector('input[name="civil"]:checked')?.value || '',
        
        // Emergency contact
        emergencyName: form.emergencyName.value.trim(),
        emergencyPhone: form.emergencyPhone.value.trim(),
        emergencyRelationship: form.emergencyRelationship.value.trim(),
      };

      //Add generated registration number and date
      formData.regNumber = generateRegistrationNumber();
      formData.regDate = getTodayDate();

      // Debug: Log formData before processing
      console.log('Manually collected formData:', formData);

      // Set fixed location values
      formData.municipality = "Dasmariñas";
      formData.province = "Cavite";
      formData.region = "IV-A";

      //Generate an 8-digit numeric temporary password and include it
      formData.generatedPassword = generatePassword8();

      // Include selected file names
      formData.proofIdentityName = identityRef.current?.files?.[0]?.name || '';
      formData.proofDisabilityName = disabilityRef.current?.files?.[0]?.name || '';

      //Mirror file name fields to match SheetDB column names
      formData.proofIdentity = formData.proofIdentityName;
      formData.proofDisability = formData.proofDisabilityName;

      //Ensure a default status of Denied
      formData.status = 'Pending';

      //Also mirror generated password to 'password' (sheet column expected)
      formData.password = formData.generatedPassword;

      // Submit to API
      const result = await submitRegistration(formData);

      if (result.success) {
        setSubmitMessage(result.message);
        
        // Store in sessionStorage for result page
        try {
          sessionStorage.setItem('lastRegistration', JSON.stringify(formData));
        } catch (e) {
          console.warn('Could not save to sessionStorage:', e);
        }

        // Navigate to result page after a short delay
        setTimeout(() => {
          navigate('/register/result', { state: { formData } });
        }, 2000);
      } else {
        setSubmitMessage(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * @summary Updates file input button text and styling based on selected file.
   * 
   * @param {Object} inputRef - React ref object pointing to the file input element.
   * @param {string} buttonId - HTML ID of the button element to update.
   * 
   * @remarks
   * Provides visual feedback by changing button text to show selected file name.
   * Updates button styling to indicate successful file selection with checkmark icon.
   * Supports both identity and disability document upload buttons.
 */
//Update file input button text and style based on selected file
  //Update file input button text and style based on selected file
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

  /**
   * @summary Validates all required form fields and provides visual feedback.
   * 
   * @param {HTMLFormElement} form - The form element to validate.
   * @returns {boolean} True if all required fields are valid, false otherwise.
   * 
   * @remarks
   * Handles both standard input fields and radio button groups for disability/civil status.
   * Applies Bootstrap validation classes (is-invalid/is-valid) for visual feedback.
   * Supports checkbox, radio, and standard input field validation.
   */
  //Validate a form and return boolean (valid or invalid)
  const validateForm = (form) => {
    const requiredFields = form.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach((field) => {
      //For checkboxes/radios, check checked status
      if ((field.type === 'checkbox' || field.type === 'radio')) {
        if (field.type === 'radio') {
          const group = form.querySelectorAll(`input[name="${field.name}"]`);
          const anyChecked = Array.from(group).some(g => g.checked);
          if (!anyChecked) {
            valid = false;
            group.forEach(g => g.classList.add('is-invalid'));
          } else {
            group.forEach(g => g.classList.remove('is-invalid'));
          }
        } else if (field.type === 'checkbox') {
          if (!field.checked) {
            valid = false;
            field.classList.add('is-invalid');
          } else {
            field.classList.remove('is-invalid');
          }
        }
      } else {
        if (!field.value || !field.value.toString().trim()) {
          valid = false;
          field.classList.add("is-invalid");
        } else {
          field.classList.remove("is-invalid");
          field.classList.add("is-valid");
        }
      }
    });

    return valid;
  };

  /**
   * @summary Generates a unique 12-digit numeric registration number.
   * 
   * @returns {string} 12-digit random number string for user identification.
   * 
   * @remarks
   * Creates a unique identifier for each registration using random number generation.
   * Used as the primary key for user records in the database system.
   */
  //Generate random 12-digit registration number
  const generateRegistrationNumber = () => {
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += Math.floor(Math.random() * 10); //Random number 0-9
    }
    return result;
  };

  /**
   * @summary Generates an 8-digit numeric temporary password.
   * 
   * @returns {string} 8-digit random number string for temporary authentication.
   * 
   * @remarks
   * Creates a simple numeric password for initial user login.
   * Users are expected to change this password after first login for security.
   */
  // Generate an 8-digit numeric password (characters 0-9)
  const generatePassword8 = () => {
    let p = '';
    for (let i = 0; i < 8; i++) {
      p += Math.floor(Math.random() * 10);
    }
    return p;
  };


  /**
   * @summary Gets current date in YYYY-MM-DD format for registration.
   * 
   * @returns {string} Current date formatted as YYYY-MM-DD.
   * 
   * @remarks
   * Used to timestamp registrations with the submission date.
   * Ensures consistent date formatting across the application.
   */
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
          <p className="blockquote text-black-30">
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

      {/* Submit Message */}
      {submitMessage && (
        <div className={`alert ${submitMessage.includes('successfully') ? 'alert-success' : 'alert-danger'} mt-3`}>
          {submitMessage}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleFormSubmit}>
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
                  value="Dasmariñas"
                  readOnly
                  disabled
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
                  value="Cavite"
                  readOnly
                  disabled
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
                  value="IV-A"
                  readOnly
                  disabled
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


        {/* Certification Section */}
        <section className="form-section" aria-labelledby="certification-info">
          <h2 id="certification-info" className="section-title h4">
            Certification
          </h2>
          
          <div className="card border-0 bg-light">
            <div className="card-body">
              <p className="fw-bold text-center mb-4">This is to certify that:</p>
              
              <div className="certification-list">
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="certify1" 
                    name="certify1" 
                    required 
                  />
                  <label className="form-check-label" htmlFor="certify1">
                    The information entered above is true and correct.
                  </label>
                </div>
                
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="certify2" 
                    name="certify2" 
                    required 
                  />
                  <label className="form-check-label" htmlFor="certify2">
                    I have the full knowledge in providing the above information.
                  </label>
                </div>
                
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="certify3" 
                    name="certify3" 
                    required 
                  />
                  <label className="form-check-label" htmlFor="certify3">
                    I understand the purpose of enrolling myself in the City of Dasmariñas registry of Persons with Disabilities.
                  </label>
                </div>
                
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="certify4" 
                    name="certify4" 
                    required 
                  />
                  <label className="form-check-label" htmlFor="certify4">
                    I have personally given my consent to allow the use of the information contained in this form.
                  </label>
                </div>
                
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="certify5" 
                    name="certify5" 
                    required 
                  />
                  <label className="form-check-label" htmlFor="certify5">
                    I understand that this form contains my personal information to be stored in the PWD database.
                  </label>
                </div>
                
                <div className="form-check mb-4">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="certify6" 
                    name="certify6" 
                    required 
                  />
                  <label className="form-check-label fw-bold" htmlFor="certify6">
                    I confirm and agree to all of the above.
                  </label>
                </div>
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

          {/* Buttons Group */}
          <div className="d-flex justify-content-center gap-3">
          <button 
            type="submit" 
            className="btn btn-success btn-lg px-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2" aria-hidden="true"></i>
                Submit Application
              </>
            )}
          </button>

          <button type="button" className="btn btn-outline-secondary btn-lg px-5">
            Cancel
          </button>
          </div>

          <p className="text-secondary mt-3 small">
            By submitting this form, you agree to our
            <Link to="/faq" className="p-1 text-decoration-none">Privacy Policy</Link>
          </p>
        </section>
      </form>
    </main>
  );
}

//TODO: No Password & Username(Email) yet
// https://docs.google.com/spreadsheets/d/1aNvr3hZd3vZSQHB46XwVLMuusiUzbDM-ENYNqjya-aA/edit?gid=0#gid=0 I hate going back and forth