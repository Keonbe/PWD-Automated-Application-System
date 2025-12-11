import api from './axiosConfig';

/**
 * @summary API Configuration for admin data endpoints
 */

/**
 * @summary Retrieves all user applications from the backend.
 * @returns {Promise<Object>} A promise that resolves to an object containing the success status, a message, and the user data.
 */
export const getAllApplications = async () => {
    try {
        const res = await api.get('/get-all-applications.php');
        return res.data;
    } catch (error) {
        console.error('Error fetching all applications:', error);
        throw error;
    }
};

/**
 * @summary Retrieves the oldest pending application from the backend.
 * @returns {Promise<Object>} A promise that resolves to an object containing the success status, a message, and the user data.
 */
export const getPendingApplication = async () => {
    try {
        const res = await api.get('/get-pending-application.php');
        return res.data;
    } catch (error) {
        console.error('Error fetching pending application:', error);
        throw error;
    }
};

/**
 * @summary Updates the status of an application.
 * @param {string} regNumber - The registration number of the user.
 * @param {string} status - The new status of the application ('accepted' or 'denied').
 * @param {string} [rejectionReason] - The reason for rejection (optional).
 * @returns {Promise<Object>} A promise that resolves to an object containing the success status and a message.
 */
export const updateApplicationStatus = async (regNumber, status, rejectionReason = null) => {
    try {
        const res = await api.post('/update-application-status.php', {
            regNumber,
            status,
            rejectionReason,
        });
        return res.data;
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
};
