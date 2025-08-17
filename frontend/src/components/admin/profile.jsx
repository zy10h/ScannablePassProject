import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Notification from "../notification";
import Swal from "sweetalert2";
import Spinner from "../spinner";

const ProfileData = () => {
  const [openRow, setOpenRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/auth/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
        showNotification("Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <DashboardLayout>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Address</th>
              <th className="p-3">Email</th>
              <th className="p-3">University</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t relative">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.address}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.university}</td>
                <td className="p-3 relative">
                  <button
                    onClick={() =>
                      setOpenRow(openRow === user._id ? null : user._id)
                    }
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openRow === user._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-50"
                    >
                      <button
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                        onClick={() =>
                          Swal.fire("Edit", "Edit functionality here", "info")
                        }
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ProfileData;
