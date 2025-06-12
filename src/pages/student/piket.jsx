import { useState, useEffect } from "react";
import axios from "axios";
import { Sun, Moon } from "lucide-react";

export default function JadwalPiket() {
  const [shift, setShift] = useState("Pagi");
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({
    Pagi: [],
    Sore: [],
  });

  // Define all days of the week
  const allDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/piket-peserta`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const pagi = res.data.data.filter(
        (schedule) => schedule.shift.toLowerCase() === "pagi"
      );
      const sore = res.data.data.filter(
        (schedule) => schedule.shift.toLowerCase() === "sore"
      );

      // Format data to make it easier to use
      const formattedSchedule = {
        Pagi: pagi.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama), // Member names
        })),
        Sore: sore.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama), // Member names
        })),
      };

      setScheduleData(formattedSchedule);
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Get schedule data for the current shift
  const scheduleByDay = {}; 
  const daysData = scheduleData[shift] || [];
  
  // Create a lookup object for existing schedules
  daysData.forEach(day => {
    scheduleByDay[day.hari.toLowerCase()] = day;
  });

  // Function to get background color based on day
  const getCardColor = (hari) => {
    const colors = {
      "senin": "bg-[#E0F3FF]",
      "selasa": "bg-[#FFE1CB]",
      "rabu": "bg-[#E2DBF9]", 
      "kamis": "bg-[#FFFED3]",
      "jum'at": "bg-[#C3EDC0]",
      "sabtu": "bg-[#AAB99A]"
    };
    
    const day = hari.toLowerCase();
    return colors[day] || "bg-white";
  };
  
  // Function to get darker color for member cards
  const getMemberCardColor = (hari) => {
    const colors = {
      "senin": "bg-[#C0E9FB]",
      "selasa": "bg-[#FFD2B7]",
      "rabu": "bg-[#D5C7FD]", 
      "kamis": "bg-[#FCDC94]",
      "jum'at": "bg-[#9FD99B]",
      "sabtu": "bg-[#AAB99A]"
    };
    
    const day = hari.toLowerCase();
    return colors[day] || "bg-white";
  };

  const renderDayCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(allDays.length).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white animate-pulse rounded-lg h-64" />
            ))
          : allDays.map((dayName, index) => (
              <div key={index}>
                {renderDayCard(dayName)}
              </div>
            ))}
      </div>
    );
  };

  const renderDayCard = (dayName) => {
    const dayLower = dayName.toLowerCase();
    const dayData = scheduleByDay[dayLower];
    const hasData = !!dayData;
    
    return (
      <div key={dayName} className="transform transition-all hover:shadow-lg">
        <div className="rounded-xl shadow-md overflow-hidden bg-white p-3">
          <div className={`p-6 ${getCardColor(dayName)} h-64 relative rounded-lg`}>
            {hasData ? (
              // Show members if data exists
              <div className="space-y-4">
                {dayData.members && dayData.members.map((name, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-2xl font-semibold text-black-800 transition-all hover:shadow-md mx-2 ${getMemberCardColor(dayName)}`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              // Show empty state if no data
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-black-500 text-center font-medium">
                  Tidak ada data piket untuk hari ini
                </p>
              </div>
            )}
          </div>
          
          {/* Day name at bottom */}
          <div className="p-4 bg-white mt-3">
            <h3 className="font-bold text-2xl text-black-800 text-left">
              {dayName}
            </h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen p-4 rounded-lg">
      <div className="max-w-6xl mx-auto">
        {/* Shift toggle buttons */}
        <div className="flex justify-start mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setShift("Pagi")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                shift === "Pagi"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Sun className="w-4 h-4 inline mr-2" />
              Shift Pagi
            </button>

            <button
              onClick={() => setShift("Sore")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                shift === "Sore"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Moon className="w-4 h-4 inline mr-2" />
              Shift Sore
            </button>
          </div>
        </div>

        {/* Schedule grid with custom layout */}
        {renderDayCards()}
      </div>
    </div>
  );
}