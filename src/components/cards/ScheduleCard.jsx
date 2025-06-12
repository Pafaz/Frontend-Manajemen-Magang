import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loading from "../Loading";
import Swal from "sweetalert2";

export default function ScheduleCard() {
  const API_URL = `${import.meta.env.VITE_API_URL}/jam-kantor`;
  
  const [scheduleData, setScheduleData] = useState({
    senin: { active: false, exists: false },
    selasa: { active: false, exists: false },
    rabu: { active: false, exists: false },
    kamis: { active: false, exists: false },
    jumat: { active: false, exists: false },
    sabtu: { active: false, exists: false },
  });

  const initialTimes = {
    masuk: { start: "08:00", end: "09:00" },
    istirahat: { start: "12:00", end: "13:00" },
    kembali: { start: "13:00", end: "13:30" },
    pulang: { start: "17:00", end: "18:00" },
  };

  const [times, setTimes] = useState({
    senin: { ...initialTimes },
    selasa: { ...initialTimes },
    rabu: { ...initialTimes },
    kamis: { ...initialTimes },
    jumat: { ...initialTimes },
    sabtu: { ...initialTimes },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState({});
  
  const isInitialized = useRef(false);
  const isInitializing = useRef(false);
  
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // FIXED: Improved time normalization to handle various formats
  const normalizeTime = (time) => {
    if (!time) return "08:00";
    
    // Handle different time formats from database
    if (typeof time === 'string') {
      // If it's already in HH:MM format
      if (time.includes(':')) {
        const [hours, minutes] = time.split(":");
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      }
      // If it's in HHMMSS or similar format
      if (time.length >= 4) {
        const hours = time.substring(0, 2);
        const minutes = time.substring(2, 4);
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      }
    }
    
    return time.toString().padStart(5, "0"); // Default fallback
  };

  // FIXED: Enhanced status parsing function
  const parseStatus = (status) => {
    console.log("🔍 Parsing status:", status, "Type:", typeof status);
    
    // Handle various status formats from database
    if (status === true || status === 1 || status === "1" || status === "true") {
      return true;
    }
    if (status === false || status === 0 || status === "0" || status === "false") {
      return false;
    }
    
    // Default to false if uncertain
    console.log("⚠️ Unknown status format, defaulting to false");
    return false;
  };

  const mapTimesToPayload = (day) => {
    const t = times[day] || initialTimes;
    return {
      hari: day,
      awal_masuk: normalizeTime(t.masuk.start),
      akhir_masuk: normalizeTime(t.masuk.end),
      awal_istirahat: normalizeTime(t.istirahat.start),
      akhir_istirahat: normalizeTime(t.istirahat.end),
      awal_kembali: normalizeTime(t.kembali.start),
      akhir_kembali: normalizeTime(t.kembali.end),
      awal_pulang: normalizeTime(t.pulang.start),
      akhir_pulang: normalizeTime(t.pulang.end),
    };
  };

  const createMissingSchedules = async (existingDaysFromDB) => {
    console.log("🔍 Checking which schedules need to be created...");
    console.log("Existing days from DB:", existingDaysFromDB);
    
    console.log("🔄 Performing fresh database check before creation...");
    try {
      const freshCheck = await axios.get(API_URL, { headers });
      const currentExistingDays = freshCheck.data?.data?.map(entry => entry.hari) || [];
      console.log("📊 Fresh DB check - current existing days:", currentExistingDays);
      
      if (currentExistingDays.length >= 6) {
        console.log("⚠️ All schedules now exist (created by another instance), skipping creation");
        return { created: 0, skipped: 6, freshCheck: true };
      }
      
      const allDays = ["senin", "selasa", "rabu", "kamis", "jumat","sabtu"];
      const missingDays = allDays.filter(day => !currentExistingDays.includes(day));
      
      if (missingDays.length === 0) {
        console.log("✅ All schedules already exist in database, no creation needed");
        return { created: 0, skipped: 6 };
      }

      console.log("📝 Missing days that need creation:", missingDays);

      let createdCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      for (const day of missingDays) {
        const payload = mapTimesToPayload(day);
        console.log(`🔄 Creating schedule for ${day}:`, payload);
        
        try {
          const response = await axios.post(API_URL, payload, { headers });
          console.log(`✅ Successfully created schedule for ${day}:`, response.data);
          createdCount++;
          
        } catch (err) {
          console.log(`❌ Error creating schedule for ${day}:`, err.response?.status, err.response?.data);
          
          if (err.response?.status === 409 || err.response?.status === 422) {
            console.log(`⚠️ Schedule for ${day} already exists (conflict), skipping...`);
            skippedCount++;
          } else {
            console.error(`💥 Unexpected error for ${day}:`, err.response?.data);
            errorCount++;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`\n📊 Schedule creation summary:`);
      console.log(`  - Created: ${createdCount}`);
      console.log(`  - Skipped (already exists): ${skippedCount}`);
      console.log(`  - Errors: ${errorCount}`);
      
      return { created: createdCount, skipped: skippedCount, errors: errorCount };
      
    } catch (error) {
      console.error("❌ Error during fresh DB check:", error);
      return { created: 0, skipped: 0, errors: 1, freshCheckError: true };
    }
  };

  const toggleDay = async (day) => {
    const current = scheduleData[day];
    const willBeActive = !current.active;

    setIsUpdating(prev => ({ ...prev, [day]: true }));

    try {
      const endpoint = willBeActive ? 'aktif' : 'nonaktif';
      const url = `${API_URL}/${day}/${endpoint}`;

      console.log(`Toggling ${day} to ${willBeActive ? 'active' : 'inactive'}`);
      console.log("Request URL:", url);

      const response = await axios.put(url, {}, { headers });
      
      console.log(`${day} toggle response:`, response.data);
      
      setScheduleData(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          active: willBeActive
        }
      }));

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Hari ${day} berhasil ${willBeActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        timer: 1500,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error("Error toggling day:", err);
      
      let errorMessage = 'Terjadi kesalahan saat mengubah status hari.';
      
      if (err.response) {
        switch (err.response.status) {
          case 404:
            errorMessage = 'Endpoint tidak ditemukan. Periksa konfigurasi API.';
            break;
          case 401:
            errorMessage = 'Token tidak valid. Silakan login ulang.';
            break;
          case 403:
            errorMessage = 'Anda tidak memiliki akses untuk melakukan aksi ini.';
            break;
          case 422:
            errorMessage = err.response.data?.message || 'Data tidak valid.';
            break;
          case 500:
            errorMessage = 'Terjadi kesalahan server. Coba lagi nanti.';
            break;
          default:
            errorMessage = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: errorMessage,
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [day]: false }));
    }
  };

  const updateTime = async (day, type, field, value) => {
    console.log(`Updating time: ${day} ${type} ${field} = ${value}`);
    
    setTimes((prev) => {
      const updated = {
        ...prev,
        [day]: {
          ...prev[day],
          [type]: {
            ...prev[day][type],
            [field]: value,
          },
        },
      };

      if (window.updateTimeouts && window.updateTimeouts[day]) {
        clearTimeout(window.updateTimeouts[day]);
      }

      if (!window.updateTimeouts) {
        window.updateTimeouts = {};
      }

      window.updateTimeouts[day] = setTimeout(async () => {
        try {
          const payload = {
            hari: day,
            awal_masuk: normalizeTime(updated[day].masuk.start),
            akhir_masuk: normalizeTime(updated[day].masuk.end),
            awal_istirahat: normalizeTime(updated[day].istirahat.start),
            akhir_istirahat: normalizeTime(updated[day].istirahat.end),
            awal_kembali: normalizeTime(updated[day].kembali.start),
            akhir_kembali: normalizeTime(updated[day].kembali.end),
            awal_pulang: normalizeTime(updated[day].pulang.start),
            akhir_pulang: normalizeTime(updated[day].pulang.end),
          };

          console.log(`Sending PUT request for ${day}:`, payload);
          
          const response = await axios.put(`${API_URL}/${day}`, payload, { headers });
          console.log(`Schedule updated for ${day}:`, response.data);
          
          setErrors((prev) => ({ ...prev, [day]: {} }));
          
        } catch (err) {
          console.error("PUT error:", err);
          
          const apiErrors = err.response?.data?.errors || err.response?.data?.meta || {};
          setErrors((prev) => ({ ...prev, [day]: apiErrors }));
          
          Swal.fire({
            icon: 'error',
            title: 'Gagal Update Waktu',
            text: err.response?.data?.message || 'Terjadi kesalahan saat mengupdate waktu.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }, 1000);

      return updated;
    });
  };

  const renderTimeInput = (day, type, field) => {
    const value = times[day][type][field];
    const timeKey = `${field}_${type}`;
    const errorMsg = errors[day]?.[timeKey]?.[0];
    const isActive = scheduleData[day]?.active || false;

    return (
      <div className="relative" key={`${day}-${type}-${field}`}>
        <select
          className={`w-full p-2 border ${
            errorMsg ? "border-red-500" : "border-gray-200"
          } rounded-md appearance-none bg-white text-sm h-10 ${
            !isActive ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          value={value}
          onChange={(e) => updateTime(day, type, field, e.target.value)}
          disabled={!isActive}
        >
          {[...Array(16)].map((_, i) => {
            const hour = 7 + i;
            return [
              <option key={`${hour}:00`} value={`${hour.toString().padStart(2, "0")}:00`}>
                {hour.toString().padStart(2, "0")}:00
              </option>,
              <option key={`${hour}:15`} value={`${hour.toString().padStart(2, "0")}:15`}>
                {hour.toString().padStart(2, "0")}:15
              </option>,
              <option key={`${hour}:30`} value={`${hour.toString().padStart(2, "0")}:30`}>
                {hour.toString().padStart(2, "0")}:30
              </option>,
              <option key={`${hour}:45`} value={`${hour.toString().padStart(2, "0")}:45`}>
                {hour.toString().padStart(2, "0")}:45
              </option>
            ];
          }).flat()}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
      </div>
    );
  };

  const dayNames = {
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jum'at",
    sabtu: "Sabtu",
  };

  // FIXED: Enhanced fetchData function with better data parsing
  const fetchData = async () => {
    try {
      console.log("📡 Fetching schedule data from database...");
      const res = await axios.get(API_URL, { headers });
      console.log("✅ Fetched raw data:", res.data);
      
      const allDays = ["senin", "selasa", "rabu", "kamis", "jumat","sabtu"];
      const updatedScheduleData = {};
      const updatedTimes = {};
      const existingDays = [];

      // Initialize dengan default values
      allDays.forEach((day) => {
        updatedScheduleData[day] = { active: false, exists: false };
        updatedTimes[day] = { ...initialTimes };
      });

      // FIXED: Better data processing with detailed logging
      if (res.data && Array.isArray(res.data.data)) {
        console.log("📋 Processing database entries:");
        
        res.data.data.forEach((entry, index) => {
          console.log(`\n📝 Entry ${index + 1}:`, entry);
          
          const day = entry.hari;
          if (!day) {
            console.log("⚠️ Missing 'hari' field in entry, skipping");
            return;
          }
          
          existingDays.push(day);
          
          // FIXED: Enhanced status parsing with logging
          const parsedStatus = parseStatus(entry.status);
          console.log(`📊 Day: ${day}, Raw Status: ${entry.status}, Parsed: ${parsedStatus}`);
          
          updatedScheduleData[day] = {
            active: parsedStatus,
            exists: true,
          };
          
          // FIXED: Enhanced time parsing with logging
          const timeData = {
            masuk: {
              start: normalizeTime(entry.awal_masuk) || "08:00",
              end: normalizeTime(entry.akhir_masuk) || "09:00",
            },
            istirahat: {
              start: normalizeTime(entry.awal_istirahat) || "12:00",
              end: normalizeTime(entry.akhir_istirahat) || "13:00",
            },
            kembali: {
              start: normalizeTime(entry.awal_kembali) || "13:00",
              end: normalizeTime(entry.akhir_kembali) || "13:30",
            },
            pulang: {
              start: normalizeTime(entry.awal_pulang) || "17:00",
              end: normalizeTime(entry.akhir_pulang) || "18:00",
            },
          };
          
          console.log(`⏰ Time data for ${day}:`, timeData);
          updatedTimes[day] = timeData;
        });
      } else {
        console.log("⚠️ No data array found in response or empty response");
      }

      // FIXED: Force state update with logging
      console.log("\n🔄 Updating state with processed data:");
      console.log("📊 Final schedule data:", updatedScheduleData);
      console.log("⏰ Final times data:", updatedTimes);
      console.log("📅 Existing days:", existingDays);
      
      setScheduleData(updatedScheduleData);
      setTimes(updatedTimes);
      
      // Force a re-render by updating a dummy state if needed
      setTimeout(() => {
        console.log("🔄 State should be updated now");
        console.log("Current scheduleData state:", updatedScheduleData);
        console.log("Current times state:", updatedTimes);
      }, 100);
      
      return existingDays;
      
    } catch (error) {
      console.error("❌ Gagal ambil data jam kantor:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  };

  const initializeData = async () => {
    if (isInitializing.current || isInitialized.current) {
      console.log("⚠️ Initialization already in progress or completed, skipping...");
      return;
    }

    isInitializing.current = true;
    isInitialized.current = true;

    try {
      console.log("\n🚀 ===== INITIALIZATION START =====");
      
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      console.log("\n📡 STEP 1: Fetching existing data from database...");
      const existingDaysInDB = await fetchData();
      
      if (existingDaysInDB.length >= 6) {
        console.log("\n✅ All 6 schedules found in database, no creation needed");
        Swal.close();
        console.log("\n✅ ===== INITIALIZATION COMPLETED (DATA EXISTS) =====\n");
        return;
      }
      
      console.log("\n🏗️ STEP 2: Creating missing schedules...");
      console.log(`Missing count: ${6 - existingDaysInDB.length}`);
      
      const createResult = await createMissingSchedules(existingDaysInDB);
      console.log("📋 Creation result:", createResult);
      
      if (createResult.created > 0) {
        console.log(`\n🔄 STEP 3: Refetching data (${createResult.created} new schedules created)`);
        await fetchData();
      }
      
      Swal.close();
      console.log("\n✅ ===== INITIALIZATION COMPLETED =====\n");
      
    } catch (error) {
      console.error("\n💥 ===== INITIALIZATION FAILED =====");
      console.error("Error:", error);
      
      isInitialized.current = false;
      
      Swal.close();
      
      let errorMessage = 'Gagal memuat data jam kantor.';
      if (error.response?.status === 401) {
        errorMessage = 'Token tidak valid. Silakan login ulang.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Anda tidak memiliki akses ke data ini.';
      } else if (!error.response) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
      isInitializing.current = false;
    }
  };

  useEffect(() => {
    const sessionKey = `schedule_initialized_${Date.now()}`;
    const wasInitialized = sessionStorage.getItem('schedule_component_initialized');
    
    if (wasInitialized && isInitialized.current) {
      console.log("🔒 Component already initialized in this session, skipping...");
      setLoading(false);
      return;
    }

    if (isInitialized.current || isInitializing.current) {
      console.log("🔒 Initialization already in progress or completed, skipping...");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const init = async () => {
      if (isMounted && !isInitialized.current && !isInitializing.current) {
        sessionStorage.setItem('schedule_component_initialized', 'true');
        await initializeData();
      }
    };

    init();

    return () => {
      isMounted = false;
      
      if (window.updateTimeouts) {
        Object.values(window.updateTimeouts).forEach(timeout => {
          clearTimeout(timeout);
        });
      }
    };
  }, []);

  if (loading) return <Loading />;

  const DayCard = ({ day }) => {
    const isActive = scheduleData[day]?.active || false;
    const isToggling = isUpdating[day] || false;
    
    return (
      <div className="bg-white rounded-lg shadow-[2px_4px_6px_rgba(0,0,0,0.1)] overflow-hidden mb-4 w-full relative">
        <div className="p-4 flex items-center bg-white-50">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-6 rounded-full flex items-center ${
                isActive ? "bg-blue-500" : "bg-gray-300"
              } relative cursor-pointer transition-colors ${
                isToggling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !isToggling && toggleDay(day)}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute ${
                  isActive ? "right-1" : "left-1"
                } transition-transform`}
              ></div>
              {isToggling && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium">{dayNames[day]}</h3>
            <span className="text-xs text-gray-500">
              ({isActive ? 'Aktif' : 'Non-aktif'})
            </span>
            {isToggling && <span className="text-sm text-gray-500">Updating...</span>}
          </div>
        </div>

        <div className={`p-4 ${!isActive ? 'opacity-60' : ''}`}>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-24">
                <label className={`text-gray-600 ${!isActive ? 'text-gray-400' : ''}`}>Masuk</label>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-full">{renderTimeInput(day, "masuk", "start")}</div>
                <span className="mx-1">-</span>
                <div className="w-full">{renderTimeInput(day, "masuk", "end")}</div>
              </div>
              <img 
                src="/assets/svg/clock.svg" 
                alt="clock" 
                className="w-6 h-6 absolute top-1 right-1"
              />
            </div>
            
            <div className="flex items-center mb-2">
              <div className="w-24">
                <label className={`text-gray-600 ${!isActive ? 'text-gray-400' : ''}`}>Istirahat</label>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-full">{renderTimeInput(day, "istirahat", "start")}</div>
                <span className="mx-1">-</span>
                <div className="w-full">{renderTimeInput(day, "istirahat", "end")}</div>
              </div>
            </div>
            
            <div className="flex items-center mb-2">
              <div className="w-24">
                <label className={`text-gray-600 ${!isActive ? 'text-gray-400' : ''}`}>Kembali</label>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-full">{renderTimeInput(day, "kembali", "start")}</div>
                <span className="mx-1">-</span>
                <div className="w-full">{renderTimeInput(day, "kembali", "end")}</div>
              </div>
            </div>
            
            <div className="flex items-center mb-2">
              <div className="w-24">
                <label className={`text-gray-600 ${!isActive ? 'text-gray-400' : ''}`}>Pulang</label>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-full">{renderTimeInput(day, "pulang", "start")}</div>
                <span className="mx-1">-</span>
                <div className="w-full">{renderTimeInput(day, "pulang", "end")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(scheduleData).map((day) => (
          <DayCard key={day} day={day} />
        ))}
      </div>
    </div>
  );
}