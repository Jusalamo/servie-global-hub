
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n'; // Import i18n configuration
import { LocalizationProvider } from './components/LangCurrencySelector';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  </BrowserRouter>
);
