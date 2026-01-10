import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './index.css';
import '@assets/styles/index-styles.css'; // Custom CSS
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // bootstrap JS
// Bootstrap JS is imported once globally in src/index.js. Avoid importing it again
// to prevent duplicate module instances which can break event handling.
// Former index.js file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
