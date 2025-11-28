import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors">
          Kick Start
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            to="/start"
            className="text-white bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Start Web Blogging
          </Link>
          <Link to="/" className="text-gray-600 hover:text-slate-700 transition-colors font-medium">
            Home
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-slate-700 transition-colors font-medium">
            Contact
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-slate-700 transition-colors font-medium">
            About
          </Link>

          {/* User info */}
          {user ? (
            <div className="flex items-center ml-4 space-x-3 bg-gray-50 border border-gray-200 p-2 rounded-lg">
              <span
                className="text-gray-700 font-medium cursor-pointer hover:text-slate-700 transition-colors"
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
            <Link to="/login" className="text-gray-600 hover:text-slate-700 transition-colors font-medium">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
