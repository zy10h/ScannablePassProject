import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

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
    <nav className="bg-[#E5F0FB]">
      <div className="w-full max-w-[1512px] mx-auto py-4 px-4 md:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Link to="/" className="flex items-center justify-center sm:justify-start">
          <img
            src={logo}
            alt="Logo"
            className="w-[42px] h-[42px] md:w-[52px] md:h-[52px] rounded-[12px]"
          />
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={handleProfileClick}
                  className="px-5 py-2 rounded-[15px] bg-[#007AFF] hover:bg-blue-700 transition text-sm md:text-base font-medium text-white w-full sm:w-auto"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-[15px] bg-red-500 hover:bg-red-600 transition text-sm md:text-base font-medium text-white w-full sm:w-auto"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-[15px] 
  bg-[#007AFF] hover:bg-blue-600 transition 
  text-sm md:text-base font-medium text-white 
  w-full sm:w-auto flex items-center justify-center h-[44px]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-[15px] border border-[#6B7280] bg-transparent 
  transition text-sm md:text-base font-medium text-[#6B7280] 
  w-full sm:w-auto flex items-center justify-center h-[44px]
  hover:bg-[#e5e7eb] hover:text-[#374151] hover:shadow-md"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
