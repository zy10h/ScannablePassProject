import { useEffect, useMemo, useRef, useState } from "react";
import {
  MoreVertical,
  Plus,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Notification from "../notification";
import Spinner from "../spinner";
import Swal from "sweetalert2";

const CATEGORY_OPTIONS = ["Concert", "Festival", "Meetup", "Workshop", "Other"];

const ModalShell = ({ title, onClose, children, footer }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
  >
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
          <X size={18} />
        </button>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 pb-5">{footer}</div>}
    </div>
  </div>
);

const AddEventModal = ({ onClose, onSubmitted }) => {
  const [form, setForm] = useState({
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

  const onChange = (e) => {
    const { name, value } = e.target;
    const numeric = name === "availableSeats" || name === "seatsFilled";
    setForm((s) => ({ ...s, [name]: numeric ? String(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        availableSeats: Number(form.availableSeats) || 0,
        seatsFilled: Number(form.seatsFilled) || 0,
      };
      const res = await axiosInstance.post("/event/createEvent", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onSubmitted?.(res?.data || payload);
      onClose?.();
    } catch {
      alert("Failed to add event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Add Event"
      onClose={onClose}
      footer={
        <button
          type="submit"
          form="add-form"
          disabled={submitting}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add"}
        </button>
      }
    >
      <form id="add-form" onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">Select type</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Enter Event Name"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Available Seats
          </label>
          <input
            type="number"
            min="0"
            name="availableSeats"
            value={form.availableSeats}
            onChange={onChange}
            placeholder="Enter Available Seats"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Booked Seats
          </label>
          <input
            type="number"
            min="0"
            name="seatsFilled"
            value={form.seatsFilled}
            onChange={onChange}
            placeholder="Enter Booked Seats"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Enter Description"
            className="w-full px-3 py-2 rounded-lg border h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Event Link
          </label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="Enter Link / Image URL"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Event Address
            </label>
            <input
              name="location"
              value={form.location}
              onChange={onChange}
              placeholder="Enter Address"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

const EditEventModal = ({ event, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    category: "",
    title: "",
    location: "",
    availableSeats: "",
    seatsFilled: "",
    description: "",
    image: "",
    date: "",
    time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const id = event?._id;

  useEffect(() => {
    if (!event) return;
    setForm({
      category: event.category || "",
      title: event.title || "",
      location: event.location || "",
      availableSeats: String(event.availableSeats ?? ""),
      seatsFilled: String(event.seatsFilled ?? ""),
      description: event.description || "",
      image: event.image || "",
      date: event.date || "",
      time: event.time || "",
    });
  }, [event]);

  const onChange = (e) => {
    const { name, value } = e.target;
    const numeric = name === "availableSeats" || name === "seatsFilled";
    setForm((s) => ({ ...s, [name]: numeric ? String(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        availableSeats: Number(form.availableSeats) || 0,
        seatsFilled: Number(form.seatsFilled) || 0,
      };
      const res = await axiosInstance.put(`/event/edit-event/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      onUpdated?.(res?.data || { ...payload, _id: id });
      onClose?.();
    } catch {
      alert("Failed to update event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Update Event Details"
      onClose={onClose}
      footer={
        <button
          type="submit"
          form="edit-form"
          disabled={submitting}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Updating…" : "Update Event"}
        </button>
      }
    >
      <form id="edit-form" onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">Select type</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Enter Event Name"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Available Seats
          </label>
          <input
            type="number"
            min="0"
            name="availableSeats"
            value={form.availableSeats}
            onChange={onChange}
            placeholder="Enter Available Seats"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Booked Seats
          </label>
          <input
            type="number"
            min="0"
            name="seatsFilled"
            value={form.seatsFilled}
            onChange={onChange}
            placeholder="Enter Booked Seats"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Enter Description"
            className="w-full px-3 py-2 rounded-lg border h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Event Link
          </label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="Enter Link / Image URL"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Event Address
            </label>
            <input
              name="location"
              value={form.location}
              onChange={onChange}
              placeholder="Enter Address"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>
      </form>
    </ModalShell>
  );
};

const Pagination = ({ total, page, pageSize, onPage, onPageSize }) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-gray-600">
      <div>
        Showing {start} to {end} of {total} entries
      </div>
      <div className="flex items-center gap-2">
        <span>Display</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1;
            const active = p === page;
            return (
              <button
                key={p}
                onClick={() => onPage(p)}
                className={`w-8 h-8 rounded-lg border text-sm transition-colors ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [query, setQuery] = useState("");
  const [openRow, setOpenRow] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/event/getAllEvents");
        setEvents(res.data || []);
      } catch {
        setNotification({ message: "Failed to fetch events", type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return events;
    const q = query.toLowerCase();
    return events.filter(
      (e) =>
        (e.title || "").toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q)
    );
  }, [events, query]);

  const getValue = (row, key) => {
    if (key === "availableSeats" || key === "seatsFilled") {
      const v = row[key];
      return typeof v === "number" ? v : Number(v) || 0;
    }
    return (row[key] || "").toString().toLowerCase();
  };

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const sortedArr = [...filtered].sort((a, b) => {
      const va = getValue(a, sortKey);
      const vb = getValue(b, sortKey);
      if (typeof va === "number" && typeof vb === "number") return va - vb;
      return va.localeCompare(vb);
    });
    return sortDir === "asc" ? sortedArr : sortedArr.reverse();
  }, [filtered, sortKey, sortDir]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This event will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/event/delete-event/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setEvents((prev) => prev.filter((ev) => ev._id !== id));
        setNotification({
          message: "Event deleted successfully",
          type: "success",
        });
        Swal.fire("Deleted!", "The event has been deleted.", "success");
      } catch {
        setNotification({ message: "Failed to delete event", type: "error" });
        Swal.fire("Error!", "Failed to delete the event.", "error");
      }
    }
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Mobile action handlers
  const handleMobileEdit = (row) => {
    setEditEvent(row);
    setOpenRow(null);
  };

  const handleMobileDelete = (id) => {
    handleDelete(id);
    setOpenRow(null);
  };

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

      <div className="px-6 py-4">
        <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-[3rem]">
            <h2 className="text-2xl font-semibold text-gray-800">
              Event Management
            </h2>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events..."
                  className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} /> Add Event
              </button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className=" text-gray-700">
              <tr>
                {[
                  ["title", "Event Name"],
                  ["location", "Location"],
                  ["category", "Category"],
                  ["availableSeats", "Available Seats"],
                  ["seatsFilled", "Booked Seats"],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    className="p-4 font-semibold border-b border-gray-200 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {sortKey === key &&
                        (sortDir === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="p-4 font-semibold border-b border-gray-200 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {query
                        ? "No events found matching your search"
                        : "No events found"}
                    </div>
                  </td>
                </tr>
              ) : (
                pageData.map((row, index) => (
                  <tr
                    key={row._id}
                    className={`border-t border-gray-100 hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {row.title}
                    </td>
                    <td className="p-4 text-gray-700">{row.location}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {row.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{row.availableSeats}</td>
                    <td className="p-4 text-gray-700">{row.seatsFilled}</td>
                    <td className="p-4 relative">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() =>
                            setOpenRow(openRow === row._id ? null : row._id)
                          }
                          className="p-2 text-gray-600 hover:text-gray-800 transition hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openRow === row._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10 text-sm"
                          >
                            <button
                              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setEditEvent(row)}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                              onClick={() => handleDelete(row._id)}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Better Layout */}
        <div className="md:hidden space-y-4">
          {pageData.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500">
                {query
                  ? "No events found matching your search"
                  : "No events found"}
              </p>
            </div>
          ) : (
            pageData.map((row) => (
              <div
                key={row._id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
              >
                {/* Header with Title and Actions */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {row.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {row.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {/* Direct Edit Button */}
                    <button
                      onClick={() => handleMobileEdit(row)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                      title="Edit Event"
                    >
                      <Edit size={16} />
                    </button>
                    {/* Direct Delete Button */}
                    <button
                      onClick={() => handleMobileDelete(row._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">
                      Location:
                    </span>
                    <span className="text-gray-800 text-right">
                      {row.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">
                      Available Seats:
                    </span>
                    <span className="text-gray-800">{row.availableSeats}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-gray-600">
                      Booked Seats:
                    </span>
                    <span className="text-gray-800">{row.seatsFilled}</span>
                  </div>
                </div>

                {/* Additional Info */}
                {(row.date || row.time) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-4 text-xs text-gray-500">
                      {row.date && (
                        <span>
                          Date: {new Date(row.date).toLocaleDateString()}
                        </span>
                      )}
                      {row.time && <span>Time: {row.time}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            total={sorted.length}
            page={page}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isAddOpen && (
        <AddEventModal
          onClose={() => setIsAddOpen(false)}
          onSubmitted={(newEvent) => setEvents((prev) => [...prev, newEvent])}
        />
      )}
      {editEvent && (
        <EditEventModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onUpdated={(updated) =>
            setEvents((prev) =>
              prev.map((ev) => (ev._id === updated._id ? updated : ev))
            )
          }
        />
      )}
    </DashboardLayout>
  );
};

export default Admin;
