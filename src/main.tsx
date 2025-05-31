import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import Header from './components/Header';
import { AuthProvider } from './context/AuthProvider';
import { Toaster } from 'react-hot-toast';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
