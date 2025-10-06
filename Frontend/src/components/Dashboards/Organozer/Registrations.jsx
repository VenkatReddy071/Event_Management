import React, { useState } from "react";

const eventsData = {
  technical: [
    { name: "Paper Presentation", type: "Team-2", fee: 300 },
    { name: "Tech Quiz", type: "Solo", fee: 100 },
    { name: "AI Build-A-Thon", type: "Team-2", fee: 300 },
    { name: "Coding Contest", type: "Solo", fee: 100 },
    { name: "Working Model Expo", type: "Team-2", fee: 200 },
    { name: "UI/UX Design Challenge", type: "Team-2", fee: 200 },
    { name: "Tech Crossword", type: "Solo", fee: 100 },
    { name: "AI Prompt Writing Contest", type: "Team-3", fee: 300 },
  ],
  nonTechnical: [
    { name: "Dance Championship", type: "Solo/Group", fee: "200/400" },
    { name: "Melodious Voice", type: "Solo", fee: 100 },
    { name: "Catwalk – Girls", type: "Solo", fee: 200 },
    { name: "Mismatch Ramp Walk – Boys", type: "Solo", fee: 200 },
    { name: "Artistic Impressions (Mehendi)", type: "Solo", fee: 150 },
    { name: "Dialogue Delivery", type: "Solo", fee: 100 },
    { name: "Theme Painting", type: "Solo", fee: 100 },
    { name: "Photography", type: "Solo", fee: 100 },
    { name: "Treasure Hunt", type: "Team-3", fee: 300 },
    { name: "Tech Memes Creation", type: "Team-2", fee: 200 },
    { name: "Stand-up Comedy", type: "Solo", fee: 100 },
    { name: "Short Film Contest", type: "Team-2", fee: 200 },
  ],
};

const RegistrationForm = () => {
  const [category, setCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSelectedEvent(null);
  };

  const handleEventChange = (e) => {
    const selected = e.target.value;
    const eventDetails =
      eventsData[category].find((ev) => ev.name === selected) || null;
    setSelectedEvent(eventDetails);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Event Registration</h2>

      {/* Filter Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block font-semibold">Select Category</label>
          <select
            className="w-full border p-2 rounded mt-1"
            onChange={handleCategoryChange}
            value={category}
          >
            <option value="">-- Choose Category --</option>
            <option value="technical">Technical</option>
            <option value="nonTechnical">Non-Technical</option>
          </select>
        </div>

        {category && (
          <div>
            <label className="block font-semibold">Select Event</label>
            <select
              className="w-full border p-2 rounded mt-1"
              onChange={handleEventChange}
              value={selectedEvent?.name || ""}
            >
              <option value="">-- Choose Event --</option>
              {eventsData[category].map((ev) => (
                <option key={ev.name} value={ev.name}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedEvent && (
          <div className="p-3 bg-gray-50 rounded-md border">
            <p>
              <strong>Type:</strong> {selectedEvent.type}
            </p>
            <p>
              <strong>Fee:</strong> ₹{selectedEvent.fee}
            </p>
          </div>
        )}
      </div>

      {/* Registration Form Fields */}
      <form className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="College Name"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
