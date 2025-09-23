import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaCalendarAlt, FaUniversity, FaMoneyBillAlt, FaUser, FaTicketAlt } from 'react-icons/fa';

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState({
    colleges: 0,
    events: 0,
    activeUsers: 0,
    revenue: 0,
    registrations: 0,
    recentColleges: [],
    recentRegistrations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('userToken'); 
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setStats(response.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch dashboard data.");
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Colleges',
      value: stats.colleges,
      icon: <FaUniversity size={32} />,
      color: 'bg-indigo-500',
    },
    {
      title: 'Total Events',
      value: stats.events,
      icon: <FaCalendarAlt size={32} />,
      color: 'bg-green-500',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <FaUsers size={32} />,
      color: 'bg-orange-500',
    },
    {
      title: 'Total Registrations',
      value: stats.registrations,
      icon: <FaTicketAlt size={32} />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue}`,
      icon: <FaMoneyBillAlt size={32} />,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {loading ? (
          <div className="flex justify-center items-center col-span-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start space-y-4 transform hover:scale-105 transition-transform duration-300"
            >
              <div className={`p-3 rounded-full text-white ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-gray-500 text-sm font-semibold uppercase">{card.title}</p>
              <h2 className="text-4xl font-extrabold text-gray-900">{card.value}</h2>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Colleges Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaUniversity size={20} className="mr-2" /> Recent Colleges
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {stats.recentColleges.length > 0 ? (
                stats.recentColleges.map((college) => (
                  <li key={college._id} className="py-3 flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{college.name}</span>
                    <span className="text-sm text-gray-500">{new Date(college.registrationDate).toLocaleDateString()}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No new colleges registered.</p>
              )}
            </ul>
          )}
        </div>

        {/* Recent Registrations Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaTicketAlt size={20} className="mr-2" /> Recent Registrations
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.map((reg) => (
                  <li key={reg._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FaUser size={16} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{reg.username}</span>
                    </div>
                    <span className="text-sm text-gray-500">{reg.event?.title || 'Unknown Event'}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No new registrations yet.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
