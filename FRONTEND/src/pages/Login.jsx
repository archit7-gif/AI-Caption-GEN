import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/login", form);
      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition-transform duration-300 hover:scale-[1.02] border border-white/20"
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center tracking-tight">
          Welcome Back
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-4 mb-6 rounded-xl border border-white/40 bg-white/40 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-6 rounded-xl border border-white/40 bg-white/40 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-md ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-gray-700 text-sm">
          New user?{" "}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
