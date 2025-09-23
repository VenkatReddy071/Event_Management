import React, { useEffect } from "react";

const Notification = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const typeColors = {
    success: "bg-green-500 border-green-700 text-white",
    error: "bg-red-500 border-red-700 text-white",
    info: "bg-blue-500 border-blue-700 text-white",
  };

  return (
    <div
      className={`fixed top-5 right-5 min-w-[250px] p-4 rounded-lg shadow-lg border-l-4 z-50 transition-transform duration-300 transform animate-slideIn
        ${typeColors[type]}`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white font-bold hover:text-gray-200"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Notification;
