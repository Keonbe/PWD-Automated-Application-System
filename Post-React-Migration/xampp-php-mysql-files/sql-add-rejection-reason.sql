-- Add rejectionReason column to pwd_users table
-- This allows storing the reason when an application is denied

USE PWDRegistry;

-- Add the rejectionReason column if it doesn't exist
ALTER TABLE pwd_users 
ADD COLUMN IF NOT EXISTS rejectionReason TEXT DEFAULT NULL 
AFTER status;

-- Optional: Add an index for faster queries on status
CREATE INDEX IF NOT EXISTS idx_status ON pwd_users(status);

-- Verify the change
DESCRIBE pwd_users;
