# File Upload Feature Documentation

## Overview

The PWD Automated Application System includes a file upload feature that allows users to submit required documents (Identity Proof and Medical Certificate) during registration and view their uploaded files in the user dashboard. Files are validated on the frontend, uploaded to the server after successful registration, and stored with proper database relationships.

---

## For Collaborators: Getting Started

### Prerequisites

Before working with this feature, ensure you have:
- XAMPP installed with Apache + MySQL running
- Node.js (v16 or higher) and npm installed
- The React project cloned locally
- MySQL database `PWDRegistry` created

### Installation

After cloning the repository, set up the file upload feature:

```bash
# Navigate to the React project directory
cd Post-React-Migration/pwd-application-system

# Install all dependencies
npm install
```

### Database Setup

Create the file uploads table by running the SQL migration:

```bash
# Option A: Using MySQL command line
mysql -u root PWDRegistry < ../xampp-php-mysql-files/sql-file-uploads.sql

# Option B: Using phpMyAdmin
1. Open http://localhost/phpmyadmin
2. Select PWDRegistry database
3. Go to SQL tab
4. Paste content from sql-file-uploads.sql
5. Execute
```

### Directory Setup

Verify upload directories exist:

```
xampp-php-mysql-files/
├── uploads/
│   ├── certificates/   (medical certificates)
│   ├── identity/       (government IDs)
│   └── thumbnails/     (future: resized images)
```

If not created, run in PowerShell:
```powershell
mkdir "xampp-php-mysql-files/uploads/certificates"
mkdir "xampp-php-mysql-files/uploads/identity"
mkdir "xampp-php-mysql-files/uploads/thumbnails"
```

---

## Feature Locations

The file upload feature is implemented in three locations:

| Location | File | Purpose |
|----------|------|---------|
| Registration | `src/pages/homepage/register.jsx` | Upload documents during registration |
| User Dashboard | `src/pages/userpage/userpage.jsx` | View uploaded files in "My Documents" |
| PHP Backend | `xampp-php-mysql-files/api/` | Handle upload, retrieval, and download |

---

## How It Works

### Upload Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FILE UPLOAD FLOW                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. USER SELECTS FILE                                                        │
│     └─► handleFileSelect() validates file (size ≤5MB, type PDF/JPG/PNG)     │
│         └─► Shows "Ready: filename" ✓                                        │
│         └─► File stored in memory (NOT uploaded yet)                         │
│                                                                              │
│  2. USER SUBMITS REGISTRATION                                                │
│     └─► handleFormSubmit() sends form data to registration API               │
│         └─► API creates user and returns regNumber (e.g., PWD-2024-00001)   │
│                                                                              │
│  3. AFTER REGISTRATION SUCCESS                                               │
│     └─► uploadFileToServer() uploads each file WITH regNumber               │
│         └─► Files saved to uploads/identity/ or uploads/certificates/        │
│         └─► Database records created with proper foreign key                 │
│                                                                              │
│  4. USER REDIRECTED TO RESULT PAGE                                           │
│     └─► Files now visible in "My Documents" section of dashboard            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why this approach?**
- Files are linked to users via `regNumber` foreign key
- No orphan files from abandoned registrations
- Database integrity maintained

---

## Frontend Implementation

### 1. State Management (register.jsx)

```jsx
// State for selected files (stored in memory until registration succeeds)
const [selectedFiles, setSelectedFiles] = useState({
  identityProof: null,
  medicalCertificate: null
});

// State for file validation feedback
const [fileValidation, setFileValidation] = useState({
  identityProof: { valid: false, message: '' },
  medicalCertificate: { valid: false, message: '' }
});
```

### 2. File Validation Function

```jsx
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const handleFileSelect = (file, fileType) => {
  // Validate file size
  if (file.size > MAX_SIZE) {
    setFileValidation(prev => ({
      ...prev,
      [fileType]: { valid: false, message: 'File too large (max 5MB)' }
    }));
    return;
  }
  
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    setFileValidation(prev => ({
      ...prev,
      [fileType]: { valid: false, message: 'Only PDF, JPG, PNG allowed' }
    }));
    return;
  }
  
  // Store file in memory and show success
  setSelectedFiles(prev => ({ ...prev, [fileType]: file }));
  setFileValidation(prev => ({
    ...prev,
    [fileType]: { valid: true, message: `Ready: ${file.name}` }
  }));
};
```

### 3. Upload Function

```jsx
const uploadFileToServer = async (file, fileType, regNumber) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', fileType);
  formData.append('regNumber', regNumber);
  
  try {
    const response = await fetch(
      'http://localhost/webdev_finals/.../api/upload.php',
      {
        method: 'POST',
        body: formData
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
};
```

