import React from "react";
import { FaCode, FaCalendarAlt, FaUserPlus } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
export default function Services() {
  const content = [
    {
      icon: <FaCode />,
      heading: "Register for Technical Events",
      info: "Access workshops, coding competitions, and tech talks. Enhance your skills and network with industry professionals.",
      color: "text-blue-500",
      bg:"bg-blue-100",
    },
    {
      icon: <MdCelebration />,
      heading: "Register for Non-Technical Events",
      info: "Explore cultural festivals, social gatherings, and recreational activities. Connect with like-minded individuals.",
      color: "text-green-500",
      bg:"bg-green-100"
    },
    {
      icon: <FaUserPlus />,
      heading: "Host an Event as a College",
      info: "Easily host and manage your events, reaching a wider audience and streamlining the registration process.",
      color: "text-orange-500",
      bg:"bg-orange-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 md:px-20 ">
      {content.map((item, index) => (
        <div
          key={index}
          className="w-full h-auto p-6 shadow-lg rounded-lg hover:shadow-xl transition transform hover:-translate-y-4 flex flex-col items-center text-center"
        >
          <div className={`text-2xl mb-4 ${item.color} ${item.bg} rounded-full p-3 flex justify-center items-center`}>{item.icon}</div>
          <h2 className="text-xl font-semibold mb-2">{item.heading}</h2>
          <p className="text-gray-700">{item.info}</p>
        </div>
      ))}
    </div>
  );
}
