import { useState } from "react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Notification from "../notification";
import Spinner from "../spinner";

const AddEventForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: "seminar",
    title: "",
    location: "",
    availableSeats: "50",
    seatsFilled: "0",
    description: "",
    image: null,
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "availableSeats" || name === "seatsFilled"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("category", formData.category);
      data.append("title", formData.title);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("availableSeats", Number(formData.availableSeats));
      data.append("seatsFilled", Number(formData.seatsFilled));
      data.append("date", formData.date);
      data.append("time", formData.time);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/event/createEvent",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("t1", { a: response.status });
      if (response.status !== 400) {
        setNotification({
          message: "Event added successfully!",
          type: "success",
        });
        setFormData({
          category: "seminar",
          title: "",
          location: "",
          availableSeats: 50,
          seatsFilled: 0,
          description: "",
          image: null,
          date: "",
          time: "",
        });
        if (onSubmit) onSubmit();
      } else {
        setNotification({ message: "Failed to add event.", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {loading && <Spinner />}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-2">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Add New Event
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

            {/* <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste image URL here"
            /> */}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition"
            >
              Add Event
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddEventForm;
