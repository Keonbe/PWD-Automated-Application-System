import React, { useRef, useState } from "react";
import "../../assets/styles/register-styles.css";
import id from "../../assets/images/sample-id.png";
import medCert from "../../assets/images/sample-medcert.png";
import { Link, useNavigate } from "react-router-dom";
import { submitRegistration, checkEmailExists } from "../../api/registrationApi";

export default function Register() {

  /** @summary Form submission loading state for registration process. */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** @summary Form submission status message for user feedback. */
  const [submitMessage, setSubmitMessage] = useState('');

  /** @summary Email validation state for duplicate check feedback. */
  const [emailValidation, setEmailValidation] = useState({ checking: false, exists: false, message: '' });
  const navigate = useNavigate();

  /** File input refs: @remarks Provides direct access to the identity proof file input for validation and file name retrieval. */

  /** @summary File input reference for identity document upload. */
  const identityRef = useRef(null);

  /** @summary File input reference for disability document upload. */
  const disabilityRef = useRef(null);

  /**
   * @summary Handles registration form submission with comprehensive data processing. Handle form submit with API integration
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
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    // Validate form before submission
    if (!validateForm(form)) {
      const errorMsg = "Please fill in all required fields marked with an asterisk (*). Please check highlighted fields.";
      setSubmitMessage(errorMsg);
      console.error('[Form Validation] error', errorMsg);
      return;
    }

    // Check if email already exists
    if (emailValidation.exists) {
      const errorMsg = "Cannot submit: Email address is already registered. Please use a different email.";
      setSubmitMessage(errorMsg);
      console.error('[Form Submission] error', errorMsg);
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
      console.log('[Form Submission] Submitting registration data...');
      const result = await submitRegistration(formData);

      // Handle API response
      if (result.success) {
        const successMsg = result.message;
        setSubmitMessage(successMsg);
        console.log('[Form Submission] Success:', successMsg);
        console.log('[Form Submission] Registration Number:', formData.regNumber);
        
        // Store in sessionStorage for result page
        try {
          sessionStorage.setItem('lastRegistration', JSON.stringify(formData));
        } catch (e) {
          console.warn('[Session Storage] Could not save to sessionStorage:', e);
        }

        // Navigate to result page after a short delay
        setTimeout(() => {
          navigate('/register/result', { state: { formData } });
        }, 2000);
      } else {
        const errorMsg = result.message;
        setSubmitMessage(errorMsg);
        console.error('[Form Submission] 404 Failed:', errorMsg);
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMsg = 'Something went wrong. Please try again.';
      console.error('[Form Submission] 404 Exception:', error);
      console.error('[Form Submission] Error details:', error.response?.data || error.message);
      setSubmitMessage(errorMsg);
      } finally {
        setIsSubmitting(false);
        console.log('[Form Submission] Submission complete. isSubmitting set to false.');
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
   * @summary Handles email blur event to check if email already exists.
   * 
   * @param {Event} event - The blur event from email input field.
   * @returns {Promise<void>}
   * 
   * @remarks
   * Provides real-time feedback on email availability.
   * Updates visual indicators and console logs for debugging.
   * Applies Bootstrap validation classes for user feedback.
   */
  const handleEmailBlur = async (event) => {
    const email = event.target.value.trim();
    const emailInput = event.target;
    
    if (!email || !email.includes('@')) {
      setEmailValidation({ checking: false, exists: false, message: '' });
      return;
    }

    setEmailValidation({ checking: true, exists: false, message: 'Checking email...' });
    console.log('[Email Validation] Validating email:', email);

    try {
      const exists = await checkEmailExists(email);
      
      if (exists) {
        setEmailValidation({ 
          checking: false, 
          exists: true, 
          message: '⚠️ This email is already registered. Please use a different email.' 
        });
        emailInput.classList.add('is-invalid');
        emailInput.classList.remove('is-valid');
        console.error('[Email Validation] Email already exists:', email);
      } else {
        setEmailValidation({ 
          checking: false, 
          exists: false, 
          message: '✓ Email is available' 
        });
        emailInput.classList.add('is-valid');
        emailInput.classList.remove('is-invalid');
        console.log('[Email Validation] Email is available:', email);
      }
    } catch (error) {
      console.error('[Email Validation] Error checking email:', error);
      setEmailValidation({ 
        checking: false, 
        exists: false, 
        message: '⚠️ Could not verify email. Please try again.' 
      });
      emailInput.classList.remove('is-valid', 'is-invalid');
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
                <select
                  name="barangay"
                  id="barangay"
                  className="form-select"
                  aria-label="Barangay"
                  required
                >
                  <option value="" disabled selected>Select Barangay</option>
                  <option value="Burol">Burol</option>
                  <option value="Burol I">Burol I</option>
                  <option value="Burol II">Burol II</option>
                  <option value="Burol III">Burol III</option>
                  <option value="Datu Esmael (Bago-a-ingud)">Datu Esmael (Bago-a-ingud)</option>
                  <option value="Emmanuel Bergado I">Emmanuel Bergado I</option>
                  <option value="Emmanuel Bergado II">Emmanuel Bergado II</option>
                  <option value="Fatima I">Fatima I</option>
                  <option value="Fatima II">Fatima II</option>
                  <option value="Fatima III">Fatima III</option>
                  <option value="Langkaan I">Langkaan I</option>
                  <option value="Langkaan II">Langkaan II</option>
                  <option value="Luzviminda I">Luzviminda I</option>
                  <option value="Luzviminda II">Luzviminda II</option>
                  <option value="Paliparan I">Paliparan I</option>
                  <option value="Paliparan II">Paliparan II</option>
                  <option value="Paliparan III">Paliparan III</option>
                  <option value="Sabang">Sabang</option>
                  <option value="Saint Peter I">Saint Peter I</option>
                  <option value="Saint Peter II">Saint Peter II</option>
                  <option value="Salawag">Salawag</option>
                  <option value="Salitran I">Salitran I</option>
                  <option value="Salitran II">Salitran II</option>
                  <option value="Salitran III">Salitran III</option>
                  <option value="Salitran IV">Salitran IV</option>
                  <option value="Sampaloc I">Sampaloc I</option>
                  <option value="Sampaloc II">Sampaloc II</option>
                  <option value="Sampaloc III">Sampaloc III</option>
                  <option value="Sampaloc IV">Sampaloc IV</option>
                  <option value="Sampaloc V (New Era)">Sampaloc V (New Era)</option>
                  <option value="San Agustin I">San Agustin I</option>
                  <option value="San Agustin II">San Agustin II</option>
                  <option value="San Agustin III">San Agustin III</option>
                  <option value="San Andres I">San Andres I</option>
                  <option value="San Andres II">San Andres II</option>
                  <option value="San Antonio De Padua I">San Antonio De Padua I</option>
                  <option value="San Antonio De Padua II">San Antonio De Padua II</option>
                  <option value="San Dionisio (Barangay 1)">San Dionisio (Barangay 1)</option>
                  <option value="San Esteban (Barangay 4)">San Esteban (Barangay 4)</option>
                  <option value="San Francisco I">San Francisco I</option>
                  <option value="San Francisco II">San Francisco II</option>
                  <option value="San Isidro Labrador I">San Isidro Labrador I</option>
                  <option value="San Isidro Labrador II">San Isidro Labrador II</option>
                  <option value="San Jose">San Jose</option>
                  <option value="San Juan (San Juan I)">San Juan (San Juan I)</option>
                  <option value="San Lorenzo Ruiz I">San Lorenzo Ruiz I</option>
                  <option value="San Lorenzo Ruiz II">San Lorenzo Ruiz II</option>
                  <option value="San Luis I">San Luis I</option>
                  <option value="San Luis II">San Luis II</option>
                  <option value="San Manuel I">San Manuel I</option>
                  <option value="San Manuel II">San Manuel II</option>
                  <option value="San Mateo">San Mateo</option>
                  <option value="San Miguel">San Miguel</option>
                  <option value="San Miguel II">San Miguel II</option>
                  <option value="San Nicolas I">San Nicolas I</option>
                  <option value="San Nicolas II">San Nicolas II</option>
                  <option value="San Roque (Sta. Cristina II)">San Roque (Sta. Cristina II)</option>
                  <option value="San Simon (Barangay 7)">San Simon (Barangay 7)</option>
                  <option value="Santa Cristina I">Santa Cristina I</option>
                  <option value="Santa Cristina II">Santa Cristina II</option>
                  <option value="Santa Cruz I">Santa Cruz I</option>
                  <option value="Santa Cruz II">Santa Cruz II</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santa Lucia (San Juan II)">Santa Lucia (San Juan II)</option>
                  <option value="Santa Maria (Barangay 20)">Santa Maria (Barangay 20)</option>
                  <option value="Santo Cristo (Barangay 3)">Santo Cristo (Barangay 3)</option>
                  <option value="Santo Niño I">Santo Niño I</option>
                  <option value="Santo Niño II">Santo Niño II</option>
                  <option value="Victoria Reyes Pag-asa">Victoria Reyes Pag-asa</option>
                  <option value="Zone I (Pob.)">Zone I (Pob.)</option>
                  <option value="Zone I-A">Zone I-A</option>
                  <option value="Zone I-B">Zone I-B</option>
                  <option value="Zone II (Pob.)">Zone II (Pob.)</option>
                  <option value="Zone III (Pob.)">Zone III (Pob.)</option>
                  <option value="Zone IV (Pob.)">Zone IV (Pob.)</option>
                </select>
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
                  onBlur={handleEmailBlur}
                  required
                />
                <label htmlFor="email" className="required-field">
                  Email Address
                </label>
                <div id="emailHelp" className="form-text">
                  {emailValidation.checking && (
                    <span className="text-info">
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Checking email availability...
                    </span>
                  )}
                  {!emailValidation.checking && emailValidation.message && (
                    <span className={emailValidation.exists ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                      {emailValidation.message}
                    </span>
                  )}
                  {!emailValidation.checking && !emailValidation.message && (
                    "We'll never share your email"
                  )}
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
                <select
                  className="form-select"
                  id="nationality"
                  name="nationality"
                  aria-describedby="nationalityHelp"
                  required
                  defaultValue="Philippines"
                >
                  <option value="" disabled>
                    Select Nationality
                  </option>
                  <option>Afghanistan</option>
                  <option>Albania</option>
                  <option>Algeria</option>
                  <option>Andorra</option>
                  <option>Angola</option>
                  <option>Antigua and Barbuda</option>
                  <option>Argentina</option>
                  <option>Armenia</option>
                  <option>Australia</option>
                  <option>Austria</option>
                  <option>Azerbaijan</option>
                  <option>Bahamas</option>
                  <option>Bahrain</option>
                  <option>Bangladesh</option>
                  <option>Barbados</option>
                  <option>Belarus</option>
                  <option>Belgium</option>
                  <option>Belize</option>
                  <option>Benin</option>
                  <option>Bhutan</option>
                  <option>Bolivia</option>
                  <option>Bosnia and Herzegovina</option>
                  <option>Botswana</option>
                  <option>Brazil</option>
                  <option>Brunei</option>
                  <option>Bulgaria</option>
                  <option>Burkina Faso</option>
                  <option>Burundi</option>
                  <option>Cabo Verde</option>
                  <option>Cambodia</option>
                  <option>Cameroon</option>
                  <option>Canada</option>
                  <option>Central African Republic</option>
                  <option>Chad</option>
                  <option>Chile</option>
                  <option>China</option>
                  <option>Colombia</option>
                  <option>Comoros</option>
                  <option>Congo (Republic of the)</option>
                  <option>Congo (Democratic Republic of the)</option>
                  <option>Costa Rica</option>
                  <option>Côte d'Ivoire</option>
                  <option>Croatia</option>
                  <option>Cuba</option>
                  <option>Cyprus</option>
                  <option>Czechia</option>
                  <option>Denmark</option>
                  <option>Djibouti</option>
                  <option>Dominica</option>
                  <option>Dominican Republic</option>
                  <option>Ecuador</option>
                  <option>Egypt</option>
                  <option>El Salvador</option>
                  <option>Equatorial Guinea</option>
                  <option>Eritrea</option>
                  <option>Estonia</option>
                  <option>Eswatini</option>
                  <option>Ethiopia</option>
                  <option>Fiji</option>
                  <option>Finland</option>
                  <option>France</option>
                  <option>Gabon</option>
                  <option>Gambia</option>
                  <option>Georgia</option>
                  <option>Germany</option>
                  <option>Ghana</option>
                  <option>Greece</option>
                  <option>Grenada</option>
                  <option>Guatemala</option>
                  <option>Guinea</option>
                  <option>Guinea-Bissau</option>
                  <option>Guyana</option>
                  <option>Haiti</option>
                  <option>Honduras</option>
                  <option>Hungary</option>
                  <option>Iceland</option>
                  <option>India</option>
                  <option>Indonesia</option>
                  <option>Iran</option>
                  <option>Iraq</option>
                  <option>Ireland</option>
                  <option>Israel</option>
                  <option>Italy</option>
                  <option>Jamaica</option>
                  <option>Japan</option>
                  <option>Jordan</option>
                  <option>Kazakhstan</option>
                  <option>Kenya</option>
                  <option>Kiribati</option>
                  <option>Kosovo</option>
                  <option>Kuwait</option>
                  <option>Kyrgyzstan</option>
                  <option>Laos</option>
                  <option>Latvia</option>
                  <option>Lebanon</option>
                  <option>Lesotho</option>
                  <option>Liberia</option>
                  <option>Libya</option>
                  <option>Liechtenstein</option>
                  <option>Lithuania</option>
                  <option>Luxembourg</option>
                  <option>Madagascar</option>
                  <option>Malawi</option>
                  <option>Malaysia</option>
                  <option>Maldives</option>
                  <option>Mali</option>
                  <option>Malta</option>
                  <option>Marshall Islands</option>
                  <option>Mauritania</option>
                  <option>Mauritius</option>
                  <option>Mexico</option>
                  <option>Micronesia</option>
                  <option>Moldova</option>
                  <option>Monaco</option>
                  <option>Mongolia</option>
                  <option>Montenegro</option>
                  <option>Morocco</option>
                  <option>Mozambique</option>
                  <option>Myanmar</option>
                  <option>Namibia</option>
                  <option>Nauru</option>
                  <option>Nepal</option>
                  <option>Netherlands</option>
                  <option>New Zealand</option>
                  <option>Nicaragua</option>
                  <option>Niger</option>
                  <option>Nigeria</option>
                  <option>North Macedonia</option>
                  <option>Norway</option>
                  <option>Oman</option>
                  <option>Pakistan</option>
                  <option>Palau</option>
                  <option>Panama</option>
                  <option>Papua New Guinea</option>
                  <option>Paraguay</option>
                  <option>Peru</option>
                  <option>Philippines</option>
                  <option>Poland</option>
                  <option>Portugal</option>
                  <option>Qatar</option>
                  <option>Romania</option>
                  <option>Russian Federation</option>
                  <option>Rwanda</option>
                  <option>Saint Kitts and Nevis</option>
                  <option>Saint Lucia</option>
                  <option>Saint Vincent and the Grenadines</option>
                  <option>Samoa</option>
                  <option>San Marino</option>
                  <option>Sao Tome and Principe</option>
                  <option>Saudi Arabia</option>
                  <option>Senegal</option>
                  <option>Serbia</option>
                  <option>Seychelles</option>
                  <option>Sierra Leone</option>
                  <option>Singapore</option>
                  <option>Slovakia</option>
                  <option>Slovenia</option>
                  <option>Solomon Islands</option>
                  <option>Somalia</option>
                  <option>South Africa</option>
                  <option>South Sudan</option>
                  <option>Spain</option>
                  <option>Sri Lanka</option>
                  <option>Sudan</option>
                  <option>Suriname</option>
                  <option>Sweden</option>
                  <option>Switzerland</option>
                  <option>Syrian Arab Republic</option>
                  <option>Tajikistan</option>
                  <option>Tanzania</option>
                  <option>Thailand</option>
                  <option>Timor-Leste</option>
                  <option>Togo</option>
                  <option>Tonga</option>
                  <option>Trinidad and Tobago</option>
                  <option>Tunisia</option>
                  <option>Turkey</option>
                  <option>Turkmenistan</option>
                  <option>Tuvalu</option>
                  <option>Uganda</option>
                  <option>Ukraine</option>
                  <option>United Arab Emirates</option>
                  <option>United Kingdom</option>
                  <option>United States of America</option>
                  <option>Uruguay</option>
                  <option>Uzbekistan</option>
                  <option>Vanuatu</option>
                  <option>Venezuela</option>
                  <option>Viet Nam</option>
                  <option>Yemen</option>
                  <option>Zambia</option>
                  <option>Zimbabwe</option>
                </select>
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
                <select
                  name="emergencyRelationship"
                  id="emergencyRelationship"
                  className="form-select"
                  aria-label="Relationship to Emergency Contact"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Relationship
                  </option>
                  <option value="Family">Family</option>
                  <option value="Parents">Parents</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Children">Children</option>
                  <option value="Siblings">Siblings</option>
                  <option value="Friends">Friends</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Relative">Relative</option>
                  <option value="Other">Other</option>
                </select>
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