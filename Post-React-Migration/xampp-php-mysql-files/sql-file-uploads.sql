-- File Upload Feature SQL Script
-- Add this to PWDRegistry database to enable file upload functionality

-- Create pwd_file_uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS pwd_file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regNumber VARCHAR(50),
    file_type ENUM('medical_certificate', 'identity_proof'),
    original_filename VARCHAR(255),
    stored_filename VARCHAR(255),
    file_path VARCHAR(500),
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP NULL,
    
    FOREIGN KEY (regNumber) REFERENCES pwd_users(regNumber) ON DELETE CASCADE,
    INDEX idx_regNumber (regNumber),
    INDEX idx_status (status),
    INDEX idx_file_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add created_at column to pwd_users if missing
ALTER TABLE pwd_users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add index to pwd_users for faster lookup
ALTER TABLE pwd_users ADD INDEX idx_status (status);

-- Verify tables were created
SHOW TABLES LIKE 'pwd_file_uploads';
DESCRIBE pwd_file_uploads;
