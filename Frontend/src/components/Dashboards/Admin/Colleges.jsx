import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const CollegeApproval = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/colleges/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setColleges(response?.data?.allColleges);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch colleges.');
      setLoading(false);
      console.error('Error fetching colleges:', err);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleApproval = async (id, isApproved) => {
    setStatusMessage(null);
    try {
      const token = localStorage.getItem('userToken');
      const endpoint = isApproved ? `${import.meta.env.VITE_SERVER_URL}/api/colleges/approve/${id}` : `${import.meta.env.VITE_SERVER_URL}/api/colleges/reject/${id}`;
      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setColleges(colleges.map(college =>
        college._id === id ? { ...college, isApproved: isApproved } : college
      ));
      setStatusMessage(`College has been ${isApproved ? 'approved' : 'rejected'}.`);
    } catch (err) {
      setStatusMessage('Failed to update college status.');
      console.error('Error updating college status:', err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">College Approval Dashboard</h1>
      
      {statusMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6" role="alert">
          <p>{statusMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin h-10 w-10 text-indigo-500" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  College Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {colleges?.length > 0 ? (
                colleges?.map((college) => (
                  <tr key={college?._id} className="hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{college.name}</div>
                      <div className="text-sm text-gray-500">{college.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{college.contactName}</div>
                      <div className="text-sm text-gray-500">{college.contactEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          college.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {college.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!college.isApproved && (
                        <button
                          onClick={() => handleApproval(college._id, true)}
                          className="text-green-600 hover:text-green-900 mr-4 transition-colors"
                          title="Approve College"
                        >
                          <FaCheckCircle size={24} />
                        </button>
                      )}
                      {college.isApproved && (
                        <button
                          onClick={() => handleApproval(college._id, false)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Reject College"
                        >
                          <FaTimesCircle size={24} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No colleges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CollegeApproval;
