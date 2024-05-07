import React from "react";
import { useLocation, Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

function Navbar() {
  const location = useLocation();

  return (
    <div className="fixed inset-x-0 top-0 flex items-center justify-between px-4 bg-white shadow-md h-16 z-10">
      <div className="flex-1"></div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link
          to="/"
          className="flex items-center justify-center w-12 h-12 text-xl rounded-full hover:bg-gray-100 transition-all ease-linear duration-300"
        >
          <AiOutlineHome />
        </Link>
      </div>

      <div className="flex items-center justify-end flex-1 space-x-4">
        {location.pathname !== "/password-generator" && (
          <div className="flex items-center justify-end flex-1 space-x-4">
            {location.pathname !== "/signin-p2" &&
              location.pathname !== "/signup-p2" && (
                <Link
                  to="/signin-p1"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 transition-all ease-linear duration-150"
                >
                  Sign In P1
                </Link>
              )}
            {location.pathname !== "/signin-p2" &&
              location.pathname !== "/signup-p2" && (
                <Link
                  to="/signup-p1"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 transition-all ease-linear duration-150"
                >
                  Sign Up P1
                </Link>
              )}
            {location.pathname !== "/signin-p1" &&
              location.pathname !== "/signup-p1" && (
                <Link
                  to="/signin-p2"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 transition-all ease-linear duration-150"
                >
                  Sign In P2
                </Link>
              )}
            {location.pathname !== "/signin-p1" &&
              location.pathname !== "/signup-p1" && (
                <Link
                  to="/signup-p2"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 transition-all ease-linear duration-150"
                >
                  Sign Up P2
                </Link>
              )}
          </div>
        )}

        <Link
          to="/password-generator"
          className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 transition-all ease-linear duration-150"
        >
          Password Generator
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
