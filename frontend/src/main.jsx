import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import './styles/index.css'
import { AuthProvider } from './auth/AuthContext';
const GOOGLE_CLIENT_ID = '667252564002-s8p09l0p7lln1k81ekqif860dsc9veai.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </AuthProvider>
  // </React.StrictMode>
);