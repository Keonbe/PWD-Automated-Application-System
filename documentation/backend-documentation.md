# Backend Migration Overview

> **Branch:** `feat--backend-integeration`  
> **Status:** 🚧 In Progress  
> **Target:** Migrate from Google Sheets API (SheetDB) to XAMPP (PHP + MySQL)

---

## 🎯 What We're Doing

We're replacing the cloud-based Google Sheets backend with a local XAMPP server running PHP and MySQL. The React frontend stays the same—only the data layer changes.

```
BEFORE:  React App  →  SheetDB API  →  Google Sheets (Cloud)
AFTER:   React App  →  PHP API      →  MySQL Database (Local)
```

---

## 📋 Migration Checklist

### Phase 1: Setup Environment
- [ ] Install XAMPP (Apache + MySQL + PHP)
- [ ] Create symbolic link from `htdocs` to repo's PHP folder
- [ ] Configure CORS for React ↔ PHP communication

### Phase 2: Database
- [ ] Create `pwd_registry` database in phpMyAdmin
- [ ] Create `pwd_users` table (matches SheetDB columns)
- [ ] Create `admin_users` table
- [ ] Export data from Google Sheets → Import to MySQL

### Phase 3: PHP API
- [ ] `config.php` - Database connection
- [ ] `register.php` - New user registration
- [ ] `login.php` - User authentication
- [ ] `admin-login.php` - Admin authentication
- [ ] `user.php` - Get user by regNumber
- [ ] `applications.php` - List all applications
- [ ] `update-status.php` - Accept/Deny applications
- [ ] `check-email.php` - Validate email uniqueness

### Phase 4: React Updates
- [ ] Create `src/api/config.js` (toggle between backends)
- [ ] Update `registrationApi.js`
- [ ] Update `userApi.js`
- [ ] Update `login.jsx`
- [ ] Update `adminpage.jsx` & `adminverify.jsx`

### Phase 5: Testing
- [ ] Test all user flows end-to-end
- [ ] Verify data integrity after migration

---

## 📁 Files Changed

| File | Change Type |
|------|-------------|
| `src/api/config.js` | **NEW** - API configuration |
| `src/api/registrationApi.js` | Modified |
| `src/api/userApi.js` | Modified |
| `src/pages/login.jsx` | Modified |
| `src/pages/adminpage/*.jsx` | Modified |
| `xampp-php-mysql-files/api/*.php` | **NEW** - PHP endpoints |
| `xampp-php-mysql-files/sql-scripts.sql` | Updated for MySQL |

---

## 🔧 Quick Start Commands

```bash
# 1. Create symlink (Run CMD as Administrator)
mklink /D "C:\xampp\htdocs\pwd-api" "C:\path\to\repo\Post-React-Migration\xampp-php-mysql-files\api"

# 2. Start XAMPP (Apache + MySQL)
# Use XAMPP Control Panel

# 3. Start React
cd Post-React-Migration/pwd-application-system
npm start
```

---

## 📖 Full Documentation

See [`backend-migration-documentation.md`](./backend-migration-documentation.md) for:
- Complete PHP code for all endpoints
- Database schema with SQL scripts
- Detailed React code modifications
- Troubleshooting guide
- Security considerations

---

## ⚡ Key Benefit

**Easy Backend Switching:** Change one variable in `config.js` to toggle between SheetDB and PHP:

```javascript
const API_MODE = 'php';    // Use XAMPP backend
// const API_MODE = 'sheetdb'; // Use Google Sheets (fallback)
```

---

## 📡 Files with SheetDB.io Interactions

The following files currently interact with SheetDB.io and require CRUD method implementation (including fetch/read/get operations) during backend migration:

### Frontend Files (React)

| File | SheetDB Operations | Methods Required |
|------|-------------------|------------------|
| `src/api/registrationApi.js` | **CREATE**: Submit new registrations<br>**READ**: Check regNumber existence<br>**READ**: Validate email uniqueness | POST (create user)<br>GET/search (check duplicates) |
| `src/api/userApi.js` | **READ**: Fetch user data by regNumber | GET/search (retrieve user profile) |
| `src/pages/login.jsx` | **READ**: User authentication<br>**READ**: Admin authentication | GET/search (validate credentials) |
| `src/pages/adminpage/adminverify.jsx` | **READ**: Fetch pending applicants<br>**UPDATE**: Change application status | GET/search (get applicants)<br>PATCH (update status) |
| `src/components/statuschart.jsx` | **READ**: Fetch all applications for statistics | GET (retrieve all records) |
| `src/pages/homepage/register.jsx` | Mirror file name fields to SheetDB columns | Data formatting for CREATE |

### Legacy Files (Pre-Migration)

| File | SheetDB Operations | Notes |
|------|-------------------|-------|
| `Pre-React-Migration/pages/user/userLogin.html` | **READ**: User/Admin login validation | Legacy implementation - reference only |

### SheetDB Endpoints Used

- **User Data**: `https://sheetdb.io/api/v1/ljqq6umrhu60o` (Backup)
- **Admin Data**: `https://sheetdb.io/api/v1/duayfvx2u7zh9`
- **Original**: `https://sheetdb.io/api/v1/wgjit0nprbfxe` (Commented out)

### Required PHP Endpoints for Migration

1. **`register.php`** - Replace `registrationApi.js` POST requests
2. **`check-email.php`** - Replace `registrationApi.js` email validation
3. **`user.php`** - Replace `userApi.js` GET by regNumber
4. **`login.php`** - Replace `login.jsx` user authentication
5. **`admin-login.php`** - Replace `login.jsx` admin authentication
6. **`applications.php`** - Replace `adminverify.jsx` and `statuschart.jsx` GET all
7. **`update-status.php`** - Replace `adminverify.jsx` PATCH status

---

*Last Updated: December 7, 2025*
