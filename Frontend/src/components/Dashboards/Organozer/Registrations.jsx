import React, { useState } from "react";

const eventsData = {
  technical: [
    "Paper Presentation",
    "Tech Quiz",
    "AI Build-A-Thon",
    "Coding Contest",
    "Working Model Expo",
    "UI/UX Design Challenge",
    "Tech Crossword",
    "AI Prompt Writing Contest",
  ],
  nonTechnical: [
    "Dance Championship",
    "Melodious Voice",
    "Catwalk – Girls",
    "Mismatch Ramp Walk – Boys",
    "Artistic Impressions (Mehendi)",
    "Dialogue Delivery",
    "Theme Painting",
    "Photography",
    "Treasure Hunt",
    "Tech Memes Creation",
    "Stand-up Comedy",
    "Short Film Contest",
  ],
};

const EventFilter = () => {
  const [category, setCategory] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setFilteredEvents(eventsData[selectedCategory] || []);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">
        🎯 Event Filter Section
      </h2>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Category</label>
        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">-- Choose Category --</option>
          <option value="technical">Technical Events</option>
          <option value="nonTechnical">Non-Technical Events</option>
        </select>
      </div>

      {/* Filtered Event List */}
      {filteredEvents.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Available {category === "technical" ? "Technical" : "Non-Technical"} Events:
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            {filteredEvents.map((event, index) => (
              <li key={index} className="text-gray-700">
                {event}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventFilter;
