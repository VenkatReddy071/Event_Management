import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="w-full">
      <div className="text-black text-center px-4 sm:px-10 py-8">
        <h1 className="font-bold text-3xl sm:text-4xl py-4">
          About Campus Connect
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-4xl mx-auto">
          Campus Connect is a dynamic platform designed to enhance college life by
          connecting students, faculty, and alumni through a diverse range of events.
          Whether you're looking to attend exciting workshops, participate in thrilling
          competitions, or organize your own events, Campus Connect provides the tools
          and resources to make it happen.
        </p>
      </div>

      <div className="bg-blue-300 py-10 flex justify-center items-center h-60 my-10">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold py-2">
            Ready to Get Started?
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-2">
            <Link to="/Explore">
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-sm sm:text-base">
              Explore an Event
            </button>
            </Link>
            <Link to="/college-register">
            <button className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition text-sm sm:text-base">
              Host an Event
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
