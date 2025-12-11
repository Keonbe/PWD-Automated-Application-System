import api from './axiosConfig';

/**
 * @summary API Configuration for login endpoints
 * 
 * @remarks
 * Using PHP/MySQL backend with XAMPP
 * SheetDB legacy code is replaced with PHP/MySQL implementation
 */

/**
 * @summary Authenticates a user with email and password.
 * 
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * 
 * @returns {Promise<Object>} Result object with success status, message, and user data.
 * @returns {boolean} result.success - Whether login was successful.
 * @returns {string} result.message - Status message.
 * @returns {Object} [result.user] - User data if login successful.
 * 
 * @throws {Error} Throws error if API call fails or network issues occur.
 * 
 * @remarks
 * This function authenticates against the pwd_users table.
 * Returns complete user record on successful authentication.
 */
export const userLogin = async (email, password) => {
    try {
        console.log('[userLogin] Attempting user login...');
        console.log('[userLogin] Email:', email);
        
        // POST to user-login.php endpoint
        const res = await api.post('/user-login.php', {
            email: email.trim().toLowerCase(),
            password: password
        });
        
        console.log('[userLogin] Response received:', res.data);
        console.log('[userLogin] HTTP status:', res.status);
        console.log('[userLogin] Response headers:', res.headers);
        
        if (res.data.success) {
            console.log('[userLogin] SUCCESS - User authenticated');
            console.log('[userLogin] User data:', res.data.user);
            return {
                success: true,
                message: res.data.message || "Login successful!",
                user: res.data.user
            };
        } else {
            console.error('[userLogin] FAILED - Authentication rejected');
            console.error('[userLogin] Reason:', res.data.message);
            return {
                success: false,
                message: res.data.message || "Invalid email or password."
            };
        }
        
    } catch (error) {
        console.error("[userLogin] ERROR - Login failed with exception");
        console.error("[userLogin] Error details:", error);
        console.error("[userLogin] Error response:", error.response?.data);
        console.error("[userLogin] Error message:", error.response?.data?.message || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Error connecting to backend. Please try again later."
        };
    }
};

/**
 * @summary Authenticates an admin with email and password.
 * 
 * @param {string} adminEmail - Admin's email address.
 * @param {string} adminPassword - Admin's password.
 * 
 * @returns {Promise<Object>} Result object with success status, message, and admin data.
 * @returns {boolean} result.success - Whether login was successful.
 * @returns {string} result.message - Status message.
 * @returns {Object} [result.admin] - Admin data if login successful.
 * 
 * @throws {Error} Throws error if API call fails or network issues occur.
 * 
 * @remarks
 * This function authenticates against the admin_users table.
 * Returns complete admin record on successful authentication.
 */
export const adminLogin = async (adminEmail, adminPassword) => {
    try {
        console.log('[adminLogin] Attempting admin login...');
        console.log('[adminLogin] Admin email:', adminEmail);
        
        // POST to admin-login.php endpoint
        const res = await api.post('/admin-login.php', {
            adminEmail: adminEmail.trim().toLowerCase(),
            adminPassword: adminPassword
        });
        
        console.log('[adminLogin] Response received:', res.data);
        console.log('[adminLogin] HTTP status:', res.status);
        console.log('[adminLogin] Response headers:', res.headers);
        
        if (res.data.success) {
            console.log('[adminLogin] SUCCESS - Admin authenticated');
            console.log('[adminLogin] Admin data:', res.data.admin);
            return {
                success: true,
                message: res.data.message || "Admin login successful!",
                admin: res.data.admin
            };
        } else {
            console.error('[adminLogin] FAILED - Authentication rejected');
            console.error('[adminLogin] Reason:', res.data.message);
            return {
                success: false,
                message: res.data.message || "Invalid admin credentials."
            };
        }
        
    } catch (error) {
        console.error("[adminLogin] ERROR - Admin login failed with exception");
        console.error("[adminLogin] Error details:", error);
        console.error("[adminLogin] Error response:", error.response?.data);
        console.error("[adminLogin] Error message:", error.response?.data?.message || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Error connecting to backend. Please try again later."
        };
    }
};

/**
 * @summary Reset user password via forgot password flow.
 *
 * @param {string} regNumber - User's registration number.
 * @param {string} email - User's email address (verification).
 * @param {string} newPassword - New password to set.
 *
 * @returns {Promise<Object>} Result object with success status and message.
 */
export const forgotPassword = async (regNumber, email, newPassword) => {
    try {
        console.log('[forgotPassword] Attempting password reset...');
        console.log('[forgotPassword] RegNumber:', regNumber);
        
        // POST to forgot-password.php endpoint
        const res = await api.post('/forgot-password.php', {
            regNumber: regNumber.trim(),
            email: email.trim().toLowerCase(),
            newPassword: newPassword
        });
        
        console.log('[forgotPassword] Response received:', res.data);
        
        if (res.data.success) {
            console.log('[forgotPassword] SUCCESS - Password reset');
            return {
                success: true,
                message: res.data.message || "Password reset successfully. Please log in with your new password."
            };
        } else {
            console.error('[forgotPassword] FAILED - Reset rejected');
            return {
                success: false,
                message: res.data.message || "Password reset failed. Please check your registration number and email."
            };
        }
        
    } catch (error) {
        console.error("[forgotPassword] ERROR - Reset failed");
        console.error("[forgotPassword] Error details:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Error connecting to backend. Please try again later."
        };
    }
};
