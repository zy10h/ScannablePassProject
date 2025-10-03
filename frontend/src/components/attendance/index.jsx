import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

const AttendancePage = () => {
    const [searchParams] = useSearchParams();
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        const userId = searchParams.get("id");
        const email = searchParams.get("email");
        const eventId = searchParams.get("eventId");

        if (!userId || !email || !eventId) {
            setMessageType("error");
            setMessage("Invalid QR code data");
            return;
        }

        const markAttendance = async () => {
            try {
                const res = await axiosInstance.get(
                    `/event/attendance?id=${userId}&email=${email}&eventId=${eventId}`
                );
                setResult(res.data);
                setMessageType("success");
                setMessage("Attendance marked successfully!");
            } catch (err) {
                setMessageType("error");
                setMessage(err.response?.data?.error || "Failed to mark attendance");
            }
        };

        markAttendance();
    }, [searchParams]);

    if (message && !result) {
        return (
            <div className="h-[65vh]">

                <div
                    className={`max-w-lg mx-auto mt-10 p-4 rounded text-white ${messageType === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {message}
                </div>
            </div>
        );
    }

    if (!result) return <div>Marking attendance...</div>;

    return (
        <div className="h-[65vh]">
            <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
                <h1 className="text-2xl font-bold text-green-600 mb-4">
                    Attendance Confirmed ✅
                </h1>
                <p><strong>User:</strong> {result.attendee.email}</p>
                <p><strong>Event:</strong> {result.event.title}</p>
                <p><strong>Date:</strong> {new Date(result.event.date).toLocaleDateString()}</p>
            </div>

        </div>
    );
};

export default AttendancePage;
