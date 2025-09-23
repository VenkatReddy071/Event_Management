import React, { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import {Link} from "react-router-dom"
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [select, setSelect] = useState("Home");
  const navbar = ["Home", "Explore", "Host"];
  const {userProfile}=useAuth();
  console.log(userProfile);
  return (
    <nav className="bg-white shadow-lg p-4 sticky top-0 z-50">
      <div className="flex justify-between items-center mx-auto">
        <div className="flex items-center gap-2">
          <FaGraduationCap className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-black">Campus Connect</h1>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navbar.map((item, index) => (
            <Link to={item === "Home" ? "/" : item === "Host" ? 'college-register' : item}>
            <h1
              key={index}
              className={`${
                select === item
                  ? "bg-blue-600 text-white py-2 px-4 rounded-full"
                  : "font-semibold cursor-pointer transition-all duration-300"
              } font-semibold cursor-pointer`}
              onClick={() => setSelect(item)}
            >
              {item}
            </h1>
            </Link>
          ))}
        </div>
          {!userProfile ?(
              <div className="hidden md:flex items-center gap-4">
          
          <Link to="/login">
          <button className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
            Log in
          </button>
          </Link>
          <Link to="/sign">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            Sign up
          </button>
          </Link>
        </div>
          ):(
          <div className="hidden md:flex items-center gap-4">
          
          
          <h1 className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            {userProfile?.username}
          </h1>
        </div>
          )}
        
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <HiOutlineX className="text-3xl text-gray-700" />
            ) : (
              <HiOutlineMenu className="text-3xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {navbar.map((item, index) => (
            <Link to={item==="Home"?"/":item}>
            <h1
              key={index}
              className={`${
                select === item
                  ? "bg-blue-600 text-white py-2 px-4 rounded-full"
                  : "text-gray-700 hover:text-blue-600"
              } font-semibold cursor-pointer`}
              onClick={() => {
                setSelect(item);
                setIsOpen(false);
              }}
            >
              {item}
            </h1>
            </Link>
          ))}
        {!userProfile ?(
          <div className="flex flex-col gap-2 mt-2">
            <Link to="/login">
            <button className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
              Log in
            </button>
            </Link>
            <Link to="/sign">
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
              Sign up
            </button>
            </Link>
          </div>
        ):(
          <div className="hidden md:flex items-center gap-4">
          
          
          <h1 className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            {userProfile?.username}
          </h1>
        </div>
        )
      }
        </div>
      )}
    </nav>
  );
};

export default Navbar;
