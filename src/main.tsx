
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n'; // Import i18n configuration
import { LocalizationProvider } from './components/LangCurrencySelector';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="servie-ui-theme">
      <BrowserRouter>
        <QueryClient>
          <MockAuthProvider>
            <NotificationProvider>
              <CartProvider>
                <App />
                <Toaster />
              </CartProvider>
            </NotificationProvider>
          </MockAuthProvider>
        </QueryClient>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
