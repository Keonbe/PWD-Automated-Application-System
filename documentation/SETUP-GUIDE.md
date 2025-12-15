# PWD Automated Application System - Complete Setup Guide

> **Master Setup Documentation**  
> Last Updated: December 15, 2025  
> Branch: `test-news` (includes News feature)

This guide provides step-by-step instructions to set up the entire PWD Automated Application System from scratch, including the PHP/MySQL backend and React frontend.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation Order Overview](#2-installation-order-overview)
3. [Step 1: Install Required Software](#step-1-install-required-software)
4. [Step 2: Clone/Setup Project Files](#step-2-clonesetup-project-files)
5. [Step 3: Database Setup](#step-3-database-setup)
6. [Step 4: PHP Backend Setup](#step-4-php-backend-setup)
7. [Step 5: React Frontend Setup](#step-5-react-frontend-setup)
8. [Step 6: Running the Application](#step-6-running-the-application)
9. [Testing Checklist](#testing-checklist)
10. [Quick Reference Commands](#quick-reference-commands)
11. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software

| Software | Version | Purpose | Download |
|----------|---------|---------|----------|
| **XAMPP** | 8.2.x+ | Apache + MySQL + PHP | [apachefriends.org](https://www.apachefriends.org/) |
| **Node.js** | 16.x+ | React runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | 8.x+ | Package manager | (Included with Node.js) |
| **Git** | Any | Version control | [git-scm.com](https://git-scm.com/) |

### System Requirements

- Windows 10/11, macOS, or Linux
- Minimum 4GB RAM
- 2GB free disk space
- Ports 80 (Apache), 3306 (MySQL), 3000 (React) available

### Verify Installations

Open a terminal and run:

```bash
# Check Node.js
node -v
# Expected: v16.x.x or higher

# Check npm
npm -v
# Expected: 8.x.x or higher

# Check Git
git --version
# Expected: git version 2.x.x
```

---

## 2. Installation Order Overview

Follow these steps **in order**:

```
┌─────────────────────────────────────────────────────────────┐
│  1. Install XAMPP, Node.js, Git                             │
├─────────────────────────────────────────────────────────────┤
│  2. Clone/Copy project to XAMPP htdocs                      │
├─────────────────────────────────────────────────────────────┤
│  3. Start XAMPP (Apache + MySQL)                            │
├─────────────────────────────────────────────────────────────┤
│  4. Create database + Run SQL migrations                    │
├─────────────────────────────────────────────────────────────┤
│  5. Create upload directories                               │
├─────────────────────────────────────────────────────────────┤
│  6. Install npm dependencies                                │
├─────────────────────────────────────────────────────────────┤
│  7. Start React development server                          │
├─────────────────────────────────────────────────────────────┤
│  8. Verify all endpoints work                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Install Required Software

### 1.1 Install XAMPP

1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Run the installer
3. Install to default location:
   - **Windows**: `C:\xampp`
   - **Mac**: `/Applications/XAMPP`
4. Select components: Apache, MySQL, PHP, phpMyAdmin

### 1.2 Install Node.js

1. Download LTS version from [nodejs.org](https://nodejs.org/)
2. Run installer with default settings
3. Restart terminal after installation

### 1.3 Install Git

1. Download from [git-scm.com](https://git-scm.com/)
2. Run installer with default settings

---

## Step 2: Clone/Setup Project Files

### 2.1 Navigate to XAMPP htdocs

```bash
# Windows (using Git Bash or PowerShell)
cd C:/xampp/htdocs

# Or if using Scoop-installed XAMPP:
cd C:/Users/admin/scoop/apps/xampp/8.2.12-0/htdocs
```

### 2.2 Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Keonbe/PWD-Automated-Application-System.git

# Or if you have a specific folder structure:
mkdir -p "webdev_finals/PWD AUTOMATED APPLICATION SYSTEM"
cd "webdev_finals/PWD AUTOMATED APPLICATION SYSTEM"
git clone https://github.com/Keonbe/PWD-Automated-Application-System.git
```

### 2.3 Switch to Correct Branch (if needed)

```bash
cd PWD-Automated-Application-System
git checkout test-news  # For news feature branch
# Or: git checkout main  # For main branch
```

### 2.4 Verify Project Structure

```
PWD-Automated-Application-System/
├── documentation/           # Documentation files
├── Post-React-Migration/
│   ├── pwd-application-system/    # React frontend
│   │   ├── package.json
│   │   ├── src/
│   │   └── public/
│   └── xampp-php-mysql-files/     # PHP backend
│       ├── config.php
│       ├── api/
│       ├── uploads/
│       └── *.sql              # Migration files
└── Pre-React-Migration/      # Legacy files (ignore)
```

---

## Step 3: Database Setup

### 3.1 Start XAMPP Services

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Both should show green "Running" status

### 3.2 Create the Database

**Option A: Using phpMyAdmin (Recommended)**

1. Open browser: http://localhost/phpmyadmin
2. Click **"New"** in the left sidebar
3. Enter database name: `PWDRegistry`
4. Select collation: `utf8mb4_unicode_ci`
5. Click **Create**

**Option B: Using Command Line**

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS PWDRegistry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3.3 Run SQL Migrations

Navigate to the SQL files directory:

```bash
cd "Post-React-Migration/xampp-php-mysql-files"
```

**Run migrations in this order:**

```bash
# 1. Master setup (creates main tables)
mysql -u root PWDRegistry < master-setup.sql

# 2. File uploads table
mysql -u root PWDRegistry < sql-file-uploads.sql

# 3. Add rejection reason column
mysql -u root PWDRegistry < sql-add-rejection-reason.sql

# 4. File reviews sync
mysql -u root PWDRegistry < sql-sync-file-reviews.sql

# 5. UTF-8 collation fix
mysql -u root PWDRegistry < sql-utf8-fix.sql

# 6. News feature (if on test-news branch)
mysql -u root PWDRegistry < sql-news-posts.sql
```

**Or using phpMyAdmin:**

1. Open http://localhost/phpmyadmin
2. Select `PWDRegistry` database
3. Click **Import** tab
4. Choose file → Select each `.sql` file
5. Click **Go**
6. Repeat for each migration file in order

### 3.4 Verify Database Tables

```bash
mysql -u root PWDRegistry -e "SHOW TABLES;"
```

**Expected tables:**
```
+------------------------+
| Tables_in_PWDRegistry  |
+------------------------+
| admin_users            |
| file_uploads           |
| pwd_applications       |
| pwd_news_posts         |  (if news feature)
| users                  |
+------------------------+
```

---

## Step 4: PHP Backend Setup

### 4.1 Verify config.php

Check database connection settings in `Post-React-Migration/xampp-php-mysql-files/config.php`:

```php
<?php
$host = 'localhost';
$user = 'root';
$pass = '';  // Default XAMPP has no password
$dbname = 'PWDRegistry';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
```

### 4.2 Create Upload Directories

```bash
cd "Post-React-Migration/xampp-php-mysql-files"

# Create main uploads directory
mkdir -p uploads

# Create subdirectories for each file type
mkdir -p uploads/certificates
mkdir -p uploads/identity
mkdir -p uploads/thumbnails
mkdir -p uploads/news  # For news feature
```

**Windows (PowerShell):**
```powershell
$basePath = "Post-React-Migration/xampp-php-mysql-files/uploads"
New-Item -ItemType Directory -Force -Path "$basePath/certificates"
New-Item -ItemType Directory -Force -Path "$basePath/identity"
New-Item -ItemType Directory -Force -Path "$basePath/thumbnails"
New-Item -ItemType Directory -Force -Path "$basePath/news"
```

### 4.3 Test PHP API

Test that the API is accessible:

```bash
# Test a simple endpoint
curl "http://localhost/webdev_finals/PWD%20AUTOMATED%20APPLICATION%20SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/get-all-applications.php"
```

**PowerShell:**
```powershell
(Invoke-WebRequest -Uri 'http://localhost/webdev_finals/PWD%20AUTOMATED%20APPLICATION%20SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/get-all-applications.php' -UseBasicParsing).Content
```

**Expected response:**
```json
{"success":true,"data":[...]}
```

---

## Step 5: React Frontend Setup

### 5.1 Navigate to React Project

```bash
cd "Post-React-Migration/pwd-application-system"
```

### 5.2 Install Dependencies

```bash
npm install
```

This may take 2-5 minutes. Wait for completion.

### 5.3 Verify API Configuration

Check `src/api/config.js` has the correct API URL:

```javascript
export const PHP_BASE_URL = 'http://localhost/webdev_finals/PWD%20AUTOMATED%20APPLICATION%20SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api';
```

**Adjust the path if your project is in a different location!**

### 5.4 Fix Common Issues Before Starting

If you encounter issues, try:

```bash
# Clean reinstall
rm -rf node_modules
npm cache clean --force
npm install
```

---

## Step 6: Running the Application

### 6.1 Startup Checklist

Before running, verify:

- [ ] XAMPP Apache is running (green)
- [ ] XAMPP MySQL is running (green)
- [ ] Database `PWDRegistry` exists with tables
- [ ] Upload directories exist
- [ ] npm dependencies installed

### 6.2 Start React Development Server

```bash
# Navigate to React project (if not already there)
cd "Post-React-Migration/pwd-application-system"

# Start the development server
npm start
```

**Full command for XAMPP htdocs location:**
```bash
cd "/c/Users/admin/scoop/apps/xampp/8.2.12-0/htdocs/webdev_finals/PWD AUTOMATED APPLICATION SYSTEM/PWD-Automated-Application-System/Post-React-Migration/pwd-application-system" && npm start
```

### 6.3 Access the Application

Once started, open in browser:

| Page | URL |
|------|-----|
| **Homepage** | http://localhost:3000 |
| **User Registration** | http://localhost:3000/register |
| **User Login** | http://localhost:3000/login |
| **Admin Login** | http://localhost:3000/admin |
| **News Page** | http://localhost:3000/news |
| **Admin News** | http://localhost:3000/admin/news |

### 6.4 Stopping the Application

- **React**: Press `Ctrl+C` in the terminal running npm
- **XAMPP**: Click Stop on Apache and MySQL in XAMPP Control Panel

---

## Testing Checklist

Use this checklist to verify everything works:

### Database Tests

| Test | Command/Action | Expected Result |
|------|----------------|-----------------|
| Database exists | `SHOW DATABASES LIKE 'PWDRegistry';` | Returns PWDRegistry |
| Tables exist | `SHOW TABLES;` | Lists all tables |
| Sample data | `SELECT COUNT(*) FROM users;` | Returns number ≥ 0 |

### PHP API Tests

| Endpoint | Test URL | Expected |
|----------|----------|----------|
| Get Applications | `/api/get-all-applications.php` | `{"success":true,...}` |
| Check Email | `/api/check-email.php?email=test@test.com` | `{"available":true/false}` |
| News (Published) | `/api/news-get-published.php` | `{"success":true,"posts":[...]}` |

### Frontend Tests

| Page | URL | Verify |
|------|-----|--------|
| Homepage | http://localhost:3000 | Loads without errors |
| Registration | http://localhost:3000/register | Form displays |
| Admin Login | http://localhost:3000/admin | Login form shows |
| News List | http://localhost:3000/news | News cards display |
| Admin News | http://localhost:3000/admin/news | Table with posts |

### Functionality Tests

| Feature | Test Action | Expected Result |
|---------|-------------|-----------------|
| User Registration | Fill form, submit | Account created, redirected |
| User Login | Enter credentials | Dashboard loads |
| Admin Login | Enter admin credentials | Admin dashboard loads |
| File Upload | Upload ID picture | File saved, preview shows |
| News Create | Create post in admin | Post appears in list |
| News View | Click article | Full article displays |

---

## Quick Reference Commands

### Start Everything

```bash
# 1. Start XAMPP (do this via XAMPP Control Panel)
# 2. Start React:
cd "/c/Users/admin/scoop/apps/xampp/8.2.12-0/htdocs/webdev_finals/PWD AUTOMATED APPLICATION SYSTEM/PWD-Automated-Application-System/Post-React-Migration/pwd-application-system" && npm start
```

### Database Commands

```bash
# Connect to MySQL
mysql -u root

# Select database
USE PWDRegistry;

# View all tables
SHOW TABLES;

# View table structure
DESCRIBE users;

# Run a SQL file
mysql -u root PWDRegistry < filename.sql
```

### NPM Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Clean reinstall
rm -rf node_modules && npm cache clean --force && npm install
```

### Git Commands

```bash
# Check current branch
git branch

# Switch branch
git checkout main
git checkout test-news

# Pull latest changes
git pull origin main
```

---

## Troubleshooting

### Issue: "ENOENT: no such file or directory"

**Cause**: Node modules not installed

**Solution**:
```bash
cd "Post-React-Migration/pwd-application-system"
npm install
```

### Issue: "Cannot connect to database"

**Cause**: MySQL not running or wrong credentials

**Solution**:
1. Check XAMPP MySQL is running
2. Verify `config.php` has correct credentials
3. Try connecting manually: `mysql -u root`

### Issue: "CORS policy" error in browser

**Cause**: PHP files missing CORS headers

**Solution**: Ensure all PHP API files have:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### Issue: "Table doesn't exist"

**Cause**: SQL migrations not run

**Solution**: Run all SQL files:
```bash
cd "Post-React-Migration/xampp-php-mysql-files"
mysql -u root PWDRegistry < master-setup.sql
# ... run other SQL files
```

### Issue: Images not uploading

**Cause**: Upload directory doesn't exist or no permissions

**Solution**:
```bash
mkdir -p uploads/news
chmod 755 uploads/news  # Linux/Mac only
```

### Issue: Port 3000 already in use

**Cause**: Another process using the port

**Solution**:
```bash
# Find and kill the process (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm start
```

### Issue: npm start fails with dependency errors

**Solution**: Clean reinstall
```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

---

## Related Documentation

- [News Feature Documentation](news-feature-documentation.md)
- [File Upload Documentation](file-upload-feature-documentation.md)
- [Database Documentation](database-documentation.md)
- [API Documentation](php-api-documentation.md)
- [Backend Documentation](backend-documentation.md)

---

## Support

If you encounter issues not covered in this guide:

1. Check browser console (F12) for JavaScript errors
2. Check terminal for PHP/MySQL errors
3. Review the related documentation files
4. Contact the development team

---

*This documentation is for the PWD Automated Application System developed for the City of Dasmariñas.*

---
**BIG NOTE — Local URL spacing issue (Action Required)**

- **Issue:** Some example URLs and the `PHP_BASE_URL` in `src/api/config.js` contain unescaped spaces because the project path includes the folder name "PWD AUTOMATED APPLICATION SYSTEM". Unescaped spaces in URLs can cause requests from browsers, `curl`, or libraries like `axios` to fail or behave inconsistently.

- **Why it matters:** Developers running the app locally may see intermittent CORS/fetch errors, 404s, or malformed-request errors when the URL is not encoded or when tools do not automatically escape spaces.

- **Workarounds / Fixes:**
    - Percent-encode spaces in URLs (replace spaces with `%20`). Example:

```text
http://localhost/webdev_finals/PWD%20AUTOMATED%20APPLICATION%20SYSTEM/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api
```

    - Better: configure a local virtual host or alias (recommended). Map a host like `pwd.local` to your project directory and use cleaner URLs:

```text
http://pwd.local/xampp-php-mysql-files/api
```

    - Update `src/api/config.js` to use the percent-encoded path or the virtual-host URL before starting the React dev server.

- **Status:** This is a known issue and is being investigated. Please follow one of the workarounds above to avoid runtime URL problems. We will update the documentation and codebase with a permanent fix (virtual host recommendation and example `hosts`/Apache config) soon.

