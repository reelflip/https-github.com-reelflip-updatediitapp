
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-family: sans-serif;"><h1>Critical Error</h1><p>Could not find root element to mount the application.</p></div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("React Mounting Error:", error);
  rootElement.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif; color: #334155;">
      <h2 style="color: #ef4444;">Application Failed to Start</h2>
      <p>A runtime error occurred during initialization.</p>
      <pre style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: left; display: inline-block; max-width: 90%; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
      <div style="margin-top: 20px;">
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">Retry Connection</button>
      </div>
    </div>
  `;
}
