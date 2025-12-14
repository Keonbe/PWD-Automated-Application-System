-- ===============================================================
--  Sync Admin Review Data from pwd_users to pwd_file_uploads
-- ===============================================================
-- This script syncs historical rejection reasons from pwd_users
-- to pwd_file_uploads for records that were denied before the fix
-- ===============================================================

USE PWDRegistry;

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

-- Display results after sync
SELECT 
    'After Sync - Updated Records' AS info,
    COUNT(*) AS total_synced
FROM pwd_file_uploads 
WHERE reviewed_by IS NOT NULL;

-- Show sample synced records
SELECT 
    id, regNumber, file_type, status, admin_notes, reviewed_by, reviewed_at 
FROM pwd_file_uploads 
WHERE reviewed_by IS NOT NULL
ORDER BY regNumber, file_type
LIMIT 20;

-- Verification: Show any remaining records that might need attention
SELECT 
    'Records Needing Attention' AS info,
    pf.regNumber, 
    pu.status AS user_status,
    pf.status AS file_status,
    pu.rejectionReason,
    pf.admin_notes,
    pf.reviewed_by
FROM pwd_file_uploads pf
INNER JOIN pwd_users pu ON pf.regNumber = pu.regNumber
WHERE pu.status IN ('denied', 'accepted') 
  AND pf.reviewed_by IS NULL
LIMIT 10;
