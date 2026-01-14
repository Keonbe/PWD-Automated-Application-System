# Vite Comprehensive Setup & Configuration Guide

> **Last Updated:** January 14, 2026  
> **Project:** PWD-Automated-Application-System  
> **Version:** 2.1 (Vite 7 + React 19)  
> **Build Tool:** Vite (replaces Create React App)

---

## Table of Contents

1. [Quick Start (5 minutes)](#1-quick-start-5-minutes)
2. [Why Vite?](#2-why-vite)
3. [Complete Installation Guide](#3-complete-installation-guide)
4. [Configuration Reference](#4-configuration-reference)
5. [Common Issues & Solutions](#5-common-issues--solutions)
6. [Troubleshooting Checklist](#6-troubleshooting-checklist)
7. [Migration Errors & Resolutions](#7-migration-errors--resolutions)
8. [Diagnostic Scripts](#8-diagnostic-scripts)
9. [Advanced Configuration](#9-advanced-configuration)

---

## 1. Quick Start (5 minutes)

### For Existing Project

```bash
# Navigate to the React project
cd Post-React-Migration/pwd-application-system

# Install dependencies (Vite is already configured)
npm install

# Start development server
npm run dev

# Visit http://localhost:3000 in your browser
```

**That's it!** The project is already configured with Vite.

### Key Commands

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Build for production (creates dist/)
npm run preview   # Preview production build locally
```

---

## 2. Why Vite?

### Performance Benefits

| Metric | Create React App | Vite |
|--------|-----------------|------|
| **Dev Server Startup** | 10-30s | < 1s |
| **HMR (Hot Reload)** | 2-5s | < 100ms |
| **Production Build** | 30-60s | 5-10s |
| **Bundle Size** | Larger | 30-40% smaller |

### Key Advantages

✅ **Lightning-fast development** - Instant feedback loop  
✅ **Hot Module Replacement** - Changes appear without page reload  
✅ **Optimized builds** - Smaller production bundles  
✅ **Better developer experience** - Faster iteration  
✅ **Native ES modules** - Modern JavaScript support  

---

## 3. Complete Installation Guide

### 3.1 Project Structure (Vite vs CRA)

**Create React App (OLD):**
```
pwd-application-system/
├── public/
│   └── index.html        ← Entry point
├── src/
│   ├── index.js          ← React entry
│   └── App.js
└── package.json
```

**Vite (CURRENT):**
```
pwd-application-system/
├── index.html            ← Entry point (at ROOT!)
├── vite.config.js        ← Configuration
├── src/
│   ├── main.jsx          ← React entry
│   └── App.jsx
├── public/               ← Static assets only
└── package.json
```

### 3.2 Critical Differences

| Feature | Create React App | Vite |
|---------|------------------|------|
| **HTML Location** | `public/index.html` | `index.html` at root |
| **Entry Point** | `src/index.js` | `src/main.jsx` |
| **Env Variables** | `process.env.REACT_APP_*` | `import.meta.env.VITE_*` |
| **JSX Files** | `.js` or `.jsx` | `.jsx` required |
| **Build Output** | `build/` | `dist/` |
| **Config File** | CRA config | `vite.config.js` |

### 3.3 Environment Variables (Vite-Specific)

**Create `.env` file in project root:**

```env
# Development
VITE_API_URL=http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api
VITE_APP_NAME=PWD Automated Application System
VITE_ENVIRONMENT=development
```

**Create `.env.production`:**

```env
# Production
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=PWD Automated Application System
VITE_ENVIRONMENT=production
```

**Important Rules:**
- ✅ Variables MUST start with `VITE_` (case-sensitive)
- ✅ Access in code: `import.meta.env.VITE_API_URL`
- ❌ Do NOT use: `process.env.VITE_*`
- ❌ Do NOT use CRA format: `REACT_APP_*`

### 3.4 Using Environment Variables in Code

```javascript
// ✅ CORRECT - Vite syntax
const apiUrl = import.meta.env.VITE_API_URL
console.log(import.meta.env.VITE_APP_NAME)

// ❌ WRONG - CRA syntax (won't work in Vite)
const apiUrl = process.env.REACT_APP_API_URL  // undefined!
```

### 3.5 Path Aliases (Cleaner Imports)

The project includes path aliases in `vite.config.js`:

```javascript
'@': './src'
'@api': './src/api'
'@components': './src/components'
'@pages': './src/pages'
'@utils': './src/utils'
'@assets': './src/assets'
```

**Using Aliases:**

```javascript
// ❌ Before (relative paths)
import Button from '../../../components/Button'
import { getUserData } from '../../api/userApi'
import logo from '../../../assets/images/logo.png'

// ✅ After (clean aliases)
import Button from '@components/Button'
import { getUserData } from '@api/userApi'
import logo from '@assets/images/logo.png'
```

---

## 4. Configuration Reference

### 4.1 vite.config.js

Complete configuration file for this project:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // React plugin for JSX support
  plugins: [react()],
  
  // Root directory (project root)
  root: process.cwd(),
  
  // Static assets directory
  publicDir: 'public',
  
  // Development server settings
  server: {
    port: 3000,
    open: true,  // Auto-open browser
    // API proxy (optional)
    proxy: {
      '/api': {
        target: 'http://localhost/webdev_finals/PWD-Automated-Application-System/Post-React-Migration/xampp-php-mysql-files/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // Production build settings
  build: {
    outDir: 'dist',              // Output folder (not build/)
    sourcemap: false,             // No source maps in production
    emptyOutDir: true,            // Clear dist/ before build
  },
  
  // Path aliases for imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
})
```

### 4.2 package.json Scripts

```json
{
  "name": "pwd-application-system",
  "version": "2.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.3",
    "react-router-hash-link": "^2.4.3",
    "bootstrap": "^5.3.8",
    "react-bootstrap": "^2.10.10",
    "axios": "^1.13.2"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### 4.3 index.html (Entry Point)

Must be at **project root** (not in `public/`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="PWD Automated Application System" />
    <title>PWD Automated Application System</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Critical Requirements:**
- ✅ Exactly ONE `<div id="root"></div>`
- ✅ `<script type="module" src="/src/main.jsx"></script>`
- ❌ NO `%PUBLIC_URL%` references (CRA thing)
- ❌ NO multiple root divs

### 4.4 src/main.jsx (React Entry Point)

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.jsx'
import './index.css'
import '@assets/styles/index-styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 5. Common Issues & Solutions

### Issue #1: "404 Not Found" after `npm run dev`

**Symptoms:**
- Terminal shows "ready in xxx ms"
- Browser shows 404 error
- No console errors

**Solution:**
Move `index.html` from `public/` to project root:

```bash
mv public/index.html index.html
```

**Before (❌ Wrong):**
```
public/
└── index.html
```

**After (✅ Correct):**
```
index.html        ← Here!
public/           ← Static assets only
```

### Issue #2: "Cannot find module '@assets/...'"

**Cause:** Path alias not configured or file doesn't exist

**Solution:**
1. Check file exists: `ls src/assets/images/filename.png`
2. Check alias in `vite.config.js`:
   ```javascript
   '@assets': path.resolve(__dirname, './src/assets')
   ```

### Issue #3: Environment variables are `undefined`

**Wrong (❌):**
```javascript
const url = process.env.REACT_APP_API_URL  // undefined in Vite!
```

**Correct (✅):**
```javascript
const url = import.meta.env.VITE_API_URL  // Works in Vite
```

**Also check:**
- Variable name starts with `VITE_`
- Defined in `.env` or `.env.production`
- Restart dev server after changing `.env`

### Issue #4: "JSX syntax extension not enabled"

**Cause:** File has `.js` extension but contains JSX

**Solution:**
Rename to `.jsx`:
```bash
mv src/App.js src/App.jsx
mv src/index.js src/main.jsx
```

### Issue #5: Port 3000 already in use

**Solution:**
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node

# Or use different port
npm run dev -- --port 3001
```

### Issue #6: Changes not appearing (HMR not working)

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .vite dist
npm install
npm run dev
```

### Issue #7: Images not loading

**Check these:**

1. **From `public/` folder:**
   ```javascript
   <img src="/images/logo.png" alt="Logo" />  // ✅ Correct
   <img src="public/images/logo.png" alt="Logo" />  // ❌ Wrong
   ```

2. **From `src/assets/`:**
   ```javascript
   import logo from '@assets/images/logo.png'
   <img src={logo} alt="Logo" />  // ✅ Correct
   ```

---

## 6. Troubleshooting Checklist

### Before Starting Dev Server

**Verify Directory:**
- [ ] Navigate to: `cd Post-React-Migration/pwd-application-system`
- [ ] Confirm location: `pwd` (should end with `pwd-application-system`)

**File Structure:**
- [ ] `index.html` exists at project root (NOT in public/)
- [ ] `vite.config.js` exists in root
- [ ] `src/main.jsx` exists (renamed from index.js)
- [ ] `src/App.jsx` exists (renamed from App.js)
- [ ] `.env` file exists with `VITE_API_URL`

**Configuration Files Content:**

**vite.config.js must have:**
- [ ] `import react from '@vitejs/plugin-react'`
- [ ] `plugins: [react()]`
- [ ] `publicDir: 'public'`
- [ ] `resolve: { alias: { '@': ... } }`

**index.html must have:**
- [ ] Exactly ONE `<div id="root"></div>`
- [ ] `<script type="module" src="/src/main.jsx"></script>`
- [ ] NO `%PUBLIC_URL%` references
- [ ] NO `<script src="index.js"></script>`

**src/main.jsx must have:**
- [ ] `import React from 'react'`
- [ ] `import ReactDOM from 'react-dom/client'`
- [ ] `ReactDOM.createRoot(document.getElementById('root')).render(...)`
- [ ] `import App from './App.jsx'` (with .jsx extension)

**package.json must have:**
- [ ] `"dev": "vite"` (NOT `"start": "react-scripts start"`)
- [ ] `"build": "vite build"` (NOT `"react-scripts build"`)
- [ ] `"vite"` and `"@vitejs/plugin-react"` in `devDependencies`
- [ ] NO `"react-scripts"` in dependencies

**.env file must have:**
- [ ] `VITE_API_URL=http://localhost/...`
- [ ] `VITE_APP_NAME=PWD Automated Application System`
- [ ] All variables start with `VITE_`

**Dependencies:**
- [ ] `node_modules/` exists
- [ ] `npm list vite` shows version
- [ ] `npm list @vitejs/plugin-react` shows version

### After Starting Dev Server

**Terminal Output:**
- [ ] Shows "ready in xxx ms"
- [ ] Shows "Local: http://localhost:3000/"
- [ ] No red error messages

**Browser Checks:**
- [ ] Browser opens to http://localhost:3000
- [ ] Page displays (not 404)
- [ ] No red errors in console (F12)
- [ ] Bootstrap styling visible
- [ ] Images loading
- [ ] Navigation works

**Environment Variables:**
In browser console (F12 → Console):
```javascript
import.meta.env.VITE_API_URL
// Should show URL, not undefined
```

### Quick Verification Command

```bash
# Run diagnostic script
diagnostic.bat    # Windows
bash diagnostic.sh # Mac/Linux

# Or manual check
ls -la index.html vite.config.js src/main.jsx .env
npm list vite
node -v && npm -v
```

---

## 7. Migration Errors & Resolutions

### Error #1: JSX Syntax Extension Not Enabled

**Error Message:**
```
The JSX syntax extension is not currently enabled
```

**Root Cause:**
File has `.js` extension but contains JSX syntax. Vite's esbuild requires `.jsx` for JSX files.

**Solution:**
```bash
# Rename to .jsx
mv src/App.js src/App.jsx

# Update imports
# Before: import App from './App'
# After:  import App from './App.jsx'
```

### Error #2: Port Already in Use

**Error Message:**
```
Port 3000 is in use, trying another one...
Port 3001 is in use, trying another one...
```

**Solution:**

**Windows:**
```bash
taskkill /F /IM node.exe
```

**Mac/Linux:**
```bash
killall node
# Or use specific port
npm run dev -- --port 3001
```

### Error #3: HTTP 404 - Page Not Loading

**Symptoms:**
- Terminal shows "ready in xxx ms"
- Browser shows 404 error
- No console errors

**Root Cause:**
`index.html` is in `public/` folder instead of project root (most common!)

**Solution (CRITICAL):**
```bash
# Move index.html from public/ to root
mv public/index.html index.html
```

**Before (❌ WRONG):**
```
pwd-application-system/
└── public/
    └── index.html
```

**After (✅ CORRECT):**
```
pwd-application-system/
├── index.html        ← HERE!
└── public/           ← Static assets only
```

### Error #4: Invalid Package Version Syntax

**Error Message:**
```
npm error code EINVALIDTAGNAME
npm error Invalid tag name "^latest" of package "vite@^latest"
```

**Solution:**

In `package.json`, change:
```json
// ❌ Wrong
"vite": "^latest",
"@vitejs/plugin-react": "^latest"

// ✅ Correct
"vite": "latest",
"@vitejs/plugin-react": "latest"
```

Then run:
```bash
npm install
```

### Error #5: react-scripts Still in Dependencies

**Issue:**
`react-scripts` from Create React App still present after migration.

**Solution:**

In `package.json`:
```json
// ❌ Remove this line
"react-scripts": "5.0.1"
```

Then run:
```bash
npm uninstall react-scripts
npm install
```

### Error #6: Cannot Find Module '@assets/...' or '@api/...'

**Cause:**
File doesn't exist or path alias not configured.

**Solution:**

1. **Verify file exists:**
   ```bash
   ls src/assets/images/filename.png
   ls src/api/userApi.js
   ```

2. **Check vite.config.js has aliases:**
   ```javascript
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
       '@api': path.resolve(__dirname, './src/api'),
       '@assets': path.resolve(__dirname, './src/assets'),
       // ... other aliases
     },
   }
   ```

3. **Restart dev server:**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

---

## 8. Diagnostic Scripts

### Automated Verification

Create these scripts in your project root to automatically check Vite setup:

### diagnostic.bat (Windows)

```batch
@echo off
echo === Vite Setup Diagnostic ===

if not exist "package.json" (
  echo X Not in project root directory
  exit /b 1
)

if exist "index.html" (
  echo √ index.html at root
) else (
  echo X index.html NOT at root - move from public/
)

if exist "src\main.jsx" (
  echo √ src/main.jsx exists
) else (
  echo X src/main.jsx missing - rename from index.js
)

if exist "src\App.jsx" (
  echo √ src/App.jsx exists
) else (
  echo X src/App.jsx missing - rename from App.js
)

if exist "vite.config.js" (
  echo √ vite.config.js exists
) else (
  echo X vite.config.js missing
)

if exist ".env" (
  echo √ .env file exists
) else (
  echo X .env file missing
)

findstr /r "vite" package.json >nul
if %errorlevel% equ 0 (
  echo √ Vite is in package.json
) else (
  echo X Vite not found in package.json
)

findstr /r "react-scripts" package.json >nul
if %errorlevel% equ 0 (
  echo ⚠ react-scripts still present (should be removed)
) else (
  echo √ react-scripts removed
)

echo === End Diagnostic ===
echo.
echo If all show √, you're ready to run: npm run dev
```

### diagnostic.sh (Mac/Linux)

```bash
#!/bin/bash
echo "=== Vite Setup Diagnostic ==="

if [ ! -f "package.json" ]; then
  echo "❌ Not in project root directory"
  exit 1
fi

[ -f "index.html" ] && echo "✅ index.html at root" || echo "❌ index.html NOT at root - move from public/"
[ -f "src/main.jsx" ] && echo "✅ src/main.jsx exists" || echo "❌ src/main.jsx missing - rename from index.js"
[ -f "src/App.jsx" ] && echo "✅ src/App.jsx exists" || echo "❌ src/App.jsx missing - rename from App.js"
[ -f "vite.config.js" ] && echo "✅ vite.config.js exists" || echo "❌ vite.config.js missing"
[ -f ".env" ] && echo "✅ .env file exists" || echo "❌ .env file missing"

grep -q "vite" package.json && echo "✅ Vite in package.json" || echo "❌ Vite not found in package.json"
grep -q "react-scripts" package.json && echo "⚠️ react-scripts still present" || echo "✅ react-scripts removed"

echo "=== End Diagnostic ==="
echo ""
echo "If all show ✅, you're ready to run: npm run dev"
```

### How to Use

**Windows:**
```bash
cd Post-React-Migration/pwd-application-system
diagnostic.bat
```

**Mac/Linux:**
```bash
cd Post-React-Migration/pwd-application-system
chmod +x diagnostic.sh
bash diagnostic.sh
```

---

## 9. Advanced Configuration

### 7.1 Code Splitting (Lazy Loading)

```javascript
import { lazy, Suspense } from 'react'

// Lazy load a page component
const HeavyPage = lazy(() => import('@pages/HeavyPage'))

// Use with Suspense boundary
<Suspense fallback={<div>Loading...</div>}>
  <HeavyPage />
</Suspense>
```

### 7.2 Conditional API URLs

```javascript
// src/api/config.js
const isDev = import.meta.env.MODE === 'development'

export const API_BASE_URL = isDev
  ? 'http://localhost:3000/api'         // Proxy in development
  : import.meta.env.VITE_API_URL        // Full URL in production
```

### 7.3 Build Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'bootstrap-vendor': ['bootstrap', 'react-bootstrap'],
        },
      },
    },
    // Minify production code
    minify: 'terser',
    cssCodeSplit: true,
  },
})
```

### 7.4 API Proxy Setup

If using the proxy in `vite.config.js`:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost/webdev_finals/.../api',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

Then in code:
```javascript
// Use relative path instead of full URL
axios.get('/api/get-user.php')  // Works in development
```

---

## Key Command Reference

### Development

```bash
cd Post-React-Migration/pwd-application-system

# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Access at http://localhost:3000
```

### Production

```bash
# Create optimized production build
npm run build

# Creates dist/ folder with optimized files

# Preview production build locally
npm run preview
```

### Troubleshooting

```bash
# Clean reinstall
rm -rf node_modules package-lock.json .vite
npm install
npm run dev

# Check versions
node -v    # Should be 14.18+
npm -v     # Should be 6.0+
```

---

## Import Refactoring Guide

### Path Aliases Overview

All imports should use path aliases defined in `vite.config.js`:

```javascript
'@': './src'
'@api': './src/api'
'@components': './src/components'
'@pages': './src/pages'
'@utils': './src/utils'
'@assets': './src/assets'
```

### Import Pattern Examples

**Before (Relative Imports - OLD):**
```javascript
import logo from '../assets/images/dasma-logo-only.png'
import { getUserData } from '../../api/userApi'
import Button from '../../components/Button'
import { normalizeStatus } from '../../utils/statusUtils'
import '../../assets/styles/userpage-styles.css'
```

**After (Path Aliases - CORRECT):**
```javascript
import logo from '@assets/images/dasma-logo-only.png'
import { getUserData } from '@api/userApi'
import Button from '@components/Button'
import { normalizeStatus } from '@utils/statusUtils'
import '@assets/styles/userpage-styles.css'
```

### Benefits of Path Aliases

✅ **Improved Readability** - Clear import purpose  
✅ **Easier Refactoring** - Move files without updating paths  
✅ **Better IDE Support** - Autocomplete and resolution  
✅ **Consistent Code** - No chains of `../../`  
✅ **Cleaner Imports** - Professional appearance  

### Files Updated in This Project

- ✅ `src/api/axiosConfig.js` - Uses `import.meta.env.VITE_API_URL`
- ✅ `src/api/config.js` - Uses `import.meta.env.VITE_API_URL`
- ✅ All React pages - Use `@pages`, `@components`, `@api`, `@assets`
- ✅ All components - Use `@assets` and `@utils`

### Dynamic API Configuration

**src/api/axiosConfig.js:**
```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export default api
```

All API calls automatically use the configured URL from `.env`.

---

## Complete Feature Verification

### Bootstrap & FontAwesome

**Global Bootstrap Import (src/main.jsx):**
```javascript
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
```

**FontAwesome (where needed):**
```javascript
import '@fortawesome/fontawesome-free/css/all.min.css'
```

**React-Bootstrap Components:**
```javascript
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap'
```

### Custom CSS

All CSS files should use path aliases:
```javascript
import '@assets/styles/custom.css'     // ✅ Correct
import '../assets/styles/custom.css'   // ❌ Wrong
```

### Environment-Specific Configuration

**Development vs Production:**
```javascript
// src/api/config.js
const isDev = import.meta.env.MODE === 'development'

export const API_BASE_URL = isDev
  ? 'http://localhost:3000/api'      // Dev proxy
  : import.meta.env.VITE_API_URL     // Production URL
```

---

## Key Command Reference

### Development
```bash
# Start with instant reloading
npm run dev

# Changes appear immediately (HMR)
# Port: 3000
```

### Production Build
```bash
# Create optimized bundle
npm run build

# Creates dist/ folder
npm run preview    # Test production build

# Deploy dist/ folder to server
```

### Cleanup
```bash
# Complete reset
rm -rf node_modules package-lock.json .vite
npm install
npm run dev

# Check setup
node -v            # 14.18+
npm -v             # 6.0+
```

---

## Important Notes

### ⚠️ CRITICAL REQUIREMENTS

1. **index.html at root** - Vite requires it at project root, NOT in `public/`!
2. **VITE_ prefix** - All environment variables MUST start with `VITE_`
3. **import.meta.env** - Use instead of `process.env.REACT_APP_*`
4. **.jsx extension** - JSX files must use `.jsx` extension
5. **npm run dev** - Not `npm start` (that's Create React App)
6. **dist/ folder** - Production builds output to `dist/`, NOT `build/`

### 📁 Deployment

Deploy the **`dist/`** folder (not `build/`):

```bash
# 1. Build production
npm run build

# 2. Upload dist/ folder contents to your server
# 3. Configure web server (Apache/Nginx) to serve index.html for all routes
```

### Performance Tips

- ✅ Use path aliases to keep imports clean
- ✅ Lazy load heavy components with `React.lazy()`
- ✅ Split code into multiple bundles
- ✅ Let Vite handle tree-shaking automatically
- ✅ Use `.env.production` for production settings

### Debugging

```bash
# Verbose output
npm run dev -- --debug

# Check specific port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill process on port
taskkill /F /IM node.exe      # Windows
killall node                  # Mac/Linux
```

### 🔗 Related Documentation

- [SETUP-GUIDE.md](SETUP-GUIDE.md) - Complete project setup (45 min)
- [init-documentation.md](init-documentation.md) - Architecture & overview
- [README.md](README.md) - Project documentation index
- [Vite Official Docs](https://vitejs.dev/) - Official reference

---

## Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| 404 Page Not Found | Move `index.html` from `public/` to root |
| Cannot find module '@assets/...' | Verify file exists and alias configured |
| Environment variables undefined | Check `.env` has `VITE_` prefix |
| Port 3000 already in use | Kill node: `taskkill /F /IM node.exe` |
| JSX errors | Rename `.js` files to `.jsx` |
| Changes not reloading | Restart server, check import paths |

---

**Status:** ✅ **VITE MIGRATION COMPLETE**

The project is fully configured with Vite 7 + React 19 and ready for development!
