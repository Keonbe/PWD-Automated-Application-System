import api from './axiosConfig';

/**
 * @summary API Configuration for user data endpoints
 * 
 * @remarks
 * Using PHP/MySQL backend with XAMPP
 * SheetDB legacy code is commented out below for reference
 */

// ============== SheetDB Configuration (Commented Out) ==============
// const SHEETDB_URL = 'https://sheetdb.io/api/v1/wgjit0nprbfxe'; // SheetDB API for user 
// const SHEETDB_URL = 'https://sheetdb.io/api/v1/ljqq6umrhu60o'; // Backup SheetsDB

/**
 * @summary Retrieves current user data from PHP/MySQL backend based on stored user ID.
 * 
 * @returns {Promise<Object>} Normalized user data object with all profile fields.
 * 
 * @throws {Error} Throws error if no user ID found or API request fails.
 * 
 * @remarks
 * Searches for user by registration number stored in sessionStorage or localStorage.
 * Includes comprehensive logging for debugging authentication flow.
 * Normalizes data structure to match database column names.
 */
export const getCurrentUserData = async () => {
    try {
        console.log('[userApi] Starting getCurrentUserData');
        
        // Try to get userId from both sessionStorage and localStorage
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        
        console.log('[userApi] Retrieved userId:', userId);
        
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }

        // ============== PHP/MySQL Backend (XAMPP) ==============
        console.log('[userApi] Fetching from PHP backend...');
        
        // POST to get-user-data.php endpoint
        const res = await api.post('/get-user-data.php', {
            regNumber: userId
        });
        
        console.log('[userApi] Response received:', res.data);
        console.log('[userApi] HTTP status:', res.status);
        
        if (res.data.success) {
            console.log('[userApi] SUCCESS - User data retrieved');
            const userData = res.data.user;
            
            // Map and normalize the data structure
            // Note: Database stores filenames in proofIdentity/proofDisability only
            const normalizedData = {
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
                blood: userData.blood || '',
                civil: userData.civil || '',
                emergencyName: userData.emergencyName || '',
                emergencyPhone: userData.emergencyPhone || '',
                emergencyRelationship: userData.emergencyRelationship || '',
                proofIdentity: userData.proofIdentity || '',
                proofDisability: userData.proofDisability || '',
                // Map filenames to *Name fields for backward compatibility
                proofIdentityName: userData.proofIdentity || '',
                proofDisabilityName: userData.proofDisability || '',
                password: userData.password || '',
                generatedPassword: userData.password || '', // Use same password
                status: userData.status || 'Pending',
                _raw: userData // Keep original for debugging
            };
            
            console.log('[userApi] Normalized user data:', normalizedData);
            return normalizedData;
            
        } else {
            console.error('[userApi] FAILED - Could not retrieve user data');
            console.error('[userApi] Reason:', res.data.message);
            throw new Error(res.data.message || 'Failed to retrieve user data');
        }
        
        /* ============== SheetDB Backend (Legacy - Commented Out) ==============
        // Build API URL to search by regNumber
        const searchUrl = `${SHEETDB_URL}/search?regNumber=${encodeURIComponent(userId)}`;
        console.log('[userApi] Fetching from:', searchUrl);
        
        // Fetch data from SheetDB
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[userApi] Raw API response:', data);
        
        // SheetDB returns an array of matching rows
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error(`No user found with registration number: ${userId}`);
        }
        
        // Get the first matching user
        const userData = data[0];
        
        // Map and normalize the data structure - match spreadsheet EXACT column names
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
        ============== End SheetDB Backend (Legacy) ============== */
        
    } catch (error) {
        console.error('[userApi] ERROR - Error in getCurrentUserData:', error.message);
        console.error('[userApi] Error details:', error);
        console.error('[userApi] Error response:', error.response?.data);
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

/**
 * @summary Change user's password via PHP backend.
 * 
 * @param {string} regNumber - User registration number.
 * @param {string} currentPassword - Current password to verify.
 * @param {string} newPassword - New password to set.
 * 
 * @returns {Promise<Object>} Result object with success and message.
 */
export const changeUserPassword = async (regNumber, currentPassword, newPassword) => {
    try {
        console.log('[userApi] changeUserPassword - starting for', regNumber);
        const res = await api.post('/change-password.php', {
            regNumber: regNumber,
            currentPassword: currentPassword,
            newPassword: newPassword
        });

        console.log('[userApi] changeUserPassword response:', res.data);

        if (res.data.success) {
            return { success: true, message: res.data.message || 'Password changed successfully' };
        }

        return { success: false, message: res.data.message || 'Failed to change password' };

    } catch (error) {
        console.error('[userApi] changeUserPassword error:', error);
        return { success: false, message: error.response?.data?.message || error.message || 'Error connecting to backend' };
    }
};

/**
 * @summary Update user profile information via PHP backend.
 * 
 * @param {string} regNumber - User registration number.
 * @param {Object} profileData - Profile data to update (address, contactNumber, emergencyContact, emergencyNumber).
 * 
 * @returns {Promise<Object>} Result object with success, message, and updated user data.
 */
export const updateUserProfile = async (regNumber, profileData) => {
    try {
        console.log('[userApi] updateUserProfile - starting for', regNumber);
        console.log('[userApi] updateUserProfile - data:', profileData);
        
        const res = await api.post('/update-profile.php', {
            regNumber: regNumber,
            ...profileData
        });

        console.log('[userApi] updateUserProfile response:', res.data);

        if (res.data.success) {
            return { 
                success: true, 
                message: res.data.message || 'Profile updated successfully',
                user: res.data.user 
            };
        }

        return { 
            success: false, 
            message: res.data.message || 'Failed to update profile' 
        };

    } catch (error) {
        console.error('[userApi] updateUserProfile error:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || error.message || 'Error connecting to backend' 
        };
    }
};