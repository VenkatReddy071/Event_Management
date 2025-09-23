import React, { useState,useEffect } from 'react';
import axios from "axios"
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import MyEvents from './MyEvents';
import CreateNewEvent from './CreateNewEvent';
import Registrations from './Registrations';
import Payments from './Payments';
import CollegeProfile from './CollegeProfile';
import Support from './Support';
import MyEventPage from './MyEventPage';

const TopBar = ({ title,profile }) => (
    <div className="flex justify-between items-center bg-white w-full p-4 sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 capitalize">{title}</h1>
        <div className="flex items-center space-x-4">

            <span className="text-gray-600">{profile?.username}</span>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                {profile?.username?.substring(0,2)}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
          const [loading, setLoading] = useState(true);
          const url = `${import.meta.env.VITE_SERVER_URL}/api`;
          const fetchProfile =async () => {
                  const token = localStorage.getItem("userToken");
                  if (!token) {
                      setUserProfile(null);
                      setLoading(false);
                  }
          
                  try {
                      const response = await axios.get(`${url}/profile/organizer`, {
                          withCredentials: true,
                          headers: {
                              Authorization: `Bearer ${token}`
                          }
                      });
          
                      if (response.status === 201) {
                          console.log(response.data);
                          setUserProfile(response.data);
                      } 
                  } catch (error) {
                      if (error.response && error.response.status === 401) {
                          alert("server error");
                      }
                  } 
                  finally {
                      setLoading(false);
                  }
          };
      
          useEffect(()=>{
              fetchProfile();
      },[])
    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard':
                return 'Dashboard Overview';
            case 'my-events':
                return 'My Events';
            case 'create-event':
                return 'Create New Event';
            case 'registrations':
                return 'Registrations';
            case 'payments':
                return 'Payments';
            case 'profile':
                return 'College Profile';
            case 'support':
                return 'Support';
            default:
                return 'Dashboard';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'my-events':
                return <MyEventPage />;
            case 'create-event':
                return <CreateNewEvent />;
            case 'registrations':
                return <Registrations />;
            case 'payments':
                return <Payments />;
            case 'profile':
                return <CollegeProfile />;
            case 'support':
                return <Support />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="flex  min-h-screen bg-gray-100">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <TopBar title={getTitle()} profile={userProfile}/>
                <div className="p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;