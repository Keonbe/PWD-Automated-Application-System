-- Drop database if exists (USE WITH CAUTION!)
-- DROP DATABASE IF EXISTS pwd_registry;

-- ===============================================================
--              DATABASE AND TABLE CREATION
-- ===============================================================
CREATE DATABASE PWDRegistry
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
GO

USE PWDRegistry;
GO
-- NOTE: ALWAYS USE `USE [DatabaseName];` TO SWITCH TO THE CORRECT DATABASE CONTEXT BEFORE CREATING TABLES OR OTHER OBJECTS.

-- ----------------------------------------------------------------
-- TABLE 1: PWD_Registry (PWD Registration)
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
    
    -- Document Proof
    proofIdentity VARCHAR(200),
    proofDisability VARCHAR(200),
    
    -- Authentication
    password VARCHAR(100) NOT NULL,
    
    -- Application Status (pending, accepted, denied)
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
GO

-- ----------------------------------------------------------------
-- TABLE 2: Admin_Users (Admin Authentication)
-- TYPE: QUERY
-- ----------------------------------------------------------------
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adminEmail VARCHAR(150) NOT NULL UNIQUE,
    adminPassword VARCHAR(255) NOT NULL,
    adminName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TYPE: QUERY
-- Insert default admin (change password in production!)
INSERT INTO admin_users (adminEmail, adminPassword, adminName) 
VALUES ('admin@dasma.gov.ph', 'admin123', 'System Administrator');


-- ===============================================================
--           SQL QUERIES (For phpMyAdmin Testing)
-- ===============================================================
-- These are plain SQL queries for testing the procedures above
-- Uncomment and modify values as needed for debugging
-- ===============================================================

-- ---------------------------------------------------------------
-- DEBUG 1: Create PWD User (Test Registration)
-- TYPE: QUERY
-- STATUS: WORKING
-- ---------------------------------------------------------------
INSERT INTO pwd_users (
    regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status
)
VALUES (
    'PWD2025001',                    -- regNumber
    '2025-12-07',                    -- regDate
    'Dela Cruz',                     -- lastName
    'Juan',                          -- firstName
    'Santos',                        -- middleName
    'Visual Impairment',             -- disability
    '123 Main St',                   -- street
    'Salitran',                      -- barangay
    'Dasmariñas',                    -- municipality
    'Cavite',                        -- province
    'IV-A',                          -- region
    '046-123-4567',                  -- tel
    '09171234567',                   -- mobile
    'juan.delacruz@email.com',       -- email
    '1990-01-15',                    -- dob
    'Male',                          -- sex
    'Filipino',                      -- nationality
    'O+',                            -- blood
    'Single',                        -- civil
    'Maria Dela Cruz',               -- emergencyName
    '09189876543',                   -- emergencyPhone
    'Sister',                        -- emergencyRelationship
    'valid_id.jpg',                  -- proofIdentity
    'medical_cert.jpg',              -- proofDisability
    'password123',                   -- password
    'pending'                        -- status
);

-- Check if insert was successful
SELECT * FROM pwd_users WHERE regNumber = 'PWD2025001';


-- ---------------------------------------------------------------
-- DEBUG 2: Check Registration Number Exists
-- TYPE: QUERY
-- STATUS: NEGATIVE
-- ---------------------------------------------------------------
SELECT COUNT(*) as exists_count
FROM pwd_users
WHERE regNumber = 'PWD2025001';



-- ---------------------------------------------------------------
-- DEBUG 3: Check Email Exists
-- TYPE: QUERY
-- STATUS: WORKING
-- ---------------------------------------------------------------
SELECT COUNT(*) as exists_count, email
FROM pwd_users
WHERE email = 'juan.delacruz@email.com';


-- ---------------------------------------------------------------
-- DEBUG 4: Get All PWD Records
-- TYPE: QUERY
-- STATUS: WORKING
-- ---------------------------------------------------------------
SELECT 
    id, regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, status,
    createdAt, updatedAt
FROM pwd_users
ORDER BY createdAt DESC;


-- ---------------------------------------------------------------
-- DEBUG 5: Get User by Registration Number
-- TYPE: QUERY
-- STATUS: WORKING
-- ---------------------------------------------------------------
SELECT 
    id, regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, password, status,
    createdAt, updatedAt
FROM pwd_users
WHERE regNumber = 'PWD2025001'
LIMIT 1;


-- ---------------------------------------------------------------
-- DEBUG 6: Get Pending Applicants
-- TYPE: QUERY
-- STATUS: WORKING
-- ---------------------------------------------------------------
SELECT 
    id, regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, status,
    createdAt, updatedAt
FROM pwd_users
WHERE status = 'pending'
ORDER BY createdAt ASC;


