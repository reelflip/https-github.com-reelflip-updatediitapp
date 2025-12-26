import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

// CRITICAL: Deployment Health Check
if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif; background: #0f172a; color: white; min-height: 100vh;">
      <h1 style="color: #f43f5e; font-size: 3rem; margin-bottom: 20px;">SYSTEM FAULT</h1>
      <p style="color: #94a3b8; font-size: 1.2rem;">Root element not found in DOM.</p>
      <div style="margin-top: 40px; color: #6366f1;">Check index.html structure or file path.</div>
    </div>
  `;
  throw new Error("Mount Target Missing");
}

try {
  // Check if running on file protocol (React apps require a server)
  if (window.location.protocol === 'file:') {
    console.warn("Application detected running on file:// - Some features may not work without a local server.");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Solaris Initialization Error:", error);
  rootElement.innerHTML = `
    <div style="padding: 60px; text-align: center; font-family: 'Inter', sans-serif; background: #f8fafc; color: #334155; min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);">
        <h2 style="color: #ef4444; font-weight: 900; letter-spacing: -0.05em; font-size: 2.5rem; text-transform: uppercase; font-style: italic;">Uplink Failed.</h2>
        <p style="color: #64748b; font-weight: 500; margin-top: 20px;">A runtime exception occurred during the handshake process.</p>
        <div style="background: #0f172a; color: #10b981; padding: 20px; border-radius: 16px; text-align: left; margin: 30px 0; font-family: monospace; font-size: 0.8rem; overflow: auto;">
          ${error instanceof Error ? error.stack || error.message : String(error)}
        </div>
        <button onclick="window.location.reload()" style="padding: 15px 30px; background: #6366f1; color: white; border: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; cursor: pointer; transition: all 0.2s;">
          Retry Connection
        </button>
      </div>
    </div>
  `;
}