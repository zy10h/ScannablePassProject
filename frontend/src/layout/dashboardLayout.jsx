import { useState } from "react";
import {
  Menu,
  X,
  Home,
  BarChart2,
  Users,
  ShoppingCart,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/GoVibe.png";

const menuItems = [
  { name: "All Events List", icon: Home, path: "/admin-dashboard" },
  { name: "Add Events", icon: BarChart2, path: "/admin-addevent" },
  { name: "Profile", icon: Users, path: "/admin-profile" },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage =
    menuItems.find((item) => item.path === location.pathname)?.name || "";

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700 md:hidden">
          <img src={logo} alt="GoVibe Logo" className="h-12" />
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <Link to="/" className="hidden md:block text-2xl font-bold p-4">
          <img src={logo} alt="GoVibe Logo" className="h-20 w-15" />
        </Link>

        <nav className="p-4 space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full space-x-2 p-2 rounded transition ${
                  isActive ? "bg-green-600 text-white" : "hover:bg-gray-800"
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow p-4 sticky top-0 z-20">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="font-bold">{currentPage}</h1>
          <div className="flex items-center space-x-3">
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
