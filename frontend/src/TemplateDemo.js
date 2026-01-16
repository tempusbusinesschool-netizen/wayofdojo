import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TemplatePreviewPage from './components/TemplatePreviewPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TemplatePreviewPage />
  </React.StrictMode>
);
