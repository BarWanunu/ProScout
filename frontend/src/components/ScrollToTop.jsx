import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Don't scroll if we're just sending a message or staying on messages page
    const shouldScroll = () => {
      // Don't scroll if we have the prevention flag set (from message sending)
      if (sessionStorage.getItem('preventMessageScroll')) {
        sessionStorage.removeItem('preventMessageScroll');
        return false;
      }
      
      // Don't scroll if we're staying on the same messages page
      const prevPath = sessionStorage.getItem('lastPath');
      if (pathname.includes('/messages') && prevPath && prevPath.includes('/messages')) {
        return false;
      }
      
      // Store current path for next navigation
      sessionStorage.setItem('lastPath', pathname);
      return true;
    };

    if (!shouldScroll()) {
      return;
    }

    // Scroll to top immediately when pathname or search params change
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Immediate scroll
      });
      
      // Also ensure the document body scrolls to top
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Force a repaint to ensure scroll happens
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    };

    scrollToTop();
    
    // Also scroll on next tick to make sure it works
    setTimeout(scrollToTop, 0);
    
  }, [pathname, search]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;