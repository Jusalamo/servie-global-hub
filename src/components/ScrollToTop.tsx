
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // When the route changes (pathname, search params, or hash), scroll to the top of the page
    // But only if there's no hash (anchor) in the URL
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Add smooth scrolling behavior
      });
    } else {
      // If there is a hash, scroll to the element with that ID
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, search, hash]); // Trigger on pathname, search param, and hash changes

  return null;
};

export default ScrollToTop;
