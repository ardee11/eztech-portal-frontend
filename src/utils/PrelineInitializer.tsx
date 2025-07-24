import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    HSStaticMethods?: { autoInit: () => void };
  }
}

export default function PrelineInitializer() {
  const location = useLocation();

  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [location.pathname]); 

  return null; 
}
