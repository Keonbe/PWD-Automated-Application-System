# PWD-Automated-Application-System
**A project for whole semester for ITWB311 “Web Development” subject**

A **PWD Automated Application System** built using **React**, **HTML, CSS, & Javascript** for midterm, and later on for the final term **Laravel**, structured for academic purposes. In partial fulfillment to ***ITWB311 “Web Development” subject***

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Repo Size">
  <img src="https://img.shields.io/github/contributors/Keonbe/PWD-Automated-Application-System?style=plastic" alt="Contributors">

  <img src="/documentation/images/homepage-screenshot.png" alt="Homepage Screenshot" width="600"/>
</p>

Note: This repository contains a mixed codebase: *a legacy static site* `(Pre-React-Migration/)` and an in-progress *React migration* `(Post-React-Migration/pwd-application-system)`. The React code lives in `Post-React-Migration/pwd-application-system` — that's the main project to run and  we will work on.

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
* Streamlined user experience for both applicants and administrators
* Improved accessibility features for users with disabilities
* Efficient data management solutions
* User-friendly interface with intuitive navigation
* Responsive design for various devices
* Separate dedicated pages for Admin/Employees and User

## Functionality

This React-based frontend (located in `Post-React-Migration/pwd-application-system/src`) implements the user-first functionality for the PWD Automated Application System. The summary below describes the main pages, shared components, API wrappers, and the typical flow through the app.

- Pages & routes (what the user sees):
  - **Public pages**: Home, News, FAQ, Resources, Contact — located under `src/pages/homepage` and its children.
  - **Authentication**: 
    - `src/pages/login.jsx` provides login. 
    - Registration and registration result pages are `src/pages/homepage/register.jsx` and `register-result.jsx`.
  - **User area**: `src/pages/userpage/userpage.jsx` — the authenticated user dashboard.
  - **Admin area**: `src/pages/adminpage/adminpage.jsx` and `src/pages/adminpage/adminverify.jsx` for admin-specific views and verification.

- Shared UI components:
  - `src/components/public-header.jsx` and `src/components/public-footer.jsx` — site header/footer and navigation used across routes.
  - `src/components/adminsidebar.jsx` — admin navigation and layout helper.
  - `src/components/statuschart.jsx` — chart/status widget used by admin pages.
  *[More shared components soon.]*

- Styling & assets:
  - CSS: page styles live in `src/assets/styles/`
  - Images and static assets in `src/assets/images` and the `public/` folder.

- API integration and data flow:
  - API wrappers live in `src/api/`:
    - `registrationApi.js` — handles registration submissions.
    - `userApi.js` — handles user operations such as login and status checks.
  - Typical flow: a page/component collects form inputs -> calls a function from `src/api/*` -> that function performs an HTTP request (to SheetDB or a future backend) -> the component reads the response and updates UI/state or navigates to a result page.
- Backend:
  - The backend is not yet implemented. Currently, the app uses [SheetDB](https://sheetdb.io/) as a temporary backend to store registration data in Google Sheets.
  - In future phases, a PHP + MySQL backend using XAMPP with AXIOS will be developed to replace SheetDB for better performance and security.

## Tech Stack
## Tech Stack

- **Frontend:**
  <p align="left">
    <img src="https://skillicons.dev/icons?i=react,bootstrap,html,css,js" alt="Frontend Icons">
  </p>

  - `ReactJS`
  - `Bootstrap`
  - `HTML`/`CSS`/`JS` ***(Legacy)***

  <br>

- **Backend:**
  <p align="left">
  <img src="https://img.shields.io/badge/Xampp-F37623?style=for-the-badge&logo=xampp&logoColor=white" alt="XAMPP Badge" />
  </p>

  - `SheetDB` ***(Temporary - midterm)***
  - `XAMPP (PHP + MySQL)` ***(Contingency / In progress — theoretical)***

  <br>

- **Database:**
  <p align="left">
  <img src="https://skillicons.dev/icons?i=mysql,php" alt="Database Icons">
  </p>

  - `MySQL`
  - `phpMyAdmin`

  <br>

- **Tools:**
   <p align="left">
    <img src="https://skillicons.dev/icons?i=vscode,md,postman" alt="Tools Icons">
  </p>

  - `Visual Studio Code`
  - `Chrome DevTools`
  - `Markdown` for Documentation
  - `SheetDB` for Database API (Midterm, temporary)
  - `Postman` for API Testing

  <br>

## Prerequisites
- Node.js (>= 16 recommended) and npm
- Git (for branching and PRs)

## Install
1. Clone the repo:

```bash
git clone https://github.com/Keonbe/PWD-Automated-Application-System.git
cd PWD-Automated-Application-System/Post-React-Migration/pwd-application-system
```

1. Install dependencies:

```bash
# To install node_modules not present in git repository
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

## Documentation Guide

1. **Start Here:** Read `init-documentation.md` to understand the project structure
2. **Start Here:** Read `README.md` in `/documentation` folder to understand Functions and API's used.
3. **Set Up:** Follow the setup instructions in `init-documentation.md`
4. **Learn APIs:** Review `api-documentation.md` to understand backend integration
5. **Study Functions:** Read `function-documentation.md` to understand code patterns
6. **Contribute:** Follow `contribution_guide-documentation.md` for contributing guidelines

#### Documentation Links:

- [Project Documentation Guide](documentation/init-documentation.md)
- [API Documentation](documentation/api-documentation.md)
- [Function Documentation](documentation/function-documentation.md)
- [Contribution Guide](documentation/contribution_guide-documentation.md)