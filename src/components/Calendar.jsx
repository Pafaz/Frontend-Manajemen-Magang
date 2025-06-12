import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const startOfMonth = currentDate.startOf("month").day();
  const daysInMonth = currentDate.daysInMonth();
  const today = dayjs().format("YYYY-MM-DD");

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  return (
    <div className="w-full bg-white rounded-2xl p-5 mt-3">
      <div className="flex justify-between items-center bg-indigo-50 p-1.5 rounded-full">
        <button
          onClick={prevMonth}
          className="w-7 h-7 border border-indigo-200 flex justify-center items-center rounded-full bg-white text-indigo-500"
        >
          <i className="bi bi-chevron-left text-xs"></i>
        </button>
        <h2 className="text-sm font-semibold text-center">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={nextMonth}
          className="w-7 h-7 border border-indigo-200 flex justify-center items-center rounded-full bg-white text-indigo-500"
        >
          <i className="bi bi-chevron-right text-xs"></i>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mt-3 text-gray-600 border border-slate-400/[0.3] rounded-xl p-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="font-semibold text-sm text-gray-800">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: startOfMonth }).map((_, index) => (
          <div key={index}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = currentDate.date(index + 1).format("YYYY-MM-DD");
          const isToday = date === today;
          const isSunday = dayjs(currentDate.date(index + 1)).day() === 0;

          return (
            <div
              key={index}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm cursor-pointer transition-all duration-300 
          ${isToday ? "bg-blue-500 text-white font-semibold" : ""}
          ${isSunday ? "text-red-500" : "text-gray-800 hover:bg-gray-200"}`}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