-- ---------------------------------------------------------------
-- DEBUG 7: Update Status by Email
-- TYPE: QUERY
-- STATUS: UNTESTED
-- ---------------------------------------------------------------
UPDATE pwd_users
SET status = 'accepted',
    updatedAt = CURRENT_TIMESTAMP
WHERE email = 'juan.delacruz@email.com';

-- Verify update
SELECT regNumber, email, status, updatedAt 
FROM pwd_users 
WHERE email = 'juan.delacruz@email.com';


-- ---------------------------------------------------------------
-- DEBUG 8: User Login Authentication
-- TYPE: QUERY
-- STATUS: UNTESTED
-- ---------------------------------------------------------------
SELECT 
    id, regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, status,
    createdAt, updatedAt
FROM pwd_users
WHERE email = 'juan.delacruz@email.com' AND password = 'password123'
LIMIT 1;


-- ---------------------------------------------------------------
-- DEBUG 9: Admin Login Authentication
-- TYPE: QUERY
-- STATUS: UNTESTED
-- ---------------------------------------------------------------
SELECT 
    id, adminEmail, adminName, createdAt
FROM admin_users
WHERE adminEmail = 'admin@dasma.gov.ph' AND adminPassword = 'admin123'
LIMIT 1;


-- ---------------------------------------------------------------
-- DEBUG 10: Get Applications by Status
-- TYPE: QUERY
-- STATUS: WORKING
-- ---------------------------------------------------------------
-- Get all accepted applications
SELECT 
    id, regNumber, regDate, lastName, firstName, middleName, disability,
    street, barangay, municipality, province, region, tel, mobile, email,
    dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
    emergencyRelationship, proofIdentity, proofDisability, status,
    createdAt, updatedAt
FROM pwd_users
WHERE status = 'accepted'
ORDER BY createdAt DESC;

-- Get all denied applications
-- Change 'accepted' to 'denied' or 'pending' as needed


-- ---------------------------------------------------------------
-- Additional Debug Queries
-- ---------------------------------------------------------------
-- <Count applications by status>
SELECT status, COUNT(*) as count FROM pwd_users GROUP BY status;

-- <Get recent applications (last 10)>
SELECT 
    regNumber, 
    CONCAT(firstName, ' ', lastName) as fullName,
    email,
    status,
    createdAt
FROM pwd_users
ORDER BY createdAt DESC
LIMIT 10;

-- <Delete test record (USE WITH CAUTION!)>
DELETE FROM pwd_users WHERE regNumber = 'enter_test_regNumber_here';



-- ===============================================================
--              STORED PROCEDURES FOR CRUD OPERATIONS
-- ===============================================================
-- Note: These procedures map to frontend API operations from:
-- - registrationApi.js: submitRegistration, checkEmailExists
-- - register.jsx: handleFormSubmit
-- - userApi.js: getCurrentUserData
-- - login.jsx: handleUserLogin, handleAdminLogin
-- - adminverify.jsx: fetchOldestPending, updateStatus
-- - statuschart.jsx: fetchData (all records)
-- NOTE: I am not sure if phpmyadmin uses stored procedures the same way as normal SQL queries. Refer to Line:332-- ===============================================================

-- ---------------------------------------------------------------
-- PROCEDURE 1: Create PWD Record (User Registration) [CREATE]
-- Used by: registrationApi.js -> submitRegistration()
-- Method: POST to register.php
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_CreatePWDUser(
    IN p_regNumber VARCHAR(20),
    IN p_regDate DATE,
    IN p_lastName VARCHAR(100),
    IN p_firstName VARCHAR(100),
    IN p_middleName VARCHAR(100),
    IN p_disability VARCHAR(100),
    IN p_street VARCHAR(200),
    IN p_barangay VARCHAR(100),
    IN p_municipality VARCHAR(100),
    IN p_province VARCHAR(100),
    IN p_region VARCHAR(50),
    IN p_tel VARCHAR(20),
    IN p_mobile VARCHAR(20),
    IN p_email VARCHAR(150),
    IN p_dob DATE,
    IN p_sex VARCHAR(10),
    IN p_nationality VARCHAR(50),
    IN p_blood VARCHAR(5),
    IN p_civil VARCHAR(20),
    IN p_emergencyName VARCHAR(150),
    IN p_emergencyPhone VARCHAR(20),
    IN p_emergencyRelationship VARCHAR(50),
    IN p_proofIdentity VARCHAR(200),
    IN p_proofDisability VARCHAR(200),
    IN p_password VARCHAR(100),
    IN p_status VARCHAR(20)
)
BEGIN
    INSERT INTO pwd_users (
        regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, password, status
    )
    VALUES (
        p_regNumber, p_regDate, p_lastName, p_firstName, p_middleName, p_disability,
        p_street, p_barangay, p_municipality, p_province, p_region, p_tel, p_mobile, p_email,
        p_dob, p_sex, p_nationality, p_blood, p_civil, p_emergencyName, p_emergencyPhone,
        p_emergencyRelationship, p_proofIdentity, p_proofDisability, p_password, p_status
    );
    
    SELECT LAST_INSERT_ID() as id, 'User registered successfully' as message;
