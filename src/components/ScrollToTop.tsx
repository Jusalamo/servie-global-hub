
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // When the route changes (either pathname or search params), scroll to the top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Add smooth scrolling behavior
    });
  }, [pathname, search]); // Also trigger on search param changes

  return null;
};

export default ScrollToTop;
