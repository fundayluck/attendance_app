import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import "react-datepicker/dist/react-datepicker.css";
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import WarningMobileView from './components/WarningMobileView';

const el = document.getElementById('root')
const root = createRoot(el)
const isMobile = window.matchMedia("only screen and (max-width: 999px)").matches

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {isMobile ?
          <WarningMobileView />
          :
          <App />
        }
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

