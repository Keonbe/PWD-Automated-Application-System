-- ===============================================================
--    PWD AUTOMATED APPLICATION SYSTEM - MASTER SETUP SCRIPT
--    NOTE: CHRONOLOGICAL STEP-BY-STEP DATABASE CREATION    
-- ===============================================================
-- Description: Complete database setup for PWD Registry System
-- Version: 2.0
-- Date: December 12, 2025
-- Database: PWDRegistry
-- Charset: utf8mb4 (Unicode support)
-- Collation: utf8mb4_unicode_ci
--
-- INSTRUCTIONS:
-- 1. Open phpMyAdmin in your XAMPP installation
-- 2. Click on "SQL" tab
-- 3. Copy and paste this entire file
-- 4. Click "Go" to execute
-- 5. Verify that PWDRegistry database and tables were created
--
-- This script includes:
-- - Database creation with UTF-8 support
-- - Users tables (pwd_users with rejectionReason column, admin_users)
-- - File upload tables (pwd_file_uploads with admin review fields)
-- - Sample data for testing
-- - Indexes for performance
-- - Data sync for historical records
--
-- CHANGELOG for revamp DBv2:
-- - Added rejectionReason column to pwd_users table
-- - Added admin_notes, reviewed_by, reviewed_at to pwd_file_uploads
-- - Added sync script for historical data
-- - Updated sample data to match new schema
-- ===============================================================

-- ===============================================================
--              SECTION 1: DATABASE CREATION
-- ===============================================================

-- Drop database if exists (CAUTION: Use only for fresh install)
-- DROP DATABASE IF EXISTS PWDRegistry;

-- Create database with UTF-8 support
CREATE DATABASE IF NOT EXISTS PWDRegistry
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Switch to the new database
USE PWDRegistry;

-- ===============================================================
--              SECTION 2: MAIN TABLES CREATION
-- ===============================================================

-- ----------------------------------------------------------------
-- TABLE 1: pwd_users (PWD Registration and User Management)
-- TYPE: QUERY
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pwd_users (
    -- Primary Key
    id INT AUTO_INCREMENT PRIMARY KEY,
    regNumber VARCHAR(20) NOT NULL UNIQUE,
    
    -- Registration Info
    regDate DATE NOT NULL,
    
    -- Personal Information
    lastName VARCHAR(100) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    middleName VARCHAR(100),
    
    -- Disability Information
    disability VARCHAR(100) NOT NULL,
    
    -- Address
    street VARCHAR(200) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL DEFAULT 'Dasmariñas',
    province VARCHAR(100) NOT NULL DEFAULT 'Cavite',
    region VARCHAR(50) NOT NULL DEFAULT 'IV-A',
    
    -- Contact Information
    tel VARCHAR(20),
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    
    -- Personal Details
    dob DATE NOT NULL,
    sex VARCHAR(10) NOT NULL,
    nationality VARCHAR(50) NOT NULL DEFAULT 'Filipino',
    blood VARCHAR(5),
    civil VARCHAR(20) NOT NULL,
    
    -- Emergency Contact
    emergencyName VARCHAR(150) NOT NULL,
    emergencyPhone VARCHAR(20) NOT NULL,
    emergencyRelationship VARCHAR(50) NOT NULL,
    
    -- Document Proof (Legacy - kept for backward compatibility)
    proofIdentity VARCHAR(200),
    proofDisability VARCHAR(200),
    
    -- Authentication
    password VARCHAR(100) NOT NULL,
    
    -- Application Status and Rejection
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    rejectionReason TEXT DEFAULT NULL,
    
    -- Timestamps
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_status (status),
    INDEX idx_regDate (regDate),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- TABLE 2: admin_users (Admin Authentication)
-- TYPE: QUERY
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adminEmail VARCHAR(150) NOT NULL UNIQUE,
    adminPassword VARCHAR(255) NOT NULL,
    adminName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (adminEmail)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- TABLE 3: pwd_file_uploads (Document Upload Management)
-- TYPE: QUERY
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pwd_file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regNumber VARCHAR(20),
    file_type ENUM('medical_certificate', 'identity_proof', 'id_photo') NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP NULL,
    
    --- Indexes and Foreign Key to pwd_users for data integrity linking to regNumber
    FOREIGN KEY (regNumber) REFERENCES pwd_users(regNumber) ON DELETE CASCADE,
    INDEX idx_regNumber (regNumber),
    INDEX idx_status (status),
    INDEX idx_file_type (file_type),
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure file_type ENUM is consistent for all environments
-- After adding new file types i.e., new document categories(id_photo), run this command to update the ENUM
ALTER TABLE pwd_file_uploads MODIFY file_type ENUM('medical_certificate', 'identity_proof', 'id_photo') NOT NULL;

-- ===============================================================
--              SECTION 3: DEFAULT DATA INSERTION
-- ===============================================================

-- Insert default admin account
INSERT INTO admin_users (adminEmail, adminPassword, adminName) 
VALUES ('admin@dasma.gov.ph', 'admin123', 'System Administrator');

-- ===============================================================
--              SECTION 4: SAMPLE USER DATA (FOR TESTING)
-- ===============================================================
-- These are test users for development and testing purposes

-- User 1: Pending Application
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
) VALUES (
    '371771933783', '2025-12-10', 'De La Salle', 'John', 'Michael',
    'Visual Impairment', '123 Main St', 'Salitran', 'Dasmariñas', 'Cavite', 'IV-A',
    '046-123-4567', '09171234567', 'john.delasalle@email.com',
    '1990-01-15', 'Male', 'Filipino', 'O+', 'Single',
    'Maria De La Salle', '09189876543', 'Sister',
    'certificates/sample-medcert.png', 'identity/sample-id.png', 'password123', 'pending'
);

