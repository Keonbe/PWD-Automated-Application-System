# 1x1 ID Photo Feature Documentation

## Overview
This document details the implementation of the 1x1 ID Photo upload feature, which was integrated into the existing PWD Application System. The feature allows users to upload a profile-sized ID photo during registration and display it on their user page PWD ID card.

## Feature Summary
- **Objective**: Allow users to upload a 1x1 ID photo and display it on the PWD ID application card
- **Integration Point**: Registration form (register.jsx) and User dashboard (userpage.jsx)
- **Backend Support**: PHP file upload handling and MySQL database
- **File Type**: Images (JPEG, PNG, etc.)
- **Storage**: `/uploads/idphoto/` directory

---

## Database Changes

### 1. Table Schema Modification
The existing `pwd_file_uploads` table required an ENUM update to support the new file type.

**File**: `master-setup.sql` and `sql-scripts.sql`

#### Original ENUM:
```sql
file_type ENUM('medical_certificate', 'identity_proof')
```

#### Updated ENUM:
```sql
file_type ENUM('medical_certificate', 'identity_proof', 'id_photo')
```

#### SQL Command to Apply:
```sql
ALTER TABLE pwd_file_uploads MODIFY file_type ENUM('medical_certificate', 'identity_proof', 'id_photo') NOT NULL;
```

### 2. Table Structure Reference
The `pwd_file_uploads` table stores all uploaded files with the following relevant fields:
- `id`: File record ID
- `regNumber`: User's registration number (foreign key)
- `file_type`: Type of file (now includes 'id_photo')
- `original_filename`: Original file name
- `stored_filename`: Server-stored filename
- `file_path`: Relative path to the file (e.g., `uploads/idphoto/filename.jpg`)
- `mime_type`: File MIME type
- `status`: File review status (pending, approved, rejected)
- `uploaded_at`: Timestamp of upload

---

## Backend Implementation (PHP)

### 1. File Upload Handler: `upload.php`

**Location**: `Post-React-Migration/xampp-php-mysql-files/api/upload.php`

#### Changes Made:
Added support for the `id_photo` file type in the upload handler.

```php
// New file type mapping
if ($fileType === 'id_photo') {
    $uploadDir = __DIR__ . '/../uploads/idphoto/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
}
```

#### Process Flow:
1. Receives file upload request with `fileType = 'id_photo'`
2. Validates file (size, type)
3. Creates `uploads/idphoto/` directory if it doesn't exist
4. Stores file with unique filename
5. Saves metadata to `pwd_file_uploads` table with `file_type = 'id_photo'`

### 2. File Retrieval Endpoints

#### a) `files.php` (Get All Files for User)
**Location**: `Post-React-Migration/xampp-php-mysql-files/api/files.php`

Returns all uploaded files for a user, including id_photo:
```php
SELECT id, file_type, original_filename, stored_filename, file_path, mime_type, ...
FROM pwd_file_uploads 
WHERE regNumber = ?
```

Returns data with field mapping:
```php
'type' => $row['file_type'],  // Maps to 'id_photo'
'filePath' => $row['file_path'],
'id' => $row['id'],
// ... other fields
```

#### b) `file-view.php` (View File by ID)
**Location**: `Post-React-Migration/xampp-php-mysql-files/api/file-view.php`

Serves files inline in browser for viewing:
```php
SELECT original_filename, file_path, mime_type 
FROM pwd_file_uploads 
WHERE id = ?
```

#### c) `file-view-path.php` (View File by Path)
**Location**: `Post-React-Migration/xampp-php-mysql-files/api/file-view-path.php`

Serves files from direct path (with security validation):
```php
// Security check to prevent directory traversal
$filePath = str_replace(['../', '..\\'], '', $filePath);
```

#### d) `file-download.php` (Download File)
**Location**: `Post-React-Migration/xampp-php-mysql-files/api/file-download.php`

Allows users to download their uploaded files as attachments.

---

## Frontend Implementation (React)

### 1. Registration Form: `register.jsx`

**Location**: `Post-React-Migration/pwd-application-system/src/pages/register/register.jsx`

#### Changes Made:

#### a) State Management
```jsx
const idPhotoRef = useRef(null);

const [selectedFiles, setSelectedFiles] = useState({
  // ... existing files
  id_photo: null  // NEW
});

const [fileValidation, setFileValidation] = useState({
  // ... existing validation
  id_photo: null  // NEW
});
```

