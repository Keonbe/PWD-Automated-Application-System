# PWD Automated Application System - Documentation Index

> **Version:** 2.0  
> **Backend:** PHP/MySQL (XAMPP)  
> **Frontend:** React 19  
> **Last Updated:** December 14, 2025

## Quick Reference Guide

This document serves as a comprehensive index to all technical documentation for the PWD Automated Application System project. The system has been migrated from SheetDB to a production-ready PHP/MySQL backend.

---

## Core Documentation Files

### 1. **🟢 Init Documentation** (`init-documentation.md`) - START HERE
Complete project overview, setup guide, and architecture documentation.

**Contains:**
- Project overview and tech stack
- Current production stack (PHP/MySQL)
- Architecture diagrams
- Complete project structure
- Setup instructions (React + XAMPP)
- Dependencies and installation
- Development lifecycle documentation
- Migration history

**When to use:**
- **First-time setup** - Setting up development environment
- Understanding project architecture
- Installing dependencies
- Learning about the tech stack

---

### 2. **🟢 Database Documentation** (`database-documentation.md`)
Complete MySQL database schema, setup, and management guide.

**Contains:**
- Database overview and ER diagrams
- All 3 table schemas (pwd_users, admin_users, pwd_file_uploads)
- Column descriptions and data types
- Foreign keys and indexes
- SQL scripts reference
- Setup instructions
- Migration guide
- Troubleshooting

**When to use:**
- Setting up the database
- Understanding data relationships
- Writing SQL queries
- Database migrations
- Troubleshooting database issues

---

### 3. **🟢 PHP API Documentation** (`php-api-documentation.md`)
Comprehensive documentation of all 19 PHP backend endpoints.

**Contains:**
- All 19 API endpoints with examples
- Authentication APIs (user/admin login)
- User management APIs (registration, profile)
- Admin management APIs (applications, verification)
- File management APIs (upload, download)
- Request/response formats
- Error handling
- Frontend integration guide

**When to use:**
- Implementing new API calls
- Understanding API contracts
- Debugging backend issues
- Adding new endpoints
- Testing with Postman

---

### 4. **🟢 Function Documentation** (`function-documentation.md`)
Detailed documentation of all React functions and components.

**Contains:**
- Current PHP/MySQL implementations (v2.0)
- Login functions (login.jsx)
- Registration functions (register.jsx)
- User dashboard functions (userpage.jsx)
- Admin dashboard functions (adminpage.jsx)
- Shared utility functions
- Legacy code archive (deprecated SheetDB functions)

**When to use:**
- Understanding React component behavior
- Implementing new features
- Debugging form submissions
- Learning project patterns
- Refactoring code

---

### 5. **API Documentation** (`api-documentation.md`)
API integration overview with migration reference.

**Contains:**
- PHP/MySQL API overview (current)
- Frontend integration summary
- Migration from SheetDB reference
- Legacy SheetDB documentation (deprecated)
- Endpoint reference table

**When to use:**
- Quick API reference
- Understanding migration path
- Comparing old vs new implementations

---

## Feature-Specific Documentation

### 6. **File Upload Feature** (`file-upload-feature-documentation.md`)
Complete guide to the document upload system.

**Contains:**
- Feature overview and architecture
- Frontend implementation (register.jsx, userpage.jsx)
- Backend PHP endpoints (upload.php, files.php)
- Database schema (pwd_file_uploads table)
- File validation rules
- Testing checklist
- Troubleshooting guide
- Admin file review features

**When to use:**
- Working with file uploads
- Debugging upload issues
- Understanding document workflow
- Implementing similar features

---

### 7. **QR Code Feature** (`qrcode-feature-documentation.md`)
Documentation for PWD ID card QR code generation.

**Contains:**
- Feature overview and implementation
- QRCodeSVG component usage
- Data structure and encoding
- Accessibility features
- Styling and customization
- Installation guide

**When to use:**
- Working with QR codes
- Understanding ID card system
- Implementing scannable features

---

## Technical Reference

### 9. **Backend Migration Documentation** (`backend-migration-documentation.md`)
Complete guide for SheetDB to PHP/MySQL migration.

**Contains:**
- Architecture comparison
- Project structure strategies
- XAMPP setup guide
- Database schema design
- PHP endpoint code samples
- React code modifications
- Testing procedures

**When to use:**
- Understanding migration decisions
- Learning backend integration
- Reference for similar migrations

---

### 10. **Backend Documentation** (`backend-documentation.md`)
Overview of backend migration progress.

**Contains:**
- Migration checklist
- Files changed reference
- Quick start commands
- API mode switching
- Key benefits

**When to use:**
- Quick migration reference
- Checking migration status

---

### 11. **UTF-8 Collation Fix** (`utf8-collation-fix.md`)
Documentation for character encoding issue resolution.

**Contains:**
- Problem description (login failures)
- Root cause analysis
- SQL fix scripts
- Verification procedures
- Prevention guidelines

**When to use:**
- Troubleshooting encoding issues
- Setting up new databases
- Understanding collation problems

---

### 12. **Contribution Guide** (`contribution_guide-documentation.md`)
Git workflow and collaboration best practices.

**Contains:**
- Creating feature branches
- Merging strategies
- Pull request workflow
- Merge conflict resolution
- Best practices for collaboration
- Troubleshooting

**When to use:**
- Creating new branches
- Resolving merge conflicts
- Making pull requests
- Team collaboration

---

### 13. **Documentation Reorganization** (`DOCUMENTATION-REORGANIZATION-COMPLETE.md`)
Summary of v2.0 documentation updates.

**Contains:**
- Phase-by-phase completion checklist
- Documentation statistics
- File structure overview
- Migration reference tables
- Deprecation tracking

