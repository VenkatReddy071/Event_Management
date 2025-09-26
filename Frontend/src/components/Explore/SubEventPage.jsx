// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import moment from 'moment';
// import RegistrationForm from './RegistrationForm';
// import axios from "axios";
// // const dummySubevent = {
// //   _id: 'subevent-1',
// //   title: 'Competitive Programming Challenge',
// //   description: 'A challenge to test your problem-solving skills and algorithms. Compete for top prizes!',
// //   photo: 'https://images.pexels.com/photos/11035392/pexels-photo-11035392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// //   registrationPrice: 200,
// //   paymentScanner: 'https://images.pexels.com/photos/1292115/pexels-photo-1292115.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// //   winningPrices: [
// //     { position: '1st', winningPrice: '₹5000' },
// //     { position: '2nd', winningPrice: '₹3000' },
// //     { position: '3rd', winningPrice: '₹1000' },
// //   ],
// //   eventDate: new Date('2025-11-15T10:00:00Z'),
// //   time: '10:00 AM - 01:00 PM',
// //   participationCertificate: true,
// //   team: 1,
// //   venue: 'Computer Science Lab, Tech Institute',
// //   eventType: 'Technical',
// //   event: 'event-1',
// // };

// const SubeventPage = () => {
//     const { subeventId} = useParams();
//     const {eventId}=useParams();
//   const [subevent, setSubevent] = useState(null);
//   const [isLoading, setLoading] = useState(true);
//   const [showRegistrationForm, setShowRegistrationForm] = useState(false);

//   const fetchData=async()=>{
//       try{
//         setLoading(true);
//         const response=await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/subevent/details/${subeventId}`,{
//           withCredentials:true,
//         })
//         setSubevent(response.data);
//       }
//       catch(error){
//         alert(error?.response?.data?.msg);
//       }
//       finally{
//         setLoading(false);
//       }
//     }
//     useEffect(() => {
//       fetchData();
//     }, [subeventId]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="animate-pulse bg-gray-200 w-1/2 h-8 rounded-md"></div>
//       </div>
//     );
//   }

//   if (!subevent) {
//     return <div className="p-8 text-center text-red-500">Sub-event not found.</div>;
//   }

//   return (
//     <div className="bg-gray-50">
//       <div className="h-[75vh] md:h-[calc(100vh_-_80px)] overflow-hidden relative">
//         <img
//           src={subevent.photo}
//           alt={subevent.title}
//           className="w-full h-full object-cover sticky top-0"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
//           <h1 className="text-4xl font-bold text-white">{subevent.title}</h1>
//         </div>
//       </div>

//       <div className="relative z-10 -mt-20 md:-mt-40 bg-white rounded-t-3xl shadow-2xl p-6 md:p-12 overflow-y-auto">
//         <div className="max-w-4xl mx-auto space-y-8">
//           <div className="grid md:grid-cols-2 gap-8">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Details</h2>
//               <p className="text-gray-600 mb-4">{subevent.description}</p>
//               <div className="space-y-2 text-gray-700">
//                 <p><strong>Date:</strong> {moment(subevent.eventDate).format('MMMM Do, YYYY')}</p>
//                 <p><strong>Time:</strong> {subevent.time}</p>
//                 <p><strong>Venue:</strong> {subevent.venue}</p>
//                 <p><strong>Type:</strong> {subevent.eventType}</p>
//                 <p><strong>Team Size:</strong> {subevent.team}</p>
//               </div>
//               <div className=" text-gray-800  mt-3">
//                 <span className=""><strong>Faculty Co-Ordinator:</strong>  {subevent.facultyCoordinator}</span>
//                 <br></br>
//                 <span className=""><strong>Faculty Contact:</strong>   {subevent.facultyContact}</span>
//               </div>
//             <div className=" text-gray-800  mt-3">
//                 <span className=""><strong>Student Co-Ordinator 1:</strong> {subevent.studentCoordinator1}</span>
//                 <br></br>
//                 <span className=""><strong>Student Contact 1:</strong>  {subevent.studentContact1}</span>
//               </div>
//             </div>
//               <div className=" text-gray-800  mt-3">
//                 <span className=""><strong>Student Co-Ordinator 2:</strong> {subevent.studentCoordinator2}</span>
//                 <br></br>
//                 <span className=""><strong>Student Contact 2:</strong>  {subevent.studentContact2}</span>
//               </div>
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Prizes</h2>
//               <div className="space-y-2">
//                 {subevent.winningPrices.map((price, index) => (
//                   <div key={index} className="flex justify-between items-center text-gray-700 bg-gray-100 p-3 rounded-md">
//                     <span className="font-semibold">{price.position}</span>
//                     {/* <span className="text-lg font-bold text-green-600">{price.winningPrice}</span> */}
//                   </div>
//                 ))}
//               </div>
//               {subevent.participationCertificate && (
//                 <p className="mt-4 text-sm text-gray-500">
//                   <span className="font-semibold text-green-500">✓</span> Participation certificates will be provided.
//                 </p>
//               )}
//             </div>
//           </div>
          
