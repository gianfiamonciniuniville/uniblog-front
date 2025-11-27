// src/compositions/header.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Import icons

const Header: React.FC = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold text-blue-600 hover:text-blue-800 transition-colors duration-200">
          UniBlog
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/blogs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
            Blogs
          </Link>
          <Link to="/posts" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
            Posts
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 focus:outline-none"
              >
                <FaUserCircle className="text-2xl" />
                <span>{user?.userName || "Profile"}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <Link
                    to={`/profile/${user?.id}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
            {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/blogs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Blogs
            </Link>
            <Link
              to="/posts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Posts
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to={`/profile/${user?.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-blue-600 border border-blue-600 rounded-md text-center hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
