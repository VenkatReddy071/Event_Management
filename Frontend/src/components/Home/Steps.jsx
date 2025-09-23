import React from 'react'

export default function Steps() {
    const steps=[
        {
            count:1,
            heading:"Explore Events",
            info:"Browse through a wide range of events. Use filters to find events that match your interests.",
        },
        {
            count:2,
            heading:"Register & Pay",
            info:"Select your desired event and complete the registration Securely pay using our integrated payment gateway.",
        },
        {
            count:3,
            heading:"Attend & Enjoy",
            info:"Attend the event and enjoy a seamless experience. Engage with participants and have fun!",
        },
    ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 md:px-20">
      {steps.map((item, index) => (
        <div
          key={index}
          className="w-full h-auto p-6 shadow-lg rounded-lg hover:shadow-xl transition transform hover:-translate-y-4 flex flex-col items-center text-center"
        >
          <div className={`text-2xl sm:text-3xl md:text-4xl mb-4 rounded-full p-4 w-14 h-14 flex justify-center items-center bg-blue-500 text-white`}>{item.count}</div>
          <h2 className="text-xl font-semibold mb-2">{item.heading}</h2>
          <p className="text-gray-700">{item.info}</p>
        </div>
      ))}
    </div>
  )
}
