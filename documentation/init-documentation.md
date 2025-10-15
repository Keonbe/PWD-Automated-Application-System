# PWD Automated Application System
A **PWD Automated Application System** built using **React**, **HTML, CSS, & Javascript** for midterm, and later on for the final term **Laravel**, structured for academic purposes. In partial fulfillment to ***ITWB311 “Web Development” subject***

---

## Table of Contents
- [PWD Automated Application System](#pwd-automated-application-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Tech Stack](#tech-stack)
  - [Project Structure (Partial Example)](#project-structure-partial-example)
  - [Setup Instructions](#setup-instructions)
    - [⚠️ About node\_modules](#️-about-node_modules)
    - [1. Clone and Navigate to React Project](#1-clone-and-navigate-to-react-project)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Project Configuration](#3-project-configuration)
      - [package.json (Example)](#packagejson-example)
    - [4. Key React Files Structure (Example)](#4-key-react-files-structure-example)
      - [src/App.js](#srcappjs)
      - [src/components/common/Header.js](#srccomponentscommonheaderjs)
      - [src/pages/Homepage.js](#srcpageshomepagejs)
    - [5. Start Development Server](#5-start-development-server)
    - [6. Build for Production](#6-build-for-production)
  - [Migration Strategy](#migration-strategy)
    - [Phase 1: Component Creation](#phase-1-component-creation)
    - [Phase 2: Styling Migration](#phase-2-styling-migration)
    - [Phase 3: State Management](#phase-3-state-management)
    - [Phase 4: Backend Integration](#phase-4-backend-integration)
  - [Dependencies Installed](#dependencies-installed)
  - [Development Life Cycle Documentation](#development-life-cycle-documentation)
    - [All Team Members involved](#all-team-members-involved)
    - [Background](#background)
    - [Midterm](#midterm)
    - [Final Term](#final-term)
  - [Legacy (HTML/CSS/JS) to React JS ⚛️](#legacy-htmlcssjs-to-react-js-️)
    - [Complete React Migration Guide](#complete-react-migration-guide)
      - [Phase 1: Routing \& Navigation Setup](#phase-1-routing--navigation-setup)
        - [1.1 Initial Route Configuration](#11-initial-route-configuration)
        - [1.2 Header Navigation Updates (`src/components/header.jsx`)](#12-header-navigation-updates-srccomponentsheaderjsx)
        - [1.3 Footer Navigation Updates (`src/components/footer.jsx`)](#13-footer-navigation-updates-srccomponentsfooterjsx)
        - [1.4 Asset Path Corrections](#14-asset-path-corrections)
        - [1.5 Verification Results](#15-verification-results)
      - [Phase 2: HTML to JSX Conversion Rules](#phase-2-html-to-jsx-conversion-rules)
        - [2.1 Attribute Transformations](#21-attribute-transformations)
        - [2.2 Event Handler Conversions](#22-event-handler-conversions)
        - [2.3 Link and Navigation Conversions](#23-link-and-navigation-conversions)
        - [2.4 Form Element Conversions](#24-form-element-conversions)
        - [2.5 Style Attribute Conversions](#25-style-attribute-conversions)
        - [2.6 Image and Asset Handling](#26-image-and-asset-handling)
        - [2.7 Script and External Library Integration](#27-script-and-external-library-integration)
        - [2.8 Conditional Rendering](#28-conditional-rendering)
        - [2.9 Dangerous HTML (innerHTML equivalent)](#29-dangerous-html-innerhtml-equivalent)
      - [Phase 3: SPA Navigation Best Practices](#phase-3-spa-navigation-best-practices)
        - [3.1 Why Avoid `window.location.href` in React](#31-why-avoid-windowlocationhref-in-react)
        - [3.2 Correct Navigation Patterns](#32-correct-navigation-patterns)
        - [3.3 Hash Links and Anchor Scrolling](#33-hash-links-and-anchor-scrolling)
        - [3.4 External Navigation (When `window.location` is OK)](#34-external-navigation-when-windowlocation-is-ok)
        - [3.5 Navigation History Management](#35-navigation-history-management)
        - [3.6 Navigation with Loading States](#36-navigation-with-loading-states)
        - [3.7 Migration Checklist](#37-migration-checklist)
        - [3.8 Common Navigation Mistakes to Avoid](#38-common-navigation-mistakes-to-avoid)
      - [Phase 4: Common Migration Issues \& Solutions](#phase-4-common-migration-issues--solutions)
        - [4.1 CSS and Styling Issues](#41-css-and-styling-issues)
        - [4.2 Asset Path Issues](#42-asset-path-issues)
        - [4.3 Bootstrap and JavaScript Issues](#43-bootstrap-and-javascript-issues)
        - [4.4 Link and Navigation Issues](#44-link-and-navigation-issues)
        - [4.5 Form Handling Issues](#45-form-handling-issues)
        - [4.6 Accessibility Issues](#46-accessibility-issues)
        - [4.7 State Management Issues](#47-state-management-issues)
        - [4.8 Troubleshooting Checklist](#48-troubleshooting-checklist)
      - [Phase 5: Testing \& Verification](#phase-5-testing--verification)
        - [5.1 Build Verification](#51-build-verification)
        - [5.2 Development Server Testing](#52-development-server-testing)
        - [5.3 Console Error Check](#53-console-error-check)
        - [5.4 Route Testing](#54-route-testing)
        - [5.5 Asset Loading Verification](#55-asset-loading-verification)
        - [5.6 Responsive Design Testing](#56-responsive-design-testing)
        - [5.7 Browser Compatibility Testing](#57-browser-compatibility-testing)
        - [5.8 Performance Verification](#58-performance-verification)
        - [5.9 Automated Testing (Optional)](#59-automated-testing-optional)
        - [5.10 Pre-Deployment Checklist](#510-pre-deployment-checklist)
        - [5.11 Post-Migration Follow-Ups](#511-post-migration-follow-ups)
        - [5.12 Common Test Failures \& Solutions](#512-common-test-failures--solutions)
        - [5.13 Monitoring Production Issues](#513-monitoring-production-issues)
  - [Follow-Up Resources](#follow-up-resources)
    - [Official Documentation](#official-documentation)
    - [Migration Tools](#migration-tools)
    - [Additional Libraries](#additional-libraries)
    - [Troubleshooting Commands](#troubleshooting-commands)
    - [Quick Reference Card](#quick-reference-card)
    - [Getting Help](#getting-help)

## Overview
This system is designed to:
* PWD Accessible website for ease of application process
* Separate user views for Admin/Employees and User

---

## Tech Stack
* **Frontend:** `ReactJS`, `Bootstrap`, `HTML`/`CSS`/`JS`
* **Backend:** `Laravel` (Not yet implemented)
* **Database:** (Not yet implemented)
* **Tools:** `Visual Studio Code`, `Chrome DevTools`,`SheetDB` for Database API, `Postman` for API Testing.


## Project Structure (Partial Example)

```
PWD-AUTOMATED-APPLICATION/
├── Post-React-Migration/          # React Application (Current)
│   ├── node_modules/
│   ├── public/
│   │   ├── dasma-logo-only.png   # Favicon
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   │   └── common/
│   │   │       ├── public-header.jsx
│   │   │       ├── public-footer.jsx
│   │   │       └── user-sidebar.jsx
│   │   ├── pages/                 # Page components
│   │   │   ├── adminpage/
│   │   │   │   └── adminpage.jsx
│   │   │   ├── homepage/
│   │   │   │   ├── consent.jsx
│   │   │   │   ├── contact.jsx
│   │   │   │   ├── faq.jsx
│   │   │   │   ├── news.jsx
│   │   │   │   ├── register.jsx
│   │   │   │   └── resources.jsx
│   │   │   ├── userpage/
│   │   │   │   └── userpage.jsx
│   │   │   ├── homepage.jsx
│   │   │   └── login.jsx
│   │   ├── assets/                # Assets
│   │   │   ├── images/             # Media (Images/Videos)
│   │   │   │   ├── dasma-logo-only.png
│   │   │   │   └── dasmarinas-holder.jpg
│   │   │   └── styles/                 # CSS Styling
│   │   │   │   ├── contact-styles.css
│   │   │   │   ├── faq-styles.css
│   │   │   │   ├── footer.css
│   │   │   │   ├── header.css
│   │   │   │   ├── index-styles.css
│   │   │   │   ├── news-styles.css
│   │   │   │   ├── resources-styles.css
│   │   │   │   └── userpage-styles.css
│   │   ├── utils/                 # Helper functions
│   │   │   ├── api.js
│   │   │   └── validation.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore      # React Project Git Ignore (node_modules and build)
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── Pre-React-Migration/           # Legacy HTML/CSS/JS
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │   │   ├── contact-styles.css
│   │   │   ├── faq-styles.css
│   │   │   ├── index-styles.css
│   │   │   ├── news-styles.css
│   │   │   ├── resource-styles.css
│   ├── pages/
│   │   ├── homepage/
│   │   │   ├── Index.html
│   │   │   ├── consent.html
│   │   │   ├── contact.html
│   │   │   ├── faq.html
│   │   │   ├── news.html
│   │   │   ├── register.html
│   │   │   └── resources.html
│   │   └── user/
│   │       └── userLogin.html
│   ├── templates/
│   │   ├── styles.css
│   │   └── template.html
├── documentation/
│   ├── api-documentation # Documentation for API
│   ├── function-documentation # Documentation for Function
│   ├── init-documentation.md # Documentation for Developers and development
│   └── README.md # Documentation for `documentation/` folder
├── README.md     # Github Readme.md
└── .gitignore    # Project Git Ignore
```

## Setup Instructions

### ⚠️ About node_modules

**Do NOT commit the** `node_modules` **folder to Git**. This is standard practice because:

- **File Size:** `node_modules` can be hundreds of megabytes
- **Platform Specific:** Dependencies may differ across operating systems
- **Dependency Management:** `package.json` + `package-lock.json` ensure consistent installations
- **Auto-generated:** The folder is automatically created when running `npm install`
  
**Prerequisites**
- `Node.js` (version 23 or higher)
- `npm` (comes with Node.js)
- `Git`

### 1. Clone and Navigate to React Project

```bash
# Clone the repository
git clone <your-repository-url>
cd PWD-AUTOMATED-APPLICATION-SYSTEM # Change directory to the cloned repository

# Navigate to React project folder
cd Post-React-Migration # Change directory to the react project folder
cd pwd-application-system # Change directory to the react folder


# Quick Navigation and Run React (Change file $PATH)
cd "/c/Users/user_name/Documents/folder_name/PWD AUTOMATED APPLICATION SYSTEM/PWD-Automated-Application-System/Post-React-Migration/pwd-application-system" && npm run build 
# Navigates to the React Project (pwd-application-system, where react files are stored). Creates production build and The build folder will contain optimized production files

cd "/c/Users/user_name/Documents/folder_name/PWD AUTOMATED APPLICATION SYSTEM/PWD-Automated-Application-System/Post-React-Migration/pwd-application-system" && npm start 
# Navigates to the React Project (pwd-application-system, where react files are stored). Starts the development server
```

### 2. Install Dependencies

```bash
# Install all project dependencies from package.json
npm install

# This command will automatically install:
# - React and React DOM
# - React Router DOM (for navigation)
# - React Bootstrap and Bootstrap (for UI components)
# - All other dependencies specified in package.json

# If you need specific additional dependencies:
npm install react-router-dom # Library that provides routing capabilities for React applications.
npm react-bootstrap bootstrap # React-Bootstrap replaces the Bootstrap JavaScript.
```

Kindly refer to [Dependencies Installed](#dependencies-installed) for specific dependencies used for this project

### 3. Project Configuration

#### package.json (Example)
```json
{
  "name": "pwd-application-system",
  "version": "0.1.0",
  "description": "PWD Automated Application System - React Frontend",
  "private": true,
  "dependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "bootstrap": "^5.3.8",
    "react": "^19.2.0",
    "react-bootstrap": "^2.10.10",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.3",
    "react-router-hash-link": "^2.4.3",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### 4. Key React Files Structure (Example)

#### src/App.js
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // .js
import 'bootstrap/dist/css/bootstrap.min.css'; // .jsx
import './App.css';

// Import components
import UserHeader from './components/public-header';
import UserFooter from './components/public-footer';
import HomePage from './pages/homepage';
import News from './pages/homepage/news';
import FAQ from './pages/homepage/faq';
import Resources from './pages/homepage/resources';
import Contact from './pages/homepage/contact';
import Consent from './pages/homepage/consent';
import Register from './pages/homepage/register';
import Login from './pages/login';
import RegisterResult from './pages/homepage/register-result';
import UserPage from './pages/userpage/userpage';
import AdminPage from './pages/adminpage/adminpage';
import './App.css';

function App() { 
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Public routes with public header and footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<News />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/result" element={<RegisterResult />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Authenticated user routes (no public header/footer) */}
          {/* Kean: User, Marqus: Admin */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/userpage" element={<UserPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/user/*" element={<UserPage />} />
            <Route path="/adminpage" element={<AdminPage />} />
          </Route>

          {/* Catch-all 404 must be last */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

//Layout for public pages (public header and footer)
function PublicLayout() {
  return (
    <>
      <UserHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <UserFooter />
    </>
  );
}

//Layout for authenticated user pages (specialized header/footer if needed)
function AuthenticatedLayout() {
  return <Outlet />;
}

```

#### src/components/common/Header.js
```jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="success" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/assets/images/dasma-logo-only.png"
            width="50"
            height="50"
            className="d-inline-block align-top me-2"
            alt="City of Dasmariñas Logo"
          />
          City of Dasmariñas — PWD Services Portal
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/news">News</Nav.Link>
            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
            <Nav.Link as={Link} to="/resources">Resources</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            <Nav.Link as={Link} to="/login" className="btn btn-warning text-dark ms-2">
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
```

#### src/pages/Homepage.js
```jsx
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1>City of Dasmariñas <span className="text-accent">PWD Application Portal</span></h1>
              <p className="lead">A dedicated platform for Persons with Disabilities to access services and support provided by the City of Dasmariñas.</p>
              <div className="d-grid gap-2 d-md-flex mt-4">
                <Button as={Link} to="/register" variant="primary" size="lg" className="me-md-2">
                  Apply Now
                </Button>
                <Button as={Link} to="/resources" variant="outline-light" size="lg">
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img 
                src="/assets/images/homepage/hero-image.png" 
                alt="PWD Services" 
                className="img-fluid hero-image"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <Container>
          <h2 className="section-title">PWD Services</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="service-card h-100 text-center">
                <Card.Body>
                  <div className="service-icon">♿</div>
                  <Card.Title>Accessibility Programs</Card.Title>
                  <Card.Text>Programs to improve accessibility in public spaces and transportation.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* Add more service cards */}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Homepage;
```

### 5. Start Development Server

```bash
# Start the development server
npm start
```

The application will open at `http://localhost:3000`

### 6. Build for Production

```bash
# Create production build
npm run build

# The build folder will contain optimized production files
```

## Migration Strategy

### Phase 1: Component Creation
1. Create reusable components (Header, Footer, Navigation)
2. Convert HTML pages to React components
3. Implement React Router for navigation

### Phase 2: Styling Migration
1. Convert CSS to CSS Modules or Styled Components
2. Integrate Bootstrap with React-Bootstrap
3. Ensure responsive design

### Phase 3: State Management
1. Add form handling
2. Implement API integration with SheetDB
3. Add client-side validation

### Phase 4: Backend Integration
1. Connect to Laravel API endpoints
2. Implement authentication
3. Add error handling

## Dependencies Installed

```bash
# Make sure you `cd` to the react project before using `npm install`, otherwise, node_modules/dependencies are installed outside of the react project.

# Core React
npm install react react-dom

# Routing
npm install react-router-dom

# UI Framework
npm install react-bootstrap bootstrap

# Hash link or Anchor link (Scrolls to a certain element with a certain ID)
npm install react-router-hash-link

# Font Awesome Icons and Fonts
npm install @fortawesome/fontawesome-free --save # Defunct Command: npm install @fortawesome/fontawesome-free; Doesn't save to package.json

# Recharts
npm install recharts
npm install rechart
```

---

## Development Life Cycle Documentation

### All Team Members involved
<!-- Grid of all contributors -->
![Contributors Grid](https://contrib.rocks/image?repo=Keonbe/PWD-Automated-Application-System)

- ***Keanu M. Bembo***
- ***Marqus Borromeo***

### Background

### Midterm

### Final Term

---

## Legacy (HTML/CSS/JS) to React JS ⚛️

### Complete React Migration Guide

This comprehensive guide covers the complete process of migrating legacy HTML/CSS/JS pages to a React single-page application (SPA), including routing setup, navigation patterns, and common issues.

---

#### Phase 1: Routing & Navigation Setup

**Branch:** react-migration

##### 1.1 Initial Route Configuration

**Changes Made to `src/App.js`:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<News />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<UserLogin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
```

##### 1.2 Header Navigation Updates (`src/components/header.jsx`)

**Before (HTML):**
```html
<a href="/" class="navbar-brand">City of Dasmariñas</a>
<a href="/news.html" class="nav-link">News</a>
<button onclick="location.href='/login.html'">Login</button>
```

**After (React):**
```jsx
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  
  return (
    <>
      <Link to="/" className="navbar-brand">City of Dasmariñas</Link>
      <Link to="/news" className="nav-link">News</Link>
      <button onClick={() => navigate('/login')}>Login</button>
    </>
  );
}
```

##### 1.3 Footer Navigation Updates (`src/components/footer.jsx`)

**Converted Links:**
- `<a href="/index.html#services">` → `<Link to="/#services">`
- `<a href="/faq.html">` → `<Link to="/faq">`
- `<a href="/resources.html">` → `<Link to="/resources">`
- `<a href="#">Application Status</a>` → `<Link to="#">Application Status</Link>` (placeholder)

**Note:** Hash links (`#services`) require additional setup for smooth scrolling (see Phase 3.3).

##### 1.4 Asset Path Corrections

**Fixed Import Paths:**
```jsx
// Before
import '../assets/styles/userlogin-styles.css';
import '../assets/images/dasmarinas-holder.jpg';

// After (corrected relative paths)
import '../../assets/styles/userlogin-styles.css';
import '../../assets/images/dasmarinas-holder.jpg';
```

##### 1.5 Verification Results

**Build Test:**
```bash
npm run build
# Result: ✓ Successful (ESLint warnings only, no errors)
```

**Runtime Test:**
```bash
npm start
# Result: ✓ In-app navigation works without page reloads
# Result: ✓ All routes render correctly
```

**Outstanding Items:**
- Several page components are empty (need content)
- Hash link scrolling not implemented
- ESLint accessibility warnings present (non-blocking)

---

#### Phase 2: HTML to JSX Conversion Rules

##### 2.1 Attribute Transformations

**Core Attribute Changes:**

| HTML Attribute | JSX Attribute | Example |
|----------------|---------------|---------|
| `class` | `className` | `<div className="container">` |
| `for` | `htmlFor` | `<label htmlFor="email">` |
| `onclick` | `onClick` | `<button onClick={handleClick}>` |
| `tabindex` | `tabIndex` | `<div tabIndex={-1}>` |
| `datetime` | `dateTime` | `<time dateTime="2025-10-08">` |
| `aria-*` | `aria-*` | Keep unchanged |
| `data-*` | `data-*` | Keep unchanged |

**Self-Closing Tags:**
```jsx
// HTML (optional closing)
<img src="logo.png" alt="Logo">
<input type="text">
<br>

// JSX (must self-close)
<img src="logo.png" alt="Logo" />
<input type="text" />
<br />
```

##### 2.2 Event Handler Conversions

**Inline JavaScript to React Handlers:**

```jsx
// HTML
<button onclick="location.href='/login.html'">Login</button>
<button onclick="alert('Clicked')">Click</button>
<a href="#" onclick="showModal(); return false;">Open</a>

// React JSX
<button onClick={() => window.location.href = '/login.html'}>Login</button>
<button onClick={() => alert('Clicked')}>Click</button>
<button onClick={showModal}>Open</button>
```

**Using useNavigate for SPA Navigation:**
```jsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/login')}>Login</button>
  );
}
```

##### 2.3 Link and Navigation Conversions

**Internal Navigation (within SPA):**

```jsx
// HTML - External links (causes full reload)
<a href="/news.html">News</a>
<a href="/faq.html">FAQ</a>

// React - SPA navigation (no reload)
import { Link } from 'react-router-dom';

<Link to="/news">News</Link>
<Link to="/faq">FAQ</Link>
```

**External Links (outside SPA):**
```jsx
// Keep as regular anchors with security attributes
<a 
  href="https://external-site.com" 
  target="_blank" 
  rel="noopener noreferrer"
>
  External Link
</a>
```

**Hash Links with Smooth Scrolling:**
```jsx
// Install: npm install react-router-hash-link
import { HashLink } from 'react-router-hash-link';

<HashLink to="/#services" smooth>PWD Services</HashLink>
<HashLink to="/about#team" smooth>Our Team</HashLink>
```

**Download Links:**
```jsx
// Direct file downloads (keep as regular anchors)
<a href="/files/application-form.pdf" download>
  Download Form
</a>
```

##### 2.4 Form Element Conversions

**Labels and Inputs:**
```jsx
// HTML
<label for="email">Email</label>
<input type="email" id="email" class="form-control">

// JSX
<label htmlFor="email">Email</label>
<input type="email" id="email" className="form-control" />
```

**Invalid Label Usage (legacy code fix):**
```jsx
// HTML - Invalid: label used as clickable link
<label for="section" onclick="navigate()">Click here</label>

// JSX - Fixed: use button for actions
<button type="button" onClick={navigate}>Click here</button>

// JSX - Fixed: use anchor for links
<a href="/section">Click here</a>
```

##### 2.5 Style Attribute Conversions

**Inline Styles:**
```jsx
// HTML
<div style="color: red; margin-top: 10px;">Text</div>

// JSX (convert to object)
<div style={{ color: 'red', marginTop: '10px' }}>Text</div>
```

**CSS Class Handling:**
```jsx
// Keep original class names unchanged
// HTML
<div class="card shadow-sm mb-4">

// JSX
<div className="card shadow-sm mb-4">
```

##### 2.6 Image and Asset Handling

**Method 1: Import in Component (Bundled Assets)**
```jsx
// Recommended for images in src/assets/
import logo from '../assets/images/logo.png';
import bannerImg from '../assets/images/banner.jpg';

<img src={logo} alt="Logo" />
<img src={bannerImg} alt="Banner" />
```

**Method 2: Public Folder (Static Assets)**
```jsx
// For assets in public/ folder
// File: public/assets/images/logo.png

<img src="/assets/images/logo.png" alt="Logo" />
<img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="Logo" />
```

##### 2.7 Script and External Library Integration

**Bootstrap JS:**
```jsx
// Option 1: Import in index.js (recommended)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Option 2: CDN in public/index.html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

**Font Awesome:**
```bash
# Install package
npm install @fortawesome/fontawesome-free --save

# Import in index.js
import '@fortawesome/fontawesome-free/css/all.min.css';
```

**Legacy Global Scripts:**
```jsx
// HTML - Global script
<script>
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
  });
</script>

// React - Convert to useEffect
import { useEffect } from 'react';

function Component() {
  useEffect(() => {
    console.log('Component mounted');
  }, []); // Empty dependency array = run once on mount
}
```

##### 2.8 Conditional Rendering

**Display/Hide Elements:**
```jsx
// HTML with inline style
<div style="display: none;" id="modal">Content</div>

// React with conditional rendering
function Component() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      {showModal && <div>Content</div>}
      <button onClick={() => setShowModal(!showModal)}>Toggle</button>
    </>
  );
}
```

##### 2.9 Dangerous HTML (innerHTML equivalent)

**When You Must Inject HTML:**
```jsx
// HTML
<div id="content"></div>
<script>
  document.getElementById('content').innerHTML = '<p>Dynamic content</p>';
</script>

// React (use cautiously - XSS risk)
function Component() {
  const htmlContent = '<p>Dynamic content</p>';
  
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
```

**⚠️ Security Warning:** Only use `dangerouslySetInnerHTML` with sanitized, trusted content. Prefer rendering structured JSX when possible.

---

#### Phase 3: SPA Navigation Best Practices

##### 3.1 Why Avoid `window.location.href` in React

**Problems with Full Page Reloads:**

1. **Performance Issues**
   - Forces browser to re-download all JS/CSS bundles
   - Re-initializes entire React application
   - Slower user experience compared to client-side routing

2. **State Loss**
   - All React component state cleared
   - Context providers reset
   - Redux/state management stores cleared
   - In-memory caches lost

3. **Poor User Experience**
   - Page flicker during reload
   - Loading indicators restart
   - Scroll position lost
   - Form data may be lost

4. **Development Complications**
   - Bypasses React Router's history management
   - Difficult to implement route guards/middleware
   - Hard to test navigation flows
   - Cannot use route transitions/animations

##### 3.2 Correct Navigation Patterns

**Pattern 1: Declarative Links (User-Driven Navigation)**

Best for: Navigation triggered by user clicks (menus, buttons, cards)

```jsx
import { Link } from 'react-router-dom';

// Basic link
<Link to="/about">About Us</Link>

// Link styled as button
<Link to="/login" className="btn btn-primary">
  Login
</Link>

// Link with state passing
<Link 
  to="/profile" 
  state={{ from: 'dashboard' }}
>
  View Profile
</Link>

// Link with search params
<Link to="/search?query=react">Search</Link>
```

**Pattern 2: Programmatic Navigation (Code-Driven)**

Best for: Navigation after events (form submit, API response, timeout)

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  async function handleLogin(credentials) {
    try {
      await loginAPI(credentials);
      
      // Navigate after successful login
      navigate('/dashboard');
      
      // Or replace history (prevent back to login)
      navigate('/dashboard', { replace: true });
      
      // Pass state to next route
      navigate('/welcome', { 
        state: { username: credentials.username } 
      });
      
    } catch (error) {
      console.error('Login failed');
    }
  }
  
  return <form onSubmit={handleLogin}>...</form>;
}
```

**Pattern 3: Navigation in Effects**

Best for: Redirects based on conditions (auth checks, data loading)

```jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute() {
  const navigate = useNavigate();
  const isAuthenticated = checkAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  return isAuthenticated ? <Dashboard /> : null;
}
```

**Pattern 4: Navigation with Confirmation**

Best for: Leaving forms with unsaved changes

```jsx
import { useNavigate, useBlocker } from 'react-router-dom';

function FormPage() {
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Block navigation if unsaved changes
  useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges &&
      currentLocation.pathname !== nextLocation.pathname
  );
  
  function handleSave() {
    saveData();
    setHasUnsavedChanges(false);
    navigate('/success');
  }
}
```

##### 3.3 Hash Links and Anchor Scrolling

**Problem:** React Router doesn't auto-scroll to hash anchors.

**Solution 1: Using react-router-hash-link**

```bash
npm install react-router-hash-link
```

```jsx
import { HashLink } from 'react-router-hash-link';

// Smooth scroll to element on same page
<HashLink to="#services" smooth>
  Our Services
</HashLink>

// Smooth scroll to element on different page
<HashLink to="/about#team" smooth>
  Meet Our Team
</HashLink>

// Custom scroll behavior
<HashLink 
  to="#contact"
  smooth
  scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
>
  Contact Us
</HashLink>
```

**Solution 2: Custom useScrollToHash Hook**

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useScrollToHash() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
}

// Use in component
function App() {
  useScrollToHash();
  return <Routes>...</Routes>;
}
```

##### 3.4 External Navigation (When `window.location` is OK)

**Acceptable Use Cases:**

```jsx
// 1. External domains
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  External Site
</a>

// 2. File downloads
<a href="/files/document.pdf" download>Download PDF</a>

// 3. Mailto/tel links
<a href="mailto:info@example.com">Email Us</a>
<a href="tel:+1234567890">Call Us</a>

// 4. Intentional full refresh (rare)
function handleLogout() {
  clearAllData();
  window.location.href = '/login'; // Force complete app reset
}

// 5. Legacy system integration
function redirectToOldSystem() {
  window.location.href = 'https://legacy-system.com/dashboard';
}
```

##### 3.5 Navigation History Management

**Understanding History Stack:**

```jsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  // Push new entry (default) - user can go back
  navigate('/page2'); // History: [page1, page2]
  
  // Replace current entry - user cannot go back
  navigate('/page2', { replace: true }); // History: [page2]
  
  // Go back
  navigate(-1); // Go back 1 page
  navigate(-2); // Go back 2 pages
  
  // Go forward
  navigate(1); // Go forward 1 page
}
```

**Best Practices:**

```jsx
// After successful login - prevent back to login page
navigate('/dashboard', { replace: true });

// After logout - clear history and prevent back
navigate('/login', { replace: true });

// After form submission - prevent duplicate submissions
navigate('/success', { replace: true });

// Multi-step forms - allow back navigation
navigate('/step2'); // Use default push
```

##### 3.6 Navigation with Loading States

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DataPage() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  
  async function handleNavigate() {
    setIsNavigating(true);
    
    try {
      await saveData(); // Wait for async operation
      navigate('/success');
    } catch (error) {
      setIsNavigating(false);
      showError(error);
    }
  }
  
  return (
    <button onClick={handleNavigate} disabled={isNavigating}>
      {isNavigating ? 'Saving...' : 'Continue'}
    </button>
  );
}
```

##### 3.7 Migration Checklist

**Step-by-Step Navigation Migration:**

- [ ] **Search for `window.location.href`**
  ```bash
  grep -r "window.location.href" src/
  ```

- [ ] **Search for `href="#"` placeholders**
  ```bash
  grep -r 'href="#"' src/
  ```

- [ ] **Replace internal links with `<Link>`**
  - Change `<a href="/page">` to `<Link to="/page">`
  - Keep external links as `<a>`

- [ ] **Replace navigation redirects with `useNavigate`**
  - Change `window.location.href = '/page'` to `navigate('/page')`
  - Add `replace: true` after login/logout

- [ ] **Update routes in `App.js`**
  - Ensure all navigation paths have corresponding routes

- [ ] **Fix placeholder anchors**
  - Replace `<a href="#">` with buttons or proper links

- [ ] **Add hash link support**
  - Install `react-router-hash-link` if needed
  - Or implement custom scroll hook

- [ ] **Test navigation flows**
  - Verify no full page reloads on internal links
  - Check browser back/forward buttons work
  - Confirm state persists during navigation

- [ ] **Run build and fix lint errors**
  ```bash
  npm run build
  ```

##### 3.8 Common Navigation Mistakes to Avoid

❌ **Don't:**
```jsx
// Using window.location for internal navigation
onClick={() => window.location.href = '/dashboard'}

// Missing return value in route
<Route path="/" element={Dashboard} /> // Wrong - should be element={<Dashboard />}

// Using anchor for internal navigation
<a href="/about">About</a>

// Forgetting to prevent default on links
<a href="/page" onClick={handleClick}>Click</a> // Will cause full reload
```

✅ **Do:**
```jsx
// Use navigate for programmatic navigation
onClick={() => navigate('/dashboard')}

// Correct element prop
<Route path="/" element={<Dashboard />} />

// Use Link for internal navigation
<Link to="/about">About</Link>

// Prevent default when needed
<a href="/page" onClick={(e) => { e.preventDefault(); handleClick(); }}>
  Click
</a>
```

---

#### Phase 4: Common Migration Issues & Solutions

##### 4.1 CSS and Styling Issues

**Issue 1: `class` vs `className`**

❌ **Problem:**
```jsx
// HTML attribute in JSX
<div class="container">Content</div>
// Result: React warning, styles may not apply
```

✅ **Solution:**
```jsx
<div className="container">Content</div>
```

**Bulk Fix Command:**
```bash
# Search for class attributes (review before replacing)
grep -r 'class="' src/
```

**Issue 2: CSS `!important` Typo**

❌ **Problem:**
```css
/* Invalid CSS with space */
.element {
  color: red ! important;
}
```

✅ **Solution:**
```css
.element {
  color: red !important;
}
```

**Issue 3: CSS Import Order**

❌ **Problem:**
```jsx
// src/index.js - Wrong order
import './App.css'; // Your styles first
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap overrides your styles
```

✅ **Solution:**
```jsx
// src/index.js - Correct order
import 'bootstrap/dist/css/bootstrap.min.css'; // Framework first
import './index.css'; // Global styles
import './App.css'; // Component styles last (highest priority)
```

**Issue 4: Missing CSS Files**

**Verification Steps:**
```bash
# Check if CSS files exist
ls -la src/assets/styles/

# Verify CSS is imported
grep -r "import.*\.css" src/
```

##### 4.2 Asset Path Issues

**Issue: Broken Image/Asset Paths**

❌ **Problem:**
```jsx
// Component in src/pages/userpage/UserLogin.jsx
import '../assets/images/logo.png'; // Wrong - goes to src/assets
```

✅ **Solution:**
```jsx
// Correct relative path from nested component
import '../../assets/images/logo.png'; // Goes to src/assets
```

**Path Reference Guide:**
```
src/
├── pages/
│   └── userpage/
│       └── UserLogin.jsx  ← Your component
└── assets/
    └── images/
        └── logo.png       ← Target file

// From UserLogin.jsx to logo.png:
// ../ = go to pages/
// ../../ = go to src/
// ../../assets/images/logo.png = correct path
```

##### 4.3 Bootstrap and JavaScript Issues

**Issue 1: Bootstrap JS Not Working**

❌ **Problem:**
```jsx
// Bootstrap components (modals, dropdowns) don't work
```

✅ **Solution:**
```jsx
// Import Bootstrap bundle once in src/index.js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

**Issue 2: Duplicate Bootstrap Imports**

❌ **Problem:**
```jsx
// Multiple files importing Bootstrap JS
// index.js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Header.jsx
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Duplicate!
```

✅ **Solution:**
```jsx
// Import Bootstrap JS ONLY ONCE in index.js
// Remove imports from individual components
```

**Issue 3: Global Script Dependencies**

❌ **Problem:**
```html
<!-- Legacy HTML with global script -->
<script>
  $(document).ready(function() {
    $('.dropdown').dropdown();
  });
</script>
```

✅ **Solution:**
```jsx
import { useEffect, useRef } from 'react';

function Component() {
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // Initialize Bootstrap dropdown
    const dropdown = new window.bootstrap.Dropdown(dropdownRef.current);
    
    return () => dropdown.dispose(); // Cleanup
  }, []);
  
  return <div ref={dropdownRef}>...</div>;
}
```

##### 4.4 Link and Navigation Issues

**Issue 1: `href="#"` Placeholders**

❌ **Problem:**
```jsx
<a href="#" onClick={handleClick}>Action</a>
// ESLint warning: anchor-is-valid
```

✅ **Solutions:**
```jsx
// For actions: use button
<button type="button" className="btn btn-link" onClick={handleClick}>
  Action
</button>

// For modal triggers
<button type="button" data-bs-toggle="modal" data-bs-target="#myModal">
  Open Modal
</button>

// For navigation
<Link to="/page">Go to Page</Link>
```

**Issue 2: External vs Internal Links**

❌ **Problem:**
```jsx
// External link without security attributes
<a href="https://example.com" target="_blank">External</a>
// Security risk: window.opener access
```

✅ **Solution:**
```jsx
// Always add rel attribute for external links
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener noreferrer"
>
  External
</a>
```

##### 4.5 Form Handling Issues

**Issue: Legacy Form Submission**

❌ **Problem:**
```html
<form action="/submit" method="POST">
  <!-- Causes full page reload -->
</form>
```

✅ **Solution:**
```jsx
import { useState } from 'react';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    
    // Handle submission with API
    submitToAPI(formData);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

##### 4.6 Accessibility Issues

**Issue 1: Redundant Alt Text**

❌ **Problem:**
```jsx
<img src="logo.png" alt="logo image" />
// ESLint: img-redundant-alt (word "image" is redundant)
```

✅ **Solution:**
```jsx
<img src="logo.png" alt="Company logo" />
<img src="banner.jpg" alt="City hall building" />
```

**Issue 2: Invalid ARIA Attributes**

❌ **Problem:**
```jsx
<div aria-label="button" onClick={handleClick}>Click</div>
// Div has button behavior but wrong semantics
```

✅ **Solution:**
```jsx
<button type="button" aria-label="Close menu" onClick={handleClick}>
  Click
</button>
```

##### 4.7 State Management Issues

**Issue: Lost State on Navigation**

❌ **Problem:**
```jsx
// Using window.location causes state loss
onClick={() => window.location.href = '/dashboard'}
```

✅ **Solution:**
```jsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(data);
  
  // Navigate while preserving state in context/Redux
  // Or pass state through navigation
  onClick={() => navigate('/dashboard', { state: { userData } })}
}
```

##### 4.8 Troubleshooting Checklist

**Component Not Rendering:**
- [ ] Check if component is imported correctly
- [ ] Verify route exists in `App.js`
- [ ] Check for JavaScript errors in console
- [ ] Ensure component returns JSX (not undefined)
- [ ] Look for CSS `display: none` hiding content

**Styles Not Applying:**
- [ ] Verify `className` (not `class`)
- [ ] Check CSS file is imported
- [ ] Confirm CSS import order (framework before custom)
- [ ] Look for `!important` typos
- [ ] Inspect element in DevTools to see computed styles

**Navigation Not Working:**
- [ ] Check if using `<Link>` for internal navigation
- [ ] Verify routes match navigation paths
- [ ] Ensure `BrowserRouter` wraps app
- [ ] Check for JavaScript errors preventing navigation
- [ ] Verify no `href` attributes on internal links

**Build Errors:**
- [ ] Run `npm install` to ensure dependencies
- [ ] Check for syntax errors (unclosed tags, missing commas)
- [ ] Verify all imports resolve correctly
- [ ] Look for `class` instead of `className`
- [ ] Check for self-closing tags (`<img />` not `<img>`)

---

#### Phase 5: Testing & Verification

##### 5.1 Build Verification

**Run Production Build:**
```bash
cd Post-React-Migration/pwd-application-system
npm run build
```

**Expected Results:**
```
✓ Build completed successfully
✓ No compilation errors
⚠ ESLint warnings (acceptable if accessibility-only)
✓ Build folder generated with optimized files
```

**Check Build Output:**
```bash
ls -la build/
# Should contain:
# - index.html
# - static/css/
# - static/js/
# - static/media/
```

##### 5.2 Development Server Testing

**Start Dev Server:**
```bash
npm start
# Opens http://localhost:3000
```

**Manual Testing Checklist:**

**Navigation Testing:**
- [ ] Click all header navigation links
- [ ] Click all footer links
- [ ] Verify no full page reloads (watch Network tab)
- [ ] Test browser back/forward buttons
- [ ] Verify URL updates correctly

**Component Rendering:**
- [ ] Homepage displays all sections
- [ ] All route pages render without errors
- [ ] Images load correctly
- [ ] CSS styling applies properly

**Interactive Elements:**
- [ ] Forms accept input
- [ ] Buttons trigger expected actions
- [ ] Modals open/close properly
- [ ] Dropdowns expand/collapse
- [ ] Mobile menu toggle works

**Accessibility:**
- [ ] Tab navigation works through elements
- [ ] Links have visible focus indicators
- [ ] Alt text present on images
- [ ] ARIA labels on interactive elements

##### 5.3 Console Error Check

**Open Browser DevTools:**
```
F12 or Right-click → Inspect → Console tab
```

**Verify:**
- [ ] No React errors (red messages)
- [ ] No 404 errors for assets
- [ ] No CSS parse errors
- [ ] No JavaScript runtime errors

**Common Errors to Fix:**
```
❌ Warning: Invalid DOM property `class`. Did you mean `className`?
   Fix: Replace class="..." with className="..."

❌ Warning: `<a>` tag missing `href` attribute
   Fix: Use <button> for actions or add valid href

❌ Error: Cannot find module '../assets/images/logo.png'
   Fix: Correct relative import path

❌ Warning: Each child in a list should have a unique "key" prop
   Fix: Add key={index} or key={item.id} to mapped elements
```

##### 5.4 Route Testing

**Test All Routes Manually:**

```bash
# Open each route in browser
http://localhost:3000/
http://localhost:3000/news
http://localhost:3000/faq
http://localhost:3000/resources
http://localhost:3000/contact
http://localhost:3000/login
```

**Verify:**
- [ ] Each route renders correct component
- [ ] No 404 errors
- [ ] Header/Footer appear on all pages
- [ ] Direct URL access works (not just navigation)

##### 5.5 Asset Loading Verification

**Check Network Tab:**
```
DevTools → Network tab → Reload page
```

**Verify:**
- [ ] All CSS files load (200 status)
- [ ] All images load (200 status)
- [ ] JavaScript bundles load
- [ ] No 404 errors for missing files

**Filter by type:**
```
Filter: CSS - Check all stylesheets load
Filter: Img - Check all images load
Filter: JS - Check all scripts load
```

##### 5.6 Responsive Design Testing

**Test Different Screen Sizes:**

```
DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

**Test Breakpoints:**
- [ ] Mobile (320px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1200px+)

**Verify:**
- [ ] Mobile menu toggle works
- [ ] Layout adapts to screen size
- [ ] Images scale appropriately
- [ ] Text remains readable
- [ ] No horizontal scrolling

##### 5.7 Browser Compatibility Testing

**Test in Multiple Browsers:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

**Verify:**
- [ ] Consistent rendering across browsers
- [ ] No browser-specific errors
- [ ] CSS features supported

##### 5.8 Performance Verification

**Check Bundle Sizes:**

```bash
npm run build

# Review build output
File sizes after gzip:

  XX.XX kB  build/static/js/main.xxxxx.js
  X.XX kB   build/static/css/main.xxxxx.css
```

**Performance Metrics:**
- [ ] Initial page load < 3 seconds
- [ ] Route transitions instantaneous
- [ ] No layout shifts during load
- [ ] Images optimized/compressed

##### 5.9 Automated Testing (Optional)

**Basic Smoke Tests:**

```jsx
// src/App.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders header', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const headerElement = screen.getByText(/City of Dasmariñas/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders footer', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const footerElement = screen.getByText(/PWD Services/i);
  expect(footerElement).toBeInTheDocument();
});
```

**Run Tests:**
```bash
npm test
```

##### 5.10 Pre-Deployment Checklist

**Code Quality:**
- [ ] No console.log statements in production code
- [ ] No commented-out code blocks
- [ ] Consistent code formatting
- [ ] Meaningful variable/function names

**Configuration:**
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Public URL set correctly in package.json

**Documentation:**
- [ ] README.md updated
- [ ] Setup instructions accurate
- [ ] Known issues documented

**Git:**
- [ ] All changes committed
- [ ] Branch up to date with main
- [ ] .gitignore includes node_modules and build

##### 5.11 Post-Migration Follow-Ups

**High Priority:**
1. **Hash Link Scrolling**
   ```bash
   npm install react-router-hash-link
   ```
   - Replace `Link to="/#services"` with `<HashLink to="/#services" smooth>`

2. **Accessibility Fixes**
   - Update all `alt` attributes (remove "image" wording)
   - Replace `href="#"` with buttons or valid links
   - Add ARIA labels where needed

3. **Empty Page Content**
   - Populate `news.jsx`, `faq.jsx`, etc. with actual content
   - Add placeholder content if final content not ready

**Medium Priority:**
4. **Form Validation**
   - Add client-side validation for all forms
   - Implement error message display
   - Add loading states during submission

5. **Error Boundaries**
   ```jsx
   // src/components/ErrorBoundary.jsx
   import React from 'react';
   
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }
     
     static getDerivedStateFromError(error) {
       return { hasError: true };
     }
     
     render() {
       if (this.state.hasError) {
         return <h1>Something went wrong.</h1>;
       }
       return this.props.children;
     }
   }
   ```

6. **Loading States**
   - Add spinners for route transitions
   - Implement skeleton screens for data loading

**Low Priority:**
7. **Code Splitting**
   ```jsx
   import { lazy, Suspense } from 'react';
   
   const News = lazy(() => import('./pages/News'));
   
   <Suspense fallback={<div>Loading...</div>}>
     <Routes>
       <Route path="/news" element={<News />} />
     </Routes>
   </Suspense>
   ```

8. **SEO Optimization**
   - Add React Helmet for meta tags
   - Implement sitemap
   - Configure robots.txt

9. **Analytics Integration**
   - Add Google Analytics or similar
   - Track route changes
   - Monitor user interactions

##### 5.12 Common Test Failures & Solutions

**Issue: "Cannot find module" Errors**

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue: Tests Fail with Router Errors**

```jsx
// Problem: Components using useNavigate/useLocation outside Router

// Solution: Wrap test in BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

render(
  <BrowserRouter>
    <ComponentUsingRouter />
  </BrowserRouter>
);
```

**Issue: CSS Not Loading in Tests**

```jsx
// Add to setupTests.js
import '@testing-library/jest-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
```

##### 5.13 Monitoring Production Issues

**Set Up Error Tracking:**

```jsx
// Example with basic error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to logging service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to logging service
});
```

**User Feedback Mechanism:**
- Add feedback button in footer
- Implement bug report form
- Monitor console errors in production

---

## Follow-Up Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Create React App Documentation](https://create-react-app.dev/)
- [Bootstrap React Documentation](https://react-bootstrap.github.io/)

### Migration Tools
- [React DevTools](https://react.dev/learn/react-developer-tools) - Browser extension for debugging
- [ESLint React Plugin](https://www.npmjs.com/package/eslint-plugin-react) - Code quality checks
- [Prettier](https://prettier.io/) - Code formatting

### Additional Libraries
```bash
# Form handling
npm install react-hook-form

# State management (if needed for complex apps)
npm install @reduxjs/toolkit react-redux

# API requests
npm install axios

# Date handling
npm install date-fns

# Toast notifications
npm install react-hot-toast
```

### Troubleshooting Commands

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit
npm audit fix

# Check bundle size
npm run build
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

### Quick Reference Card

**Most Common Conversions:**
```
HTML              → JSX
──────────────────────────────────
class             → className
for               → htmlFor
onclick           → onClick
<img src="">      → <img src="" />
<a href="/page">  → <Link to="/page">
window.location   → navigate()
href="#"          → <button> or <Link>
```

**Most Common Imports:**
```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

---

### Getting Help

**Internal Documentation:**
- Check `documentation/` folder for project-specific guides
- Review Git commit history for migration context
- Refer to inline code comments

**Community Support:**
- [Stack Overflow - React](https://stackoverflow.com/questions/tagged/reactjs)
- [React Discord Community](https://discord.gg/react)
- [Reddit - r/reactjs](https://reddit.com/r/reactjs)

**Team Support:**
- Create issues in project repository
- Request code review for major changes
- Document solutions for future reference
