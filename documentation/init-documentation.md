# PWD Automated Application System
A **PWD Automated Application System** built using **React**, **HTML, CSS, & Javascript** for midterm, and later on for the final term **Laravel**, structured for academic purposes. 

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

## Overview
This system is designed to:
* PWD Accessible website for ease of application process
* Separate user views for Admin/Employees and User

---

## Tech Stack
* **Frontend:** `ReactJS`, `Bootstrap`, `HTML`/`CSS`/`JS`
* **Backend:** `Laravel` (Not yet implemented)
* **Database:** (Not yet implemented)
* **Tools:** `Visual Studio Code`, `Chrome DevTools`, `SheetDB`


## Project Structure (Partial Example)

```
PWD-AUTOMATED-APPLICATION/
├── Post-React-Migration/          # React Application (Current)
│   ├── node_modules/
│   ├── public/
│   │   ├── dasma-logo-only.png
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   │   ├── common/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── Navigation.js
│   │   │   ├── forms/
│   │   │   │   ├── LoginForm.js
│   │   │   │   └── RegistrationForm.js
│   │   │   └── ui/
│   │   │       ├── Card.js
│   │   │       └── Button.js
│   │   ├── pages/                 # Page components
│   │   │   ├── adminpage/
│   │   │   │   └── dashboard.jsx
│   │   │   ├── homepage/
│   │   │   │   ├── consent.jsx
│   │   │   │   ├── contact.jsx
│   │   │   │   ├── faq.jsx
│   │   │   │   ├── news.jsx
│   │   │   │   ├── register.jsx
│   │   │   │   └── resources.jsx
│   │   │   └── userpage/
│   │   │       └── userLogin.jsx
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
│   │   │   │   └── userlogin-styles.css
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
│   ├── developer-documentation # Documentation for Developers and development
│   ├──init-documentation.md # This Document
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
- Node.js (version 23 or higher)
- npm (comes with Node.js)
- Git

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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ,js
import 'bootstrap/dist/css/bootstrap.min.css'; // .jsx
import './App.css';

// Import components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Consent from './pages/Consent';
import Resources from './pages/Resources';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/news" element={<News />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
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
```
