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

    const handleAttendance = async () => {
      try {
        const eventRes = await axiosInstance.get(`/event/getById/${eventId}`);
        const event = eventRes.data;

        if (!event || !event.date) {
          setMessageType("error");
          setMessage("Invalid event data");
          return;
        }

        const now = new Date();
        const startTime = new Date(event.date);
        if (event.time) {
          const [hh, mm] = event.time.split(":");
          startTime.setHours(Number(hh), Number(mm), 0, 0);
        }

        const allowedStart = new Date(startTime.getTime() - 60 * 60 * 1000);
        const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);

        if (now < allowedStart) {
          setMessageType("error");
          setMessage("Attendance can only be marked 1 hour before the event starts.");
          return;
        }

        if (now > endTime) {
          setMessageType("error");
          setMessage("Attendance period has ended.");
          return;
        }

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

    handleAttendance();
  }, [searchParams]);

  if (message && !result) {
    return (
      <div className="h-[65vh]">
        <div
          className={`max-w-lg mx-auto mt-10 p-4 rounded text-white ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      </div>
    );
  }

  if (!result) return <div className="text-center mt-10">Marking attendance...</div>;

  return (
    <div className="h-[65vh]">
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Attendance Confirmed ✅
        </h1>
        <p>
          <strong>User:</strong> {result.attendee.email}
        </p>
        <p>
          <strong>Event:</strong> {result.event.title}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(result.event.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default AttendancePage;
