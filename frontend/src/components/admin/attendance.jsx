import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/dashboardLayout";
import axiosInstance from "../../axiosConfig";
import Spinner from "../spinner";

const RegisterUser = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axiosInstance.get("/event/attendance/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setAttendance(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    if (loading) return <Spinner />;

    return (
        <DashboardLayout>
            <div className="px-6 py-4">
                <h2 className="text-2xl font-semibold mb-4">Event Attendance</h2>
                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3 font-medium">Name</th>
                                <th className="p-3 font-medium">Email</th>
                                <th className="p-3 font-medium">Event</th>
                                <th className="p-3 font-medium">Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((row, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="p-3">{row.name}</td>
                                        <td className="p-3">{row.email}</td>
                                        <td className="p-3">{row.eventTitle}</td>
                                        <td className="p-3">{row.attendance}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RegisterUser;
