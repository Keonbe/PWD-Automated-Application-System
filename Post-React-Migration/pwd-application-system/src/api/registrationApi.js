/**
 * @summary Base URL for the SheetDB API endpoint storing user registration data.
 * 
 * @remarks
 * This is the original API endpoint for user data storage.
 * All user registration operations will use this base URL.
 */
const sheetdbUrl = "https://sheetdb.io/api/v1/wgjit0nprbfxe"; //Orig API (Marqus) User

/**
 * @summary Submits a new user registration to the SheetDB database.
 * 
 * @param {Object} formData - The registration form data containing user information.
 * @param {string} formData.regNumber - Unique registration number for the user.
 * @param {string} formData.regDate - Date of registration.
 * @param {string} formData.lastName - User's last name.
 * @param {string} formData.firstName - User's first name.
 * @param {string} formData.middleName - User's middle name (optional).
 * @param {string} formData.disability - Type of disability.
 * @param {Object} formData.address - Complete address information.
 * @param {string} formData.contact - Contact information.
 * @param {string} formData.dob - Date of birth.
 * @param {string} formData.sex - Gender.
 * @param {string} formData.password - User password.
 * 
 * @returns {Promise<Object>} Result object with success status and message.
 * 
 * @throws {Error} Throws error if API calls fail or network issues occur.
 * 
 * @remarks
 * This function performs duplicate registration check before submission.
 * Includes debug logging to help troubleshoot SheetDB structure issues.
 * Temporarily stores only file names (not actual files) for midterm compromise.
 */
export const submitRegistration = async (formData) => {
    try {
        //Check if registration number already exists
        const checkResponse = await fetch(`${sheetdbUrl}/search?regNumber=${formData.regNumber}`);
        const existingRegistrations = await checkResponse.json();

        if (existingRegistrations.length > 0) {
            return {
                success: false,
                message: "Registration number already exists. Please try again."
            };
        }

        // Debug: First, let's check what the current sheet structure looks like
        console.log('Checking current sheet structure...');
        const sheetCheckResponse = await fetch(sheetdbUrl);
        const sheetData = await sheetCheckResponse.json();
        console.log('Current sheet data sample:', sheetData.slice(0, 1)); // First row to see column structure

        //Prepare data for SheetDB to match its expected format and add new user.
        const registrationData = {
            data: [
                { // Match spreadsheet EXACT casing
                    regNumber: formData.regNumber,
                    regDate: formData.regDate,
                    lastName: formData.lastName,
                    firstName: formData.firstName,
                    middleName: formData.middleName || '',
                    disability: formData.disability,
                    street: formData.street,
                    barangay: formData.barangay,
                    municipality: formData.municipality,
                    province: formData.province,
                    region: formData.region,
                    tel: formData.tel || '',
                    mobile: formData.mobile,
                    email: formData.email,
                    dob: formData.dob,
                    sex: formData.sex,
                    nationality: formData.nationality || 'Filipino',
                    blood: formData.blood || '',        // Match spreadsheet "blood" not "bloodtype"
                    civil: formData.civil,
                    emergencyName: formData.emergencyName,
                    emergencyPhone: formData.emergencyPhone,
                    emergencyRelationship: formData.emergencyRelationship,
                    proofIdentity: formData.proofIdentity || '',
                    proofDisability: formData.proofDisability || '',
                    password: formData.password || formData.generatedPassword || '',
                    status: formData.status || 'Pending'
                    //Note: As we are only SheetDB, to compromise we are only storing file names temporarily for midterm.
                }
            ]
        };

        // Debug: Log the data being sent to SheetDB
        console.log('Data being sent to SheetDB:', registrationData);

        //Submit registration data
        const addResponse = await fetch(sheetdbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        });

        // Debug: Log the response
        console.log('SheetDB response status:', addResponse.status);
        console.log('SheetDB response ok:', addResponse.ok);
        
        const responseData = await addResponse.json();
        console.log('SheetDB response data:', responseData);

        if (addResponse.ok) {
            return {
                success: true,
                message: "Registration submitted successfully!"
            };
        } else {
            return {
                success: false,
                message: "Registration failed. Please try again."
            };
        }
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message: "Something went wrong. Please try again later."
        };
    }
};

/**
 * @summary Checks if an email address already exists in the registration database.
 * 
 * @param {string} email - The email address to check for duplicates.
 * 
 * @returns {Promise<boolean>} True if email exists, false if available or on error.
 * 
 * @throws {Error} Throws error if API call fails, returns false on network issues.
 * 
 * @remarks
 * Used during registration form validation to prevent duplicate accounts.
 * Returns false on errors to avoid blocking registration due to temporary issues.
 * Checks if email already exists
 */
export const checkEmailExists = async (email) => {
    try {
        const response = await fetch(`${sheetdbUrl}/search?email=${email}`);
        const existingUsers = await response.json();
        return existingUsers.length > 0;
    } catch (error) {
        console.error("Error checking email:", error);
        return false;
    }
};
