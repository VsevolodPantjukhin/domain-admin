import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

window.url =  "http://localhost:3000/v1/"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);