### 4. Form Submit Handler (relevant portion)

```jsx
const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Submit registration form first
  const registrationResult = await registerUser(formData);
  
  if (registrationResult.success) {
    const regNumber = registrationResult.regNumber;
    
    // 2. Upload files AFTER registration succeeds
    if (selectedFiles.identityProof) {
      await uploadFileToServer(
        selectedFiles.identityProof,
        'identity_proof',
        regNumber
      );
    }
    
    if (selectedFiles.medicalCertificate) {
      await uploadFileToServer(
        selectedFiles.medicalCertificate,
        'medical_certificate',
        regNumber
      );
    }
    
    // 3. Redirect to success page
    navigate('/register-result', { state: registrationResult });
  }
};
```

---

## User Dashboard: My Documents

### State and Effect Hook (userpage.jsx)

```jsx
const [userFiles, setUserFiles] = useState([]);

// Fetch files when userData loads
useEffect(() => {
  if (userData?.regNumber) {
    fetchUserFiles(userData.regNumber);
  }
}, [userData]);

const fetchUserFiles = async (regNumber) => {
  try {
    const response = await fetch(
      `http://localhost/webdev_finals/.../api/files.php?regNumber=${regNumber}`
    );
    const data = await response.json();
    if (data.success) {
      setUserFiles(data.files);
    }
  } catch (error) {
    console.error('Error fetching files:', error);
  }
};
```

### Navigation Section (activeNav === 4)

```jsx
{activeNav === 4 && (
  <div className="user-documents-section">
    <h3>My Documents</h3>
    
    {/* Upload Status Summary */}
    <div className="upload-summary">
      <span className="badge bg-secondary">Total: {userFiles.length}</span>
      <span className="badge bg-success">
        Approved: {userFiles.filter(f => f.status === 'approved').length}
      </span>
      <span className="badge bg-warning">
        Pending: {userFiles.filter(f => f.status === 'pending').length}
      </span>
      <span className="badge bg-danger">
        Rejected: {userFiles.filter(f => f.status === 'rejected').length}
      </span>
    </div>
    
    {/* Documents Table */}
    <table className="table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Filename</th>
          <th>Size</th>
          <th>Status</th>
          <th>Upload Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {userFiles.map(file => (
          <tr key={file.id}>
            <td>{file.type === 'identity_proof' ? 'ID Proof' : 'Medical Cert'}</td>
            <td>{file.originalFilename}</td>
            <td>{formatFileSize(file.size)}</td>
            <td>
              <span className={`badge bg-${getStatusColor(file.status)}`}>
                {file.status}
              </span>
            </td>
            <td>{formatDate(file.uploadedAt)}</td>
            <td>
              <a href={`/api/file-download.php?fileId=${file.id}`}>
                Download
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
```

---

## Backend Implementation (PHP)

### 1. Upload Endpoint (upload.php)

```php
<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config.php';

// Constants
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_TYPES', ['application/pdf', 'image/jpeg', 'image/png']);
define('UPLOAD_DIR', __DIR__ . '/../uploads/');

// Validate file
function validateFile($file) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['valid' => false, 'error' => 'Upload error: ' . $file['error']];
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['valid' => false, 'error' => 'File too large (max 5MB)'];
    }
    
    // Get actual MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime, ALLOWED_TYPES)) {
        return ['valid' => false, 'error' => 'Invalid file type. Only PDF, JPG, PNG allowed'];
    }
    
    return ['valid' => true, 'mime' => $mime];
}

// Main upload logic
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $file = $_FILES['file'] ?? null;
    $fileType = $_POST['fileType'] ?? '';
    $regNumber = $_POST['regNumber'] ?? null;
    
    if (!$file || !$fileType) {
        echo json_encode(['success' => false, 'error' => 'Missing file or file type']);
        exit;
    }
    
    // Validate
    $validation = validateFile($file);
    if (!$validation['valid']) {
        echo json_encode(['success' => false, 'error' => $validation['error']]);
        exit;
    }
    
    // Determine subdirectory
    $subdir = ($fileType === 'medical_certificate') ? 'certificates' : 'identity';
    $targetDir = UPLOAD_DIR . $subdir . '/';
    
    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $storedFilename = $fileType . '_' . time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $targetPath = $targetDir . $storedFilename;
    
    // Move file
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode(['success' => false, 'error' => 'Failed to save file']);
        exit;
    }
    
    // Save to database
    $relativePath = 'uploads/' . $subdir . '/' . $storedFilename;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $pdo->prepare("
            INSERT INTO pwd_file_uploads 
            (regNumber, file_type, original_filename, stored_filename, file_path, file_size, mime_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $regNumber,
            $fileType,
            $file['name'],
            $storedFilename,
            $relativePath,
            $file['size'],
            $validation['mime']
        ]);
        
        $fileId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'fileId' => $fileId,
            'filename' => $storedFilename,
            'filePath' => $relativePath,
            'size' => $file['size'],
            'message' => 'File uploaded successfully'
        ]);
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
```

### 2. Get Files Endpoint (files.php)

```php
<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';

