
import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });

    setTimeout(() => setNotification(null), 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 p-4 rounded-xl shadow-lg transition-all duration-300 text-white 
            ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "error"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
