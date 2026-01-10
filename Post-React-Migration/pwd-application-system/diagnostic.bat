@echo off
REM Vite Setup Diagnostic Script for Windows
REM Run this to check if your Vite setup is correct

setlocal enabledelayedexpansion

echo ==========================================
echo Vite Setup Diagnostic Check (Windows)
echo ==========================================
echo.

REM Check Node version
echo 1. Checking Node.js version...
node -v >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo    [OK] Node.js: !NODE_VERSION!
    echo    [OK] npm: !NPM_VERSION!
) else (
    echo    [ERROR] Node.js not found!
    exit /b 1
)
echo.

REM Check current directory
echo 2. Checking current directory...
set "CURRENT_DIR=%cd%"
echo    Current: %CURRENT_DIR%
if "%CURRENT_DIR:pwd-application-system=%"=="%CURRENT_DIR%" (
    echo    [ERROR] Not in pwd-application-system directory!
    echo    Please run: cd Post-React-Migration\pwd-application-system
    exit /b 1
) else (
    echo    [OK] In correct directory
)
echo.

REM Check vite.config.js
echo 3. Checking vite.config.js...
if exist "vite.config.js" (
    echo    [OK] vite.config.js exists
    findstr /M "react" vite.config.js >nul
    if %errorlevel% equ 0 (
        echo    [OK] React plugin configured
    ) else (
        echo    [ERROR] React plugin not configured!
    )
) else (
    echo    [ERROR] vite.config.js not found!
    exit /b 1
)
echo.

REM Check public/index.html
echo 4. Checking public\index.html...
if exist "public\index.html" (
    echo    [OK] public\index.html exists
    findstr /M 'main.jsx' public\index.html >nul
    if %errorlevel% equ 0 (
        echo    [OK] Correct script tag found
    ) else (
        echo    [WARNING] main.jsx script tag not found
    )
) else (
    echo    [ERROR] public\index.html not found!
    exit /b 1
)
echo.

REM Check src/main.jsx
echo 5. Checking src\main.jsx...
if exist "src\main.jsx" (
    echo    [OK] src\main.jsx exists
    findstr /M "createRoot" src\main.jsx >nul
    if %errorlevel% equ 0 (
        echo    [OK] React 18+ API detected
    ) else (
        echo    [WARNING] React API might be outdated
    )
) else (
    echo    [ERROR] src\main.jsx not found!
    exit /b 1
)
echo.

REM Check src/App.js
echo 6. Checking src\App.js...
if exist "src\App.js" (
    echo    [OK] src\App.js exists
) else (
    echo    [ERROR] src\App.js not found!
)
echo.

REM Check .env file
echo 7. Checking .env file...
if exist ".env" (
    echo    [OK] .env file exists
    findstr /M "VITE_API_URL" .env >nul
    if %errorlevel% equ 0 (
        echo    [OK] VITE_API_URL configured
    ) else (
        echo    [ERROR] VITE_API_URL not found in .env
    )
) else (
    echo    [ERROR] .env file not found!
)
echo.

REM Check node_modules
echo 8. Checking node_modules...
if exist "node_modules" (
    echo    [OK] node_modules directory exists
    if exist "node_modules\vite" (
        echo    [OK] Vite package installed
    ) else (
        echo    [ERROR] Vite not installed!
    )
    if exist "node_modules\@vitejs\plugin-react" (
        echo    [OK] @vitejs/plugin-react installed
    ) else (
        echo    [ERROR] @vitejs/plugin-react not installed!
    )
) else (
    echo    [ERROR] node_modules not found!
    echo    Please run: npm install
)
echo.

REM Check package.json scripts
echo 9. Checking package.json scripts...
findstr /M '"dev".*"vite"' package.json >nul
if %errorlevel% equ 0 (
    echo    [OK] dev script configured for Vite
) else (
    echo    [ERROR] dev script not configured for Vite
)
echo.

REM Summary
echo ==========================================
echo Diagnostic check complete!
echo ==========================================
echo.
echo Next steps:
echo 1. If all checks passed, run: npm run dev
echo 2. If checks failed, review the errors above
echo 3. Check vite-troubleshooting-localhost-error.md for help
echo.

pause
