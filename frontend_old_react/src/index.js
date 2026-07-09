import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import ErrorBoundary from "@/components/ErrorBoundary";

// Suppress ResizeObserver loop error (benign browser warning)
const resizeObserverErr = window.onerror;
window.onerror = (message, ...args) => {
  if (message && message.includes && message.includes('ResizeObserver loop')) {
    return true;
  }
  // Ignorer les erreurs removeChild causées par les extensions de navigateur
  if (message && message.includes && message.includes('removeChild')) {
    console.warn('Erreur DOM ignorée (extension navigateur)');
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
  // Ignorer les erreurs removeChild
  if (event.message && event.message.includes('removeChild')) {
    event.stopImmediatePropagation();
    event.preventDefault();
    console.warn('Erreur DOM ignorée');
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
