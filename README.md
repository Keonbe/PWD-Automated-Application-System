# PWD-Automated-Application-System
**A project for whole semester for ITWB311 “Web Development” subject**

A **PWD Automated Application System** built using **React**, **HTML, CSS, & Javascript** for midterm, and later on for the final term **Laravel**, structured for academic purposes. In partial fulfillment to ***ITWB311 “Web Development” subject***

Note: This repository contains a mixed codebase: a legacy static site (Pre-React-Migration/) and an in-progress React migration (Post-React-Migration/pwd-application-system). The React code lives in Post-React-Migration/pwd-application-system — that's the main project to run and work on.

Contents
- **Overview**
- **Tech Stack**
- **Prerequisites**
- **Install**
- **Run (development)**
- **Build (production**)
- **What to test (quick checklist**)
- **Project structure & important files**
- **Migration notes and temporary artifacts**
- **How to contribute (PR process)**
- **Contributors**
- **Documentation Guide**

## Overview
This system is designed to:
* PWD Accessible website for ease of application process
* Separate user views for Admin/Employees and User

## Tech Stack
* **Frontend:** `ReactJS`, `Bootstrap`, `HTML`/`CSS`/`JS`
* **Backend:** `Laravel` (Not yet implemented)
* **Database:** (Not yet implemented)
* **Tools:** `Visual Studio Code`, `Chrome DevTools`, `SheetDB` for Database API, `Postman` for API Testing


## Prerequisites
- Node.js (>= 16 recommended) and npm
- Git (for branching and PRs)

## Install
1. Clone the repo:

```bash
git clone https://github.com/Keonbe/PWD-Automated-Application-System.git
cd PWD-Automated-Application-System/Post-React-Migration/pwd-application-system
```

2. Install dependencies:

```bash
npm install
```

## Run (development)

Start the CRA development server (hot-reloads on change):

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Build (production)

Create an optimized production build (output in `build/`):

```bash
npm run build
```

## Serve the build locally (optional):

```bash
npm install -g serve
serve -s build
```

## What to test (quick checklist)
- Confirm pages render without console errors: Home, News, FAQ, Resources, Contact.
- Login page: go to /login and check the form UI and client-side validation.
- Registration/testing pages: visit /register or /registration depending on current routes.
- Verify header and footer appear across pages and links use client-side routing (no full page reload).
- Confirm assets (images/CSS) load and styles are applied.

## Project structure (short)
- Post-React-Migration/pwd-application-system/
  - public/ -> static public assets
  - src/
    - App.js -> main router and layout
    - index.js -> app entry and global imports
    - pages/ -> React pages grouped by feature (homepage, userpage, adminpage)
    - components/ -> header, footer, shared components
    - assets/styles/ -> CSS files (page-specific and shared)

## Migration notes and temporary artifacts
- The `Pre-React-Migration/` folder contains the original static HTML/CSS/JS site preserved for reference.
- During migration you'll see temporary files with names like `registerationtest.jsx` (note typos) and route aliases such as `/registrationcopy` — these are intentionally temporary. Before merging to `main`, please:
  - Choose canonical filenames and routes (e.g., `/register` mapped to `register.jsx`).
  - Remove duplicate routes like `/registrationcopy`.
  - Replace legacy HTML `href` links pointing at `Pre-React-Migration/...` with React Router `<Link to="/...">`.
  - Replace direct `window.location.href` usage with `useNavigate()`.

## How to contribute
1. Create a feature branch off `react-migration` (or `main` if applicable):

```bash
git checkout -b feature/<short-descr>
```

2. Make small commits and push:

```bash
git add .
git commit -m "Short, descriptive message"
git push origin feature/<short-descr>
```

3. Open a Pull Request on GitHub targeting `react-migration` (or `main`) and include:
- What you changed and why
- Any manual steps to validate
- Screenshots if UI changed


## Contributors

#### 👥 All Team Members 
<!-- Grid of all contributors -->
![Contributors Grid](https://contrib.rocks/image?repo=Keonbe/PWD-Automated-Application-System)

#### 🏆 Top Contributors to This Repo
<!-- Pie chart showing who contributed most -->
![Contribution Pie Chart](https://contrib.nn.ci/api?repo=Keonbe/PWD-Automated-Application-System&type=pie)

## Documentation Guide

1. **Start Here:** Read `init-documentation.md` to understand the project structure
2. **Start Here:** Read `README.md` in `/documentation` folder to understand Functions and API's used.
3. **Set Up:** Follow the setup instructions in `init-documentation.md`
4. **Learn APIs:** Review `api-documentation.md` to understand backend integration
5. **Study Functions:** Read `function-documentation.md` to understand code patterns