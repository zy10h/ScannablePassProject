import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import axiosInstance from "../../axiosConfig";
import Notification from "../notification";
import { FiMapPin, FiCalendar, FiUsers, FiTag, FiCheckCircle } from "react-icons/fi";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [registered, setRegistered] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userId, setUserId] = useState(null);

  const event = formData;
  const seatsFull = event.seatsFilled >= event.availableSeats;

const GetById = async (id, uid) => {
  try {
    const res = await axiosInstance.get(`/event/getById/${id}`);
    setFormData(res.data);
    const userRegistered = uid && res.data.registeredPeople?.includes(uid);
    if (userRegistered) setRegistered(true);
  } catch (err) {
    setNotification({ message: "Failed to fetch event", type: "error" });
  }
};


useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const uid = storedToken ? JSON.parse(atob(storedToken.split(".")[1])).id : null;
  setUserId(uid);
  if (id) GetById(id, uid); // pass userId directly
}, [id]);


  useEffect(() => {
    if (id && userId) GetById(id);
  }, [id, userId]);

  const handleRegister = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/register", { replace: true });
      return;
    }
    if (seatsFull || registered) return;

    try {
      const res = await axiosInstance.post(
        `/event/register-for/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      if (res.status === 200 || res.status === 201) {
        const { qrCode } = res.data;
        const pdf = new jsPDF();
        pdf.setFontSize(20);
        pdf.text(event.title, 105, 30, { align: "center" });
        pdf.addImage(qrCode, "PNG", 70, 50, 70, 70);
        pdf.save(`${event.title}_ticket.pdf`);

        setRegistered(true);
        setFormData((prev) => ({
          ...prev,
          seatsFilled: prev.seatsFilled + 1,
        }));

        setNotification({
          message: "Registration successful! Ticket PDF downloaded.",
          type: "success",
        });
      } else {
        setNotification({
          message: "Failed to register for the event.",
          type: "error",
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Error registering for the event.";
      setNotification({ message: errorMessage, type: "error" });
    }
  };


  if (!event) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-gray-600">
        <h2 className="text-2xl font-semibold">Event not found</h2>
      </div>
    );
  }

  const isRegistered = registered;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-6 my-12">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden">
        <div className="w-full h-64 md:h-auto overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-between p-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {event.title}
            </h1>
            <p className="mt-4 text-gray-600">{event.description}</p>
            <div className="mt-6 space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <FiMapPin />
                <span className="font-semibold">Location:</span> {event.location}
              </p>
              <p className="flex items-center gap-2">
                <FiCalendar />
                <span className="font-semibold">Date:</span> {formatDate(event.date)} at {event.time}
              </p>
              <p className="flex items-center gap-2">
                <FiUsers />
                <span className="font-semibold">Seats:</span> {event.seatsFilled}/{event.availableSeats} booked
              </p>
              <p className="flex items-center gap-2">
                <FiTag />
                <span className="font-semibold">Category:</span> {event.category}
              </p>
            </div>
          </div>
          <button
            onClick={handleRegister}
            disabled={isRegistered || seatsFull}
            className={`mt-6 w-full h-[52px] rounded-[12px] text-white font-semibold transition ${isRegistered || seatsFull
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {seatsFull
              ? "Seats Full"
              : isRegistered
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiCheckCircle /> Already Registered
                  </span>
                )
                : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
