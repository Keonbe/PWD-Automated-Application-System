#!/bin/bash
# Vite Setup Diagnostic Script
# Run this to check if your Vite setup is correct

echo "=========================================="
echo "Vite Setup Diagnostic Check"
echo "=========================================="
echo ""

# Check Node version
echo "1. Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    echo "   ✓ Node.js: $NODE_VERSION"
    echo "   ✓ npm: $NPM_VERSION"
else
    echo "   ✗ Node.js not found!"
    exit 1
fi
echo ""

# Check current directory
echo "2. Checking current directory..."
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" == *"pwd-application-system"* ]]; then
    echo "   ✓ Current directory: $CURRENT_DIR"
else
    echo "   ✗ Not in pwd-application-system directory!"
    echo "   Please run: cd Post-React-Migration/pwd-application-system"
    exit 1
fi
echo ""

# Check vite.config.js
echo "3. Checking vite.config.js..."
if [ -f "vite.config.js" ]; then
    echo "   ✓ vite.config.js exists"
    if grep -q "plugins.*react" vite.config.js; then
        echo "   ✓ React plugin configured"
    else
        echo "   ✗ React plugin not configured!"
    fi
else
    echo "   ✗ vite.config.js not found!"
    exit 1
fi
echo ""

# Check public/index.html
echo "4. Checking public/index.html..."
if [ -f "public/index.html" ]; then
    echo "   ✓ public/index.html exists"
    if grep -q 'type="module".*src="/src/main.jsx"' public/index.html; then
        echo "   ✓ Correct script tag found"
    else
        echo "   ⚠ Script tag might be incorrect"
        grep "script.*main" public/index.html || echo "   No main.jsx script found"
    fi
else
    echo "   ✗ public/index.html not found!"
    exit 1
fi
echo ""

# Check src/main.jsx
echo "5. Checking src/main.jsx..."
if [ -f "src/main.jsx" ]; then
    echo "   ✓ src/main.jsx exists"
    if grep -q "ReactDOM.createRoot" src/main.jsx; then
        echo "   ✓ React 18+ API detected"
    else
        echo "   ⚠ React API might be outdated"
    fi
else
    echo "   ✗ src/main.jsx not found!"
    exit 1
fi
echo ""

# Check src/App.js
echo "6. Checking src/App.js..."
if [ -f "src/App.js" ]; then
    echo "   ✓ src/App.js exists"
else
    echo "   ✗ src/App.js not found!"
fi
echo ""

# Check .env file
echo "7. Checking .env file..."
if [ -f ".env" ]; then
    echo "   ✓ .env file exists"
    if grep -q "VITE_API_URL" .env; then
        echo "   ✓ VITE_API_URL configured"
    else
        echo "   ✗ VITE_API_URL not found in .env"
    fi
else
    echo "   ✗ .env file not found!"
fi
echo ""

# Check node_modules
echo "8. Checking node_modules..."
if [ -d "node_modules" ]; then
    echo "   ✓ node_modules directory exists"
    if [ -d "node_modules/vite" ]; then
        echo "   ✓ Vite package installed"
    else
        echo "   ✗ Vite not installed!"
    fi
    if [ -d "node_modules/@vitejs/plugin-react" ]; then
        echo "   ✓ @vitejs/plugin-react installed"
    else
        echo "   ✗ @vitejs/plugin-react not installed!"
    fi
else
    echo "   ✗ node_modules not found!"
    echo "   Please run: npm install"
fi
echo ""

# Check package.json scripts
echo "9. Checking package.json scripts..."
if grep -q '"dev".*"vite"' package.json; then
    echo "   ✓ dev script configured for Vite"
else
    echo "   ✗ dev script not configured for Vite"
fi
echo ""

# Summary
echo "=========================================="
echo "Diagnostic check complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. If all checks passed, run: npm run dev"
echo "2. If checks failed, review the errors above"
echo "3. Check vite-troubleshooting-localhost-error.md for help"
echo ""
