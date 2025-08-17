import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import axiosInstance from "../../axiosConfig";
import Notification from "../notification";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [registered, setRegistered] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userId, setUserId] = useState(null);
  const [check, setCheck] = useState(false);

  const event = formData;
  const seatsFull = event.seatsFilled >= event.availableSeats;

  const GetById = async (id) => {
    try {
      const res = await axiosInstance.get(`/event/getById/${id}`);
      setFormData(res.data);
      const userRegistered = res.data.registeredPeople?.includes(res.data._id);
      setCheck(userRegistered);
      if (userId && res.data.registeredPeople?.includes(userId)) {
        setRegistered(true);
      }
    } catch (err) {
      setNotification({ message: "Failed to fetch event", type: "error" });
    }
  };

  useEffect(() => {
    if (id) GetById(id);
  }, [id]);

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
        { userId: id },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        const qrMessage = `Registered successfully for ${event.title}`;
        const qrDataUrl = await QRCode.toDataURL(qrMessage);

        const pdf = new jsPDF();
        pdf.setFontSize(20);
        pdf.text(event.title, 105, 30, { align: "center" });
        pdf.addImage(qrDataUrl, "PNG", 70, 50, 70, 70);

        pdf.save(`${event.title}_ticket.pdf`);

        setRegistered(true);
        setNotification({
          message: "Registration successful!",
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
        err.response?.data?.message || "Error registering for the event.";
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

  const isRegistered = registered || check;

  return (
    <div className="max-w-6xl mx-auto p-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-full h-96 overflow-hidden rounded-lg">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="mt-4 text-gray-600">{event.description}</p>
            <div className="mt-6 space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">📍 Location:</span>{" "}
                {event.location}
              </p>
              <p>
                <span className="font-semibold">📅 Date:</span> {event.date} at{" "}
                {event.time}
              </p>
              <p>
                <span className="font-semibold">🎟 Seats:</span>{" "}
                {event.seatsFilled}/{event.availableSeats} booked
              </p>
              <p>
                <span className="font-semibold">🏷 Category:</span>{" "}
                {event.category}
              </p>
            </div>
          </div>
          <button
            onClick={handleRegister}
            disabled={isRegistered || seatsFull}
            className={`mt-6 w-full py-3 px-4 rounded-xl text-white font-semibold transition ${
              isRegistered || seatsFull
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {seatsFull
              ? "Seats Full"
              : isRegistered
              ? "Already Registered ✔"
              : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
