import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineEventNote, MdPeopleOutline, MdOutlinePayments, MdOutlineEvent, MdPerson } from 'react-icons/md';

// Define URL outside the component or at least the effect for clarity
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Utility function for currency formatting
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '$0.00'; // Handle non-numeric or null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const DashboardOverview = () => {
  const token = localStorage.getItem("userToken");
  const [dashboardData, setDashboardData] = useState({
    totalHostedEvents: 0,
    totalParticipants: 0,
    revenueSummary: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Abort controller for cleanup
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return;
      }
      try {
        // Prepare API call promises
        const promises = [
          axios.get(`${SERVER_URL}/api/organizer`, {
            signal, // Pass signal to the request
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${SERVER_URL}/api/organizer/events?limit=5`, {
            signal,
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${SERVER_URL}/api/organizer/registrations?limit=10`, {
            signal,
            headers: { Authorization: `Bearer ${token}` },
          }),
        ];

        // Execute all promises concurrently
        const [summaryResponse, eventsResponse, registrationsResponse] = await Promise.all(promises);

        setDashboardData(summaryResponse.data);
        setRecentEvents(eventsResponse.data);
        setRecentRegistrations(registrationsResponse.data);

      } catch (err) {
        if (axios.isCancel(err)) {
            console.log('Request canceled:', err.message);
            return;
        }
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to abort requests if the component unmounts
    return () => {
      controller.abort();
    };
  }, [token]); // Added token to dependency array for completeness, though it's likely static here.

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-600 font-semibold">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Hosted Events', value: dashboardData.totalHostedEvents, icon: <MdOutlineEventNote size={36} className="text-blue-500" /> },
    { label: 'Total Participants', value: dashboardData.totalParticipants, icon: <MdPeopleOutline size={36} className="text-green-500" /> },
    // Use the formatting function
    { label: 'Revenue Summary', value: formatCurrency(dashboardData.revenueSummary), icon: <MdOutlinePayments size={36} className="text-purple-500" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
              {stat.icon}
            </div>
            <p className="mt-4 text-5xl font-extrabold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
            <MdOutlineEvent size={24} className="mr-2 text-blue-500" />
            Recent Events
          </h3>
          <ul className="divide-y divide-gray-200">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <li key={event._id} className="py-3 flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent events found.</p>
            )}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
            <MdPerson size={24} className="mr-2 text-green-500" />
            Recent Registrations
          </h3>
          <ul className="divide-y divide-gray-200">
            {recentRegistrations.length > 0 ? (
              recentRegistrations.map((reg) => (
                <li key={reg._id} className="py-3 flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{reg.username}</p>
                    <p className="text-xs text-gray-500">{reg.CollegeName}</p>
                  </div>
                  {/* FIX: Corrected the dynamic class name syntax */}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${reg.paymentId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {reg.paymentId ? 'Paid' : 'Pending'}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent registrations found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
