import React from 'react';
import {
  MdOutlineDashboard,
  MdOutlineEventNote,
  MdOutlineAddBox,
  MdPeopleOutline,
  MdOutlinePayments,
  MdSchool,
  MdOutlineHelpOutline,
  MdMenu,
} from 'react-icons/md';

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <MdOutlineDashboard size={24} /> },
    { id: 'my-events', label: 'My Events', icon: <MdOutlineEventNote size={24} /> },
    { id: 'host-request', label: 'College Request', icon: <MdOutlineAddBox size={24} /> },
    { id: 'participants', label: 'Participants', icon: <MdPeopleOutline size={24} /> },
  ];

  return (
    <aside
      className={`fixed top-0 p-4 left-0 h-screen transition-all duration-300 ease-in-out bg-white shadow-md
        ${isSidebarOpen ? 'w-54' : 'w-20'}`}
    >
      <div className="flex items-center p-4 justify-between   border-b border-gray-200 ">
        {isSidebarOpen && <span className="text-xl font-bold text-blue-600 ">Admin Dashboard</span>}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-blue-600 focus:outline-none">
          <MdMenu size={24} />
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="my-2">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full p-3 transition-colors duration-200 ease-in-out
                  ${activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
                  }`}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                {isSidebarOpen && <span className="ml-4 whitespace-nowrap">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;