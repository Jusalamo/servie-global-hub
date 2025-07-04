
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';
import './i18n';
import { LocalizationProvider } from './components/LangCurrencySelector';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <LocalizationProvider>
            <BrowserRouter>
              <App />
              <Toaster />
            </BrowserRouter>
          </LocalizationProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
