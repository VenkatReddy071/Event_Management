import React, { useState } from 'react';

import axios from "axios"
export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    contactName: '',
    contactEmail: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/colleges/register`, formData);

      const result = await response.data;

      if (response.status===201) {
        setMessage(result.message || 'Registration successful. Please wait for approval.');
        setFormData({
          name: '',
          address: '',
          website: '',
          contactName: '',
          contactEmail: '',
          password: '',
        });
      } else {
        setMessage(result.error || result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('A network error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center p-4">
      <div className=" overflow-hidden w-full max-w-6xl flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-blue-50">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 leading-tight">
            How Our Registration Process Works
          </h2>
          <p className="text-blue-700 mb-8">
            Welcome to our event management platform! Follow these simple steps to get your college approved and start creating events.
          </p>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 shadow-md">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-900">Submit Your Details</h3>
                <p className="text-sm text-blue-700">
                  Fill out the registration form with your college's information and your contact details. This creates a pending account.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 shadow-md">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-900">Awaiting Approval</h3>
                <p className="text-sm text-blue-700">
                  Our administrators will review your registration. We'll send you an email notification as soon as your account is approved.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 shadow-md">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-900">Access Your Dashboard</h3>
                <p className="text-sm text-blue-700">
                  Once approved, you can log in to your dedicated dashboard to manage your college's profile and create new events.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4 shadow-md">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-900">Create Events</h3>
                <p className="text-sm text-blue-700">
                  Post main events and create technical or non-technical sub-events to showcase everything your college has to offer.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            College Registration
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">College Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">College Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">College Website (Optional)</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Organizer Name</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {isLoading ? 'Registering...' : 'Register My College'}
              </button>
            </div>
          </form>
          {message && (
            <div className={`mt-4 text-center text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
