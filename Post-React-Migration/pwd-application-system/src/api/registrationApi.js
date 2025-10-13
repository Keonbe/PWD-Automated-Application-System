// Api for handling registration submissions from register.jsx to SheetDB
// Modified Signup.js 

const sheetdbUrl = "https://sheetdb.io/api/v1/wgjit0nprbfxe"; //Orig API (Marqus) User
//const sheetdbUrl = "https://sheetdb.io/api/v1/duayfvx2u7zh9"; //Test API (Kean) Admin

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

        //Prepare data for SheetDB to match its expected format and add new user.
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
                    nationality: formData.nationality,
                    blood: formData.blood || '',
                    civil: formData.civil,
                    emergencyName: formData.emergencyName,
                    emergencyPhone: formData.emergencyPhone,
                    emergencyRelationship: formData.emergencyRelationship,
                    // Sheet column names expected by the spreadsheet
                    proofIdentity: formData.proofIdentity || formData.proofIdentityName || '',
                    proofDisability: formData.proofDisability || formData.proofDisabilityName || '',
                    // Store password under 'password' column
                    password: formData.password || formData.generatedPassword || '',
                    // Default status column (set in formData to 'Denied' by default)
                    status: formData.status || 'Pending'
                    //Note: As we are only SheetDB, to compromise we are only storing file names temporarily for midterm.
                }
            ]
        };

        // Submit registration data
        const addResponse = await fetch(sheetdbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        });

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

//Check if email already exists
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

//TODO: PASSWORD GENERATE AND USER LOGIN