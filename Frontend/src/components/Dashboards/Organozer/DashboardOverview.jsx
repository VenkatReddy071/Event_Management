import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineEventNote, MdPeopleOutline, MdOutlinePayments, MdOutlineEvent, MdPerson } from 'react-icons/md';

const DashboardOverview = () => {
  const token = localStorage.getItem("userToken");

  const [dashboardData, setDashboardData] = useState({
    totalHostedEvents: 0,
    totalParticipants: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [totals, setTotals] = useState({
    totalRegistrations: 0,
    totalSolo: 0,
    totalTeams: 0,
    soloRevenue: 0,
    teamRevenue: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dashboard summary
        const summaryResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/organizer`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(summaryResponse.data);

        // Recent events
        const eventsResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/organizer/events?limit=500`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentEvents(eventsResponse.data);

        // All registrations
        const registrationsResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/organizer/registrations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const registrations = registrationsResponse.data;

        // Calculate totals
        const soloRegs = registrations.filter(r => !r.groupType || r.groupType.toLowerCase() === 'solo');
        const teamRegs = registrations.filter(r => r.groupType && r.groupType.toLowerCase() === 'team');

        const soloRevenue = soloRegs.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);
        const teamRevenue = teamRegs.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);
        const totalRevenue = soloRevenue + teamRevenue;

        setTotals({
          totalRegistrations: registrations.length,
          totalSolo: soloRegs.length,
          totalTeams: teamRegs.length,
          soloRevenue,
          teamRevenue,
          totalRevenue
        });

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    { label: 'Total Solo Registrations', value: totals.totalSolo, icon: <MdPerson size={36} className="text-yellow-500" /> },
    { label: 'Total Team Registrations', value: totals.totalTeams, icon: <MdPerson size={36} className="text-purple-500" /> },
    { label: 'Solo Revenue', value: `$${totals.soloRevenue}`, icon: <MdOutlinePayments size={36} className="text-green-500" /> },
    { label: 'Team Revenue', value: `$${totals.teamRevenue}`, icon: <MdOutlinePayments size={36} className="text-blue-500" /> },
    { label: 'Total Revenue', value: `$${totals.totalRevenue}`, icon: <MdOutlinePayments size={36} className="text-red-500" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
              {stat.icon}
            </div>
            <p className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-900">{stat.value}</p>
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
      </div>
    </div>
  );
};

export default DashboardOverview;
