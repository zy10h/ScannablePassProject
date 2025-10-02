import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import AdminForm from "./form";
import Notification from "../notification";
import Swal from "sweetalert2";
import Spinner from "../spinner";

const Admin = () => {
  const [openRow, setOpenRow] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notification, setNotification] = useState(null);
  const dropdownRef = useRef(null);

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
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/event/getAllEvents");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
        showNotification("Failed to fetch events", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEditClick = (event) => {
    setSelectedEvent({
      _id: event._id,
    });
    setIsModalOpen(true);
    setOpenRow(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.delete(`/event/delete-event/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(events.filter((event) => event._id !== id));
        showNotification("Event deleted successfully!", "success");
      } catch (error) {
        console.error("Failed to delete event", error);
        showNotification("Failed to delete event.", "error");
      }
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleUpdate = (updatedData) => {
    const updatedEvents = events.map((event) =>
      event._id === updatedData._id ? updatedData : event
    );
    setEvents(updatedEvents);
    setIsModalOpen(false);
    showNotification("Event updated successfully!", "success");
  };

  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );

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
              <th className="p-3">Event Category</th>
              <th className="p-3">Event Name</th>
              <th className="p-3">Event Address</th>
              <th className="p-3">Available Seats</th>
              <th className="p-3">Booked Seats</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((row) => (
              <tr key={row._id} className="border-t relative">
                <td className="p-3">{row.category}</td>
                <td className="p-3">{row.title}</td>
                <td className="p-3">{row.location}</td>
                <td className="p-3">{row.availableSeats}</td>
                <td className="p-3">{row.seatsFilled}</td>
                <td className="p-3 relative">
                  <button
                    onClick={() =>
                      setOpenRow(openRow === row._id ? null : row._id)
                    }
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openRow === row._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-50"
                    >
                      <button
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                        onClick={() => handleEditClick(row)}
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                        onClick={() => handleDelete(row._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <AdminForm
            initialData={selectedEvent}
            onClose={handleCloseModal}
            onSubmit={handleUpdate}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Admin;
