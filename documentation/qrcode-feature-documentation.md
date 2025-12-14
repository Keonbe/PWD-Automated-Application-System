# QR Code Feature Documentation

## Overview

The PWD Automated Application System uses QR codes to provide a scannable verification method for PWD ID cards. This feature allows quick verification of PWD registration status by scanning the QR code on printed or digital ID cards.

---

## For Collaborators: Getting Started

### Prerequisites

Before working with this feature, ensure you have:
- Node.js (v16 or higher)
- npm or yarn package manager
- The React project cloned locally

### Installation

After cloning the repository, the `qrcode.react` package must be installed:

```bash
# Navigate to the React project directory
cd Post-React-Migration/pwd-application-system

# Install all dependencies (including qrcode.react)
npm install

# Or if qrcode.react is missing, install it explicitly
npm install qrcode.react
```

### Verifying Installation

Check that `qrcode.react` appears in `package.json` dependencies:

```json
{
  "dependencies": {
    "qrcode.react": "^4.2.0"
  }
}
```

---

## Feature Locations

The QR code feature is implemented in two locations:

| Location | File | Purpose |
|----------|------|---------|
| Registration Result | `src/pages/homepage/register-result.jsx` | Displays QR code after successful registration |
| User Dashboard | `src/pages/userpage/userpage.jsx` | View/Print ID section with QR code |

---

## How It Works

### 1. Import Statement

```jsx
import { QRCodeSVG } from 'qrcode.react';
```

The library provides two components:
- `QRCodeSVG` - Renders QR code as SVG (recommended for web)
- `QRCodeCanvas` - Renders QR code as Canvas element

We use `QRCodeSVG` because SVG scales better for printing and displays crisply at any size.

### 2. QR Code Data Structure

The QR code encodes user information in a multiline text format:

```
PWD ID: [Registration Number]
Name: [Last Name], [First Name] [Middle Name]
Disability: [Disability Type]
Status: [Application Status]
City Government of Dasmariñas
```

**Example encoded data:**
```
PWD ID: PWD-2024-00123
Name: Dela Cruz, Juan Miguel
Disability: Visual Impairment
Status: Approved
City Government of Dasmariñas
```

### 3. Component Implementation

#### In `userpage.jsx` (View/Print ID):

```jsx
<div className="pwd-card-qr" role="region" aria-label="PWD ID Verification QR Code">
  <span className="sr-only">QR Code containing PWD ID information for verification</span>
  <QRCodeSVG 
    value={`PWD ID: ${userData.regNumber || 'N/A'}
Name: ${userData.lastName || ''}, ${userData.firstName || ''} ${userData.middleName || ''}
Disability: ${userData.disability || 'N/A'}
Status: ${userData.status || 'Pending'}
City Government of Dasmariñas`}
    size={120}
    level="H"
    includeMargin={true}
    aria-hidden="true"
  />
  <span className="pwd-qr-label">
    <i className="fas fa-qrcode me-1" aria-hidden="true"></i>
    Scan to Verify
  </span>
  <span className="pwd-qr-sublabel">PWD ID: {userData.regNumber || 'N/A'}</span>
</div>
```

#### In `register-result.jsx`:

```jsx
<div role="region" aria-label="PWD Registration Verification QR Code">
  <span className="sr-only">QR Code containing PWD registration information for verification</span>
  <QRCodeSVG 
    value={`PWD ID: ${display('regNumber', 'N/A')}
Name: ${display('lastName', '')}, ${display('firstName', '')} ${display('middleName', '')}
Disability: ${display('disability', 'N/A')}
Date: ${display('regDate', 'N/A')}
City Government of Dasmariñas`}
    size={140}
    level="H"
    includeMargin={true}
    aria-hidden="true"
    style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
  />
</div>
```

---

## Component Props Explained

| Prop | Value | Description |
|------|-------|-------------|
| `value` | String | The data to encode in the QR code. Uses template literals to build multiline text. |
| `size` | 120-140 | Size in pixels. Larger = easier to scan but takes more space. |
| `level` | "H" | Error correction level. "H" (High) allows 30% of the code to be damaged and still scannable. |
| `includeMargin` | true | Adds white "quiet zone" around QR code, required for reliable scanning. |
| `aria-hidden` | true | Hides QR from screen readers (content provided via `.sr-only` text instead). |

