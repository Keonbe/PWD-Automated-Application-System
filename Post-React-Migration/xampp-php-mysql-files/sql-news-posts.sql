-- ============================================
-- PWD News Posts Table Migration
-- Version: 1.0
-- Created: December 14, 2025
-- ============================================

USE PWDRegistry;

-- Drop table if exists (for clean reinstall)
-- DROP TABLE IF EXISTS pwd_news_posts;

-- Create news posts table
CREATE TABLE IF NOT EXISTS pwd_news_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Content fields
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Media
    image_path VARCHAR(500) DEFAULT NULL,
    image_alt VARCHAR(255) DEFAULT NULL,
    
    -- Publishing
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at DATETIME DEFAULT NULL,
    
    -- Categorization
    category VARCHAR(100) DEFAULT 'announcement',
    
    -- Tracking
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100) DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Analytics
    view_count INT DEFAULT 0,
    
    -- Indexing
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_created_at (created_at),
    INDEX idx_slug (slug)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample news posts (migrate current hardcoded data)
INSERT INTO pwd_news_posts 
    (title, excerpt, content, slug, image_path, image_alt, status, published_at, created_by, category) 
VALUES 
    (
        'New PWD Services Available',
        'The city government has launched new services for Persons with Disabilities, including free medical consultations and assistive device programs.',
        '<p>The city government has launched new services for Persons with Disabilities, including free medical consultations and assistive device programs.</p><p>These services are available at all barangay health centers and the main PWD affairs office. Eligible PWD ID holders can avail of the following:</p><ul><li>Free monthly medical consultations</li><li>Assistive device lending program</li><li>Priority lane services at government offices</li><li>Transportation assistance</li></ul><p>For more information, please visit the PWD Affairs Office or call (046) 416-0000.</p>',
        'new-pwd-services-available',
        NULL,
        'New PWD services announcement banner',
        'published',
        '2025-01-15 09:00:00',
        'admin@dasma.gov.ph',
        'announcement'
    ),
    (
        'Community Outreach Program',
        'Join us for the upcoming PWD community outreach program scheduled for next month. Activities include health screenings and skills workshops.',
        '<p>Join us for the upcoming PWD community outreach program scheduled for next month. Activities include health screenings and skills workshops.</p><p>The outreach program will be held at the Dasmariñas City Sports Complex on January 25, 2025, from 8:00 AM to 5:00 PM.</p><h3>Program Highlights:</h3><ul><li>Free health screenings (blood pressure, blood sugar, eye check-up)</li><li>Skills training workshops (computer literacy, handicraft making)</li><li>Job fair with PWD-friendly employers</li><li>Entertainment and raffle prizes</li></ul><p>Pre-registration is required. Please register at your barangay hall or online through this portal.</p>',
        'community-outreach-program',
        NULL,
        'Community outreach event banner',
        'published',
        '2025-01-10 10:30:00',
        'admin@dasma.gov.ph',
        'event'
    ),
    (
        'PWD ID Application Process Simplified',
        'Good news! The PWD ID application process has been streamlined. Learn about the new requirements and faster processing times.',
        '<p>Good news! The PWD ID application process has been streamlined. Learn about the new requirements and faster processing times.</p><p>Starting this month, we have simplified the PWD ID application process to serve you better:</p><h3>What''s New:</h3><ul><li>Online pre-registration now available</li><li>Reduced documentary requirements</li><li>Processing time reduced from 30 days to 7 days</li><li>Mobile registration units visiting barangays</li></ul><h3>New Requirements:</h3><ol><li>Valid government ID</li><li>Medical certificate or assessment from licensed physician</li><li>2x2 ID photo (white background)</li><li>Proof of residence</li></ol><p>Apply online through this portal or visit the PWD Affairs Office for assistance.</p>',
        'pwd-id-application-simplified',
        NULL,
        'PWD ID application process banner',
        'published',
        '2025-01-05 14:00:00',
        'admin@dasma.gov.ph',
        'announcement'
    ),
    (
        'Accessibility Improvements in Public Spaces',
        'The local government has completed accessibility improvements in major public areas, making them more PWD-friendly.',
        '<p>The local government has completed accessibility improvements in major public areas, making them more PWD-friendly.</p><p>We are proud to announce the completion of Phase 1 of our city-wide accessibility improvement project.</p><h3>Completed Improvements:</h3><ul><li>Wheelchair ramps at all government buildings</li><li>Tactile paving at major intersections</li><li>Accessible restrooms in public parks</li><li>Audio signals at pedestrian crossings</li><li>Reserved parking spaces with proper signage</li></ul><h3>Phase 2 Coming Soon:</h3><p>The next phase will focus on public transportation accessibility and additional improvements to commercial areas.</p><p>We welcome feedback from the PWD community. Please submit your suggestions through this portal or visit the PWD Affairs Office.</p>',
        'accessibility-improvements-public-spaces',
        NULL,
        'Accessibility improvements announcement banner',
        'published',
        '2025-01-01 08:00:00',
        'admin@dasma.gov.ph',
        'announcement'
    );

-- Verify insertion
SELECT COUNT(*) as total_posts FROM pwd_news_posts;

-- Show sample data
SELECT id, title, status, published_at, created_by, view_count 
FROM pwd_news_posts 
ORDER BY published_at DESC;