#### b) File Selection Handler
Added id_photo handling to `handleFileSelect` function:
```jsx
case 'id_photo':
  if (file && file.size <= 5 * 1024 * 1024) {
    setSelectedFiles(prev => ({ ...prev, id_photo: file }));
    setFileValidation(prev => ({ ...prev, id_photo: null }));
  } else {
    setFileValidation(prev => ({ 
      ...prev, 
      id_photo: 'File must be less than 5MB' 
    }));
  }
  break;
```

#### c) UI Section for ID Photo Upload
Added a new grid column in the upload section:
```jsx
<div className="upload-section">
  <div className="upload-grid">
    {/* Existing uploads... */}
    
    {/* NEW: 1x1 ID Photo */}
    <div className="upload-item">
      <label>1x1 ID Photo</label>
      <input
        ref={idPhotoRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'id_photo')}
      />
      {fileValidation.id_photo && (
        <span className="upload-warning">{fileValidation.id_photo}</span>
      )}
    </div>
  </div>
</div>
```

#### d) Form Submission Handler
Modified `handleFormSubmit` to upload id_photo:
```jsx
// Upload id_photo if selected
if (selectedFiles.id_photo) {
  const idPhotoFormData = new FormData();
  idPhotoFormData.append('file', selectedFiles.id_photo);
  idPhotoFormData.append('fileType', 'id_photo');
  idPhotoFormData.append('regNumber', registrationData.regNumber);

  try {
    await fetch('http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/upload.php', {
      method: 'POST',
      body: idPhotoFormData
    });
  } catch (error) {
    console.error('ID photo upload failed:', error);
  }
}
```

#### e) Validation
Added id_photo to pre-submission validation:
```jsx
if (!selectedFiles.id_photo) {
  alert('Please upload a 1x1 ID photo');
  return;
}
```

### 2. User Dashboard: `userpage.jsx`

**Location**: `Post-React-Migration/pwd-application-system/src/pages/userpage/userpage.jsx`

#### Changes Made:

#### a) Fetching User Files
User files are fetched from the `files.php` endpoint:
```jsx
const fetchUserFiles = useCallback(async () => {
  try {
    const response = await fetch(
      `http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/files.php?regNumber=${userData.regNumber}`
    );
    const data = await response.json();
    setUserFiles(data.files || []);
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}, [userData?.regNumber]);
```

#### b) PWD ID Card Display
Modified the PWD card preview to display the uploaded id_photo:
```jsx
<div className="pwd-card-photo">
  {(() => {
    // Find the uploaded 1x1 ID photo from userFiles (type or fileType)
    const idPhotoFile = userFiles.find(f => f.type === 'id_photo' || f.fileType === 'id_photo');
    if (idPhotoFile) {
      return (
        <img
          src={`http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api/file-view.php?fileId=${idPhotoFile.id}`}
          alt="1x1 ID Photo"
          className="pwd-id-photo-img"
          style={{ 
            width: 80, 
            height: 80, 
            objectFit: 'cover', 
            borderRadius: '8px', 
            border: '1px solid #ccc' 
          }}
        />
      );
    } else if (userData.proofIdentity) {
      // Fallback to proof of identity
      return <img src={...} alt="ID Photo" />;
    } else {
      // Placeholder
      return (
        <>
          <i className="fas fa-user"></i>
          <span>Photo</span>
        </>
      );
    }
  })()}
</div>
```

---

## File System Structure

### Directory Layout
```
Post-React-Migration/
├── xampp-php-mysql-files/
│   ├── uploads/
│   │   ├── idphoto/           (NEW - stores 1x1 ID photos)
│   │   ├── identity/          (existing - proof of identity)
│   │   ├── certificates/      (existing - medical certificates)
│   │   ├── news/              (existing - news images)
│   │   └── thumbnails/        (existing - news thumbnails)
│   ├── api/
│   │   ├── upload.php         (MODIFIED - added id_photo support)
│   │   ├── files.php          (unchanged - returns all file types)
│   │   ├── file-view.php      (unchanged - serves all file types)
│   │   ├── file-view-path.php (unchanged - serves from path)
│   │   └── file-download.php  (unchanged - downloads all file types)
│   └── config.php             (configuration)
└── pwd-application-system/
    └── src/
        ├── pages/
        │   ├── register/
        │   │   └── register.jsx  (MODIFIED - added id_photo upload UI)
        │   └── userpage/
        │       └── userpage.jsx  (MODIFIED - display id_photo in PWD card)
        └── assets/               (styling)
```

---

## Data Flow Diagram

### Upload Flow
```
User Registration Form (register.jsx)
    ↓
Select id_photo file
    ↓
handleFileSelect() validates file
    ↓
handleFormSubmit() creates FormData with:
  - file: id_photo file
  - fileType: 'id_photo'
  - regNumber: user's registration number
    ↓
POST to upload.php
    ↓
upload.php:
  - Validates file
  - Creates /uploads/idphoto/ directory
  - Stores file with unique name
  - Inserts record in pwd_file_uploads with file_type='id_photo'
    ↓
Database: pwd_file_uploads table updated
```

