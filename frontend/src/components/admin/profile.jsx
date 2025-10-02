import { useState, useRef, useEffect, useMemo } from "react";
import { MoreVertical, Plus, Search, ChevronUp, ChevronDown } from "lucide-react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Notification from "../notification";
import Spinner from "../spinner";

const Pagination = ({ currentPage, totalPages, onPage }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => currentPage > 1 && onPage(currentPage - 1)}
        className="w-8 h-8 rounded-lg border bg-gray-100 disabled:opacity-50"
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        {"<"}
      </button>

      {pages.map((p) => {
        const active = currentPage === p;
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

      <button
        onClick={() => currentPage < totalPages && onPage(currentPage + 1)}
        className="w-8 h-8 rounded-lg border bg-gray-100 disabled:opacity-50"
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        {">"}
      </button>
    </div>
  );
};


const ProfileData = () => {
  const [openRow, setOpenRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  const [sortKey, setSortKey] = useState(null); // "name" | "address" | "email" | "university"
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenRow(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/auth/users");
        setUsers(res.data || []);
      } catch (e) {
        console.error(e);
        setNotification({ message: "Failed to fetch users", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter((u) =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.address || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.university || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  const getValue = (row, key) => String(row?.[key] ?? "").toLowerCase();
  const compare = (a, b, key, dir) => {
    const va = getValue(a, key);
    const vb = getValue(b, key);
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
    };
  const requestSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [query, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const firstIdx = (currentPage - 1) * itemsPerPage;
  const lastIdx = firstIdx + itemsPerPage;
  const pageRows = sorted.slice(firstIdx, lastIdx);

  if (loading) return (<div><Spinner /></div>);

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

      <div className="px-4 md:px-6 py-4 flex items-center gap-3">
        <h2 className="text-lg md:text-4xl font-semibold">Profile</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none w-56 md:w-72"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("name")}
                  >
                    Name
                    {sortKey === "name" ? (
                      sortDir === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("address")}
                  >
                    Address
                    {sortKey === "address" ? (
                      sortDir === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("email")}
                  >
                    Email
                    {sortKey === "email" ? (
                      sortDir === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium">
                  <button
                    className="inline-flex items-center gap-1 hover:underline"
                    onClick={() => requestSort("university")}
                  >
                    University
                    {sortKey === "university" ? (
                      sortDir === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    ) : (
                      <ChevronDown size={16} className="opacity-30" />
                    )}
                  </button>
                </th>
                <th className="p-3 font-medium text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row._id} className="border-t">
                  <td className="p-3">{row.name || "—"}</td>
                  <td className="p-3">{row.address || "—"}</td>
                  <td className="p-3">{row.email || "—"}</td>
                  <td className="p-3">{row.university || "—"}</td>
                  <td className="p-3 pr-6 text-right relative">
                    <button
                      onClick={() => setOpenRow(openRow === row._id ? null : row._id)}
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openRow === row._id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-4 mt-2 w-28 bg-white border rounded-lg shadow-md z-50 text-sm"
                      >
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                          View
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50">
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td className="p-8 text-center text-gray-500" colSpan={5}>
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


<div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-gray-600 px-3 py-3">
  <div>
    Showing {sorted.length === 0 ? 0 : firstIdx + 1} to{" "}
    {Math.min(lastIdx, sorted.length)} of {sorted.length} entries
  </div>

  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2">
      <span>Display</span>
      <select
        value={itemsPerPage}
        onChange={(e) => setItemsPerPage(Number(e.target.value))}
        className="px-3 py-1.5 rounded-md border"
      >
        {[5, 10, 20, 50].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>

    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPage={setCurrentPage}
    />
  </div>
</div>

      </div>
    </DashboardLayout>
  );
};

export default ProfileData;
