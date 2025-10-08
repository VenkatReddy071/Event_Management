import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineEventNote, MdPeopleOutline, MdOutlinePayments, MdOutlineEvent, MdPerson, MdGroup } from 'react-icons/md';

const DashboardOverview = () => {
  const token = localStorage.getItem("userToken");
  const [dashboardData, setDashboardData] = useState({
    totalHostedEvents: 0,
    totalParticipants: 0,
    revenueSummary: 0,
    totalTeams: 0,
    totalSolo: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard summary
        const summaryResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/organizer`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDashboardData(summaryResponse.data);

        // Fetch recent events
        const eventsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/organizer/events?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentEvents(eventsResponse.data);

        // Fetch recent registrations
        const registrationsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/organizer/registrations?limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentRegistrations(registrationsResponse.data);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center p-8 text-gray-600 font-semibold">Loading dashboard data...</p>;
  if (error) return <p className="text-center p-8 text-red-500 font-semibold">{error}</p>;

  const stats = [
    { label: 'Total Hosted Events', value: dashboardData.totalHostedEvents, icon: <MdOutlineEventNote size={36} className="text-blue-500" /> },
    { label: 'Total Participants', value: dashboardData.totalParticipants, icon: <MdPeopleOutline size={36} className="text-green-500" /> },
    { label: 'Total Teams', value: dashboardData.totalTeams, icon: <MdGroup size={36} className="text-purple-500" /> },
    { label: 'Total Solo', value: dashboardData.totalSolo, icon: <MdPerson size={36} className="text-yellow-500" /> },
    { label: 'Total Revenue', value: `$${dashboardData.revenueSummary}`, icon: <MdOutlinePayments size={36} className="text-red-500" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
              {stat.icon}
            </div>
            <p className="mt-4 text-4xl font-extrabold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent events and registrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
            <MdOutlineEvent size={24} className="mr-2 text-blue-500" /> Recent Events
          </h3>
          <ul className="divide-y divide-gray-200">
            {recentEvents.length ? recentEvents.map(event => (
              <li key={event._id} className="py-3 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                  <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </li>
            )) : <p className="text-gray-500 text-sm">No recent events found.</p>}
          </ul>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
            <MdPerson size={24} className="mr-2 text-green-500" /> Recent Registrations
          </h3>
          <ul className="divide-y divide-gray-200">
            {recentRegistrations.length ? recentRegistrations.map(reg => (
              <li key={reg._id} className="py-3 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{reg.username}</p>
                  <p className="text-xs text-gray-500">{reg.CollegeName}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${reg.paymentId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reg.paymentId ? 'Paid' : 'Pending'}
                </span>
              </li>
            )) : <p className="text-gray-500 text-sm">No recent registrations found.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
