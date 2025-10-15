const sheetdbUrl = "https://sheetdb.io/api/v1/wgjit0nprbfxe"; //Orig API (Marqus) User

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
                {
                    regNumber: formData.regNumber,
                    regDate: formData.regDate,
                    lastName: formData.lastName,        // Match spreadsheet EXACT casing
                    firstName: formData.firstName,      // Match spreadsheet EXACT casing
                    middleName: formData.middleName || '',  // Match spreadsheet EXACT casing
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
