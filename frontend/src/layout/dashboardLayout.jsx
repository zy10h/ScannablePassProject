import { PieChart, UserCheck, User, LogOut, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const menuItems = [
  { name: "All Events List", icon: PieChart, path: "/admin-dashboard" },
  { name: "Attendance", icon: UserCheck, path: "/admin-attendance" },
  { name: "Profile", icon: User, path: "/admin-profile" },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/eventListing");
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-gray-900 flex">
      <aside
        className={`fixed inset-y-0 left-0 transform bg-white border-r w-64 shrink-0 z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 rounded cursor-pointer"
            onClick={() => navigate("/")}
          />
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
                  ${active
                    ? "bg-[#007AFF] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-4 py-6">
          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-6 py-3 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-md"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
          <img src={logo} alt="logo" className="w-10 h-10" />
        </header>

        <main className="p-4 md:p-6 bg-[#F8FBFF]">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
