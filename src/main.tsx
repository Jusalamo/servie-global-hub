
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import './i18n'; // Import i18n configuration
import { ThemeProvider } from './components/ui/ThemeProvider';
import { MockAuthProvider } from './context/MockAuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="servie-ui-theme">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <MockAuthProvider>
            <NotificationProvider>
              <CartProvider>
                <App />
                <Toaster />
              </CartProvider>
            </NotificationProvider>
          </MockAuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
