import api from './axiosConfig';

/**
 * @summary API Configuration for registration endpoints
 * 
 * @remarks
 * Using PHP/MySQL backend with XAMPP
 * SheetDB legacy code is commented out below for reference
 */

// ============== SheetDB Configuration (Commented Out) ==============
// const USE_PHP_BACKEND = true; // Change to `false` to use SheetDB
// const sheetdbUrl = "https://sheetdb.io/api/v1/ljqq6umrhu60o";
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
        // ============== PHP/MySQL Backend (XAMPP) ==============
        // Prepare registration data
        const registrationData = {
            regNumber: formData.regNumber,
            regDate: formData.regDate,
            lastName: formData.lastName,
            firstName: formData.firstName,
            middleName: formData.middleName || '',
            disability: formData.disability,
            street: formData.street,
            barangay: formData.barangay,
            municipality: formData.municipality || 'Dasmariñas',
            province: formData.province || 'Cavite',
            region: formData.region || 'IV-A',
            tel: formData.tel || '',
            mobile: formData.mobile,
            email: formData.email,
            dob: formData.dob,
            sex: formData.sex,
            nationality: formData.nationality || 'Filipino',
            blood: formData.blood || '',
            civil: formData.civil,
            emergencyName: formData.emergencyName,
            emergencyPhone: formData.emergencyPhone,
            emergencyRelationship: formData.emergencyRelationship,
            proofIdentity: formData.proofIdentity || '',
            proofDisability: formData.proofDisability || '',
            password: formData.password || formData.generatedPassword || '',
            status: 'pending'
        };

        console.log('[submitRegistration] Submitting to PHP backend...');
        console.log('[submitRegistration] Data:', registrationData); // Debug log

        // POST to register.php endpoint, with api residing in `backend/api/register.php`
        const res = await api.post('/register.php', registrationData); // Pass registrationData to '/register.php' for backend
        console.log('[submitRegistration] PHP response received:', res.data);

        if (res.data.success) {
            console.log('[submitRegistration] SUCCESS - Registration completed');
            console.log('[submitRegistration] Registration Number:', registrationData.regNumber);
            return {
                success: true,
                message: res.data.message || "Registration submitted successfully!"
            };
        } else {
            console.error('[submitRegistration] FAILED - Registration rejected');
            console.error('[submitRegistration] Reason:', res.data.message);
            return {
                success: false,
                message: res.data.message || "Registration failed. Please try again."
            };
        }

        /* ============== SheetDB Backend (Legacy - Commented Out) ==============
        //Check if registration number already exists
        const checkResponse = await fetch(`${sheetdbUrl}/search?regNumber=${formData.regNumber}`);
        const existingRegistrations = await checkResponse.json();

        if (existingRegistrations.length > 0) {
            return {
                success: false,
                message: "Registration number already exists. Please try again."
            };
        }

        //Prepare data for SheetDB
        const registrationData = {
            data: [
                {
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
                    blood: formData.blood || '',
                    civil: formData.civil,
                    emergencyName: formData.emergencyName,
                    emergencyPhone: formData.emergencyPhone,
                    emergencyRelationship: formData.emergencyRelationship,
                    proofIdentity: formData.proofIdentity || '',
                    proofDisability: formData.proofDisability || '',
                    password: formData.password || formData.generatedPassword || '',
                    status: formData.status || 'Pending'
                }
            ]
        };

        console.log('Submitting to SheetDB:', registrationData);

        const addResponse = await fetch(sheetdbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        });
        
        const responseData = await addResponse.json();
        console.log('SheetDB response:', responseData);

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
        ============== End SheetDB Legacy Code ============== */

    } catch (error) {
        console.error("[submitRegistration] ERROR - Registration failed with exception");
        console.error("[submitRegistration] Error details:", error);
        console.error("[submitRegistration] Error response:", error.response?.data);
        console.error("[submitRegistration] Error message:", error.response?.data?.message || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Error connecting to backend. Please try again later."
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
 */
export const checkEmailExists = async (email) => {
    try {
        // ============== PHP/MySQL Backend (XAMPP) ==============
        console.log('🔍 [checkEmailExists] Checking if email exists:', email);
        
        // GET request to check-email.php endpoint
        const res = await api.get(`/check-email.php?email=${encodeURIComponent(email)}`);
        
        const exists = res.data.exists || false;
        
        if (exists) {
            console.error('[checkEmailExists] Email already exists in database');
            console.log('[checkEmailExists] Response data:', res.data);
        } else {
            console.log('[checkEmailExists] Email is available');
        }

        /* ============== SheetDB Backend (Legacy - Commented Out) ==============
        const response = await fetch(`${sheetdbUrl}/search?email=${encodeURIComponent(email)}`);
        const existingUsers = await response.json();
        return existingUsers.length > 0;
        ============== End SheetDB Legacy Code ============== */
        
        return exists;

    } catch (error) {
        console.error("[checkEmailExists] ERROR - Failed to check email");
        console.error("[checkEmailExists] Error details:", error);
        console.error("[checkEmailExists] Returning false to avoid blocking registration");
        return false;
    }
};
