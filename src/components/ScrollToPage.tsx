
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Component that handles page state persistence and scroll restoration
 * to prevent page reload issues and maintain consistent navigation
 */
const ScrollToPage = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  // Save current page location to session storage on every route change
  useEffect(() => {
    const currentPath = pathname + search + hash;
    sessionStorage.setItem('lastPath', currentPath);
  }, [pathname, search, hash]);

  // On initial load, ensure we stay on the current page
  useEffect(() => {
    const handleInitialLoad = () => {
      // Always ensure we have a valid route - don't redirect on reload
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Scroll to top without any redirects
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    };

    handleInitialLoad();
  }, []);

  return null;
};

export default ScrollToPage;
