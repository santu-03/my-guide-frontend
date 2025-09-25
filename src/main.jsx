import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes/Router.jsx';
import './index.css'; // CSS is imported separately

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
