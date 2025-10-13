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
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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

export default App;