**When to use:**
- Understanding documentation structure
- Tracking deprecated features
- Migration reference

---

## Quick Start Guide

### For New Developers

1. **Start Here:** Read `init-documentation.md` for project overview and setup
2. **Database Setup:** Follow `database-documentation.md` to create MySQL database
3. **Learn APIs:** Review `php-api-documentation.md` for backend endpoints
4. **Study Code:** Read `function-documentation.md` for React implementation patterns
5. **Git Workflow:** Check `contribution_guide-documentation.md` for collaboration

### For Feature Development

1. **Check Existing:** `function-documentation.md` - See if similar functionality exists
2. **Review Database:** `database-documentation.md` - Understand data structure
3. **Plan APIs:** `php-api-documentation.md` - Use established patterns
4. **Implement:** Follow conventions in `init-documentation.md`
5. **Document:** Update relevant documentation files

### For Bug Fixes

1. **Identify Component:** Use `function-documentation.md` index
2. **Check Database:** Review `database-documentation.md` for data issues
3. **Verify API:** Test with `php-api-documentation.md` examples
4. **Common Issues:** Check `utf8-collation-fix.md` for known problems

---

## Documentation by Feature

### Authentication (Login/Logout)
- **Database:** `database-documentation.md` → pwd_users & admin_users tables
- **API:** `php-api-documentation.md` → user-login.php, admin-login.php
- **Functions:** `function-documentation.md` → handleUserLogin(), handleAdminLogin()
- **Frontend:** login.jsx component

### Registration Form
- **Database:** `database-documentation.md` → pwd_users table schema
- **API:** `php-api-documentation.md` → register.php, check-email.php, check-regnumber.php
- **Functions:** `function-documentation.md` → Registration Functions (register.jsx)
- **Frontend:** register.jsx component

### File Upload System
- **Database:** `database-documentation.md` → pwd_file_uploads table
- **API:** `php-api-documentation.md` → upload.php, files.php, file-download.php
- **Feature Docs:** `file-upload-feature-documentation.md` → Complete guide
- **Functions:** `function-documentation.md` → File upload handlers
- **Frontend:** register.jsx, userpage.jsx components

### Admin Dashboard
- **Database:** `database-documentation.md` → All tables with relationships
- **API:** `php-api-documentation.md` → get-all-applications.php, update-application-status.php
- **Functions:** `function-documentation.md` → Admin Dashboard Functions
- **Frontend:** adminpage.jsx, adminverify.jsx components

### User Dashboard
- **Database:** `database-documentation.md` → pwd_users, pwd_file_uploads
- **API:** `php-api-documentation.md` → get-user-data.php, update-profile.php, files.php
- **Functions:** `function-documentation.md` → User Dashboard Functions
- **Frontend:** userpage.jsx component

### QR Code Feature
- **Feature Docs:** `qrcode-feature-documentation.md` → Complete guide
- **Frontend:** register-result.jsx, userpage.jsx components

### News System (Planned v2.1)
- **Status:** Not yet implemented
- **Frontend:** news.jsx (currently static content)

---

## Common Tasks

### How to add a new page/component?
**See:** `init-documentation.md` → Project Structure & Component Creation

### How to create a new API endpoint?
**See:** `php-api-documentation.md` → Endpoint examples + patterns

### How to add a database table?
**See:** `database-documentation.md` → Table Definitions + SQL examples

### How to make an API call from React?
**See:** `function-documentation.md` → API integration examples

### How to handle file uploads?
**See:** `file-upload-feature-documentation.md` → Complete implementation guide

### How to resolve merge conflicts?
**See:** `contribution_guide-documentation.md` → Conflict Resolution Guide

### How to fix login issues?
**See:** `utf8-collation-fix.md` → Common encoding problems

---

## Documentation Statistics

| Category | Files | Status |
|----------|-------|--------|
| Core Documentation | 5 | ✅ Complete |
| Feature Documentation | 3 | ✅ Complete |
| Technical Reference | 5 | ✅ Complete |
| **Total** | **13** | **Production Ready** |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v2.0 | Dec 13, 2025 | PHP/MySQL migration complete, comprehensive documentation overhaul |
| v1.5 | Dec 12, 2025 | File upload feature, QR codes, database documentation |
| v1.0 | Nov 2025 | React migration complete, SheetDB backend |
| v0.5 | Oct 2025 | Pre-React HTML/CSS/JS implementation |

---

## Learning Path

### Day 1-3: Setup & Basics
1. Read `init-documentation.md` (project overview)
2. Set up XAMPP + React environment
3. Run `database-documentation.md` SQL scripts
4. Test login with sample data

### Day 4-6: Understanding Backend
1. Study `database-documentation.md` (tables & relationships)
2. Review `php-api-documentation.md` (all endpoints)
3. Test APIs with Postman
4. Trace API calls in browser DevTools

### Day 7-9: Frontend Development
1. Study `function-documentation.md` (React patterns)
2. Explore registration flow (register.jsx)
3. Understand state management
4. Practice creating components

### Day 10-12: Advanced Features
1. Study `file-upload-feature-documentation.md`
2. Review `qrcode-feature-documentation.md`
3. Practice implementing similar features

---

## Need Help?

1. **Check documentation** - Search relevant files above
2. **Review examples** - All docs include code samples
3. **Check troubleshooting** - Most docs have troubleshooting sections
4. **Ask the team** - Use GitHub issues or pull request comments

---

**Last Updated:** December 14, 2025  
**Maintained by:** Development Team  
**Repository:** [PWD-Automated-Application-System](https://github.com/Keonbe/PWD-Automated-Application-System)

