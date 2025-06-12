import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";

export default function JamKantorModernCard() {
  const API_URL = `${import.meta.env.VITE_API_URL}/jam-kantor`;
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const initialTimes = {
    masuk: { start: "08:00", end: "08:15" },
    istirahat: { start: "12:00", end: "13:00" },
    kembali: { start: "12:25", end: "13:00" },
    pulang: { start: "16:00", end: "17:00" },
  };

  const dayNames = {
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jum'at",
  };

  // Fungsi untuk memformat waktu (menghilangkan detik jika ada)
  const formatTime = (timeString) => {
    if (!timeString) return "";
    
    // Jika format sudah HH:MM, return as is
    if (timeString.length === 5) return timeString;
    
    // Jika format HH:MM:SS, ambil hanya HH:MM
    if (timeString.length === 8) {
      return timeString.substring(0, 5);
    }
    
    return timeString;
  };

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, { headers });
      
      const allDays = ["senin", "selasa", "rabu", "kamis", "jumat"];
      const processedData = [];

      allDays.forEach((day) => {
        const existingData = res.data?.data?.find(item => item.hari === day);
        
        if (existingData) {
          processedData.push({
            hari: day,
            masuk: {
              start: formatTime(existingData.awal_masuk),
              end: formatTime(existingData.akhir_masuk)
            },
            istirahat: {
              start: formatTime(existingData.awal_istirahat),
              end: formatTime(existingData.akhir_istirahat)
            },
            kembali: {
              start: formatTime(existingData.awal_kembali),
              end: formatTime(existingData.akhir_kembali)
            },
            pulang: {
              start: formatTime(existingData.awal_pulang),
              end: formatTime(existingData.akhir_pulang)
            },
            status: existingData.status === true || existingData.status === 1,
          });
        } else {
          processedData.push({
            hari: day,
            masuk: initialTimes.masuk,
            istirahat: initialTimes.istirahat,
            kembali: initialTimes.kembali,
            pulang: initialTimes.pulang,
            status: false,
          });
        }
      });

      setScheduleData(processedData);
      setError(null);
    } catch (err) {
      console.error("Gagal memuat data jam kantor:", err);
      setError("Gagal memuat data jam kantor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const TimeSlot = ({ label, time }) => (
    <div className="text-center flex-1">
      <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
      <div className="text-gray-600">
        <span className="text-sm">{time.start}</span>
        <span className="mx-2">-</span>
        <span className="text-sm">{time.end}</span>
      </div>
    </div>
  );

  return (
      <div className="bg-white-200 bg-white border border-slate-400/[0.5] rounded-xl p-2 mb-2">
        {/* Header */}
        <div className="p-2">
          <h2 className="text-2xl font-bold text-black">Jam Kantor</h2>
        </div>

        {/* Content */}
        <div className="p-2">
          {/* Header Row */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 mb-2 pb-2 border-b-2 border-[#C7C7C7]">
            <div className="font-semibold text-gray-700">Hari</div>
            <div className="font-semibold text-gray-700 text-center">Masuk</div>
            <div className="font-semibold text-gray-700 text-center">Istirahat</div>
            <div className="font-semibold text-gray-700 text-center">Kembali</div>
            <div className="font-semibold text-gray-700 text-center">Pulang</div>
          </div>

          {/* Schedule Rows */}
          <div className="space-y-4">
            {scheduleData.map((schedule) => (
              <div 
                key={schedule.hari}
                className={`
                  border rounded-lg p-2
                  ${schedule.status ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-75'}
                  ${!schedule.status ? 'relative' : ''}
                `}
              >
                {/* Mobile Layout */}
                <div className="md:hidden">
                  <div className="font-semibold text-gray-800 mb-3 text-lg text-center">
                    {dayNames[schedule.hari]}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TimeSlot label="Masuk" time={schedule.masuk} />
                    <TimeSlot label="Istirahat" time={schedule.istirahat} />
                    <TimeSlot label="Kembali" time={schedule.kembali} />
                    <TimeSlot label="Pulang" time={schedule.pulang} />
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                  <div className="font-semibold text-gray-800">
                    {dayNames[schedule.hari]}
                  </div>
                  <TimeSlot label="" time={schedule.masuk} />
                  <TimeSlot label="" time={schedule.istirahat} />
                  <TimeSlot label="" time={schedule.kembali} />
                  <TimeSlot label="" time={schedule.pulang} />
                </div>

                {/* Status Badge */}
                {!schedule.status && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      Nonaktif
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Footer Note */}
          <div className="mt-6 text-sm text-gray-500 text-center">
            * Jadwal yang tidak aktif ditampilkan dengan latar belakang abu-abu
          </div>
        </div>
      </div>
    
  );
}