-- User 2: Pending Application
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
) VALUES (
    '409853541380', '2025-12-10', 'Montaigne', 'Michel', 'de',
    'Hearing Impairment', '456 Oak Ave', 'Poblacion', 'Dasmariñas', 'Cavite', 'IV-A',
    '046-234-5678', '09171234568', 'michel.montaigne@email.com',
    '1985-06-20', 'Male', 'Filipino', 'A+', 'Married',
    'Marie Montaigne', '09189876544', 'Spouse',
    'certificates/sample-medcert.png', 'identity/sample-id.png', 'password123', 'pending'
);

-- User 3: Pending Application
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
) VALUES (
    '863143528975', '2025-12-10', 'Ikari', 'Shinji', 'Yui',
    'Intellectual Disability', '789 Pine Rd', 'Fatima I', 'Dasmariñas', 'Cavite', 'IV-A',
    '046-345-6789', '09171234569', 'shinji.ikari@email.com',
    '1995-03-10', 'Male', 'Filipino', 'B+', 'Single',
    'Gendo Ikari', '09189876545', 'Father',
    'certificates/sample-medcert.png', 'identity/sample-id.png', 'password123', 'pending'
);

-- User 4: Accepted Application
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
) VALUES (
    '973821289541', '2025-12-08', 'Dela Cruz', 'Juan', 'Santos',
    'Mobility Impairment', '123 Main Street', 'Poblacion', 'Imus', 'Cavite', 'IV-A',
    '046-111-2222', '09123456790', 'juan.delacruz@email.com',
    '1990-05-15', 'Male', 'Filipino', 'O+', 'Married',
    'Maria Dela Cruz', '09123456791', 'Spouse',
    'certificates/sample-medcert.png', 'identity/sample-id.png', '12345678', 'accepted'
);

-- User 5: Denied Application
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status, rejectionReason
) VALUES (
    '973821289540', '2025-12-07', 'Karamazov', 'Ivan', 'Fyodor',
    'Learning Disability', 'b1 b2', 'sabang', 'dasma', 'cavite', 'iv a',
    '046-222-3333', '09123456789', 'ivan@email.com',
    '2000-09-04', 'Male', 'Filipino', 'A+', 'Single',
    'Keanu Oneal', '09123456789', 'Friend',
    'certificates/sample-medcert.png', 'identity/sample-id.png', '83185255', 'denied',
    'Incomplete or incorrect documents'
);

-- ===============================================================
-- SECTION 5: SAMPLE FILE UPLOAD DATA (WITH SECTION 4 SAMPLE DATA)
-- ===============================================================
-- Create sample file upload records for testing

-- Files for User 1 (371771933783)
INSERT INTO pwd_file_uploads (regNumber, file_type, original_filename, stored_filename, file_path, file_size, mime_type, status, uploaded_at)
VALUES 
('371771933783', 'medical_certificate', 'sample-medcert.png', 'medical_certificate_1765449167_xvnawj.png', 
 'uploads/certificates/medical_certificate_1765449167_xvnawj.png', 16766, 'image/webp', 'pending', '2025-12-11 18:32:47'),
