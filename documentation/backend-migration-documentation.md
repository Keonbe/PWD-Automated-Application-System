# Backend Migration Documentation
## React (SheetDB) → XAMPP (PHP + MySQL)

A comprehensive guide for migrating the **PWD Automated Application System** from Google Sheets API (SheetDB) to a local XAMPP-based PHP/MySQL backend.

---

## Table of Contents
- [Backend Migration Documentation](#backend-migration-documentation)
  - [React (SheetDB) → XAMPP (PHP + MySQL)](#react-sheetdb--xampp-php--mysql)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Current Architecture](#current-architecture)
    - [Target Architecture](#target-architecture)
  - [Project Structure Strategies](#project-structure-strategies)
    - [Strategy A: Separate Directories with Symbolic Links (Recommended)](#strategy-a-separate-directories-with-symbolic-links-recommended)
    - [Strategy B: Include PHP in Repository](#strategy-b-include-php-in-repository)
    - [Strategy C: Git Worktrees (Advanced)](#strategy-c-git-worktrees-advanced)
  - [XAMPP Setup Guide](#xampp-setup-guide)
    - [1. Install XAMPP](#1-install-xampp)
    - [2. Start Services](#2-start-services)
    - [3. Configure Apache for CORS](#3-configure-apache-for-cors)
  - [Database Schema Design (MySQL)](#database-schema-design-mysql)
    - [PWD Registry Table](#pwd-registry-table)
    - [Admin Users Table](#admin-users-table)
  - [PHP API Development](#php-api-development)
    - [Directory Structure](#directory-structure)
    - [Database Configuration](#database-configuration)
    - [API Endpoints Mapping](#api-endpoints-mapping)
      - [1. User Registration API (`api/register.php`)](#1-user-registration-api-apiregisterphp)
      - [2. User Login API (`api/login.php`)](#2-user-login-api-apiloginphp)
      - [3. Admin Login API (`api/admin-login.php`)](#3-admin-login-api-apiadmin-loginphp)
      - [4. Get User Data API (`api/user.php`)](#4-get-user-data-api-apiuserphp)
      - [5. Get All Applications API (`api/applications.php`)](#5-get-all-applications-api-apiapplicationsphp)
      - [6. Update Status API (`api/update-status.php`)](#6-update-status-api-apiupdate-statusphp)
      - [7. Check Email API (`api/check-email.php`)](#7-check-email-api-apicheck-emailphp)
  - [React Code Modifications](#react-code-modifications)
    - [1. Create API Configuration File](#1-create-api-configuration-file)
    - [2. Update `registrationApi.js`](#2-update-registrationapijs)
    - [3. Update `userApi.js`](#3-update-userapijs)
    - [4. Update `login.jsx`](#4-update-loginjsx)
    - [5. Update `adminpage.jsx`](#5-update-adminpagejsx)
    - [6. Update `adminverify.jsx`](#6-update-adminverifyjsx)
  - [Data Migration Strategy](#data-migration-strategy)
    - [Export from Google Sheets](#export-from-google-sheets)
    - [Import to MySQL](#import-to-mysql)
  - [Development Workflow](#development-workflow)
    - [Running Both Servers](#running-both-servers)
    - [CORS Configuration](#cors-configuration)
  - [Testing Checklist](#testing-checklist)
  - [Troubleshooting](#troubleshooting)
  - [Security Considerations](#security-considerations)
  - [Quick Reference Commands](#quick-reference-commands)

---

## Overview

### Current Architecture
```
React App (localhost:3000)
    ↓ fetch() calls
SheetDB API (https://sheetdb.io/api/v1/...)
    ↓
Google Sheets (Cloud)
```

### Target Architecture
```
React App (localhost:3000)
    ↓ fetch() calls
PHP API (localhost/pwd-api/...)
    ↓
MySQL Database (localhost/phpmyadmin)
```

---

## Project Structure Strategies

Your concern about managing Git when PHP files are in `htdocs` but your React project is in a separate location is valid. Here are three strategies:

### Strategy A: Separate Directories with Symbolic Links (Recommended)

Keep your existing repository structure and create a symbolic link in XAMPP's htdocs.

```
Your Repository (Git-controlled):
C:\Users\admin\Documents\...\PWD-Automated-Application-System\
├── Post-React-Migration\
│   ├── pwd-application-system\     # React app
│   └── xampp-php-mysql-files\      # PHP API files ← Keep here!
│       ├── api\
│       │   ├── config.php
│       │   ├── register.php
│       │   ├── login.php
│       │   └── ...
│       ├── init.php
│       └── sql-scripts.sql
└── documentation\

XAMPP htdocs (Symbolic Link):
C:\xampp\htdocs\
└── pwd-api → (symlink to) xampp-php-mysql-files\api\
```

**Create Symbolic Link (Run as Administrator):**
```cmd
mklink /D "C:\xampp\htdocs\pwd-api" "C:\Users\admin\Documents\PROGRAMMING FILES\WebDev Projects and Files\WebDev Subject\Project\PWD AUTOMATED APPLICATION SYSTEM\PWD-Automated-Application-System\Post-React-Migration\xampp-php-mysql-files\api"
```

**Benefits:**
- ✅ All files remain in your Git repository
- ✅ Changes sync automatically via symlink
- ✅ No duplicate files
- ✅ Easy to track changes with Git

---

### Strategy B: Include PHP in Repository

Already implemented! Your `xampp-php-mysql-files` folder is in the repository. Just copy/symlink to htdocs.

```
Repository Structure (Current):
Post-React-Migration/
├── pwd-application-system/     # React (runs on localhost:3000)
└── xampp-php-mysql-files/      # PHP (copy/link to htdocs)
    ├── api/                    # API endpoints
    ├── init.php
    └── sql-scripts.sql
```

---

### Strategy C: Git Worktrees (Advanced)

Use Git worktrees to have multiple working directories.

```bash
# Create a worktree directly in htdocs
cd "C:\Users\admin\Documents\...\PWD-Automated-Application-System"
git worktree add "C:\xampp\htdocs\pwd-api" feat--backend-integeration
```

**Note:** This creates a linked working directory. Changes in either location are tracked by the same Git repository.

---

## XAMPP Setup Guide

### 1. Install XAMPP

1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Install to `C:\xampp` (default)
3. Select Apache + MySQL + PHP

### 2. Start Services

1. Open XAMPP Control Panel
2. Start **Apache** (port 80)
3. Start **MySQL** (port 3306)
4. Access phpMyAdmin: `http://localhost/phpmyadmin`

### 3. Configure Apache for CORS

React runs on `localhost:3000`, PHP on `localhost:80`. You need CORS headers.

Edit `C:\xampp\apache\conf\httpd.conf` or add to `.htaccess`:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "http://localhost:3000"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>
```

---

## Database Schema Design (MySQL)

### PWD Registry Table

```sql
-- Run this in phpMyAdmin (http://localhost/phpmyadmin)

CREATE DATABASE IF NOT EXISTS pwd_registry;
USE pwd_registry;

-- Main PWD Registration Table (matches your SheetDB columns exactly)
CREATE TABLE pwd_users (
    id INT AUTO_INCREMENT,
    regNumber VARCHAR(20) PRIMARY KEY,
    regDate DATE NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    middleName VARCHAR(100) DEFAULT '',
    disability VARCHAR(100) NOT NULL,
    street VARCHAR(200) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL DEFAULT 'Dasmariñas',
    province VARCHAR(100) NOT NULL DEFAULT 'Cavite',
    region VARCHAR(50) NOT NULL DEFAULT 'IV-A',
    tel VARCHAR(20) DEFAULT '',
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    dob DATE NOT NULL,
    sex VARCHAR(10) NOT NULL,
    nationality VARCHAR(50) DEFAULT 'Filipino',
    blood VARCHAR(5) DEFAULT '',
    civil VARCHAR(20) NOT NULL,
    emergencyName VARCHAR(150) NOT NULL,
    emergencyPhone VARCHAR(20) NOT NULL,
    emergencyRelationship VARCHAR(50) NOT NULL,
    proofIdentity VARCHAR(200) DEFAULT '',
    proofDisability VARCHAR(200) DEFAULT '',
    password VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'Accepted', 'Denied') DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_id (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Admin Users Table

```sql
-- Admin users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adminEmail VARCHAR(150) NOT NULL UNIQUE,
    adminPassword VARCHAR(255) NOT NULL,
    adminName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin (change password in production!)
INSERT INTO admin_users (adminEmail, adminPassword, adminName) 
VALUES ('admin@dasma.gov.ph', 'admin123', 'System Administrator');
```

---

## PHP API Development

### Directory Structure

Create this structure inside `xampp-php-mysql-files/`:

```
xampp-php-mysql-files/
├── api/
│   ├── config.php              # Database connection
│   ├── cors.php                # CORS headers helper
│   ├── register.php            # POST: Create new registration
│   ├── login.php               # POST: User login
│   ├── admin-login.php         # POST: Admin login
│   ├── user.php                # GET: Get user by regNumber
│   ├── applications.php        # GET: Get all applications
│   ├── update-status.php       # PATCH: Update application status
│   └── check-email.php         # GET: Check if email exists
├── sql-scripts.sql
└── init.php
```

### Database Configuration

**`api/config.php`**
```php
<?php
/**
 * Database Configuration
 * Connects to MySQL database using PDO
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'pwd_registry');
define('DB_USER', 'root');          // Default XAMPP user
define('DB_PASS', '');              // Default XAMPP has no password

function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}
?>
```

**`api/cors.php`**
```php
<?php
/**
 * CORS Headers Helper
 * Include this at the top of every API file
 */

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

### API Endpoints Mapping

Below is the mapping from SheetDB API calls to PHP endpoints:

| SheetDB Call | PHP Endpoint | Method |
|-------------|--------------|--------|
| `GET /api/v1/xxx` | `/pwd-api/applications.php` | GET |
| `GET /api/v1/xxx/search?regNumber=X` | `/pwd-api/user.php?regNumber=X` | GET |
| `GET /api/v1/xxx/search?email=X&password=Y` | `/pwd-api/login.php` | POST |
| `GET /api/v1/xxx/search?status=pending` | `/pwd-api/applications.php?status=pending` | GET |
| `POST /api/v1/xxx` | `/pwd-api/register.php` | POST |
| `PATCH /api/v1/xxx/email/X` | `/pwd-api/update-status.php` | PATCH |

#### 1. User Registration API (`api/register.php`)

```php
<?php
/**
 * User Registration API
 * Replaces: POST to SheetDB /api/v1/xxx
 */
require_once 'cors.php';
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$data = $input['data'][0] ?? $input; // Handle both formats

try {
    $pdo = getDBConnection();
    
    // Check if regNumber already exists
    $stmt = $pdo->prepare("SELECT regNumber FROM pwd_users WHERE regNumber = ?");
    $stmt->execute([$data['regNumber']]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Registration number already exists']);
        exit;
    }
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT email FROM pwd_users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already exists']);
        exit;
    }
    
    // Insert new registration
    $sql = "INSERT INTO pwd_users (
        regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, password, status
    ) VALUES (
        :regNumber, :regDate, :lastName, :firstName, :middleName, :disability,
        :street, :barangay, :municipality, :province, :region, :tel, :mobile, :email,
        :dob, :sex, :nationality, :blood, :civil, :emergencyName, :emergencyPhone,
        :emergencyRelationship, :proofIdentity, :proofDisability, :password, :status
    )";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':regNumber' => $data['regNumber'],
        ':regDate' => $data['regDate'],
        ':lastName' => $data['lastName'],
        ':firstName' => $data['firstName'],
        ':middleName' => $data['middleName'] ?? '',
        ':disability' => $data['disability'],
        ':street' => $data['street'],
        ':barangay' => $data['barangay'],
        ':municipality' => $data['municipality'] ?? 'Dasmariñas',
        ':province' => $data['province'] ?? 'Cavite',
        ':region' => $data['region'] ?? 'IV-A',
        ':tel' => $data['tel'] ?? '',
        ':mobile' => $data['mobile'],
        ':email' => $data['email'],
        ':dob' => $data['dob'],
        ':sex' => $data['sex'],
        ':nationality' => $data['nationality'] ?? 'Filipino',
        ':blood' => $data['blood'] ?? '',
        ':civil' => $data['civil'],
        ':emergencyName' => $data['emergencyName'],
        ':emergencyPhone' => $data['emergencyPhone'],
        ':emergencyRelationship' => $data['emergencyRelationship'],
        ':proofIdentity' => $data['proofIdentity'] ?? '',
        ':proofDisability' => $data['proofDisability'] ?? '',
        ':password' => $data['password'], // Note: Hash in production!
        ':status' => $data['status'] ?? 'Pending'
    ]);
    
    http_response_code(201);
    echo json_encode(['created' => 1, 'message' => 'Registration successful']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
}
?>
```

#### 2. User Login API (`api/login.php`)

```php
<?php
/**
 * User Login API
 * Replaces: GET SheetDB /search?email=X&password=Y
 */
require_once 'cors.php';
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Find user by email and password
    // Note: In production, use password_verify() with hashed passwords!
    $stmt = $pdo->prepare("SELECT * FROM pwd_users WHERE email = ? AND password = ?");
    $stmt->execute([strtolower(trim($email)), $password]);
    $user = $stmt->fetch();
    
    if ($user) {
        // Return array format to match SheetDB response
        echo json_encode([$user]);
    } else {
        // Return empty array (matches SheetDB behavior)
        echo json_encode([]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
}
?>
```

#### 3. Admin Login API (`api/admin-login.php`)

```php
<?php
/**
 * Admin Login API
 * Replaces: GET SheetDB admin endpoint /search?adminEmail=X&adminPassword=Y
 */
require_once 'cors.php';
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$adminEmail = $input['adminEmail'] ?? '';
$adminPassword = $input['adminPassword'] ?? '';

if (empty($adminEmail) || empty($adminPassword)) {
    http_response_code(400);
    echo json_encode(['error' => 'Admin credentials required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE adminEmail = ? AND adminPassword = ?");
    $stmt->execute([strtolower(trim($adminEmail)), $adminPassword]);
    $admin = $stmt->fetch();
    
    if ($admin) {
        // Don't return password
        unset($admin['adminPassword']);
        echo json_encode([$admin]);
    } else {
        echo json_encode([]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Admin login failed: ' . $e->getMessage()]);
}
?>
```

#### 4. Get User Data API (`api/user.php`)

```php
<?php
/**
 * Get User Data API
 * Replaces: GET SheetDB /search?regNumber=X
 */
require_once 'cors.php';
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$regNumber = $_GET['regNumber'] ?? '';

if (empty($regNumber)) {
    http_response_code(400);
    echo json_encode(['error' => 'Registration number required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("SELECT * FROM pwd_users WHERE regNumber = ?");
    $stmt->execute([$regNumber]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo json_encode([$user]); // Array format to match SheetDB
    } else {
        echo json_encode([]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch user: ' . $e->getMessage()]);
}
?>
```

#### 5. Get All Applications API (`api/applications.php`)

```php
<?php
/**
 * Get All Applications API
 * Replaces: GET SheetDB base URL (all records)
 * Also handles: GET /search?status=pending
 */
require_once 'cors.php';
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Check for status filter
    $status = $_GET['status'] ?? null;
    
    if ($status) {
        $stmt = $pdo->prepare("SELECT * FROM pwd_users WHERE LOWER(status) = LOWER(?) ORDER BY createdAt ASC");
        $stmt->execute([$status]);
    } else {
        $stmt = $pdo->query("SELECT * FROM pwd_users ORDER BY createdAt DESC");
    }
    
    $applications = $stmt->fetchAll();
    echo json_encode($applications);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch applications: ' . $e->getMessage()]);
}
?>
```

#### 6. Update Status API (`api/update-status.php`)

```php
<?php
/**
 * Update Application Status API
 * Replaces: PATCH SheetDB /email/{email}
 */
require_once 'cors.php';
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $_GET['email'] ?? $input['email'] ?? '';
$newStatus = $input['data']['status'] ?? $input['status'] ?? '';

if (empty($email) || empty($newStatus)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and status required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("UPDATE pwd_users SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE email = ?");
    $stmt->execute([$newStatus, $email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['updated' => 1, 'message' => 'Status updated successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Update failed: ' . $e->getMessage()]);
}
?>
```

#### 7. Check Email API (`api/check-email.php`)

```php
<?php
/**
 * Check Email Exists API
 * Replaces: GET SheetDB /search?email=X
 */
require_once 'cors.php';
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$email = $_GET['email'] ?? '';

if (empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email required']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    $stmt = $pdo->prepare("SELECT email FROM pwd_users WHERE email = ?");
    $stmt->execute([strtolower(trim($email))]);
    $exists = $stmt->fetch();
    
    // Return array format to match SheetDB
    echo json_encode($exists ? [$exists] : []);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Check failed: ' . $e->getMessage()]);
}
?>
```

---

## React Code Modifications

### 1. Create API Configuration File

Create a new file: `src/api/config.js`

```javascript
/**
 * API Configuration
 * Toggle between SheetDB and PHP backend
 */

// Set to 'php' for XAMPP backend, 'sheetdb' for Google Sheets
const API_MODE = 'php'; // Change this to switch backends

const config = {
    sheetdb: {
        baseUrl: 'https://sheetdb.io/api/v1/ljqq6umrhu60o',
        adminUrl: 'https://sheetdb.io/api/v1/duayfvx2u7zh9'
    },
    php: {
        baseUrl: 'http://localhost/pwd-api',
        // Endpoints
        register: '/register.php',
        login: '/login.php',
        adminLogin: '/admin-login.php',
        user: '/user.php',
        applications: '/applications.php',
        updateStatus: '/update-status.php',
        checkEmail: '/check-email.php'
    }
};

export const API_MODE_CURRENT = API_MODE;
export const API_BASE = API_MODE === 'php' ? config.php.baseUrl : config.sheetdb.baseUrl;
export const ADMIN_API_BASE = API_MODE === 'php' ? config.php.baseUrl : config.sheetdb.adminUrl;
export const endpoints = config.php;
export default config;
```

### 2. Update `registrationApi.js`

```javascript
/**
 * Registration API - PHP/MySQL Version
 */
import { API_BASE, API_MODE_CURRENT, endpoints } from './config';

export const submitRegistration = async (formData) => {
    try {
        if (API_MODE_CURRENT === 'php') {
            // PHP Backend
            const response = await fetch(`${API_BASE}${endpoints.register}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: [formData] })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                return { success: true, message: 'Registration submitted successfully!' };
            } else {
                return { success: false, message: result.error || 'Registration failed.' };
            }
        } else {
            // Original SheetDB code (keep as fallback)
            // ... existing SheetDB code ...
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Something went wrong. Please try again later.' };
    }
};

export const checkEmailExists = async (email) => {
    try {
        if (API_MODE_CURRENT === 'php') {
            const response = await fetch(`${API_BASE}${endpoints.checkEmail}?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            return data.length > 0;
        } else {
            // Original SheetDB code
            const response = await fetch(`${API_BASE}/search?email=${email}`);
            const existingUsers = await response.json();
            return existingUsers.length > 0;
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};
```

### 3. Update `userApi.js`

```javascript
/**
 * User API - PHP/MySQL Version
 */
import { API_BASE, API_MODE_CURRENT, endpoints } from './config';

export const getCurrentUserData = async () => {
    try {
        const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
        
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }

        let searchUrl;
        if (API_MODE_CURRENT === 'php') {
            searchUrl = `${API_BASE}${endpoints.user}?regNumber=${encodeURIComponent(userId)}`;
        } else {
            searchUrl = `${API_BASE}/search?regNumber=${encodeURIComponent(userId)}`;
        }
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error(`No user found with registration number: ${userId}`);
        }
        
        return data[0]; // Return first matching user
        
    } catch (error) {
        console.error('[userApi] Error:', error.message);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userData');
    sessionStorage.clear();
};
```

### 4. Update `login.jsx`

In `login.jsx`, update the login functions:

```javascript
// Import at top
import { API_BASE, ADMIN_API_BASE, API_MODE_CURRENT, endpoints } from '../api/config';

// Update handleUserLogin function
const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage('');

    if (!email || !password) {
        setLoginMessage('<div class="alert alert-danger">Please enter both email and password.</div>');
        setIsLoading(false);
        return;
    }

    try {
        let response, data;
        
        if (API_MODE_CURRENT === 'php') {
            // PHP Backend - use POST
            response = await fetch(`${API_BASE}${endpoints.login}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email.trim().toLowerCase(), 
                    password: password 
                })
            });
            data = await response.json();
        } else {
            // SheetDB - use GET with query params
            const qEmail = encodeURIComponent(email.trim().toLowerCase());
            const qPassword = encodeURIComponent(password);
            response = await fetch(`${API_BASE}/search?email=${qEmail}&password=${qPassword}`);
            data = await response.json();
        }

        if (data && data.length > 0) {
            const userRecord = data[0];
            sessionStorage.setItem('userId', userRecord.regNumber);
            sessionStorage.setItem('loggedInUser', email);
            sessionStorage.setItem('userData', JSON.stringify(userRecord));
            
            setLoginMessage('<div class="alert alert-success">Login successful! Redirecting...</div>');
            setTimeout(() => navigate('/userpage', { replace: true }), 1000);
        } else {
            setLoginMessage('<div class="alert alert-danger">Invalid email or password.</div>');
        }
    } catch (error) {
        console.error('Login error:', error);
        setLoginMessage('<div class="alert alert-danger">Login service unavailable.</div>');
    } finally {
        setIsLoading(false);
    }
};

// Update handleAdminLogin similarly
const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminIsLoading(true);
    setAdminLoginMessage('');

    if (!adminEmail || !adminPassword) {
        setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Please enter both email and password.</div>');
        setAdminIsLoading(false);
        return;
    }

    try {
        let response, data;
        
        if (API_MODE_CURRENT === 'php') {
            response = await fetch(`${API_BASE}${endpoints.adminLogin}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    adminEmail: adminEmail.trim().toLowerCase(), 
                    adminPassword: adminPassword 
                })
            });
            data = await response.json();
        } else {
            const qEmail = encodeURIComponent(adminEmail.trim().toLowerCase());
            const qPassword = encodeURIComponent(adminPassword);
            response = await fetch(`${ADMIN_API_BASE}/search?adminEmail=${qEmail}&adminPassword=${qPassword}`);
            data = await response.json();
        }

        if (data && data.length > 0) {
            sessionStorage.setItem('adminLoggedIn', adminEmail);
            setAdminLoginMessage('<div class="alert alert-success m-3 p-3">Admin login successful!</div>');
            setTimeout(() => navigate('/adminpage', { replace: true }), 1000);
        } else {
            setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Invalid admin credentials.</div>');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        setAdminLoginMessage('<div class="alert alert-danger m-3 p-3">Admin login service unavailable.</div>');
    } finally {
        setAdminIsLoading(false);
    }
};
```

### 5. Update `adminpage.jsx`

```javascript
// Import at top
import { API_BASE, API_MODE_CURRENT, endpoints } from '../../api/config';

// Update useEffect fetch
useEffect(() => {
    const fetchData = async () => {
        try {
            let url;
            if (API_MODE_CURRENT === 'php') {
                url = `${API_BASE}${endpoints.applications}`;
            } else {
                url = API_BASE; // SheetDB base URL returns all
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            // ... rest of your processing code stays the same ...
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);
```

### 6. Update `adminverify.jsx`

```javascript
// Import at top
import { API_BASE, API_MODE_CURRENT, endpoints } from '../../api/config';

// Update fetchOldestPending
const fetchOldestPending = async () => {
    try {
        let url;
        if (API_MODE_CURRENT === 'php') {
            url = `${API_BASE}${endpoints.applications}?status=pending`;
        } else {
            url = `${API_BASE}/search?status=pending`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setApplicant(data[0] || null);
    } catch (err) {
        console.error('Error fetching applicant:', err);
    } finally {
        setLoading(false);
    }
};

// Update updateStatus
const updateStatus = async (newStatus) => {
    if (!applicant) return;
    setUpdating(true);
    try {
        if (API_MODE_CURRENT === 'php') {
            await fetch(`${API_BASE}${endpoints.updateStatus}?email=${applicant.email}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { status: newStatus } })
            });
        } else {
            await fetch(`${API_BASE}/email/${applicant.email}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { status: newStatus } })
            });
        }

        alert(`Status updated to: ${newStatus}`);
        
        // Reload pending list
        await fetchOldestPending();
    } catch (err) {
        console.error('Error updating status:', err);
        alert('Failed to update status.');
    } finally {
        setUpdating(false);
    }
};
```

---

## Data Migration Strategy

### Export from Google Sheets

1. Open your Google Sheet
2. Go to **File → Download → Comma Separated Values (.csv)**
3. Save as `pwd_data_export.csv`

### Import to MySQL

**Option A: phpMyAdmin Import**
1. Open `http://localhost/phpmyadmin`
2. Select `pwd_registry` database
3. Click `pwd_users` table
4. Click **Import** tab
5. Choose your CSV file
6. Set format options:
   - Format: CSV
   - Columns enclosed by: `"`
   - First line contains column names: ✅

**Option B: SQL Import Script**

```sql
-- Create temporary table matching CSV structure
LOAD DATA LOCAL INFILE 'C:/path/to/pwd_data_export.csv'
INTO TABLE pwd_users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(regNumber, regDate, lastName, firstName, middleName, disability,
 street, barangay, municipality, province, region, tel, mobile, email,
 dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
 emergencyRelationship, proofIdentity, proofDisability, password, status);
```

---

## Development Workflow

### Running Both Servers

You need two terminals running simultaneously:

**Terminal 1: React Development Server**
```bash
cd "C:\Users\admin\Documents\...\pwd-application-system"
npm start
# Runs on http://localhost:3000
```

**Terminal 2: XAMPP (Already running via Control Panel)**
- Apache: `http://localhost` (port 80)
- MySQL: `localhost:3306`
- phpMyAdmin: `http://localhost/phpmyadmin`

### CORS Configuration

If you encounter CORS errors, add this `.htaccess` file in your `api/` folder:

```apache
# api/.htaccess
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "http://localhost:3000"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
</IfModule>

# Handle OPTIONS preflight
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
```

---

## Testing Checklist

- [ ] **Database Setup**
  - [ ] Created `pwd_registry` database
  - [ ] Created `pwd_users` table
  - [ ] Created `admin_users` table
  - [ ] Inserted test admin user

- [ ] **PHP API**
  - [ ] `register.php` - Create new registration
  - [ ] `login.php` - User authentication
  - [ ] `admin-login.php` - Admin authentication
  - [ ] `user.php` - Get user by regNumber
  - [ ] `applications.php` - Get all/filtered applications
  - [ ] `update-status.php` - Update application status
  - [ ] `check-email.php` - Check email exists

- [ ] **React Integration**
  - [ ] Created `src/api/config.js`
  - [ ] Updated `registrationApi.js`
  - [ ] Updated `userApi.js`
  - [ ] Updated `login.jsx`
  - [ ] Updated `adminpage.jsx`
  - [ ] Updated `adminverify.jsx`

- [ ] **End-to-End Testing**
  - [ ] New user registration
  - [ ] User login
  - [ ] View user dashboard
  - [ ] Admin login
  - [ ] View applications list
  - [ ] Accept/Deny applications

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check `.htaccess` or `cors.php` headers |
| 500 Internal Server Error | Check PHP error log in `C:\xampp\apache\logs\error.log` |
| Database connection failed | Verify MySQL is running, check credentials in `config.php` |
| Empty response from PHP | Add `error_reporting(E_ALL)` at top of PHP file |
| React not seeing API | Check `API_MODE` in `config.js` is set to `'php'` |
| Symbolic link not working | Run CMD as Administrator |

---

## Security Considerations

**Before Production:**

1. **Hash Passwords:**
```php
// In register.php
$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

// In login.php
if (password_verify($password, $user['password'])) { ... }
```

2. **Use Prepared Statements:** ✅ Already implemented

3. **Validate Input:**
```php
$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}
```

4. **Use HTTPS in Production**

5. **Set Proper File Permissions** on PHP files

---

## Quick Reference Commands

```bash
# Create symbolic link (Run CMD as Administrator)
mklink /D "C:\xampp\htdocs\pwd-api" "C:\path\to\repo\Post-React-Migration\xampp-php-mysql-files\api"

# Start React
cd "C:\path\to\pwd-application-system" && npm start

# Test PHP API
curl http://localhost/pwd-api/applications.php

# View Apache error log
type "C:\xampp\apache\logs\error.log"
```

---

*Documentation created: December 3, 2025*  
*For: PWD Automated Application System - Backend Migration*
