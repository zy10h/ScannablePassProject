import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Spinner from "../spinner";

const RegisterUser = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axiosInstance.get("/event/attendance/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAttendance(res.data);
        console.log("data", { a: res.data });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Filter attendance based on search
  const filteredAttendance = attendance.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.eventTitle?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
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
      <div className="px-6 py-4">
        <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
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
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
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
                      {search
                        ? "No attendance records found matching your search"
                        : "No attendance records found"}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-t border-gray-100 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="p-4 text-gray-700">{row.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {row.eventTitle}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedData.length === 0 ? (
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
                {search
                  ? "No attendance records found matching your search"
                  : "No attendance records found"}
              </p>
            </div>
          ) : (
            paginatedData.map((row, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
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
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="font-semibold text-gray-600">Event:</span>
                    <span className="text-gray-800 text-right">
                      {row.eventTitle}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 flex justify-end">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Registered
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm text-gray-600">
            <div>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + pageSize, totalItems)} of {totalItems}{" "}
              entries
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RegisterUser;
