import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RegistrationForm = ({ subevent }) => {
  const { eventId, subeventId } = useParams();
  console.log('Event ID:', eventId, 'Subevent ID:', subeventId);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    collegeName: '',
    year: '',
    branch: '',
    semister: '',
    paymentId: '',
    groupType: '',
  });

  const [paymentScreenShot, setPaymentScreenShot] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPaymentScreenShot(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!formData.username.trim()) errors.username = 'Username is required.';
    if (!formData.email.trim()) errors.email = 'Email is required.';
    else if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format.';

    if (!formData.mobile.trim()) errors.mobile = 'Mobile number is required.';
    else if (!mobileRegex.test(formData.mobile)) errors.mobile = 'Invalid mobile number.';

    if (!formData.collegeName.trim()) errors.collegeName = 'College Name is required.';
    if (!formData.year.trim()) errors.year = 'Year is required.';
    if (!formData.branch.trim()) errors.branch = 'Branch is required.';
    if (!formData.semister.trim()) errors.semister = 'Semester is required.';

    if (!formData.paymentId.trim()) errors.paymentId = 'Payment Transaction ID is required.';
    else if (formData.paymentId.length < 10)
      errors.paymentId = 'Payment ID must be at least 10 characters.';

    if (!paymentScreenShot) errors.paymentScreenShot = 'Payment screenshot is required.';

    const isTeamEvent =
      subevent &&
      (subevent.title.includes('Dance Championship') ||
        subevent.title.includes('AI Prompt Writing Contest'));

    if (isTeamEvent && !formData.groupType.trim()) {
      errors.groupType = 'Please specify if participating as Team or Solo.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');
    setIsSuccess(false);

    if (!validateForm()) {
      setFormMessage('Please fix the errors in the form.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('paymentScreenShot', paymentScreenShot);
      data.append('event', eventId);
      data.append('subEvent', subeventId);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/eventRegister`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('Response:', response.data);
      setFormMessage('Registration successful!');
      setIsSuccess(true);

      setFormData({
        username: '',
        email: '',
        mobile: '',
        collegeName: '',
        year: '',
        branch: '',
        semister: '',
        paymentId: '',
        groupType: '',
      });
      setPaymentScreenShot(null);
    } catch (error) {
      console.error('Registration error:', error);
      setFormMessage('Registration failed. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const isTeamEvent =
    subevent &&
    (subevent.title.includes('Dance Championship') ||
      subevent.title.includes('AI Prompt Writing Contest'));

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Your Registration</h3>

      {/* Payment instructions */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <p className="font-semibold text-yellow-800 mb-2">Payment Instructions</p>
          <p className="text-sm text-gray-700">
            Scan the QR code below to pay the registration fee of{' '}
            <span className="font-bold">₹{subevent.registrationPrice}</span>. After payment, enter
            the Transaction ID and upload a screenshot.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={subevent.paymentScanner}
            alt="Payment QR Code"
            className="w-60 h-60 object-contain rounded-md border border-gray-300"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username + Email */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">
              {subevent.team !== 1 ? 'User name / Team Name' : 'User name'}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>
        </div>

        {/* Mobile + College */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.mobile && <p className="text-red-500 text-sm">{formErrors.mobile}</p>}
          </div>
          <div>
            <label className="block text-gray-700">College Name</label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.collegeName && (
              <p className="text-red-500 text-sm">{formErrors.collegeName}</p>
            )}
          </div>
        </div>

        {/* Year + Branch */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.year && <p className="text-red-500 text-sm">{formErrors.year}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.branch && <p className="text-red-500 text-sm">{formErrors.branch}</p>}
          </div>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-gray-700">Semester</label>
          <input
            type="text"
            name="semister"
            value={formData.semister}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.semister && <p className="text-red-500 text-sm">{formErrors.semister}</p>}
        </div>

        {/* Payment ID */}
        <div>
          <label className="block text-gray-700">Payment Transaction ID</label>
          <input
            type="text"
            name="paymentId"
            value={formData.paymentId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.paymentId && <p className="text-red-500 text-sm">{formErrors.paymentId}</p>}
        </div>

        {/* Group Type */}
        {isTeamEvent && (
          <div>
            <label className="block text-gray-700">Participating as a Team or Solo</label>
            <input
              type="text"
              name="groupType"
              value={formData.groupType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.groupType && <p className="text-red-500 text-sm">{formErrors.groupType}</p>}
          </div>
        )}

        {/* Screenshot */}
        <div>
          <label className="block text-gray-700">Upload Payment Screenshot</label>
          <input
            type="file"
            name="paymentScreenShot"
            onChange={handleFileChange}
            className="w-full text-gray-700 border rounded-md py-2"
          />
          {formErrors.paymentScreenShot && (
            <p className="text-red-500 text-sm">{formErrors.paymentScreenShot}</p>
          )}
        </div>

        {/* Message */}
        {formMessage && (
          <p
            className={`text-center py-2 rounded-md ${
              isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {formMessage}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
