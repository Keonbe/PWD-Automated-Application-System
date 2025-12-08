-- ===============================================================
--        UTF-8 COLLATION FIX FOR PWDRegistry DATABASE
-- ===============================================================
-- ISSUE: Database was using latin1_swedish_ci by default while
--        React forms send UTF-8 encoded data, causing login
--        authentication failures due to character encoding mismatch.
--
-- SOLUTION: Convert database and tables to utf8mb4 with
--           utf8mb4_unicode_ci collation to match application encoding.
-- EXECUTE THIS QUERY IN phpMyAdmin OR MySQL CLIENT
-- ===============================================================

-- Step 1: Convert the entire database to UTF-8
ALTER DATABASE PWDRegistry 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Step 2: Convert pwd_users table to UTF-8
ALTER TABLE pwd_users 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Step 3: Convert admin_users table to UTF-8
ALTER TABLE admin_users 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- NOTE: If any other tables exist, repeat the ALTER TABLE command to CONVERT into the unicode, for those future tables as well to ensure full database consistency.

-- ===============================================================
--     IMPORTANT: RE-INSERT SAMPLE DATA AFTER CONVERSION
-- ===============================================================
-- After running the above ALTER commands, it is a MUST TO:
-- 1. Delete all existing data from pwd_users and admin_users (During testing, only data inserted with latin1, which is from PhpMyAdmin will fail login, so that is only data to be removed)
-- 2. Re-insert sample data using sql-generate-data.sql (to ensure UTF-8 encoding)
-- 3. Test login with the newly inserted data
--
-- This is necessary because existing data may have been stored
-- with incorrect encoding and needs to be re-inserted with
-- proper UTF-8 encoding.
-- ===============================================================

-- Optional: Verify the conversion
-- Run these queries to confirm the changes:
SHOW TABLE STATUS FROM PWDRegistry WHERE Name = 'pwd_users';
SHOW TABLE STATUS FROM PWDRegistry WHERE Name = 'admin_users';
SHOW FULL COLUMNS FROM pwd_users;

-- Expected results should show:
-- - Collation: utf8mb4_unicode_ci
-- - Character Set: utf8mb4

-- ===============================================================
--              CLEANUP AND REINSERTION COMMANDS
-- ===============================================================
-- Run these after the ALTER commands above:
-- Clear existing data (CAUTION: This deletes all records!)
TRUNCATE TABLE pwd_users;
TRUNCATE TABLE admin_users;

-- Re-insert admin user for admin_table
INSERT INTO admin_users (adminEmail, adminPassword, adminName) 
VALUES ('admin@dasma.gov.ph', 'admin123', 'System Administrator');

-- You can now RUN sql-generate-data.sql TO INSERT SAMPLE USERS for user_table

