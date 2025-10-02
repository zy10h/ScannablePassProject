import { PieChart, UserCheck, User, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const menuItems = [
  { name: "All Events List", icon: PieChart, path: "/admin-dashboard" },
  { name: "Reg.users", icon: UserCheck, path: "/admin-attendance" },
  { name: "Profile", icon: User, path: "/admin-profile" },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/"); 
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-gray-900 flex">
      <aside className="flex flex-col w-64 shrink-0 bg-white border-r min-h-screen">
        <div className="flex items-center gap-2 px-5 h-16 cursor-pointer">
          <img src={logo} alt="logo" className="w-12 h-12 rounded" onClick={()=>navigate("/")}/>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
                  ${
                    active
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-6 py-3 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-md"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <main className="p-4 md:p-6 bg-[#F8FBFF]">
          <div className="mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
