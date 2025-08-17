import { useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";

const AdminForm = ({ initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    location: "",
    availableSeats: "",
    seatsFilled: "",
    date: "",
    time: "",
    description: "",
    image: "",
  });

  const GetById = async (id) => {
    axiosInstance
      .get(`/event/getById/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("Failed to fetch event:", err));
  };

  useEffect(() => {
    if (initialData) {
      GetById(initialData._id);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(
        `/event/edit-event/${initialData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSubmit(res.data);
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  return (
    // backdrop
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      {/* modal box */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Update Event Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="">Select Event Category</option>
            <option value="Workshop">Workshop</option>
            <option value="Festival">Festival</option>
            <option value="Concert">Concert</option>
            <option value="Meetup">Meetup</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event Address"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="text"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
            placeholder="Available Seats"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="text"
            name="seatsFilled"
            value={formData.seatsFilled}
            onChange={handleChange}
            placeholder="Seats Filled"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none h-28"
          />

          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Paste image URL here"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <button
            type="submit"
            disabled={!formData.title}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
