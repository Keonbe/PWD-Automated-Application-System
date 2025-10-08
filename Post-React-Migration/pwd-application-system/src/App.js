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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserHeader from './components/user-header';
import UserFooter from './components/user-footer';
import HomePage from './pages/homepage';
import News from './pages/homepage/news';
import FAQ from './pages/homepage/faq';
import Resources from './pages/homepage/resources';
import Contact from './pages/homepage/contact';
import Consent from './pages/homepage/consent';
import Register from './pages/homepage/register';
import UserLogin from './pages/userpage/userLogin';
import './App.css';


function App() { 
  return (
    <BrowserRouter>
      <div className="app">
        <UserHeader />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<News />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Userlogin" element={<UserLogin />} />
          </Routes>
        </main>
        <UserFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
