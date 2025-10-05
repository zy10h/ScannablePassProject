import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Spinner from "../spinner";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const RegisterUser = () => {
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, eventsRes] = await Promise.all([
          axiosInstance.get("/event/attendance/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axiosInstance.get("/event/getAllEvents"),
        ]);
        setAttendance(attendanceRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isClosedEvent = (eventTitle) => {
    const event = events.find((e) => e.title === eventTitle);
    if (!event) return false;
    const eventDate = new Date(event.date);
    return eventDate < new Date();
  };

  const filteredAttendance = attendance.filter(
    (item) =>
      isClosedEvent(item.eventTitle) &&
      (item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.eventTitle?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalItems = filteredAttendance.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedData = filteredAttendance.slice(
    startIndex,
    startIndex + pageSize
  );

  if (loading) return <Spinner />;

  return (
    <DashboardLayout>
      <div className="px-2 py-4">
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-[1rem] flex flex-col sm:flex-row justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Event Attendance
            </h2>
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table className="hidden md:table w-full text-left">
            <thead className="text-gray-700">
              <tr>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Name
                </th>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Email
                </th>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Event
                </th>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Status
                </th>
                <th className="p-4 font-semibold border-b border-gray-200">
                  Attendance Time
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No closed event attendance records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="p-4 text-gray-700">{row.email}</td>
                    <td className="p-4">
                      <span>{row.eventTitle}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Closed
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      {formatDateTime(row.timestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 mt-4">
          {paginatedData.length === 0 ? (
            <div></div>
          ) : (
            paginatedData.map((row, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {row.name}
                    </h3>
                    <p className="text-sm text-gray-600">{row.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">Event:</span>
                    <span className="text-gray-800 text-right">
                      {row.eventTitle}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">Status:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Closed
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">
                      Attendance Time:
                    </span>
                    <span className="text-gray-800 text-right">
                      {formatDateTime(row.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-gray-600">
            <div>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + pageSize, totalItems)} of {totalItems}{" "}
              entries
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const active = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg border text-sm transition-colors ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegisterUser;
