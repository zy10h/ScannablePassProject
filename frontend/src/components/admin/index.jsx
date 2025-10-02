// components/admin/index.jsx
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

const CATEGORY_OPTIONS = [
  "Concert",
  "Tech Meetup",
  "Food Festival",
  "Business Conference",
  "Cultural Event",
  "Community Fair",
  "Educational Meetup",
  "Other",
];

const ModalShell = ({ title, onClose, children, footer }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === "Escape" && onClose?.()}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer ? <div className="px-5 pb-5">{footer}</div> : null}
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
        {/* Concert */}
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

        {/* Event Name */}
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

        {/* Available Seats */}
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

        {/* Booked Seats */}
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

        {/* Description */}
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

        {/* Event Link */}
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

        {/* Address / Date / Time */}
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
        {/* Concert */}
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

        {/* Event Name */}
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

        {/* Available Seats */}
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

        {/* Booked Seats */}
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

        {/* Description */}
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

        {/* Event Link */}
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
                className={`w-8 h-8 rounded-lg border text-sm ${
                  active
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
      return typeof v === "number" ? v : Number(v ?? 0);
    }
    return String(row[key] ?? "");
  };

  const compare = (a, b, key, dir) => {
    const va = getValue(a, key);
    const vb = getValue(b, key);
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  };

  const requestSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => compare(a, b, sortKey, sortDir));
    return arr;
  }, [filtered, sortKey, sortDir]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, sortKey, sortDir]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "The event will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.delete(`/event/delete-event/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents((prev) => prev.filter((e) => e._id !== id));
        setNotification({ message: "Event deleted successfully!", type: "success" });
      } catch (error) {
        console.error(error);
        setNotification({ message: "Failed to delete event.", type: "error" });
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <DashboardLayout>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="-mx-4 md:-mx-6 -mt-4 md:-mt-6 bg-white">
        <div className="px-4 md:px-6">
          <div className="flex justify-end items-center py-4">
            <img
              src="https://ui-avatars.com/api/?name=AD&background=0D8ABC&color=fff"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="-mx-6">
        <div className="w-full border-t border-gray-300 mb-10"></div>
      </div>
        {/* Events List + Search bar + Add Event */}
        <div className="px-4 md:px-6 py-4 flex items-center gap-3">
          <h2 className="text-lg md:text-4xl font-semibold">Events List</h2>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none w-56 md:w-72"
              />
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#007AFF] text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>
        </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("category")}
                  >
                    Event Category
                    {sortKey === "category" ? (
                      sortDir === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("title")}
                  >
                    Event Name
                    {sortKey === "title" ? (
                      sortDir === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("location")}
                  >
                    Event Address
                    {sortKey === "location" ? (
                      sortDir === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("availableSeats")}
                  >
                    Available Seats
                    {sortKey === "availableSeats" ? (
                      sortDir === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("seatsFilled")}
                  >
                    Booked Seats
                    {sortKey === "seatsFilled" ? (
                      sortDir === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => (
                <tr key={row._id} className="border-t">
                  <td className="p-3">{row.category || "—"}</td>
                  <td className="p-3">{row.title || "—"}</td>
                  <td className="p-3">{row.location || "—"}</td>
                  <td className="p-3">{row.availableSeats ?? "—"}</td>
                  <td className="p-3">{row.seatsFilled ?? "—"}</td>
                  <td className="p-3 pr-6 text-right relative">
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
                        className="absolute right-4 mt-2 w-28 bg-white border rounded-lg shadow-md z-50 text-sm"
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
                  <td className="p-8 text-center text-gray-500" colSpan={6}>
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 md:px-6 py-3 bg-gray-50 border-top">
          <Pagination
            total={sorted.length}
            page={page}
            pageSize={pageSize}
            onPage={setPage}
            onPageSize={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isAddOpen && (
        <AddEventModal
          onClose={() => setIsAddOpen(false)}
          onSubmitted={(newEvent) => {
            setEvents((prev) => [newEvent, ...prev]);
          }}
        />
      )}

      {editEvent && (
        <EditEventModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onUpdated={(updated) => {
            setEvents((prev) =>
              prev.map((e) => (e._id === updated._id ? updated : e))
            );
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Admin;
