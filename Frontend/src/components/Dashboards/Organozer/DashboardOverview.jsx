import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineEventNote, MdPeopleOutline, MdOutlinePayments, MdOutlineEvent, MdPerson } from 'react-icons/md';

const DashboardOverview = () => {
  const token = localStorage.getItem("userToken");

  const [dashboardData, setDashboardData] = useState({
    totalHostedEvents: 0,
    totalParticipants: 0,
    totalTeams: 0,
    totalSolo: 0,
    revenueTeams: 0,
    revenueSolo: 0,
    totalRevenue: 0,
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/organizer/events?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentEvents(eventsResponse.data);

        // Fetch all registrations for total calculation
        const registrationsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/organizer/registrations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const registrations = registrationsResponse.data;
        setRecentRegistrations(registrations.slice(-10).reverse()); // still show last 10 in UI

        // Separate solo and team registrations
        const teams = registrations.filter(r => r.groupType && r.groupType.toLowerCase() === 'team');
        const solo = registrations.filter(r => !r.groupType || r.groupType.toLowerCase() === 'solo');

        // Compute totals
        const totalParticipants = registrations.length;
        const revenueTeams = teams.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);
        const revenueSolo = solo.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);
        const totalRevenue = revenueTeams + revenueSolo;

        setDashboardData({
          totalHostedEvents: eventsResponse.data.length,
          totalParticipants,
          totalTeams: teams.length,
          totalSolo: solo.length,
          revenueTeams,
          revenueSolo,
          totalRevenue,
        });

      } catch (err) {
        console.error("Error fetching dashboard data:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p className="text-center p-8">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;

  const stats = [
    { label: 'Total Hosted Events', value: dashboardData.totalHostedEvents, icon: <MdOutlineEventNote size={36} className="text-blue-500" /> },
    { label: 'Total Participants', value: dashboardData.totalParticipants, icon: <MdPeopleOutline size={36} className="text-green-500" /> },
    { label: 'Teams Registered', value: dashboardData.totalTeams, icon: <MdPerson size={36} className="text-purple-500" /> },
    { label: 'Solo Participants', value: dashboardData.totalSolo, icon: <MdPerson size={36} className="text-yellow-500" /> },
    { label: 'Revenue (Teams)', value: `$${dashboardData.revenueTeams}`, icon: <MdOutlinePayments size={36} className="text-purple-600" /> },
    { label: 'Revenue (Solo)', value: `$${dashboardData.revenueSolo}`, icon: <MdOutlinePayments size={36} className="text-green-600" /> },
    { label: 'Total Revenue', value: `$${dashboardData.totalRevenue}`, icon: <MdOutlinePayments size={36} className="text-red-500" /> },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-8 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
              {stat.icon}
            </div>
            <p className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
            <MdOutlineEvent size={24} className="mr-2 text-blue-500" /> Recent Events
          </h3>
          <ul className="divide-y divide-gray-200">
            {recentEvents.length ? recentEvents.map(e => (
              <li key={e._id} className="py-3 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                  <p className="text-xs text-gray-500">{new Date(e.startDate).toLocaleDateString()}</p>
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
            {recentRegistrations.length ? recentRegistrations.map(r => (
              <li key={r._id} className="py-3 flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.username}</p>
                  <p className="text-xs text-gray-500">{r.CollegeName}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.paymentId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {r.paymentId ? 'Paid' : 'Pending'}
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
