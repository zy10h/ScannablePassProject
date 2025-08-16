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

  return (
    <nav
      className="text-white p-4 flex justify-between items-center h-20 bg-opacity-100"
      style={{ backgroundColor: "#abc4cb" }}
    >
      <Link to="/" className="text-2xl font-bold">
        <img src={logo} alt="GoVibe Logo" className="h-20 w-15" />
      </Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">
              CRUD
            </Link>
            <Link to="/profile" className="mr-4">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="mr-4 px-4 py-2 rounded-[10px] bg-blue-500 text-white border border-white hover:bg-blue-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-[10px] bg-green-500 text-white border border-white hover:bg-green-700"
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
