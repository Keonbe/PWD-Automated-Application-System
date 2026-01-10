import axios from "axios";

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

/**
 * Development: http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api
 * Production: Set via .env.production VITE_API_URL
 * 
 * To be read as (see example, enclose in brackets `{}`):
 * C:\Users\admin\xampp\8.2.12-0\htdocs\webdev_finals\PWD-Automated-Application-System\Post-React-Migration\xampp-php-mysql-files\api\
 */