('371771933783', 'identity_proof', 'sample-id.png', 'identity_proof_1765449167_ni2xrf.png', 
 'uploads/identity/identity_proof_1765449167_ni2xrf.png', 1006198, 'image/png', 'pending', '2025-12-11 18:32:47');

-- Files for User 2 (409853541380)
INSERT INTO pwd_file_uploads (regNumber, file_type, original_filename, stored_filename, file_path, file_size, mime_type, status, uploaded_at)
VALUES 
('409853541380', 'medical_certificate', 'sample-medcert.png', 'medical_certificate_1765448672_missing.png', 
 'uploads/certificates/medical_certificate_1765448672_missing.png', 16766, 'image/webp', 'pending', '2025-12-11 18:24:32'),
('409853541380', 'identity_proof', 'sample-id.png', 'identity_proof_1765448672_31ubyi.png', 
 'uploads/identity/identity_proof_1765448672_31ubyi.png', 1006198, 'image/png', 'pending', '2025-12-11 18:24:32');

-- Files for User 3 (863143528975)
INSERT INTO pwd_file_uploads (regNumber, file_type, original_filename, stored_filename, file_path, file_size, mime_type, status, uploaded_at)
VALUES 
('863143528975', 'medical_certificate', 'sample-medcert.png', 'medical_certificate_1765448853_dakfqj.png', 
 'uploads/certificates/medical_certificate_1765448853_dakfqj.png', 16766, 'image/webp', 'pending', '2025-12-11 18:27:33'),
('863143528975', 'identity_proof', 'sample-id.png', 'identity_proof_1765448853_9wibtq.png', 
 'uploads/identity/identity_proof_1765448853_9wibtq.png', 1006198, 'image/png', 'pending', '2025-12-11 18:27:33');

-- ===============================================================
--     SECTION 6: SYNC HISTORICAL DATA (FOR EXISTING DATABASES)
-- ===============================================================
-- This section syncs admin review data from pwd_users to pwd_file_uploads
-- NOTES: Only needed if you have existing data that was created before the admin review fields were added

-- Update pwd_file_uploads for all denied/rejected applications
-- that have rejection reasons in pwd_users but not in pwd_file_uploads
UPDATE pwd_file_uploads pf
INNER JOIN pwd_users pu ON pf.regNumber = pu.regNumber
SET 
    pf.status = CASE 
        WHEN pu.status = 'denied' THEN 'rejected'
        WHEN pu.status = 'accepted' THEN 'approved'
        ELSE pf.status
    END,
    pf.admin_notes = CASE 
        WHEN pu.status = 'denied' AND pu.rejectionReason IS NOT NULL 
        THEN pu.rejectionReason
        ELSE pf.admin_notes
    END,
    pf.reviewed_by = CASE 
        WHEN pu.status IN ('denied', 'accepted') AND pf.reviewed_by IS NULL 
        THEN 'System Administrator'
        ELSE pf.reviewed_by
    END,
    pf.reviewed_at = CASE 
        WHEN pu.status IN ('denied', 'accepted') AND pf.reviewed_at IS NULL 
        THEN pu.updatedAt
        ELSE pf.reviewed_at
    END
WHERE pu.status IN ('denied', 'accepted') 
  AND pf.reviewed_by IS NULL;

-- ===============================================================
--              SECTION 7: VERIFICATION QUERIES
-- ===============================================================
-- Run these queries to verify the setup was successful
-- NOTES: RUN THESE SQL QUERIES ON SECTION 7 UNDER THE "Server: 127.0.0.1 -> Database: pwdregistry"
-- ON TOP BAR, TO THE RIGHT OF LEFT PANEL WITH PHPMYADMIN LOGO. 
-- TO BE QUERIED NOT INSIDE TABLES BUT QUERIED UNDER THE DATABASE: "pwdregistry"

-- Check database charset
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'PWDRegistry';

-- Verify all tables were created
SHOW TABLES;

-- Count records in each table
SELECT 'pwd_users' as table_name, COUNT(*) as record_count FROM pwd_users
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'pwd_file_uploads', COUNT(*) FROM pwd_file_uploads;

-- View sample user data
SELECT regNumber, firstName, lastName, email, status, rejectionReason
FROM pwd_users 
ORDER BY regDate DESC;

-- View file upload summary with review status
SELECT u.regNumber, 
    CONCAT(u.firstName, ' ', u.lastName) as fullName,
    u.status as user_status,
    COUNT(f.id) as file_count,
    SUM(CASE WHEN f.status = 'approved' THEN 1 ELSE 0 END) as approved_files,
    SUM(CASE WHEN f.status = 'rejected' THEN 1 ELSE 0 END) as rejected_files,
    SUM(CASE WHEN f.status = 'pending' THEN 1 ELSE 0 END) as pending_files
