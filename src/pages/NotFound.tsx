
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MovingBackground } from "@/components/MovingBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <MovingBackground />
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center gradient-card p-8 rounded-2xl shadow-xl">
          <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
          <p className="text-xl text-gray-200 mb-4">Oops! Page not found</p>
          <a href="/" className="text-blue-200 hover:text-blue-100 underline transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
