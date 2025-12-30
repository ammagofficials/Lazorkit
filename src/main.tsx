import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LazorProvider } from './context/LazorProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LazorProvider>
      <App />
    </LazorProvider>
  </React.StrictMode>,
);