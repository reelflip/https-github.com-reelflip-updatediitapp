import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif; background: #0f172a; color: white; min-height: 100vh;">
      <h1 style="color: #f43f5e; font-size: 3rem; margin-bottom: 20px;">SYSTEM FAULT</h1>
      <p style="color: #94a3b8; font-size: 1.2rem;">Root element not found in DOM.</p>
      <div style="margin-top: 40px; color: #6366f1;">Check index.html structure.</div>
    </div>
  `;
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}