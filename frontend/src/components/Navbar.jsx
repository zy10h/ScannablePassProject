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
      <div className="w-full max-w-[1512px] mx-auto text-white py-6 px-6 md:px-20 flex justify-between items-center">

        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-[52px] h-[52px] rounded-[12px]"
          />
        </Link>

        <div className="flex items-center gap-6 flex-wrap">
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={handleProfileClick}
                  className="px-4 py-2 rounded-[15px] bg-[#007AFF] hover:bg-gray-700 transition text-sm md:text-base w-[19vh]"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-[15px] bg-red-500  hover:bg-red-600 transition text-sm md:text-base w-[19vh]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-[15px] 
        bg-[#007AFF] hover:bg-red-600 transition text-sm md:text-base w-[16vh] cursor-pointer transition hover:bg-[#0062cc] hover:shadow-md font-poppins font-normal flex items-center justify-center gap-[10px]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-[15px] border border-[#6B7280] bg-transparent 
             transition text-sm md:text-base flex items-center justify-center gap-[10px] 
             font-poppins font-normal text-[16px] md:text-[18px] leading-[100%] 
             text-[#6B7280] cursor-pointer hover:bg-[#e5e7eb] hover:text-[#374151] hover:shadow-md"
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
