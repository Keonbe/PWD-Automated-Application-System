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
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminVerify from './pages/adminpage/adminverify';
import './App.css';

// Wrapper component to handle conditional rendering
const AppWrapper = () => {
  const location = useLocation();

  // Define routes where footer should NOT appear
  const noFooterRoutes = ["/login", "/adminpage", "/userpage", "/user", "/admin/adminverify"];

  return (
    <div className="app">
      <UserHeader />
      <main className="main-content">
        <Routes>
          {/* Public routes with public header and footer */}
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<News />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/result" element={<RegisterResult />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated user routes (no public header/footer) */}
          {/* Kean: User, Marqus: Admin */}
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/user/*" element={<UserPage />} />
          <Route path="/adminpage" element={<AdminPage />} />
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
