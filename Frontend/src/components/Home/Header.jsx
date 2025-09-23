import React from "react";
import HeaderImg from "../../assets/header.jpg";
import {Link} from "react-router-dom"
function Header() {
  return (
    <div className="w-full relative">
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] xl:h-[450px]">
        <img
          src={HeaderImg}
          alt="header image"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4">
          Connect, Create, and Celebrate Campus Life!
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg xl:text-xl mb-4 sm:mb-6 px-2 sm:px-0">
          Your one-step platform for discovering and hosting vibrant college events.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link to='/Explore'>
          <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-blue-700 transition text-sm sm:text-base">
            Explore an Event
          </button>
          </Link>
          <Link to="/college-register">
          <button className="bg-gray-50 text-black px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-gray-200 transition text-sm sm:text-base">
            Host an Event
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
