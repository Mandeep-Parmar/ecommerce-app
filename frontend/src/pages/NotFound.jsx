import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] border-t flex flex-col items-center justify-center text-center px-4">
      <p className="text-gray-500 text-sm tracking-[6px]">ERROR 404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-medium text-gray-800">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-gray-500">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-8 border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-all duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
