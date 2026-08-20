import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CareCoverApp } from './CareCover.tsx';
import './index.css';

const host = window.location.hostname.toLowerCase();
const path = window.location.pathname.toLowerCase();
const isCareCover =
  host.includes('care') ||
  host.includes('cover') ||
  host.includes('-cc') ||
  path.startsWith('/carecover');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isCareCover ? <CareCoverApp /> : <App />}
  </StrictMode>
);
