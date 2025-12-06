-- Drop database if exists (USE WITH CAUTION!)
-- DROP DATABASE IF EXISTS pwd_registry;

-- Database Creation

-- Create database
CREATE DATABASE PWDRegistry;
GO

USE PWDRegistry;
GO

-- NOTE: ALWAYS USE `USE [DatabaseName];` TO SWITCH TO THE CORRECT DATABASE CONTEXT BEFORE CREATING TABLES OR OTHER OBJECTS.

-- ===============================================================
-- TABLE 1: PWD_Registry (PWD Registration)
-- ===============================================================
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
);
GO

-- ===============================================================
-- TABLE 2: Admin_Users (Admin Authentication)
-- ===============================================================
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adminEmail VARCHAR(150) NOT NULL UNIQUE,
    adminPassword VARCHAR(255) NOT NULL,
    adminName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (change password in production!)
INSERT INTO admin_users (adminEmail, adminPassword, adminName) 
VALUES ('admin@dasma.gov.ph', 'admin123', 'System Administrator');



-- ===============================================================
--              STORED PROCEDURES FOR CRUD OPERATIONS
-- ===============================================================



-- ===============================================================
-- PROCEDURE 1: Create PWD Record (User Registration) [CREATE]
-- ===============================================================
    @regNumber VARCHAR(20),
    @regDate DATE,
    @lastName NVARCHAR(100),
    @firstName NVARCHAR(100),
    @middleName NVARCHAR(100),
    @disability NVARCHAR(100),
    @street NVARCHAR(200),
    @barangay NVARCHAR(100),
    @municipality NVARCHAR(100),
    @province NVARCHAR(100),
    @region NVARCHAR(50),
    @tel VARCHAR(20),
    @mobile VARCHAR(20),
    @email NVARCHAR(150),
    @dob DATE,
    @sex NVARCHAR(10),
    @nationality NVARCHAR(50),
    @blood NVARCHAR(5),
    @civil NVARCHAR(20),
    @emergencyName NVARCHAR(150),
    @emergencyPhone VARCHAR(20),
    @emergencyRelationship NVARCHAR(50),
    @proofIdentity NVARCHAR(200),
    @proofDisability NVARCHAR(200),
    @password NVARCHAR(100),
    @status NVARCHAR(20)
AS
BEGIN
    INSERT INTO PWD_Registry (
        regNumber, regDate, lastName, firstName, middleName, disability,
        street, barangay, municipality, province, region, tel, mobile, email,
        dob, sex, nationality, blood, civil, emergencyName, emergencyPhone,
        emergencyRelationship, proofIdentity, proofDisability, password, status
    )
    VALUES (
        @regNumber, @regDate, @lastName, @firstName, @middleName, @disability,
        @street, @barangay, @municipality, @province, @region, @tel, @mobile, @email,
        @dob, @sex, @nationality, @blood, @civil, @emergencyName, @emergencyPhone,
        @emergencyRelationship, @proofIdentity, @proofDisability, @password, @status
    );
END;
GO

-- ===============================================================
-- PROCEDURE 2: Get All Records [READ]
-- ===============================================================

-- ===============================================================
-- PROCEDURE 3: Get Record by Registration Number [READ]
-- ===============================================================

-- ===============================================================
-- PROCEDURE 4: Update Status Only (accepted, denied, pending) [UPDATE]
-- ===============================================================

-- ===============================================================
-- PROCEDURE 5: User Login (by email and password)
-- ===============================================================

-- ===============================================================
-- PROCEDURE 6: Admin Login (by email and password)
-- ===============================================================