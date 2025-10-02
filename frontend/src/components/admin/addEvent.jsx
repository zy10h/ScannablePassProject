import { useState } from "react";
import axiosInstance from "../../axiosConfig";
import { X } from "lucide-react";

export const AddEventModal = ({ onClose, onSubmitted }) => {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    location: "",
    availableSeats: "50",
    seatsFilled: "0",
    description: "",
    image: "",
    date: "",
    time: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numeric = name === "availableSeats" || name === "seatsFilled";
    setFormData((prev) => ({ ...prev, [name]: numeric ? String(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        availableSeats: Number(formData.availableSeats) || 0,
        seatsFilled: Number(formData.seatsFilled) || 0,
      };
      const res = await axiosInstance.post("/event/createEvent", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSubmitted?.(res?.data || payload);
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Failed to add event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={(e) => e.key === "Escape" && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold">Add Event</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="px-3 py-2 rounded-lg border"
              required
            >
              <option value="">Select type</option>
              <option value="Concert">Concert</option>
              <option value="Tech Meetup">Tech Meetup</option>
              <option value="Food Festival">Food Festival</option>
              <option value="Business Conference">Business Conference</option>
              <option value="Cultural Event">Cultural Event</option>
              <option value="Community Fair">Community Fair</option>
              <option value="Educational Meetup">Educational Meetup</option>
              <option value="Other">Other</option>
            </select>

            <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Name" className="px-3 py-2 rounded-lg border" required />
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Event Address" className="px-3 py-2 rounded-lg border" />
            <input type="number" min="0" name="availableSeats" value={formData.availableSeats} onChange={handleChange} placeholder="Available Seats" className="px-3 py-2 rounded-lg border" />
            <input type="number" min="0" name="seatsFilled" value={formData.seatsFilled} onChange={handleChange} placeholder="Booked Seats" className="px-3 py-2 rounded-lg border" />
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="px-3 py-2 rounded-lg border" />
            <input type="time" name="time" value={formData.time} onChange={handleChange} className="px-3 py-2 rounded-lg border" />
          </div>

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 rounded-lg border h-24 resize-none" />
          <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="Event Link / Image URL (optional)" className="w-full px-3 py-2 rounded-lg border" />

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Adding…" : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;