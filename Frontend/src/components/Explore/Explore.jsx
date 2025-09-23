import React, { useState, useEffect } from "react";
import moment from "moment";
import {Link} from "react-router-dom"
import axios from "axios";


const EventCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="flex justify-between items-center mt-3">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        <div className="h-5 bg-blue-200 rounded-full w-1/5"></div>
      </div>
    </div>
  </div>
);

const EventCard = ({ event }) => {
  return (
    <Link to={`/Explore/event/${event?._id}/${event?.title}`}>
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
      <img src={event.posterUrl} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{event.college.name}</p>
        {event?.description?.split('.').map((item)=>(
            <li className="text-gray-600 text-sm mt-2 line-clamp-2">{item}</li>
        ))}
        {event.departments.split(',').map((item)=>(
          <p className="text-sm text-gray-500 mt-1 font-semibold">{item}</p>
        ))}

        <div className="flex justify-between items-center text-gray-800 text-xs mt-3">
          <span className="font-bold text-black text-sm">Start Date : {moment(event.startDate).format('MMM Do, YYYY')}</span>
          <span className="font-bold text-black text-sm">End  Date : {moment(event.startDate).format('MMM Do, YYYY')}</span>
        </div>
        <div className="flex justify-center items-center mt-6">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize relative right-0 ">
            {event.category}
          </span>
        </div>
  
      </div>
    </div>
    </Link>
  );
};

export default function Explore() {
  const [search, setSearch] = useState("");
  const [technical, setTechnical] = useState(false);
  const [nonTechnical, setNonTechnical] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [events,setEvents]=useState([]);
  const fetchData=async()=>{
    try{
      setLoading(true);
      const response=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/event`,{
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event?.title.toLowerCase().includes(search.toLowerCase()) ||
      event?.college.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = (!technical && !nonTechnical) ||
      (technical && event?.category==='technical') ||
      (nonTechnical && event?.category===('nontechnical'));
    
    const matchesBoth = (technical || nonTechnical) && event?.category==='both';
    
    return matchesSearch && (matchesCategory || matchesBoth);
  });

  const skeletons = Array(6).fill(null);

  return (
    <div className="px-4 md:px-10 py-6 bg-gray-50 min-h-screen">
      <div className="text-black mb-6">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl">Explore Colleges</h1>
        <p className="text-gray-500 text-lg">Discover institutions hosting exciting events.</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search colleges or events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-sm"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 bg-white p-4 rounded-md shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700">
              <input 
                type="checkbox" 
                className="form-checkbox text-blue-600 rounded" 
                checked={technical}
                onChange={() => setTechnical(!technical)}
              />
              Technical
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input 
                type="checkbox" 
                className="form-checkbox text-blue-600 rounded" 
                checked={nonTechnical}
                onChange={() => setNonTechnical(!nonTechnical)}
              />
              Non-Technical
            </label>
          </div>
        </div>
        
        <div className="md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {isLoading ? (
              skeletons.map((_, index) => <EventCardSkeleton key={index} />)
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No events match your search or filter criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}