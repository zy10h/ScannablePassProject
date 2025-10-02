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
console.log("User in Navbar:", user,isAdmin);
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

        <div className="flex items-center gap-3 flex-wrap">
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={handleProfileClick}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition text-sm md:text-base"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 transition text-sm md:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-[178px] h-[52px] rounded-[15px] border-[1.5px] border-[#F9FAFB] 
             bg-[#007AFF] opacity-100 px-[18px] flex items-center justify-center gap-[10px] text-sm md:text-base"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-[178px] h-[52px] rounded-[15px] border-[1.5px] border-[#6B7280] 
             bg-[#F2F2F2] opacity-100 px-[18px] flex items-center justify-center gap-[10px] 
             font-poppins font-normal text-[16px] md:text-[18px] leading-[100%] text-[#6B7280]"
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