//           <hr className="my-8" />
          
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>
//             <div className="flex items-center justify-between bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
//               <span className="text-xl font-bold text-blue-800">Registration Fee: {subevent.registrationPrice}</span>
//               <button
//                 onClick={() => setShowRegistrationForm(!showRegistrationForm)}
//                 className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 hover:bg-blue-700"
//               >
//                 {showRegistrationForm ? 'Hide Form' : 'Register Now'}
//               </button>
//             </div>
            
//             {showRegistrationForm && (
//               <div className="mt-8">
//                 <RegistrationForm subevent={subevent} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
    
//   );
// };

// export default SubeventPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import RegistrationForm from './RegistrationForm'; // Make sure this component exists

const SubeventPage = () => {
  const { subeventId } = useParams();
  const [subevent, setSubevent] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Function to fetch subevent data from the backend
  const fetchSubeventData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/subevent/details/${subeventId}`, {
        withCredentials: true,
      });
      setSubevent(response.data);
    } catch (error) {
      console.error("Error fetching subevent:", error);
      alert(error?.response?.data?.msg || "Failed to fetch event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubeventData();
  }, [subeventId]);

  // A helper function to render the description based on its content
  const renderDescription = (description) => {
    const DELIMITER = 'DELIMITER';
    // Check if the description contains the specific delimiter
    if (description && description.includes(DELIMITER)) {
      const sections = description.split(DELIMITER).map(s => s.trim()).filter(s => s.length > 0);

      return (
        <div className="space-y-6">
          {sections.map((section, index) => {
            const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length === 0) return null;

            const title = lines[0];
            const content = lines.slice(1);

            return (
              <div key={index}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {content.map((point, pointIndex) => (
                    <li key={pointIndex}>
                      {/* Check if the line is in a "Key: Value" format to bold the key */}
                      {point.includes(':') ? (
                        <>
                          <span className="font-semibold">{point.split(':')[0]}:</span>
                          {point.substring(point.indexOf(':') + 1)}
                        </>
                      ) : (
                        point
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      );
    }

    // If no delimiter is found, render the description as a single paragraph
    return <p className="text-gray-600 mb-4">{description}</p>;
  };

  // Display a loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse bg-gray-200 w-1/2 h-8 rounded-md"></div>
      </div>
    );
  }

  // Handle the case where the subevent data is not found
  if (!subevent) {
    return <div className="p-8 text-center text-red-500">Sub-event not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="h-[75vh] md:h-[calc(100vh_-_80px)] overflow-hidden relative">
        <img
          src={subevent.photo}
          alt={subevent.title}
          className="w-full h-full object-cover sticky top-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
          <h1 className="text-4xl font-bold text-white">{subevent.title}</h1>
        </div>
      </div>

      <div className="relative z-10 -mt-20 md:-mt-40 bg-white rounded-t-3xl shadow-2xl p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Details</h2>
              {/* This is where the dynamic rendering happens */}
              {renderDescription(subevent.description)}

              <div className="space-y-2 text-gray-700 mt-6">
                <p><strong>Date:</strong> {moment(subevent.eventDate).format('MMMM Do, YYYY')}</p>
                {/* <p><strong>Time:</strong> {subevent.time}</p> */}
                {/* <p><strong>Venue:</strong> {subevent.venue}</p> */}
                <p><strong>Type:</strong> {subevent.eventType}</p>
                <p><strong>Team Size:</strong> {subevent.team}</p>
              </div>
              
              <div className="text-gray-800 mt-6 space-y-2">
                <div>
                  <p><strong>Faculty Co-Ordinator:</strong> {subevent.facultyCoordinator}</p>
                  <p><strong>Faculty Contact:</strong> {subevent.facultyContact}</p>
                </div>
                <div>
                  <p><strong>Student Co-Ordinator 1:</strong> {subevent.studentCoordinator1}</p>
                  <p><strong>Student Contact 1:</strong> {subevent.studentContact1}</p>
                </div>
                <div>
                  <p><strong>Student Co-Ordinator 2:</strong> {subevent.studentCoordinator2}</p>
                  <p><strong>Student Contact 2:</strong> {subevent.studentContact2}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Prizes</h2>
              <div className="space-y-2">
                {subevent.winningPrices && subevent.winningPrices.map((price, index) => (
                  <div key={index} className="flex justify-between items-center text-gray-700 bg-gray-100 p-3 rounded-md">
                    <span className="font-semibold">{price.position}</span>
                    <span className="text-lg font-bold text-green-600">{price.winningPrice}</span>
                  </div>
                ))}
              </div>
              {subevent.participationCertificate && (
                <p className="mt-4 text-sm text-gray-500">
                  <span className="font-semibold text-green-500">✓</span> Participation certificates will be provided.
                </p>
              )}
            </div>
          </div>
          
          <hr className="my-8" />
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration</h2>
            <div className="flex items-center justify-between bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
              <span className="text-xl font-bold text-blue-800">Registration Fee: {subevent.registrationPrice}</span>
              <button
                onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 hover:bg-blue-700"
              >
                {showRegistrationForm ? 'Hide Form' : 'Register Now'}
              </button>
            </div>
            
            {showRegistrationForm && (
              <div className="mt-8">
                <RegistrationForm subevent={subevent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubeventPage;
