import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/event`;

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1 capitalize">{label}</label>
    <input {...props} className="w-full rounded-md border-gray-400 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition px-4 py-2" />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1 capitalize">{label}</label>
    <textarea {...props} rows="3" className="w-full rounded-md border-gray-400 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition px-4 py-2"></textarea>
  </div>
);

const EventForm = ({ event, onSubmit, onClose,loading }) => {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    category: '',
    departments:'',
  });

  // New state for the file and its preview URL
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: new Date(event.startDate).toISOString().split('T')[0],
        endDate: new Date(event.endDate).toISOString().split('T')[0],
        location: event.location,
        category: event.category,
        departments:event.departments,
      });
      // Set the existing poster URL for editing
      setPosterPreview(event.posterUrl);
    }
  }, [event]);

  // Effect to handle creating a new preview URL whenever a new file is selected
  useEffect(() => {
    if (posterFile) {
      const objectUrl = URL.createObjectURL(posterFile);
      setPosterPreview(objectUrl);
      // Clean up the URL when the component unmounts or a new file is selected
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [posterFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      category: checked ? value : '',
    }));
  };

  // New handler for file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (posterFile) {
      data.append('posterUrl', posterFile);
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {event ? 'Edit Event' : 'Create New Event'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="title" name="title" value={formData.title} onChange={handleChange} required />
          <TextAreaField label="description" name="description" value={formData.description} onChange={handleChange} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField type="date" label="start date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            <InputField type="date" label="end date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
          <InputField label="location" name="location" value={formData.location} onChange={handleChange} required />
          <InputField label="departments" name="departments" value={formData.departments} onChange={handleChange} required />
          <div>
            <label className="block text-gray-700 font-medium mb-1 capitalize">category</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  value="technical"
                  checked={formData.category === 'technical'}
                  onChange={handleCategoryChange}
                  className="form-checkbox text-blue-600 rounded"
                />
                <span>technical</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  value="non-technical"
                  checked={formData.category === 'non-technical'}
                  onChange={handleCategoryChange}
                  className="form-checkbox text-blue-600 rounded"
                />
                <span>non-technical</span>
              </label>
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  value="both"
                  checked={formData.category === 'both'}
                  onChange={handleCategoryChange}
                  className="form-checkbox text-blue-600 rounded"
                />
                <span>both</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 capitalize">poster image</label>
            <input
              type="file"
              name="poster"
              onChange={handleFileChange}
              className="w-full rounded-md border-gray-400 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
              required={!event} // Make file required for new events
            />
            {posterPreview && (
              <div className="mt-4">
                <img src={posterPreview} alt="poster preview" className="w-full h-48 object-cover rounded-md" />
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
            >
              {event ? !loading ? 'Update Event':"Updading Event.." : !loading?'Create Event':"Creating Event.."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyEvents = () => {
  const token = localStorage.getItem('userToken');
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading,setLoading]=useState(false);
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response?.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      if (currentEvent) {
        const { data } = await axios.put(`${API_URL}/admin/dashboard/${currentEvent._id}`, formData, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important for file uploads
          }
        });
        setEvents((prev) => prev.map((e) => (e._id === data._id ? data : e)));
      } else {
        const { data } = await axios.post(`${API_URL}/admin/dashboard`, formData, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important for file uploads
          }
        });
        setEvents((prev) => [data, ...prev]);
      }
      setIsFormVisible(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
    finally{
    setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/dashboard/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsFormVisible(true);
  };

  const EventCard = ({ event, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img src={event.posterUrl} alt={event.title} className="w-full h-56 object-cover" />
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow capitalize">
          {event.category.toLowerCase()}
        </span>
      </div>
      <div className="p-5 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
        <div className="text-gray-500 text-sm mb-2">
          📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
        </div>
        <div className="text-gray-500 text-sm mb-4">📍 {event.location}</div>
        <div className="flex gap-3 mt-auto">
          <button onClick={() => onEdit(event)} className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
            edit
          </button>
          <button onClick={() => onDelete(event._id)} className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
            delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">All Events 🎉</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
        </div>
      </header>
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="no events"
            className="w-28 mx-auto mb-4 opacity-70"
          />
          <p className="text-lg font-medium">no events found. try adding a new one!</p>
        </div>
      )}
      {isFormVisible && (
        <EventForm event={currentEvent} onSubmit={handleFormSubmit} onClose={() => setIsFormVisible(false)} loading={loading}/>
      )}
    </div>
  );
};

export default MyEvents;