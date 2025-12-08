# UTF-8 Collation Fix Documentation

## Problem Description

### Issue
Users were unable to log in with sample data or registered data, even with correct credentials.

### Root Cause
**Character Encoding and Collation Mismatch**

1. **phpMyAdmin Default**: Creates databases with `latin1_swedish_ci` collation by default
2. **React Application**: Sends form data encoded in UTF-8
3. **PHP MySQL Functions**: `LOWER()` and `TRIM()` normalize strings differently based on collation
4. **Result**: Email/password comparisons fail because the same text is encoded differently

### Technical Details

When a user enters `"test@email.com"` in the React form:
- **Frontend**: Encodes as UTF-8 → `test@email.com` (UTF-8 bytes)
- **Database**: Stored as `latin1_swedish_ci` → `test@email.com` (Latin-1 bytes)
- **PHP LOWER()**: Normalizes based on table collation (Latin-1)
- **Comparison**: UTF-8 input vs Latin-1 stored data = **MISMATCH** ❌

## Solution

***Following steps must be executed in phpMyAdmin or MySQL client to fix the collation issue. It is crucial to follow these steps in order to ensure the database and tables use the correct UTF-8 encoding.***
*Code are already in **sql-utf8-fix.sql**. This serves merely as a documentation*

### Step 1: Convert Database to UTF-8

Run the following SQL commands in phpMyAdmin:

```sql
-- Convert database
ALTER DATABASE PWDRegistry 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Convert pwd_users table
ALTER TABLE pwd_users 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Convert admin_users table
ALTER TABLE admin_users 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### Step 2: Clear and Re-insert Data

**IMPORTANT**: Existing data must be deleted and re-inserted because it was stored with incorrect encoding.

```sql
-- Clear existing data
TRUNCATE TABLE pwd_users;
TRUNCATE TABLE admin_users;

-- Re-insert admin
INSERT INTO admin_users (adminEmail, adminPassword, adminName) 
VALUES ('admin@dasma.gov.ph', 'admin123', 'System Administrator');
```

### Step 3: Re-insert Sample Data

Run the `sql-generate-data.sql` script to populate the database with sample users.

### Step 4: Verify PHP Connection

Ensure `config.php` includes the UTF-8 charset setting:

```php
$conn->set_charset("utf8mb4");
```

This line was already added to `config.php` and ensures all database connections use UTF-8 encoding.

## Verification

After applying the fix, verify the changes:

```sql
-- Check database collation
SHOW TABLE STATUS FROM PWDRegistry WHERE Name = 'pwd_users';

-- Check column collations
SHOW FULL COLUMNS FROM pwd_users;
```

Expected output:
- **Collation**: `utf8mb4_unicode_ci`
- **Character Set**: `utf8mb4`

## Testing

1. **Test Admin Login**:
   - Email: `admin@dasma.gov.ph`
   - Password: `admin123`

2. **Test User Login**:
   - Use credentials from `sql-generate-data.sql`
   - Verify email normalization works correctly

3. **Test Registration**:
   - Register a new user with special characters
   - Verify the user can log in immediately after registration

## Why This Happens

### phpMyAdmin Default Behavior
- phpMyAdmin uses MySQL server's default charset/collation
- Most MySQL installations default to `latin1_swedish_ci` for historical reasons
- This is incompatible with modern web applications using UTF-8

### Modern Web Standards
- All modern web applications use UTF-8 encoding
- React/JavaScript always sends UTF-8 encoded data
- UTF-8 supports all international characters and emojis

### The Fix
- `utf8mb4`: Full UTF-8 support (4-byte characters, includes emojis)
- `utf8mb4_unicode_ci`: Case-insensitive Unicode collation
- Ensures `LOWER()`, `TRIM()`, and string comparisons work correctly across PHP and JavaScript

## Files Modified

### New Files
- `sql-utf8-fix.sql` - Migration script for UTF-8 conversion

### Existing Files (Already Correct)
- `config.php` - Contains `$conn->set_charset("utf8mb4");`

## Prevention for Future Projects

When creating a new database in phpMyAdmin:

1. **During Creation**: Explicitly set collation to `utf8mb4_unicode_ci`
2. **In SQL Scripts**: Always specify charset/collation:
   ```sql
   CREATE DATABASE YourDatabase
   CHARACTER SET utf8mb4
   COLLATE utf8mb4_unicode_ci;
   ```
3. **In PHP**: Always include `$conn->set_charset("utf8mb4");`

## References

- [MySQL Character Set Support](https://dev.mysql.com/doc/refman/8.0/en/charset.html)
- [UTF-8 vs utf8mb4](https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-utf8mb4.html)
- [PHP MySQLi Character Set](https://www.php.net/manual/en/mysqli.set-charset.php)
