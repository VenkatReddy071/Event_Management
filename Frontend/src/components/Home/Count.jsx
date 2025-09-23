import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Count() {
  const [stats, setStats] = useState({
    colleges: 0,
    events: 0,
    activeUsers: 0,
  });
  const [animatedCounts, setAnimatedCounts] = useState({
    colleges: 0,
    events: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user-stats`);
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

  useEffect(() => {
    if (loading || error) return;

    const startAnimation = (statKey) => {
      let currentCount = 0;
      const finalCount = stats[statKey];
      const duration = 500;
      let startTime = null;

      const animateStep = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        const newCount = Math.floor(percentage * finalCount);

        setAnimatedCounts(prevCounts => ({
          ...prevCounts,
          [statKey]: newCount
        }));

        if (percentage < 1) {
          requestAnimationFrame(animateStep);
        }
      };

      requestAnimationFrame(animateStep);
    };
    
    startAnimation('colleges');
    startAnimation('events');
    startAnimation('activeUsers');

  }, [stats, loading, error]);

  const counts = [
    { count: animatedCounts.events, info: "Events Hosted" },
    { count: animatedCounts.colleges, info: "Registered Colleges" },
    { count: animatedCounts.activeUsers, info: "Participants" },
  ];

  return (
    <div className="bg-blue-500 text-white w-full h-auto py-20 my-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {counts.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              {loading ? '...' : `${item.count}+`}
            </h1>
            <p className="text-lg sm:text-xl">{item.info}</p>
          </div>
        ))}
      </div>
    </div>
  );
}