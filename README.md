# PWD-Automated-Application-System

**A project for ITWB311 "Web Development" subject — Final Term v2.1**

A **PWD Automated Application System** built using **React 19**, **Vite 7**, **PHP 8.2**, and **MySQL** — a full-stack web application for managing PWD (Persons with Disabilities) registrations in Dasmariñas City.

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Repo Size">
  <img src="https://img.shields.io/github/contributors/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Contributors">

  <img src="/documentation/images/homepage-screenshot.png" alt="Homepage Screenshot" width="600"/>
</p>

> **Version 2.1** — Production-ready with Vite 7 build tool, PHP/MySQL backend, 25 API endpoints, file upload system, admin review workflow, and news management.

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
  - [Getting Started (5-Minute Setup)](#getting-started-5-minute-setup)
    - [Path Structure](#path-structure)
    - [Installation Checklist](#installation-checklist)
    - [Quick Start (5 minutes)](#quick-start-5-minutes)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Frontend Dependencies](#2-install-frontend-dependencies)
    - [3. Configure API (Environment Variables)](#3-configure-api-environment-variables)
    - [4. Set Up PHP Backend](#4-set-up-php-backend)
  - [Database Setup](#database-setup)
    - [1. Start XAMPP Services](#1-start-xampp-services)
    - [2. Create Database](#2-create-database)
    - [3. Run SQL Setup Script](#3-run-sql-setup-script)
  - [Run Development](#run-development)
    - [Start Frontend (React with Vite)](#start-frontend-react-with-vite)
    - [Start Backend (XAMPP)](#start-backend-xampp)
  - [Build Production](#build-production)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [User Management](#user-management)
    - [Admin Management](#admin-management)
    - [File Management](#file-management)
    - [News Management](#news-management)
  - [How to Contribute](#how-to-contribute)
  - [Contributors](#contributors)
      - [All Team Members](#all-team-members)
  - [Documentation Guide](#documentation-guide)
    - [🚀 Quick Setup](#-quick-setup)
    - [❓ Need Help?](#-need-help)
    - [📚 Complete Documentation Reference](#-complete-documentation-reference)
      - [Development Setup](#development-setup)
      - [API \& Development](#api--development)
      - [Features](#features)
      - [Build Tool \& Configuration](#build-tool--configuration)
      - [Contributing](#contributing)
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
| **News & Announcements** | Admin-managed news posts with image uploads, categories, and publish workflow |
| **Dual Authentication** | Separate login for users and administrators |

---

## Tech Stack

### Frontend
<p align="left">
  <img src="https://skillicons.dev/icons?i=react,vite,bootstrap,html,css,js" alt="Frontend Icons">
</p>

- **React 19** with React Router v7
- **Vite v7** as build tool (lightning-fast development server with HMR)
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
- **25 RESTful API endpoints**
- **File upload handling** with MIME validation

### Database

<p align="left">
  <img src="https://skillicons.dev/icons?i=mysql" alt="MySQL Icon">
</p>

- **MySQL** (PWDRegistry database)
- **utf8mb4** collation for full Unicode support
- **4 tables:** `pwd_users`, `admin_users`, `pwd_file_uploads`, `pwd_news_posts`

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

## Getting Started (5-Minute Setup)

### Path Structure
Your project should be in one of these locations:
- **Windows (XAMPP Default):** `C:\xampp\htdocs\webdev_finals\PWD-Automated-Application-System`
- **Windows (Scoop):** `C:\Users\<username>\scoop\apps\xampp\8.2.12-0\htdocs\webdev_finals\PWD-Automated-Application-System`

### Installation Checklist
```
✅ [ ] Clone the repository (git clone)
✅ [ ] Install Node dependencies (npm install)
✅ [ ] Configure .env file with VITE_API_URL
✅ [ ] Set up database (create PWDRegistry, run master-setup.sql)
✅ [ ] Start XAMPP (Apache + MySQL)
✅ [ ] Start Vite dev server (npm run dev)
✅ [ ] Open http://localhost:3000
```

For **detailed step-by-step instructions**, see [SETUP-GUIDE.md](documentation/SETUP-GUIDE.md).

---

### Quick Start (5 minutes)

For detailed setup instructions, see **[SETUP-GUIDE.md](documentation/SETUP-GUIDE.md)**

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

### 3. Configure API (Environment Variables)

Create `.env` file in `pwd-application-system/` directory:

```env
VITE_API_URL=http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api
VITE_APP_NAME=PWD Automated Application System
VITE_ENVIRONMENT=development
```

**Note:** Adjust the path based on your XAMPP htdocs location.

### 4. Set Up PHP Backend

Copy the PHP files to your XAMPP htdocs:

```bash
# Windows (PowerShell - Admin):
New-Item -ItemType SymbolicLink -Path "C:\xampp\htdocs\pwd-api" -Target "C:\path\to\PWD-Automated-Application-System\Post-React-Migration\xampp-php-mysql-files\api"

# Or copy files directly:
xcopy "Post-React-Migration\xampp-php-mysql-files\api" "C:\xampp\htdocs\pwd-api\api" /E /I
```

---

## Database Setup

### 1. Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache** (should show green "Running")
3. Click **Start** next to **MySQL** (should show green "Running")

### 2. Create Database

Open phpMyAdmin at `http://localhost/phpmyadmin`:

1. Click **New** in left sidebar
2. Enter database name: `PWDRegistry`
3. Select collation: `utf8mb4_unicode_ci`
4. Click **Create**

### 3. Run SQL Setup Script

1. Select `PWDRegistry` database
2. Go to **SQL** tab
3. Copy all contents from `Post-React-Migration/xampp-php-mysql-files/master-setup.sql`
4. Paste into SQL editor
5. Click **Go** or **Execute**

This creates all tables and sample data with default admin account:
- **Email:** `admin@dasma.gov.ph`
- **Password:** `admin123`

---

## Run Development

### Start Frontend (React with Vite)

```bash
cd Post-React-Migration/pwd-application-system
npm run dev
```

Opens at `http://localhost:3000` (uses Vite development server with hot module replacement)

**Note:** This project was migrated from Create React App to Vite for faster development and builds. See [VITE-COMPLETE-DOCUMENTATION.md](Post-React-Migration/documentation/VITE-COMPLETE-DOCUMENTATION.md) for migration details.

### Start Backend (XAMPP)

1. Ensure Apache and MySQL are running in XAMPP
2. API available at `http://localhost/pwd-api/` (or your configured path)

---

## Build Production

```bash
cd Post-React-Migration/pwd-application-system
npm run build
```

The optimized build will be in the `dist/` folder (Vite generates smaller, faster bundles than Create React App).

To preview the production build locally:
```bash
npm run preview
```

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
│   │       │   ├── adminApi.js
│   │       │   └── newsApi.js
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
│   │   ├── api/                    # 25 PHP API endpoints
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

### News Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `news-get-published.php` | GET | Get published news (paginated) |
| `news-get-single.php` | GET | Get single news article by slug |
| `news-admin-get-all.php` | GET | Admin: Get all news posts |
| `news-admin-create.php` | POST | Admin: Create news post |
| `news-admin-update.php` | POST | Admin: Update news post |
| `news-admin-delete.php` | POST | Admin: Delete news post |
| `news-upload-image.php` | POST | Admin: Upload news image |

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

### 🚀 Quick Setup
**New to the project?** Start with:
1. **[SETUP-GUIDE.md](documentation/SETUP-GUIDE.md)** — Complete step-by-step installation
2. **[init-documentation.md](documentation/init-documentation.md)** — Project architecture overview
3. **[database-documentation.md](documentation/database-documentation.md)** — Database schema

### ❓ Need Help?
**Having issues during setup?** Check these:
- **[VITE-COMPLETE-DOCUMENTATION.md](Post-React-Migration/documentation/VITE-COMPLETE-DOCUMENTATION.md)** — Comprehensive Vite migration guide with troubleshooting
- **[VITE-DOCUMENTATION-INDEX.md](Post-React-Migration/documentation/VITE-DOCUMENTATION-INDEX.md)** — Quick Vite reference guide
- [Backend Documentation](documentation/backend-documentation.md) — PHP and MySQL setup help

### 📚 Complete Documentation Reference

#### Development Setup
- [SETUP-GUIDE.md](documentation/SETUP-GUIDE.md) — Installation and configuration guide
- [Init Documentation](documentation/init-documentation.md) — Complete project setup
- [Database Documentation](documentation/database-documentation.md) — MySQL schema and design
- [Backend Documentation](documentation/backend-documentation.md) — PHP backend architecture

#### API & Development
- [API Documentation](documentation/api-documentation.md) — Frontend to backend integration
- [PHP API Documentation](documentation/php-api-documentation.md) — All 25 API endpoints reference
- [Function Documentation](documentation/function-documentation.md) — React function reference
- [NPM Scripts Documentation](documentation/npm-script.md) — All npm commands

#### Features
- [File Upload Feature](documentation/file-upload-feature-documentation.md) — File upload system
- [News Feature Documentation](documentation/news-feature-documentation.md) — News management system
- [QR Code Feature Documentation](documentation/qrcode-feature-documentation.md) — QR generation
- [ID Photo Feature Documentation](documentation/id-photo-feature-documentation.md) — ID photo handling

#### Build Tool & Configuration
- **[Vite Comprehensive Guide](documentation/vite-comprehensive-guide.md)** — Complete Vite 7 setup, configuration, troubleshooting, and advanced usage
- **[Vite Quick Start](Post-React-Migration/documentation/vite-quick-start.md)** — 5-minute Vite setup guide
- **[Vite Documentation Index](Post-React-Migration/documentation/VITE-DOCUMENTATION-INDEX.md)** — Quick Vite reference

#### Contributing
- [Contribution Guide](documentation/contribution_guide-documentation.md) — How to contribute
- [Backend Migration Documentation](documentation/backend-migration-documentation.md) — Backend development history

---

## License

This project is for academic purposes as part of ITWB311 "Web Development" subject.

---

<p align="center">
  <b>PWD Automated Application System v2.1</b><br>
  De La Salle University Dasmariñas<br>
  January 2026
</p>
