import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../axiosConfig";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import DashboardLayout from "../../layout/dashboardLayout";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/auth/users", axiosConfig);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/auth/delete-users/${id}`, axiosConfig);
          setUsers(users.filter((user) => user.id !== id));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(
        `/auth/edit-users/${editingUser.id}`,
        editingUser,
        axiosConfig
      );
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );
      setShowModal(false);
      Swal.fire("Saved!", "User updated successfully.", "success");
    } catch {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">University</th>
                <th className="py-2 px-4 border">Address</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                  <td className="py-2 px-4 border">{user.role}</td>
                  <td className="py-2 px-4 border">{user.university}</td>
                  <td className="py-2 px-4 border">{user.address}</td>
                  <td className="py-2 px-4 border flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white border rounded p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{user.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {user.role}
              </p>
              <p>
                <span className="font-semibold">University:</span> {user.university}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {user.address}
              </p>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {showModal && editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <input
                type="text"
                placeholder="Name"
                className="border p-2 mb-2 w-full rounded"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 mb-2 w-full rounded"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
              <select
                className="border p-2 mb-2 w-full rounded"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="text"
                placeholder="University"
                className="border p-2 mb-2 w-full rounded"
                value={editingUser.university}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, university: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="border p-2 mb-4 w-full rounded"
                value={editingUser.address}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, address: e.target.value })
                }
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