FROM pwd_users u
LEFT JOIN pwd_file_uploads f ON u.regNumber = f.regNumber
GROUP BY u.regNumber, u.firstName, u.lastName, u.status
ORDER BY u.regDate DESC;

-- View file review details
SELECT pf.regNumber,
    CONCAT(pu.firstName, ' ', pu.lastName) as fullName,
    pf.file_type,
    pf.status as file_status,
    pf.admin_notes,
    pf.reviewed_by,
    pf.reviewed_at
FROM pwd_file_uploads pf
INNER JOIN pwd_users pu ON pf.regNumber = pu.regNumber
ORDER BY pf.regNumber, pf.file_type;

-- ===============================================================
--              SECTION 8: USEFUL MAINTENANCE QUERIES
-- ===============================================================

-- Get application statistics by status
-- SELECT status, COUNT(*) as count 
-- FROM pwd_users 
-- GROUP BY status;

-- Get recent applications (last 10)
-- SELECT regNumber, 
--        CONCAT(firstName, ' ', lastName) as fullName,
--        email, status, rejectionReason, createdAt
-- FROM pwd_users
-- ORDER BY createdAt DESC
-- LIMIT 10;

-- Get users with incomplete file uploads (less than 2 files)
-- SELECT u.regNumber, 
--        CONCAT(u.firstName, ' ', u.lastName) as fullName,
--        COUNT(f.id) as file_count
-- FROM pwd_users u
-- LEFT JOIN pwd_file_uploads f ON u.regNumber = f.regNumber
-- GROUP BY u.regNumber, u.firstName, u.lastName
-- HAVING COUNT(f.id) < 2;

-- Get denied applications with rejection reasons
-- SELECT regNumber,
--        CONCAT(firstName, ' ', lastName) as fullName,
--        email,
--        rejectionReason,
--        updatedAt as denied_at
-- FROM pwd_users
-- WHERE status = 'denied'
-- ORDER BY updatedAt DESC;

-- Get file upload statistics
-- SELECT 
--     file_type,
--     status,
--     COUNT(*) as count
-- FROM pwd_file_uploads
-- GROUP BY file_type, status
-- ORDER BY file_type, status;

-- ===============================================================
--              SECTION 9: UTF-8 COLLATION FIX (IF NEEDED)
-- ===============================================================
-- If you experience login authentication issues due to character encoding,
-- uncomment and run these commands to convert the database to UTF-8

-- ALTER DATABASE PWDRegistry 
-- CHARACTER SET utf8mb4 
-- COLLATE utf8mb4_unicode_ci;

-- ALTER TABLE pwd_users 
-- CONVERT TO CHARACTER SET utf8mb4 
-- COLLATE utf8mb4_unicode_ci;

-- ALTER TABLE admin_users 
-- CONVERT TO CHARACTER SET utf8mb4 
-- COLLATE utf8mb4_unicode_ci;

-- ALTER TABLE pwd_file_uploads 
-- CONVERT TO CHARACTER SET utf8mb4 
-- COLLATE utf8mb4_unicode_ci;

-- NOTE: After conversion, you may need to re-insert data if existing records
-- were stored with incorrect encoding. Clear tables with TRUNCATE and re-run
-- Sections 3, 4, and 5 to re-insert data with proper UTF-8 encoding.

-- ===============================================================
--                    SETUP COMPLETE
-- ===============================================================
-- Your PWD Automated Application System database is now ready!
-- 
-- Default Login Credentials:
-- Admin: admin@dasma.gov.ph / admin123
-- Test Users:
--   - john.delasalle@email.com / password123 (Pending)
--   - michel.montaigne@email.com / password123 (Pending)
--   - shinji.ikari@email.com / password123 (Pending)
--   - juan.delacruz@email.com / 12345678 (Accepted)
--   - ivan@email.com / 83185255 (Denied)
--
-- Database Features:
-- ✓ UTF-8 support for international characters
-- ✓ User registration and authentication
-- ✓ Admin authentication and review system
-- ✓ File upload management with admin review
-- ✓ Application status tracking with rejection reasons
-- ✓ Indexes for optimized query performance
--
-- Next Steps:
-- 1. Update admin password in production
-- 2. Create uploads directory structure (certificates, identity, thumbnails)
-- 3. Configure config.php with database credentials
-- 4. Test the application with fresh install or sync existing data
-- ===============================================================
