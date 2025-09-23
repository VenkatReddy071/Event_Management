import React,{useState,useEffect} from 'react'
import MyEvents from './MyEvents'
import axios from "axios"
export default function MyEventPage() {
    const token = localStorage.getItem('userToken');
    const [events, setEvents] = useState([]);
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/event/dashboard`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response?.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    useEffect(() => {
      fetchEvents();
    }, []);
  return (
    <div>
      <MyEvents title={"My Events"} event={events} hidden={false}/>
    </div>
  )
}