$regNumber = $_GET['regNumber'] ?? '';

if (empty($regNumber)) {
    echo json_encode(['success' => false, 'error' => 'Missing regNumber']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("
        SELECT id, file_type as type, original_filename as originalFilename, 
               stored_filename as storedFilename, file_path as path, 
               file_size as size, status, uploaded_at as uploadedAt
        FROM pwd_file_uploads
        WHERE regNumber = ?
        ORDER BY uploaded_at DESC
    ");
    
    $stmt->execute([$regNumber]);
    $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'files' => $files]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
```

### 3. Download Endpoint (file-download.php)

```php
<?php
header('Access-Control-Allow-Origin: http://localhost:3000');

require_once __DIR__ . '/../config.php';

$fileId = $_GET['fileId'] ?? '';

if (empty($fileId)) {
    http_response_code(400);
    echo 'Missing fileId';
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT original_filename, file_path, mime_type FROM pwd_file_uploads WHERE id = ?");
    $stmt->execute([$fileId]);
    $file = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$file) {
        http_response_code(404);
        echo 'File not found';
        exit;
    }
    
    $fullPath = __DIR__ . '/../' . $file['file_path'];
    
    if (!file_exists($fullPath)) {
        http_response_code(404);
        echo 'File not found on disk';
        exit;
    }
    
    header('Content-Type: ' . $file['mime_type']);
    header('Content-Disposition: attachment; filename="' . $file['original_filename'] . '"');
    header('Content-Length: ' . filesize($fullPath));
    
    readfile($fullPath);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Database error';
}
?>
```

---

## Database Schema

### Table: pwd_file_uploads

```sql
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
```

### Column Descriptions

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Auto-increment primary key |
| `regNumber` | VARCHAR(50) | Foreign key to pwd_users.regNumber |
| `file_type` | ENUM | Either 'medical_certificate' or 'identity_proof' |
| `original_filename` | VARCHAR(255) | User's original filename |
| `stored_filename` | VARCHAR(255) | Server-generated unique filename |
| `file_path` | VARCHAR(500) | Relative path to file on disk |
| `file_size` | INT | File size in bytes |
| `mime_type` | VARCHAR(100) | MIME type (e.g., 'application/pdf') |
| `uploaded_at` | TIMESTAMP | When file was uploaded |
| `status` | ENUM | 'pending', 'approved', or 'rejected' |
| `admin_notes` | TEXT | Admin feedback (for rejections) |
| `reviewed_by` | VARCHAR(100) | Admin who reviewed the file |
| `reviewed_at` | TIMESTAMP | When file was reviewed |

---

## API Endpoints Reference

### Upload File

```
POST /api/upload.php

Form Data:
- file: (binary file content)
- fileType: 'identity_proof' or 'medical_certificate'
- regNumber: 'PWD-2024-00001'

Success Response:
{
  "success": true,
  "fileId": 123,
  "filename": "identity_proof_1702251234_abc123.jpg",
  "filePath": "uploads/identity/identity_proof_1702251234_abc123.jpg",
  "size": 245670,
  "message": "File uploaded successfully"
}

Error Response:
{
  "success": false,
  "error": "File too large (max 5MB)"
}
```

### Get User Files

```
GET /api/files.php?regNumber=PWD-2024-00001

Success Response:
{
  "success": true,
  "files": [
    {
      "id": 1,
      "type": "identity_proof",
      "originalFilename": "ID_card.jpg",
      "storedFilename": "identity_proof_1702251234_abc123.jpg",
      "path": "uploads/identity/identity_proof_1702251234_abc123.jpg",
      "size": 245670,
      "status": "pending",
      "uploadedAt": "2024-12-11 10:30:45"
    }
  ]
}
```

### Download File

```
GET /api/file-download.php?fileId=123

Response: Binary file with headers:
- Content-Type: application/pdf (or image/jpeg, etc.)
- Content-Disposition: attachment; filename="original_filename.pdf"
```

---

## File Validation Rules

### Frontend Validation

| Rule | Value | Error Message |
|------|-------|---------------|
| Max Size | 5MB | "File too large (max 5MB)" |
| Allowed Types | PDF, JPG, PNG | "Only PDF, JPG, PNG allowed" |

### Backend Validation

| Rule | Implementation | Purpose |
|------|----------------|---------|
| Size Check | `$file['size'] > MAX_FILE_SIZE` | Prevent large uploads |
| MIME Check | `finfo_file()` | Verify actual file type (not just extension) |
| Extension Check | `pathinfo()` | Generate safe filename |

---

## File Storage

### Directory Structure

```
xampp-php-mysql-files/
├── uploads/
│   ├── certificates/           # Medical certificates
│   │   └── medical_certificate_1702251234_abc123.pdf
│   ├── identity/               # Government IDs
│   │   └── identity_proof_1702251234_def456.jpg
│   └── thumbnails/             # Future: resized images
└── api/
    ├── upload.php
    ├── files.php
    └── file-download.php
```

### Filename Convention

```
[file_type]_[timestamp]_[random_hash].[extension]

Examples:
- identity_proof_1702251234_a1b2c3d4e5f6g7h8.jpg
- medical_certificate_1702251234_z9y8x7w6v5u4t3s2.pdf
```

---

## Testing Checklist

### Registration Upload Test
- [ ] Go to `/register` page
- [ ] Fill form until "Required Documents" section
- [ ] Click "Upload ID Document"
- [ ] Select a JPG/PNG file (< 5MB)
- [ ] Verify "Ready: filename" message appears
- [ ] Upload Medical Certificate (PDF/JPG/PNG)
- [ ] Complete and submit registration
- [ ] Verify files uploaded successfully

### View Documents Test
- [ ] Log in to user account
- [ ] Click "My Documents" in sidebar
- [ ] Verify documents table appears
- [ ] Check status shows "pending"
- [ ] Test download button works

### Error Handling Test
- [ ] Try uploading file > 5MB → Should show error
- [ ] Try uploading .exe file → Should show error
- [ ] Try accessing files.php without regNumber → Should return error

---

## Troubleshooting

### Issue: "Table doesn't exist" error
**Solution:** Run the SQL migration file
```bash
mysql -u root PWDRegistry < sql-file-uploads.sql
```

### Issue: Upload fails with "File too large"
**Solution:** Ensure file is under 5MB. Also check PHP settings:
```ini
; php.ini
upload_max_filesize = 10M
post_max_size = 10M
```

### Issue: Upload fails with "Invalid file type"
**Solution:** Only PDF, JPG, PNG files are allowed

### Issue: "My Documents" section not visible
**Solution:** Check sidebar navigation has item with `activeNav === 4`

### Issue: Files not appearing in table
**Solution:** Verify regNumber matches in database query

### Issue: Download returns 404
**Solution:** Check file exists at the path stored in database

---

## Features Not Yet Implemented

The following are planned but NOT yet applied:

- ❌ Admin file review functionality
- ❌ Admin verification page enhancements
- ❌ Image preview modal in admin
- ❌ Admin approval/rejection workflow
- ❌ Status update from "pending" to "approved/rejected"
- ❌ Image thumbnail generation
- ❌ Re-upload functionality for rejected files

---

## Related Files

| File | Description |
|------|-------------|
| `src/pages/homepage/register.jsx` | Registration with file upload |
| `src/pages/userpage/userpage.jsx` | User dashboard with My Documents |
| `xampp-php-mysql-files/api/upload.php` | File upload endpoint |
| `xampp-php-mysql-files/api/files.php` | Get user files endpoint |
| `xampp-php-mysql-files/api/file-download.php` | File download endpoint |
| `xampp-php-mysql-files/sql-file-uploads.sql` | Database migration |
| `Post-React-Migration/documentation/FILE-UPLOAD-IMPLEMENTATION.md` | Detailed implementation notes |
| `Post-React-Migration/documentation/FILE-UPLOAD-QUICKSTART.md` | Quick setup guide |
| `Post-React-Migration/documentation/FILE-UPLOAD-SETUP.md` | Complete setup guide |

---

## Changelog

| Date | Change |
|------|--------|
| 2024-12-09 | Initial file upload feature implementation |
| 2024-12-10 | Added register.jsx file selection and validation |
| 2024-12-11 | Created PHP upload, files, and download endpoints |
| 2024-12-11 | Added userpage.jsx "My Documents" section |
| 2024-12-11 | Created database migration sql-file-uploads.sql |
