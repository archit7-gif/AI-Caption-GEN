

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Upload from "./Upload";
import DeletePage from "./DeletePage";
import API from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [scrollY, setScrollY] = useState(0); // current scroll position
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users/me")
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await API.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLogout(false);
    }
  };

  // calculate gradual translate: max -20px, min 0px
  const translate = Math.min(scrollY / 3, 20); // smooth up to -20px
  const opacity = Math.max(1 - scrollY / 100, 0); // fade gradually

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200">
      <nav
        className="sticky top-0 z-50 flex items-center justify-between bg-white/40 backdrop-blur-md shadow-md px-6 py-3 transition-transform duration-300"
        style={{
          transform: `translateY(-${translate}px)`,
          opacity: opacity,
          pointerEvents: opacity === 0 ? "none" : "auto",
        }}
      >
        <div className="text-xl font-bold text-gray-800">MyApp</div>
        <div className="flex items-center gap-4">
          <Link
            to="/feed"
            className="font-medium text-gray-800 hover:text-gray-600 transition duration-200"
          >
            Home
          </Link>
          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className={`px-4 py-2 rounded-lg font-semibold transition duration-200
              ${loadingLogout ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
          >
            {loadingLogout ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-5xl font-italic mb-12 underline text-gray-800 text-center tracking-tight">
          {user ? user.username : "Loading..."}
        </h2>
        <DeletePage embedded />
        <div className="my-12" />
        <Upload embedded />
      </div>
    </div>
  );
};

export default Profile;




