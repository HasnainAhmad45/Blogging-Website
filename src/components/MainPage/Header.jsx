import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Kick Start
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link
              to="/start"
              className="text-white bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              Start Web Blogging
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-slate-700 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-slate-700 transition-colors font-medium"
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-slate-700 transition-colors font-medium"
            >
              About
            </Link>

            {/* Desktop User Info */}
            {user ? (
              <div className="flex items-center ml-4 space-x-3 bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <span
                  className="text-gray-700 font-medium cursor-pointer hover:text-slate-700 transition-colors text-sm"
                  onClick={() => navigate(`/profile`)}
                >
                  {user.name}
                </span>
                <button
                  onClick={() => navigate(`/profile`)}
                  className="text-white bg-slate-600 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-slate-700 px-3 py-1.5 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-slate-700 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button - Right Side */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hamburger-button lg:hidden text-gray-600 hover:text-slate-700 focus:outline-none ml-auto"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop - transparent overlay to capture clicks */}
            <div 
              className="lg:hidden fixed inset-0 top-[57px] z-30"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            
            {/* Sidebar Menu */}
            <div className="mobile-menu lg:hidden fixed right-0 top-[57px] w-64 h-[calc(100vh-57px)] bg-white shadow-2xl z-40 overflow-y-auto border-l border-gray-300">
              <nav className="px-4 sm:px-6 py-6 space-y-3">
              <Link
                to="/"
                className="block text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/start"
                className="block text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Blogging
              </Link>

              {/* Mobile User Info */}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate(`/profile`);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium hover:translate-x-1"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium hover:translate-x-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-slate-900 hover:bg-gray-100 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium hover:translate-x-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;