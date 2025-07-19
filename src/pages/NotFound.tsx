import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="text-center bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-purple-400">404</h1>
        <p className="text-xl text-gray-300 mb-4">Oops! Page not found</p>
        <a href="/" className="text-purple-400 hover:text-purple-300 underline font-semibold">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
