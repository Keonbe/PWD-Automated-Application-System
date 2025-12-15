/**
 * API Configuration for Backend Switching
 * Toggle between SheetDB and PHP/MySQL backends
 */

// Backend mode: 'sheetdb' or 'php'
export const API_MODE = "php"; // Change to 'php' when ready to use XAMPP backend

// Base URLs
export const SHEETDB_USERS_URL = "https://sheetdb.io/api/v1/ljqq6umrhu60o";
export const PHP_BASE_URL =
  "http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api"; // baseURL for PHP backend should match the axiosConfig.js configuration string

/**
 * Get the appropriate base URL based on API_MODE
 * @returns {string} Base URL
 */
export const getBaseUrl = () => {
  return API_MODE === "php" ? PHP_BASE_URL : SHEETDB_USERS_URL;
};

/**
 * Check if using PHP backend
 * @returns {boolean}
 */
export const isPhpMode = () => API_MODE === "php";

export default {
  API_MODE,
  getBaseUrl,
  isPhpMode,
  SHEETDB_USERS_URL,
  PHP_BASE_URL,
};
