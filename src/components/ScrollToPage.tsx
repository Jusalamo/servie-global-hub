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

  // On initial load, check if we should redirect to a saved path
  useEffect(() => {
    // Only run on initial component mount
    const handleInitialLoad = () => {
      const lastPath = sessionStorage.getItem('lastPath');
      const currentPath = pathname + search + hash;

      // If we're on the root path and there's a saved path that's different, redirect to it
      if (pathname === '/' && lastPath && lastPath !== '/' && lastPath !== currentPath) {
        navigate(lastPath, { replace: true });
        return;
      }

      // If there's a hash, scroll to the element
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Otherwise scroll to the top
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
