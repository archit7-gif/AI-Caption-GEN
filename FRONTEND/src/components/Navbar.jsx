


import { Link } from "react-router-dom";
import { useState } from "react";
import useLogout from "../pages/Logout";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const logout = useLogout();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-lg border-b border-white/20 shadow-xl">

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide text-gray-800">
          Mini Insta
        </div>

        {/* Links */}
        <div className="flex gap-0 items-center">


          <Link
            to="/profile"
            className="relative font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200
              after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-purple-500 after:transition-all after:duration-300 hover:after:w-full"
          >
            Profile
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`ml-6 px-4 py-2 rounded-lg font-semibold text-sm transition duration-200 shadow-sm
              ${
                loading
                  ? "bg-red-400 cursor-not-allowed text-white"
                  : "bg-red-600 text-white hover:bg-red-700 hover:scale-[1.02] transform"
              }`}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


