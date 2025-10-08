import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineEventNote, MdPeopleOutline, MdOutlinePayments, MdOutlineEvent, MdPerson } from 'react-icons/md';

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
    const fetchData = async () => {
      try {
        // Fetch hosted events summary
        const summaryResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/organizer`,
          { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
        );

        setDashboardData(prev => ({
          ...prev,
          totalHostedEvents: summaryResponse.data.totalHostedEvents,
          totalParticipants: summaryResponse.data.totalParticipants,
        }));

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

        // Compute total revenue from registrations
        const totalRevenue = registrationsResponse.data.reduce((sum, reg) => {
          // Assuming each registration has a "registrationPrice" field or you can hardcode
          return sum + (reg.registrationPrice ? Number(reg.registrationPrice) : 0);
        }, 0);

        setDashboardData(prev => ({
          ...prev,
          revenueSummary: totalRevenue,
        }));

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center p-8">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;

  const stats = [
    { label: 'Total Hosted Events', value: dashboardData.totalHostedEvents, icon: <MdOutlineEventNote size={36} className="text-blue-500" /> },
    { label: 'Total Participants', value: dashboardData.totalParticipants, icon: <MdPeopleOutline size={36} className="text-green-500" /> },
    { label: 'Revenue Summary', value: `$${dashboardData.revenueSummary}`, icon: <MdOutlinePayments size={36} className="text-purple-500" /> },
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

      {/* Recent Events & Registrations remain the same */}
      {/* ... */}
    </div>
  );
};

export default DashboardOverview;
