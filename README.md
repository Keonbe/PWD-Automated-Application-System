# PWD-Automated-Application-System

**A project for ITWB311 "Web Development" subject — Final Term v2.0**

A **PWD Automated Application System** built using **React 19**, **PHP 8.2**, and **MySQL** — a full-stack web application for managing PWD (Persons with Disabilities) registrations in Dasmariñas City.

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Repo Size">
  <img src="https://img.shields.io/github/contributors/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Contributors">

  <img src="/documentation/images/homepage-screenshot.png" alt="Homepage Screenshot" width="600"/>
</p>

> **Version 2.0** — Production-ready with PHP/MySQL backend, 18 API endpoints, file upload system, and admin review workflow.

---

## Contents

- [PWD-Automated-Application-System](#pwd-automated-application-system)
  - [Contents](#contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Tools](#tools)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Frontend Dependencies](#2-install-frontend-dependencies)
    - [3. Set Up PHP Backend](#3-set-up-php-backend)
  - [Database Setup](#database-setup)
    - [1. Start XAMPP Services](#1-start-xampp-services)
    - [2. Create Database](#2-create-database)
    - [3. Run Setup Script](#3-run-setup-script)
  - [Run Development](#run-development)
    - [Start Frontend (React)](#start-frontend-react)
    - [Start Backend (XAMPP)](#start-backend-xampp)
  - [Build Production](#build-production)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [User Management](#user-management)
    - [Admin Management](#admin-management)
    - [File Management](#file-management)
  - [How to Contribute](#how-to-contribute)
  - [Contributors](#contributors)
      - [All Team Members](#all-team-members)
  - [Documentation Guide](#documentation-guide)
    - [Getting Started](#getting-started)
    - [Documentation Links](#documentation-links)
  - [License](#license)

---

## Overview

This system is designed to:
* Provide an accessible PWD registration platform for Dasmariñas City
* Streamline the application process for persons with disabilities
* Enable administrators to review and manage applications efficiently
* Support document uploads (medical certificates, identity proofs)
* Generate QR codes for PWD ID verification
* Provide responsive design for all devices

---

## Key Features

| Feature | Description |
|---------|-------------|
| **User Registration** | Complete PWD application form with validation |
| **File Upload** | Upload medical certificates and identity proofs (PDF/JPG/PNG, max 5MB) |
| **User Dashboard** | View application status, uploaded documents, and PWD ID card |
| **QR Code Generation** | Scannable verification codes on PWD ID cards |
| **Admin Dashboard** | Statistics, charts, application list, and management tools |
| **Admin Review** | Approve/reject applications with notes and document review |
| **Status Tracking** | Color-coded status badges (Pending/Accepted/Denied) |
| **Dual Authentication** | Separate login for users and administrators |

---

## Tech Stack

### Frontend
<p align="left">
  <img src="https://skillicons.dev/icons?i=react,bootstrap,html,css,js" alt="Frontend Icons">
</p>

- **React 19** with React Router v7
- **Bootstrap 5** with React-Bootstrap
- **Axios** for HTTP requests
- **Recharts** for data visualization
- **QRCode.react** for QR code generation

### Backend

<p align="left">
  <img src="https://skillicons.dev/icons?i=php" alt="PHP Icon">
  <img src="https://img.shields.io/badge/XAMPP-F37623?style=for-the-badge&logo=xampp&logoColor=white" alt="XAMPP Badge" />
</p>

- **PHP 8.2** on XAMPP
- **MySQLi** with prepared statements
- **18 RESTful API endpoints**
- **File upload handling** with MIME validation

### Database

<p align="left">
  <img src="https://skillicons.dev/icons?i=mysql" alt="MySQL Icon">
</p>

- **MySQL** (PWDRegistry database)
- **utf8mb4** collation for full Unicode support
- **3 tables:** \`pwd_users\`, \`admin_users\`, \`pwd_file_uploads\`

### Tools

<p align="left">
  <img src="https://skillicons.dev/icons?i=vscode,git,github,postman" alt="Tools Icons">
</p>

- **VS Code** for development
- **Git/GitHub** for version control
- **Postman** for API testing
- **phpMyAdmin** for database management

---

## Prerequisites

- **Node.js** (v18+ recommended) and npm
- **XAMPP** (v8.2+) with Apache and MySQL
- **Git** for version control

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Keonbe/PWD-Automated-Application-System.git
cd PWD-Automated-Application-System
```

### 2. Install Frontend Dependencies

```bash
cd Post-React-Migration/pwd-application-system
npm install
```

### 3. Set Up PHP Backend

Copy or symlink the PHP files to your XAMPP htdocs:

```bash
# Option A: Create symbolic link (Windows Admin PowerShell)
mklink /D "C:\xampp\htdocs\pwd-api" "C:\path\to\PWD-Automated-Application-System\Post-React-Migration\xampp-php-mysql-files\api"

# Option B: Copy files directly
xcopy "Post-React-Migration\xampp-php-mysql-files" "C:\xampp\htdocs\pwd-api" /E /I
```

---

## Database Setup

### 1. Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Start **Apache** (port 80)
3. Start **MySQL** (port 3306)

### 2. Create Database

Open phpMyAdmin (`http://localhost/phpmyadmin`) and run:

```sql
CREATE DATABASE IF NOT EXISTS PWDRegistry
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 3. Run Setup Script

Execute the master setup script in phpMyAdmin:

1. Select \`PWDRegistry\` database
2. Go to **SQL** tab
3. Copy contents from \`Post-React-Migration/xampp-php-mysql-files/master-setup.sql\`
4. Click **Go**

This creates all tables and inserts sample data including a default admin account:
- **Email:** `admin@dasma.gov.ph`
- **Password:** `admin123`

---

## Run Development

### Start Frontend (React)

```bash
cd Post-React-Migration/pwd-application-system
npm start
```

Opens at `http://localhost:3000`

### Start Backend (XAMPP)

1. Ensure Apache and MySQL are running in XAMPP
2. API available at `http://localhost/pwd-api/` (or your configured path)

---

## Build Production

```bash
cd Post-React-Migration/pwd-application-system
npm run build
```

The optimized build will be in the `build/` folder.

---

## Project Structure

```
PWD-Automated-Application-System/
├── Post-React-Migration/
│   ├── pwd-application-system/     # React Frontend
│   │   ├── public/                 # Static assets
│   │   └── src/
│   │       ├── api/                # API wrapper modules
│   │       │   ├── loginApi.js
│   │       │   ├── registrationApi.js
│   │       │   ├── userApi.js
│   │       │   └── adminApi.js
│   │       ├── components/         # Reusable components
│   │       ├── pages/              # Page components
│   │       │   ├── homepage/       # Public pages
│   │       │   ├── userpage/       # User dashboard
│   │       │   └── adminpage/      # Admin dashboard
│   │       └── assets/             # Styles and images
│   │
│   ├── xampp-php-mysql-files/      # PHP Backend
│   │   ├── config.php              # Database configuration
│   │   ├── master-setup.sql        # Database initialization
│   │   ├── api/                    # 18 PHP API endpoints
│   │   └── uploads/                # Uploaded files storage
│   │
│   └── documentation/              # Feature documentation
│
├── Pre-React-Migration/            # Legacy HTML/CSS/JS (archived)
│
└── documentation/                  # Main documentation
    ├── README.md
    ├── init-documentation.md
    ├── api-documentation.md
    ├── php-api-documentation.md
    ├── database-documentation.md
    ├── function-documentation.md
    └── file-upload-feature-documentation.md
```

---

## API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `user-login.php` | POST | User authentication |
| `admin-login.php` | POST | Admin authentication |
| `forgot-password.php` | POST | Password recovery |
| `change-password.php` | POST | Change password |

### User Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `register.php` | POST | Create new user |
| `get-user-data.php` | GET | Get user profile |
| `check-email.php` | POST | Validate email uniqueness |
| `check-regnumber.php` | POST | Validate registration number |

### Admin Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `get-all-applications.php` | GET | List all applications |
| `get-pending-application.php` | GET | List pending applications |
| `update-application-status.php` | POST | Approve/deny application |

### File Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `files.php` | POST | Upload file |
| `get-user-files.php` | GET | Get user's uploaded files |
| `file-download.php` | GET | Download file |
| `file-view.php` | GET | View file inline |
| `update-file-status.php` | POST | Update file status |
| `update-all-files-status.php` | POST | Bulk update file status |

---

## How to Contribute

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/<short-description>
   ```

2. **Make changes and commit:**
   ```bash
   git add
   git commit -m "feat: add new feature description"
   git push origin feature/<short-description>
   ```

3. **Open a Pull Request** on GitHub with:
   - Description of changes
   - Screenshots (if UI changed)
   - Testing steps

---

## Contributors

####  All Team Members
![Contributors Grid](https://contrib.rocks/image?repo=Keonbe/PWD-Automated-Application-System)

- **Keanu M. Bembo**
- **Marqus Borromeo**

---

## Documentation Guide

### Getting Started
1. **Read** \`documentation/init-documentation.md\` for project setup
2. **Review** \`documentation/database-documentation.md\` for schema details
3. **Study** \`documentation/php-api-documentation.md\` for API reference

### Documentation Links

| Document | Description |
|----------|-------------|
| [Init Documentation](documentation/init-documentation.md) | Complete project setup guide |
| [Database Documentation](documentation/database-documentation.md) | MySQL schema and ER diagram |
| [PHP API Documentation](documentation/php-api-documentation.md) | All 18 API endpoints |
| [Function Documentation](documentation/function-documentation.md) | React function reference |
| [File Upload Documentation](documentation/file-upload-feature-documentation.md) | File upload system guide |
| [API Documentation](documentation/api-documentation.md) | Frontend API integration |
| [Contribution Guide](documentation/contribution_guide-documentation.md) | How to contribute |

---

## License

This project is for academic purposes as part of ITWB311 "Web Development" subject.

---

<p align="center">
  <b>PWD Automated Application System v2.0</b><br>
  De La Salle University Dasmariñas<br>
  December 2025
</p>