END

-- ----------------------------------------------------------------
-- PROCEDURE 2: Check Registration Number Exists [READ]
-- Used by: registrationApi.js -> submitRegistration() (duplicate check)
-- Method: GET to check-regnumber.php
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_CheckRegNumberExists(
    IN p_regNumber VARCHAR(20)
)
BEGIN
    SELECT COUNT(*) as exists_count
    FROM pwd_users
    WHERE regNumber = p_regNumber;
END

-- ----------------------------------------------------------------
-- PROCEDURE 3: Check Email Exists [READ]
-- Used by: registrationApi.js -> checkEmailExists()
-- Method: GET to check-email.php
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_CheckEmailExists(
    IN p_email VARCHAR(150)
)
BEGIN
    SELECT COUNT(*) as exists_count, email
    FROM pwd_users
    WHERE email = p_email;
END

-- ----------------------------------------------------------------
-- PROCEDURE 4: Get All PWD Records [READ]
-- Used by: statuschart.jsx -> fetchData() (for chart statistics)
-- Method: GET to applications.php
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_GetAllPWDUsers()
BEGIN
    SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, status,
        createdAt, updatedAt
    FROM pwd_users
    ORDER BY createdAt DESC;
END

-- ----------------------------------------------------------------
-- PROCEDURE 5: Get User by Registration Number [READ]
-- Used by: userApi.js -> getCurrentUserData()
-- Method: GET to user.php?regNumber=XXX
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_GetUserByRegNumber(
    IN p_regNumber VARCHAR(20)
)
BEGIN
    SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, password, status,
        createdAt, updatedAt
    FROM pwd_users
    WHERE regNumber = p_regNumber
    LIMIT 1;
END

-- ----------------------------------------------------------------
-- PROCEDURE 6: Get Pending Applicants [READ]
-- Used by: adminverify.jsx -> fetchOldestPending()
-- Method: GET to applications.php?status=pending
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_GetPendingApplicants()
BEGIN
    SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, status,
        createdAt, updatedAt
    FROM pwd_users
    WHERE status = 'pending'
    ORDER BY createdAt ASC;
END

-- ----------------------------------------------------------------
-- PROCEDURE 7: Update Status by Email [UPDATE]
-- Used by: adminverify.jsx -> updateStatus()
-- Method: PATCH to update-status.php\
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_UpdateStatusByEmail(
    IN p_email VARCHAR(150),
    IN p_status VARCHAR(20)
)
BEGIN
    UPDATE pwd_users
    SET status = p_status,
        updatedAt = CURRENT_TIMESTAMP
    WHERE email = p_email;
    
    SELECT ROW_COUNT() as affected_rows, 'Status updated successfully' as message;
END

-- ----------------------------------------------------------------
-- PROCEDURE 8: User Login Authentication [READ]
-- Used by: login.jsx -> handleUserLogin()
-- Method: POST to login.php
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_UserLogin(
    IN p_email VARCHAR(150),
    IN p_password VARCHAR(100)
)
BEGIN
    SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, status,
        createdAt, updatedAt
    FROM pwd_users
    WHERE email = p_email AND password = p_password
    LIMIT 1;
END

-- ----------------------------------------------------------------
-- PROCEDURE 9: Admin Login Authentication [READ]
-- Used by: login.jsx -> handleAdminLogin()
-- Method: POST to admin-login.php
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_AdminLogin(
    IN p_adminEmail VARCHAR(150),
    IN p_adminPassword VARCHAR(255)
)
BEGIN
    SELECT 
        id, adminEmail, adminName, createdAt
    FROM admin_users
    WHERE adminEmail = p_adminEmail AND adminPassword = p_adminPassword
    LIMIT 1;
END

-- ----------------------------------------------------------------
-- PROCEDURE 10: Get Applications by Status [READ]
-- Used by: Multiple components for filtering applications
-- Method: GET to applications.php?status=XXX
-- TYPE: PROCEDURE
-- ----------------------------------------------------------------
CREATE PROCEDURE sp_GetApplicationsByStatus(
    IN p_status VARCHAR(20)
)
BEGIN
    SELECT 
        id, regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, status,
        createdAt, updatedAt
    FROM pwd_users
    WHERE status = p_status
    ORDER BY createdAt DESC;
END