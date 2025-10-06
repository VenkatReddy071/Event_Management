import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from "axios"
// Modal component to display user details
const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Registration Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile Number:</strong>{user.mobile}</p>
            <p><strong>College:</strong> {user.CollegeName}</p>
            <p><strong>Year:</strong> {user.year}</p>
            <p><strong>Branch:</strong> {user.branch}</p>
            <p><strong>Semester:</strong> {user.semister}</p>
            <p><strong>Payment ID:</strong> {user.paymentId}</p>
            <p><strong>Event:</strong> {user.event.title}</p>
            <p><strong>Subevent:</strong> {user.subEvent.title}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Screenshot</h4>
            <img 
              src={user.paymentScreenShot} 
              alt="Payment Screenshot" 
              className="w-full h-auto rounded-lg shadow-md" 
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/e0e0e0/555555?text=Screenshot+Not+Available" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};



function Registration() {
  const [registrations, setRegistrations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const token=localStorage.getItem('userToken');
  const fetchRegistrations=async()=>{
    try{
      const response=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/eventRegister/registrations`,{
        withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            }
      });
      setRegistrations(response.data);
    }
    catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDownload = () => {
    const header = ['Username', 'Email','Mobile Number', 'College Name', 'Year', 'Branch', 'Semester', 'Payment ID', 'Event', 'Sub-event'];
    const rows = registrations.map(reg => [
      reg.username,
      reg.email,
      reg.mobile,
      reg.CollegeName,
      reg.year,
      reg.branch,
      reg.semister,
      reg.paymentId,
      reg.event.name,
      reg.subEvent.title,
    ].join(','));

    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'registrations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Event Registrations
        </h1>

        <div className="p-6 bg-white rounded-xl shadow-lg h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Registered Users</h2>
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors"
            >
              Download All Transactions
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Event</th>
                  <th className="py-3 px-6 text-left">Sub-event</th>
                  <th className="py-3 px-6 text-left">Payment ID</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {registrations.map(reg => (
                  <tr key={reg._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{reg.username}</div>
                      <div className="text-xs text-gray-500">{reg.email}</div>
                      <div className="text-xs text-gray-500">{reg.mobile}</div>
                    </td>
                    <td className="py-3 px-6 text-left">{reg.event.title}</td>
                    <td className="py-3 px-6 text-left">{reg.subEvent.title}</td>
                    <td className="py-3 px-6 text-left">{reg.paymentId}</td>
                    <td className="py-3 px-6 text-center">
                      <button 
                        onClick={() => setSelectedUser(reg)}
                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-full text-xs transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
} 

export default Registration;
