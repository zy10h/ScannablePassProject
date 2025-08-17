import { useEffect } from "react";

const Notification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-gray-500";

  return (
    <div className={`fixed top-5 right-5 px-6 py-4 rounded-lg text-white shadow-lg ${bgColor} z-50 animate-fade-in`}>
      {message}
    </div>
  );
};

export default Notification;
