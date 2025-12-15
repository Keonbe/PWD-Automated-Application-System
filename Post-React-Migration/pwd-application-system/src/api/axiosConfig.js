import axios from "axios";

const api = axios.create({
  // Updated baseURL to match project location under htdocs/XAMPP
  // Follow the same folder structure as in the XAMPP htdocs directory
  baseURL:
    "http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// To be read as(see example, enclose in brackets `{}`):
// C:\Users\admin\xampp\8.2.12-0\htdocs\{webdev_finals\PWD AUTOMATED APPLICATION SYSTEM\PWD-Automated-Application-System\Post-React-Migration\xampp-php-mysql-files/api}