### Display Flow
```
User Views PWD ID Card (userpage.jsx)
    ↓
fetchUserFiles() called on mount
    ↓
GET from files.php?regNumber=XXX
    ↓
files.php queries pwd_file_uploads:
  SELECT * WHERE regNumber=? AND file_type='id_photo'
    ↓
Returns array of files with type='id_photo'
    ↓
React finds idPhotoFile in userFiles
    ↓
Renders <img src={file-view.php?fileId=X} />
    ↓
file-view.php serves image from database path
    ↓
Image displayed on PWD ID card
```

---

## Integration Points with Existing Features

### 1. File Upload System
The id_photo feature uses the existing file upload infrastructure:
- Same `pwd_file_uploads` table structure
- Same file validation logic (size, type)
- Same directory-based storage approach
- Same API endpoints for retrieval

### 2. User Registration Flow
The id_photo is uploaded as part of the normal registration process:
- Integrated into the registration form UI
- Validation occurs before submission
- Upload happens alongside other documents

### 3. User Dashboard
The id_photo displays on the PWD ID card preview:
- Fetches from same file API endpoint
- Uses same file viewing mechanism
- Falls back to proof of identity if id_photo not found
- Matches existing styling and layout

---

## Security Considerations

### 1. File Validation
- File type checking (MIME type validation)
- File size limits (5MB max)
- Filename sanitization

### 2. Path Security
- Directory traversal prevention in file-view-path.php
- File path validation before serving
- Realpath verification to ensure files are within uploads directory

### 3. Database Integrity
- Foreign key relationship between regNumber and pwd_users
- Status tracking for review workflow
- Admin notes for file review

---

## SQL Maintenance Scripts

### Location
- `sql-scripts.sql` - Contains the ALTER TABLE statement
- `master-setup.sql` - Contains original table creation with updated ENUM

### Application Order
1. Apply `master-setup.sql` to initialize database with new schema
2. OR apply ALTER TABLE from `sql-scripts.sql` to existing database

```sql
-- For existing databases, run this to add id_photo support:
ALTER TABLE pwd_file_uploads MODIFY file_type ENUM('medical_certificate', 'identity_proof', 'id_photo') NOT NULL;
```

---

## Testing Checklist

- [ ] Upload id_photo during user registration
- [ ] Verify file is stored in `/uploads/idphoto/` directory
- [ ] Verify record is created in `pwd_file_uploads` table with `file_type='id_photo'`
- [ ] View uploaded id_photo on PWD ID card in user dashboard
- [ ] Verify placeholder displays when no id_photo is uploaded
- [ ] Test file validation (size, type)
- [ ] Test file view endpoint returns correct image

---

## Future Enhancements

1. **Image Preview**: Show thumbnail preview of selected image before upload
2. **Crop/Edit**: Allow users to crop the image to 1:1 aspect ratio
3. **Drag & Drop**: Support drag-and-drop file upload
4. **Background Removal**: Auto-remove background for professional ID photos
5. **Compression**: Automatically compress images to reduce storage
6. **Admin Review**: Track admin review status of id_photo separately from other documents

---

## Troubleshooting

### Issue: ID photo not displaying
**Solution**: 
- Check if file is in `/uploads/idphoto/` directory
- Verify database record exists with `file_type='id_photo'`
- Check API endpoint returns correct fileId in response
- Verify file-view.php can access the file path

### Issue: Upload fails silently
**Solution**:
- Check browser console for error messages
- Verify file size is under 5MB
- Verify file type is image (JPEG, PNG, etc.)
- Check `/uploads/idphoto/` directory permissions (755)

### Issue: ENUM value not recognized
**Solution**:
- Run ALTER TABLE command from sql-scripts.sql
- Verify `pwd_file_uploads` table has been updated
- Check column definition: `SHOW COLUMNS FROM pwd_file_uploads;`

---

## Files Modified Summary

| File | Changes | Type |
|------|---------|------|
| master-setup.sql | Updated ENUM to include 'id_photo' | Database |
| sql-scripts.sql | Added ALTER TABLE for consistency | Database |
| upload.php | Added id_photo directory and handling | Backend |
| register.jsx | Added id_photo upload UI and logic | Frontend |
| userpage.jsx | Added id_photo display on PWD card | Frontend |

---

## Implementation Date
January 2026

## Documentation Date
January 4, 2026
