import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress ResizeObserver loop error (benign browser warning)
const resizeObserverErr = window.onerror;
window.onerror = (message, ...args) => {
  if (message && message.includes && message.includes('ResizeObserver loop')) {
    return true;
  }
  if (resizeObserverErr) {
    return resizeObserverErr(message, ...args);
  }
};

// Also handle unhandled promise rejections for ResizeObserver
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('ResizeObserver loop')) {
    event.stopImmediatePropagation();
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
