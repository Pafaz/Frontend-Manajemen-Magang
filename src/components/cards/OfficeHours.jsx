import { useState } from "react";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum’at"];

const OfficeHours = () => {
  const [selectedDay, setSelectedDay] = useState("Selasa");

  const renderTimeFields = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex items-center gap-6 mb-6">
        <label className="w-32 font-medium text-sm">Jam Masuk</label>
        <input
          type="text"
          placeholder="07.00"
          className="w-40 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="text-sm font-medium">-</span>
        <input
          type="text"
          placeholder="07.00"
          className="w-40 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    ));
  };

  return (
    <div className="h-[600px] p-10 text-gray-800">
      <h2 className="text-3xl font-bold mb-2">Jam Kantor</h2>
      <p className="text-gray-500 text-base mb-8">Atur Jam Operasional Kantor</p>

      <div className="flex gap-5 border-b border-gray-200 pb-5 mb-8">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`font-semibold text-sm px-5 py-2 rounded-md transition ${
              selectedDay === day
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {renderTimeFields()}

      <div className="flex justify-end gap-4 mt-8">
        <button className="px-5 py-2 rounded-md bg-blue-100 text-blue-600 text-sm font-semibold hover:bg-blue-200">
          Cancel
        </button>
        <button className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default OfficeHours;
