import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/GoVibe.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/profile");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="GoVibe Logo" className="h-14 w-auto" />
      </Link>

      <div className="flex items-center space-x-3">
        {user ? (
          <>
            {isAdmin && (
              <button
                onClick={handleProfileClick}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Dashboard
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
