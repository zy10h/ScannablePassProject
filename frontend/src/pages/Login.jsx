import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import Notification from "../components/notification";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      login(response.data);
      setNotification({ message: "Login successful!", type: "success" });
      setTimeout(() => {
        if (response.data.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/eventListing", { replace: true });
        }
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setNotification({
        message,
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 relative">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Please login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center text-gray-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-gray-800 font-semibold hover:underline"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
