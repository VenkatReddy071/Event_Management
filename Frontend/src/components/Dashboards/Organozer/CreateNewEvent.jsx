import axios from "axios";
import { useEffect, useState } from 'react';
const API_URL=`${import.meta.env.VITE_SERVER_URL}/api`
function Registration() {
  const token=localStorage.getItem("userToken");
  const [loading,setLoading]=useState(false);
  const [events, setEvents] = useState([]);
  const [subevents, setSubevents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    registrationPrice: '',
    winningPrices: [{ position: '1st', winningPrice: '' }],
    eventDate: '',
    time: '',
    team: 1,
    venue: '',
    eventType: 'Technical',
    event: '',
    studentCoordinator1:'',
    studentContact1:'',
    studentCoordinator2:'',
    studentContact2:'',
    facultyCoordinator:'',
    facultyContact:'',
  });
  const [photo, setPhoto] = useState(null);
  const [paymentScanner, setPaymentScanner] = useState(null);
  const [editingSubevent, setEditingSubevent] = useState(null); // New state for editing
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/event/dashboard`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response?.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  const fetchSubEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/subevent/dashboard/all`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubevents(response?.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  useEffect(() => {
    fetchEvents();
    fetchSubEvents();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    if (e.target.name === 'photo') setPhoto(e.target.files[0]);
    else setPaymentScanner(e.target.files[0]);
  };
  const handleWinningPriceChange = (index, e) => {
    const newPrices = [...formData.winningPrices];
    newPrices[index][e.target.name] = e.target.value;
    setFormData({ ...formData, winningPrices: newPrices });
  };
  const addWinningPrice = () => {
    setFormData({ ...formData, winningPrices: [...formData.winningPrices, { position: '', winningPrice: '' }] });
  };


  const handleEditSubevent = (subevent) => {
    setEditingSubevent(subevent._id);
    setFormData({
      title: subevent.title,
      description: subevent.description,
      registrationPrice: subevent.registrationPrice,
      winningPrices: subevent.winningPrices,
      eventDate: new Date(subevent.eventDate).toISOString().split('T')[0], // Format date for input
      time: subevent.time,
      team: subevent.team,
      venue: subevent.venue,
      eventType: subevent.eventType,
      event: subevent.event._id,
      studentCoordinator1:subevent.studentCoordinator1,
      studentContact1:subevent?.studentContact1,
      studentCoordinator2:subevent.studentCoordinator2,
      studentContact2:subevent?.studentContact2,
      facultyCoordinator:subevent.facultyCoordinator,
      facultyContact:subevent.facultyContact,
    });
    setPhoto(null);
    setPaymentScanner(null);
  };

  const handleClearForm = () => {
    setEditingSubevent(null);
    setFormData({
      title: '', description: '', registrationPrice: '',
      winningPrices: [{ position: '1st', winningPrice: '' }],
      eventDate: '', time: '', team: 1, venue: '',
      eventType: 'Technical', event: '',
    studentCoordinator1:'',
    studentContact1:'',
    studentCoordinator2:'',
    studentContact2:'',
    facultyCoordinator:'',
    facultyContact:'',
    });
    setPhoto(null);
    setPaymentScanner(null);
  };

  // const handleSubmit = async(e) => {
  //   e.preventDefault();
  //   try{
  //     setLoading(true);
  //   if (editingSubevent) {
  //       const response = await axios.put(`${API_URL}/subevent/${editingSubevent?._id}`,formData, {
  //         withCredentials: true,
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       if(response.data===201){
  //         setStatusMessage({ type: 'success', text: 'Subevent updated successfully!' });
  //       }
  //       else{
  //         setStatusMessage({ type: 'error', text: response?.data?.msg });
  //       }
    
  //   } else {
  //     console.log('Creating Subevent with data:', formData);
  //       const response = await axios.post(`${API_URL}/subevent/new`,formData, {
  //         withCredentials: true,
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
        
  //       console.log(response.data);
  //       if(response.status===201){
  //         setStatusMessage({ type: 'success', text: 'Subevent created successfully!' });
  //       }
  //       else{
  //         setStatusMessage({ type: 'error', text: response?.data?.msg });
  //       }
      
  //   }
  //   handleClearForm();
  // }
  // catch(error){
  //     setStatusMessage({ type: 'error', text: 'Subevent Creation Failed.!' });
  // }
  // finally{
  //   setLoading(false);
  // }
  // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatusMessage({ type: '', text: '' }); // Clear any previous status messages

//     const formDataToSend = new FormData();
//     formDataToSend.append('title', formData.title);
//     formDataToSend.append('description', formData.description);
//     formDataToSend.append('registrationPrice', formData.registrationPrice);
//     formDataToSend.append('winningPrices', JSON.stringify(formData.winningPrices));
//     formDataToSend.append('eventDate', formData.eventDate);
//     formDataToSend.append('time', formData.time);
//     formDataToSend.append('team', formData.team);
//     formDataToSend.append('venue', formData.venue);
//     formDataToSend.append('eventType', formData.eventType);
//     formDataToSend.append('event', formData.event);

//     // Append the files only if they exist
//     if (photo) {
//         formDataToSend.append('photo', photo);
//     }
//     if (paymentScanner) {
//         formDataToSend.append('paymentScanner', paymentScanner);
//     }

//     try {
//         let response;
//         const config = {
//             withCredentials: true,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data', // This is crucial
//             },
//         };

//         if (editingSubevent) {
//             response = await axios.put(`${API_URL}/subevent/${editingSubevent}`, formData, config);
//         } else {
//             response = await axios.post(`${API_URL}/subevent/new`, formDataToSend, config);
//         }

//         if (response.status === 201) {
//             setStatusMessage({ type: 'success', text: 'Subevent created successfully!' });
//             handleClearForm();
//         } else {
//             setStatusMessage({ type: 'error', text: response?.data?.msg || 'An unknown error occurred.' });
//         }

//     } catch (error) {
//         console.error('Error:', error);
//         setStatusMessage({
//             type: 'error',
//             text: error.response?.data?.message || 'Subevent Creation Failed. Please check all fields.',
//         });
//     } finally {
//         setLoading(false);
//     }
// };
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' }); // Clear any previous status messages

    // Create a new FormData object to handle both text and files
    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('registrationPrice', formData.registrationPrice);
    
    // Stringify the winningPrices array to a JSON string
    formDataToSend.append('winningPrices', JSON.stringify(formData.winningPrices));
    
    formDataToSend.append('eventDate', formData.eventDate);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('team', formData.team);
    formDataToSend.append('venue', formData.venue);
    formDataToSend.append('eventType', formData.eventType);
    formDataToSend.append('event', formData.event);
    formDataToSend.append('studentCoordinator1',formData?.studentCoordinator1);
    formDataToSend.append('studentContact1',formData?.studentContact1);
    formDataToSend.append('studentCoordinator2',formData?.studentCoordinator2);
    formDataToSend.append('studentContact2',formData?.studentContact2);
    formDataToSend.append('facultyCoordinator',formData?.facultyCoordinator);
    formDataToSend.append('facultyContact',formData?.facultyContact);
    // Append files if they exist.
    if (photo) {
        formDataToSend.append('photo', photo);
    }
    if (paymentScanner) {
        formDataToSend.append('paymentScanner', paymentScanner);
    }

    try {
        let response;
        const config = {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                // The 'Content-Type' header will be automatically set to 'multipart/form-data' by the browser when you use FormData.
                // You don't need to specify it manually unless you have a specific requirement.
            },
        };

        if (editingSubevent) {
            response = await axios.put(`${API_URL}/subevent/${editingSubevent}`, formDataToSend, config);
        } else {
            response = await axios.post(`${API_URL}/subevent/new`, formDataToSend, config);
        }

        if (response.status === 200 || response.status === 201) {
            setStatusMessage({ type: 'success', text: `Subevent ${editingSubevent ? 'updated' : 'created'} successfully!` });
            handleClearForm();
        } else {
            setStatusMessage({ type: 'error', text: response?.data?.msg || 'An unknown error occurred.' });
        }
    } catch (error) {
        console.error('Error:', error);
        setStatusMessage({
            type: 'error',
            text: error.response?.data?.msg || 'Subevent operation failed. Please check all fields.',
        });
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Create New Event 
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Main Event List */}
          <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Main Events</h2>
            <div className="grid grid-cols-1 gap-6">
              {events.map(event => (
                <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300">
                  <img className="w-full h-40 object-cover" src={event.posterUrl} alt={event.name} />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <p><strong>Starting Date:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
                      <p><strong>Ending Date:</strong> {new Date(event.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Sub-Events</h2>
            <div className="grid grid-cols-1 gap-6">
              {subevents.map(subevent => (
                <div key={subevent._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 duration-300">
                  <img className="w-full h-40 object-cover" src={subevent.photo} alt={subevent.title} />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900">{subevent.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{subevent.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <p><strong>Main Event:</strong> {subevent.event.name}</p>
                      <p><strong>Date:</strong> {new Date(subevent.eventDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {subevent.time}</p>
                    </div>
                    <button
                      onClick={() => handleEditSubevent(subevent)}
                      className="mt-4 w-full py-2 px-4 rounded-md font-semibold text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Subevent Creation Form */}
          <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingSubevent ? 'Edit Subevent': 'Create New Subevent'}
            </h2>
            {statusMessage.text && (
                <div className={`p-4 mb-4 rounded-md text-white ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {statusMessage.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File and Main Event Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                  <input type="file" id="photo" name="photo" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
                <div>
                  <label htmlFor="scanner" className="block text-sm font-medium text-gray-700">Payment Scanner</label>
                  <input type="file" id="scanner" name="paymentScanner" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              </div>
              <div>
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700">Main Event</label>
                <select id="event-select" name="event" value={formData.event} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5">
                  <option value="">-- Select Main Event --</option>
                  {events.map((event)=>(
                      <option key={event?._id} value={event?._id} className="text-black">{event?.title}</option>
                  ))}
                </select>
              </div>

              {/* Text Inputs */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>

              {/* Number, Date, Time, Venue Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Registration Price</label>
                  <input type="text" id="price" name="registrationPrice" value={formData.registrationPrice} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-gray-700">Team Size (1-5)</label>
                  <input type="number" id="team" name="team" value={formData.team} onChange={handleChange} min="1" max="5" required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Event Date</label>
                  <input type="date" id="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                  <input type="text" id="time" name="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="facultyCoordinator" className="block text-sm font-medium text-gray-700">faculty Co-ordinator</label>
                  <input type="text" id="facultyCoordinator" name="facultyCoordinator" value={formData.facultyCoordinator} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="facultyContact" className="block text-sm font-medium text-gray-700">faculty Contact Number</label>
                  <input type="text" id="facultyContact" name="facultyContact" value={formData.facultyContact} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentCoordinator1" className="block text-sm font-medium text-gray-700">Student Co-ordinator 1</label>
                  <input type="text" id="studentCoordinator1" name="studentCoordinator1" value={formData.studentCoordinator1} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="studentContact1" className="block text-sm font-medium text-gray-700">Student Contact Number 1</label>
                  <input type="text" id="studentContact1" name="studentContact1" value={formData.studentContact1} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentCoordinator2" className="block text-sm font-medium text-gray-700">Student Co-ordinator 2</label>
                  <input type="text" id="studentCoordinator2" name="studentCoordinator2" value={formData.studentCoordinator2} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="studentContact2" className="block text-sm font-medium text-gray-700">Student Contact Number 2</label>
                  <input type="text" id="studentContact2" name="studentContact2" value={formData.studentContact2} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Winning Prices</label>
                {formData.winningPrices.map((price, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" name="position" value={price.position} onChange={(e) => handleWinningPriceChange(index, e)} placeholder="Position (e.g., 1st)" className="w-1/2 rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                    <input type="text" name="winningPrice" value={price.winningPrice} onChange={(e) => handleWinningPriceChange(index, e)} placeholder="Prize (e.g., $500)" className="w-1/2 rounded-md border border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                ))}
                <button type="button" onClick={addWinningPrice} className="text-sm text-indigo-600 hover:text-indigo-800">
                  + Add Another Price
                </button>
              </div>

              {/* Submit and Clear Buttons */}
              <div className="flex gap-4">
                <button type="submit" className="w-full py-3 px-4 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {editingSubevent ? !loading? 'Update Subevent':'Updating...' : !loading ? 'Create Subevent':"Creating.."}
                </button>
                {editingSubevent && (
                  <button type="button" onClick={handleClearForm} className="w-full py-3 px-4 rounded-md font-semibold text-gray-700 border border-gray-300 hover:bg-gray-200">
                    Clear Form
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
