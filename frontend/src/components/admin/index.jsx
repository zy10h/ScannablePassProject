import { useEffect, useMemo, useRef, useState } from "react";
import {
  MoreVertical,
  Plus,
  Search,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Notification from "../notification";
import Spinner from "../spinner";
import Swal from "sweetalert2";

const CATEGORY_OPTIONS = ["Concert", "Festival", "Meetup", "Workshop", "Other"];

const ModalShell = ({ title, onClose, children, footer }) => {
  return (
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
};


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
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        availableSeats: Number(form.availableSeats) || 0,
        seatsFilled: Number(form.seatsFilled) || 0,
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
          <label className="text-sm font-medium text-gray-700">Concert</label>
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
          <label className="text-sm font-medium text-gray-700">Event Name</label>
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
          <label className="text-sm font-medium text-gray-700">Available Seats</label>
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
          <label className="text-sm font-medium text-gray-700">Booked Seats</label>
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
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Enter Description"
            className="w-full px-3 py-2 rounded-lg border h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Event Link</label>
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
            <label className="text-sm font-medium text-gray-700">Event Address</label>
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
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        availableSeats: Number(form.availableSeats) || 0,
        seatsFilled: Number(form.seatsFilled) || 0,
      };
      const res = await axiosInstance.put(`/event/edit-event/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdated?.(res?.data || { ...payload, _id: id });
      onClose?.();
    } catch (err) {
      console.error(err);
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
          <label className="text-sm font-medium text-gray-700">Concert</label>
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
          <label className="text-sm font-medium text-gray-700">Event Name</label>
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
          <label className="text-sm font-medium text-gray-700">Available Seats</label>
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
          <label className="text-sm font-medium text-gray-700">Booked Seats</label>
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
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Enter Description"
            className="w-full px-3 py-2 rounded-lg border h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Event Link</label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="Enter Booked Seats"
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Event Address</label>
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
          className="border rounded-lg px-2 py-1"
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
                className={`w-8 h-8 rounded-lg border text-sm ${active
                  ? "bg-[#007AFF] text-white border-[#007AFF]"
                  : "bg-white hover:bg-gray-50"
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpenRow(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/event/getAllEvents");
        setEvents(res.data || []);
      } catch (e) {
        console.error(e);
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
      if (typeof va === "number" && typeof vb === "number")
        return va - vb;
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
        await axiosInstance.delete(`/event/delete-event/${id}`);
        setEvents((prev) => prev.filter((ev) => ev._id !== id));
        setNotification({ message: "Event deleted successfully", type: "success" });
        Swal.fire("Deleted!", "The event has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting event:", error);
        setNotification({ message: "Failed to delete event", type: "error" });
        Swal.fire("Error!", "Failed to delete the event.", "error");
      }
    }
  };

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
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
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold">Event Management</h2>
          <div className="ml-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-600">
                {[
                  ["title", "Event Name"],
                  ["location", "Location"],
                  ["category", "Category"],
                  ["availableSeats", "Available Seats"],
                  ["seatsFilled", "Booked Seats"],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    className="px-4 py-2 cursor-pointer select-none"
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
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pageData.map((row) => (
                <tr key={row._id} className="border-t">
                  <td className="px-4 py-2">{row.title}</td>
                  <td className="px-4 py-2">{row.location}</td>
                  <td className="px-4 py-2">{row.category}</td>
                  <td className="px-4 py-2">{row.availableSeats}</td>
                  <td className="px-4 py-2">{row.seatsFilled}</td>
                  <td className="px-4 py-2 relative">
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
                        className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10 text-sm"
                      >
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                          onClick={() => {
                            setEditEvent(row);
                            setOpenRow(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden overflow-x-auto">
          <div className="flex gap-3 w-max">
            {pageData.map((row) => (
              <div key={row._id} className="min-w-[250px] border rounded-lg p-3 shadow-sm flex-shrink-0">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{row.title}</h3>
                  <button
                    onClick={() =>
                      setOpenRow(openRow === row._id ? null : row._id)
                    }
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{row.category}</p>
                <p className="text-sm">{row.location}</p>
                <div className="flex justify-between text-sm mt-2">
                  <span>Available: {row.availableSeats}</span>
                  <span>Booked: {row.seatsFilled}</span>
                </div>
                {openRow === row._id && (
                  <div
                    ref={dropdownRef}
                    className="mt-2 w-full bg-white border rounded-lg shadow-md text-sm"
                  >
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setEditEvent(row);
                        setOpenRow(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                      onClick={() => handleDelete(row._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
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
          onSubmitted={(newEvent) =>
            setEvents((prev) => [...prev, newEvent])
          }
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
