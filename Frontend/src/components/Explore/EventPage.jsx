import React, { useState, useEffect } from "react";
import moment from "moment";
import {Link,useParams} from "react-router-dom"
import axios from "axios"

const EventCard = ({ event,id }) => {
  return (
    <Link to={`/Explore/${id}/subevents/${event?._id}`}>
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
      <img
        src={event.photo}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{event.college.name}</p>
        <h3 className=" font-bold text-gray-800">Registration Fee: <br></br>{event.registrationPrice}</h3>
        <h3 className="text-xl font-bold text-gray-800">Total Members:{event.team}</h3>
        
        <div className="flex justify-between items-center text-gray-800 text-xs mt-3">
          <span className="font-semibold">Date: {moment(subevent.eventDate).format('MMMM Do, YYYY')}</span>
            {/* <span className="font-semibold">Time Slot:{event.time}</span> */}
        </div>
      </div>
    </div>
    </Link>
  );
};

// Reusable skeleton loading component for a single card
const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      </div>
    </div>
  );
};

// Main component that handles the grid display and lazy loading
export default function EventsGrid() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {id}=useParams();
  const fetchData=async()=>{
    try{
      setLoading(true);
      const response=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/subevent/${id}`,{
        withCredentials:true,
      })
      setEvents(response.data);
    }
    catch(error){
      alert(error?.response?.data?.msg);
    }
    finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  // An array of 12 skeleton cards to fill the initial grid
  const skeletons = Array(12).fill(null);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Register for a Event 
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? skeletons.map((_, index) => <EventCardSkeleton key={index} />)
          : events.map((event) => <EventCard key={event._id} event={event} id={id}/>)}
      </div>
    </div>
  );
}
