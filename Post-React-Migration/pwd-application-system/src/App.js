/* Init app.js
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

/* NEED DIFFERENT PAGE FOR USER +  ADMIN + LOGIN(No Header & Footer) */
/* Add more routes as needed */
/* Example for user/admin pages after login: */
/* <Route path="/userpage" element={<UserPage />} /> */
/* <Route path="/adminpage" element={<AdminPage />} /> */
/* or if you use /testuser and /testadmin: */
/* <Route path="/testuser" element={<UserPage />} /> */
/* <Route path="/testadmin" element={<AdminPage />} /> */
/* Ensure to import UserPage and AdminPage components at the top */
/* import UserPage from './pages/userpage/userpage'; */
/* import AdminPage from './pages/adminpage/adminpage'; */
/* Adjust paths as necessary */

import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import UserHeader from "./components/user-header";
import UserFooter from "./components/user-footer";
import HomePage from "./pages/homepage";
import News from "./pages/homepage/news";
import FAQ from "./pages/homepage/faq";
import Resources from "./pages/homepage/resources";
import Contact from "./pages/homepage/contact";
import Consent from "./pages/homepage/consent";
import Register from "./pages/homepage/register";
import Login from "./pages/login";
import Testuser from "./pages/userpage/userpage";
import Testadmin from "./pages/adminpage/adminpage";
import AdminVerify from "./pages/adminpage/adminverify";
import "./App.css";

// Wrapper component to handle footer visibility based on route
const AppWrapper = () => {
  const location = useLocation();

  // Define routes where footer should NOT appear
  const noFooterRoutes = ["/login", "/testadmin", "/testuser"];

  return (
    <div className="app">
      <UserHeader /> {/* Keep header for all pages */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<News />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* test pages for user/admin after login */}
          <Route path="/testuser" element={<Testuser />} />
          <Route path="/testadmin" element={<Testadmin />} />
          <Route path="/admin/adminverify" element={<AdminVerify />} />

          {/* Catch-all 404 must be last */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </main>
      {/* Conditionally render footer if current path is NOT in noFooterRoutes */}
      {!noFooterRoutes.includes(location.pathname) && <UserFooter />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
