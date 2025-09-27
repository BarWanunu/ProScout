import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "@/styles/transitions.css";

export default function RouteFade({ children }) {
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    
    // Small delay to let ScrollToTop component work first
    const id = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(id);
  }, [location.pathname]);

  return <div className={`route-fade ${ready ? "in" : ""}`}>{children}</div>;
}
