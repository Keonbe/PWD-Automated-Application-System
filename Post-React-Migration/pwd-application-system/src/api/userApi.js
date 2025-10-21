/**
 * @summary Base URL for the SheetDB API endpoint storing user registration data.
 * 
 * @remarks
 * This is the original API endpoint for user data storage.
 * All user registration operations will use this base URL.
 */
    //const SHEETDB_URL = 'https://sheetdb.io/api/v1/wgjit0nprbfxe'; // SheetDB API for user 
    const SHEETDB_URL = 'https://sheetdb.io/api/v1/ljqq6umrhu60o'; // Backup SheetsDB
/**
 * @summary Retrieves current user data from SheetDB based on stored user ID.
 * 
 * @returns {Promise<Object>} Normalized user data object with all profile fields.
 * 
 * @throws {Error} Throws error if no user ID found or API request fails.
 * 
 * @remarks
 * Searches for user by registration number stored in sessionStorage or localStorage.
 * Includes comprehensive logging for debugging authentication flow.
 * Normalizes data structure to match exact spreadsheet column names.
 */
export const getCurrentUserData = async () => {
    try {
        console.log('[userApi] Starting getCurrentUserData');
        
        //Try to get userId from both sessionStorage and localStorage
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        
        console.log('[userApi] Retrieved userId:', userId);
        
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }

        //Build API URL to search by regNumber
        const searchUrl = `${SHEETDB_URL}/search?regNumber=${encodeURIComponent(userId)}`;
        console.log('[userApi] Fetching from:', searchUrl);
        
        //Fetch data from SheetDB
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[userApi] Raw API response:', data);
        
        //SheetDB returns an array of matching rows
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error(`No user found with registration number: ${userId}`);
        }
        
        //Get the first matching user
        const userData = data[0];
        
        //Map and normalize the data structure - match spreadsheet EXACT column names
        const normalizedData = { // Match spreadsheet EXACT casing
            regNumber: userData.regNumber || '',
            regDate: userData.regDate || '',
            lastName: userData.lastName || '',
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            disability: userData.disability || '',
            street: userData.street || '',
            barangay: userData.barangay || '',
            municipality: userData.municipality || '',
            province: userData.province || '',
            region: userData.region || '',
            tel: userData.tel || '',
            mobile: userData.mobile || '',
            email: userData.email || '',
            dob: userData.dob || '',
            sex: userData.sex || '',
            nationality: userData.nationality || '',
            blood: userData.blood || '',              // Match spreadsheet "blood" not "bloodtype"
            civil: userData.civil || '',
            emergencyName: userData.emergencyName || '',
            emergencyPhone: userData.emergencyPhone || '',
            emergencyRelationship: userData.emergencyRelationship || '',
            proofIdentity: userData.proofIdentity || '',
            proofDisability: userData.proofDisability || '',
            proofIdentityName: userData.proofIdentityName || '',
            proofDisabilityName: userData.proofDisabilityName || '',
            password: userData.password || '',
            generatedPassword: userData.generatedPassword || '',
            status: userData.status || 'Pending',
            _raw: userData // Keep original for debugging
        };
        
        console.log('[userApi] Normalized user data:', normalizedData);
        return normalizedData;
        
    } catch (error) {
        console.error(' [userApi] Error in getCurrentUserData:', error.message);
        console.error('[userApi] Storage check:', {
            sessionUserId: sessionStorage.getItem('userId'),
            localUserId: localStorage.getItem('userId')
        });
        throw error;
    }
};

/**
 * @summary Logs out user by clearing all stored authentication data.
 * 
 * @remarks
 * Removes user ID from both localStorage and sessionStorage.
 * Clears all session storage data to ensure complete logout.
 * Used in logout functionality and session timeout handling.
 */
export const logoutUser = () => {
    console.log('[userApi] Logging out user');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userData');
    sessionStorage.clear();
};