### Error Correction Levels

| Level | Recovery | Use Case |
|-------|----------|----------|
| L | ~7% | Maximum data capacity |
| M | ~15% | Standard use |
| Q | ~25% | Industrial use |
| **H** | ~30% | **Used here** - Best for printed IDs that may get damaged |

---

## Accessibility Features

The QR code implementation follows PWD accessibility guidelines:

### 1. Screen Reader Support
```jsx
<span className="sr-only">QR Code containing PWD ID information for verification</span>
```
Screen readers announce the purpose of the QR code.

### 2. ARIA Landmarks
```jsx
<div role="region" aria-label="PWD ID Verification QR Code">
```
Helps users navigate the page with assistive technology.

### 3. Visual Fallback
```jsx
<span className="pwd-qr-sublabel">PWD ID: {userData.regNumber || 'N/A'}</span>
```
The PWD ID is displayed as text for users who cannot scan.

### 4. CSS for Screen Reader Only Text
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Styling

QR code styles are defined in `src/assets/styles/userpage-styles.css`:

```css
.pwd-card-qr {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 2px solid #2d7c2f;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.pwd-card-qr svg {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pwd-qr-label {
  display: block;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d7c2f;
  text-align: center;
  letter-spacing: 0.5px;
}

.pwd-qr-sublabel {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  text-align: center;
  margin-top: 0.25rem;
}
```

---

## Print Support

The QR code prints correctly because:

1. **SVG Format** - Scales perfectly at any DPI
2. **High Error Correction** - Readable even with print imperfections
3. **White Background** - Maintains contrast on any paper
4. **Included Margin** - Quiet zone ensures scanner detection

Print styles are defined in the same CSS file under `@media print`.

---

## Testing the QR Code

### Manual Testing

1. Run the development server:
   ```bash
   npm start
   ```

2. Navigate to either:
   - `/register` → Complete registration → View QR on result page
   - `/user` → Login → Click "View/Print ID" → View QR code

3. Use any QR scanner app on your phone to scan

4. Verify the scanned text matches the displayed user information

### Expected Scan Result

When scanning, the QR reader should display:
```
PWD ID: PWD-2024-00123
Name: Dela Cruz, Juan
Disability: Visual Impairment
Status: Approved
City Government of Dasmariñas
```

---

## Troubleshooting

### QR Code Not Rendering

**Problem:** Component shows nothing or errors

**Solution:**
```bash
# Ensure package is installed
npm install qrcode.react

# Clear cache and restart
npm start
```

### QR Code Not Scanning

**Possible causes:**
- Size too small (increase `size` prop)
- Missing quiet zone (ensure `includeMargin={true}`)
- Low contrast (check `bgColor` and `fgColor`)
- Error correction too low (use `level="H"`)

### Import Errors

**Problem:** `Cannot find module 'qrcode.react'`

**Solution:**
```bash
rm -rf node_modules
npm install
```

---

## Future Enhancements

Potential improvements for this feature:

1. **Verification Endpoint** - Create `/api/verify-pwd.php` to validate QR codes online
2. **QR Code Logo** - Add city logo in center using `imageSettings` prop
3. **Dynamic URL** - Encode verification URL instead of plain text
4. **Expiration** - Include ID expiration date in QR data

---

## Related Files

| File | Description |
|------|-------------|
| `src/pages/userpage/userpage.jsx` | View/Print ID implementation |
| `src/pages/homepage/register-result.jsx` | Registration result implementation |
| `src/assets/styles/userpage-styles.css` | QR code styling |
| `documentation/qrcode-implementation-plan.md` | Technical implementation plan |

---

## Dependencies

```json
{
  "qrcode.react": "^4.2.0"
}
```

**Library Info:**
- Repository: https://github.com/zpao/qrcode.react
- NPM: https://www.npmjs.com/package/qrcode.react
- License: ISC

---

## Changelog

| Date | Change |
|------|--------|
| 2025-12-14 | Updated documentation |
| 2025-12-10 | Initial QR code feature implementation |
| 2025-12-10 | Added accessibility features (ARIA, sr-only) |
| 2025-12-10 | Enhanced styling with gradient background |
