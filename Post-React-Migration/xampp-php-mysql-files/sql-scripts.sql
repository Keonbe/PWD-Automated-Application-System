-- Database Creation

-- Create database
CREATE DATABASE PWDRegistry;
GO

USE PWDRegistry;
GO

-- NOTE: ALWAYS USE `USE [DatabaseName];` TO SWITCH TO THE CORRECT DATABASE CONTEXT BEFORE CREATING TABLES OR OTHER OBJECTS.

-- Create main table
CREATE TABLE PWD_Registry (
    regNumber VARCHAR(20) PRIMARY KEY,
    regDate DATE NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    firstName NVARCHAR(100) NOT NULL,
    middleName NVARCHAR(100),
    disability NVARCHAR(100) NOT NULL,
    street NVARCHAR(200) NOT NULL,
    barangay NVARCHAR(100) NOT NULL,
    municipality NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    region NVARCHAR(50) NOT NULL,
    tel VARCHAR(20),
    mobile VARCHAR(20) NOT NULL,
    email NVARCHAR(150),
    dob DATE NOT NULL,
    sex NVARCHAR(10) NOT NULL,
    nationality NVARCHAR(50) NOT NULL,
    blood NVARCHAR(5),
    civil NVARCHAR(20) NOT NULL,
    emergencyName NVARCHAR(150) NOT NULL,
    emergencyPhone VARCHAR(20) NOT NULL,
    emergencyRelationship NVARCHAR(50) NOT NULL,
    proofIdentity NVARCHAR(200),
    proofDisability NVARCHAR(200),
    password NVARCHAR(100) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- <=============================================================>

-- CREATE PROCEDURE sp_CreatePWDRecord
-- Create Record
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

-- <=============================================================>

\