import { useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";
import { X } from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (initialData && initialData._id && Object.keys(initialData).length === 1) {
          const res = await axiosInstance.get(`/event/get-event/${initialData._id}`);
          const d = res?.data || {};
          setFormData({
            category: d.category || "",
            title: d.title || "",
            location: d.location || "",
            availableSeats: d.availableSeats ?? "",
            seatsFilled: d.seatsFilled ?? "",
            date: d.date || "",
            time: d.time || "",
            description: d.description || "",
            image: d.image || "",
          });
        } else if (initialData) {
          setFormData({
            category: initialData.category || "",
            title: initialData.title || "",
            location: initialData.location || "",
            availableSeats: initialData.availableSeats ?? "",
            seatsFilled: initialData.seatsFilled ?? "",
            date: initialData.date || "",
            time: initialData.time || "",
            description: initialData.description || "",
            image: initialData.image || "",
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [initialData]);

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
      const res = await axiosInstance.put(
        `/event/edit-event/${initialData._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSubmit?.(res?.data || payload);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-semibold">Update Event Details</h3>
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
            className="w-full px-3 py-2 rounded-lg border"
            required
          >
            <option value="">Select type</option>
            <option value="Concert">Concert</option>
            <option value="Festival">Festival</option>
            <option value="Meetup">Meetup</option>
            <option value="Workshop">Workshop</option>
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

        <button type="submit" disabled={submitting || !formData.title} className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Updating…" : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default AdminForm;
