# PWD-Automated-Application-System
**A project for whole semester for ITWB311 “Web Development” subject**

This README (README.md) is written for contributors and reviewers who clone the repository and want a quick way to run, test, and contribute to the React migration work.

Note: This repository contains a mixed codebase: a legacy static site (Pre-React-Migration/) and an in-progress React migration (Post-React-Migration/pwd-application-system). The React code lives in Post-React-Migration/pwd-application-system — that's the main project to run and work on.

Contents
- **Prerequisites**
- **Install**
- **Run (development)**
- **Build (production**)
- **What to test (quick checklist**)
- **Project structure & important files**
- **Migration notes and temporary artifacts**
- **How to contribute (PR process)**
- **Useful links and references**

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

Notes on coding style and checks
- The project uses CRA and ESLint. Fix warnings where practical, especially accessibility lint warnings (anchor-is-valid, img alt text).
- Keep CSS import order consistent: vendor CSS (bootstrap) first, then global app CSS, then component/page-level CSS.

## Miscellaneous

### Contributors

#### 👥 All Team Members 
<!-- Grid of all contributors -->
![Contributors Grid](https://contrib.rocks/image?repo=Keonbe/PWD-Automated-Application-System)

#### 🏆 Top Contributors to This Repo
<!-- Pie chart showing who contributed most -->
![Contribution Pie Chart](https://contrib.nn.ci/api?repo=Keonbe/PWD-Automated-Application-System&type=pie)

### Useful links
- React Router `useNavigate` and `Link`: https://reactrouter.com/
- CRA docs: https://create-react-app.dev/docs/getting-started/
- Accessibility checklist: https://www.w3.org/WAI/standards-guidelines/wcag/

### Contact / Maintainers
- Repo owner: Keonbe (check repo contributors and open issues for maintainer contact)