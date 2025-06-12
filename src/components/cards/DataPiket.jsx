import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Sun,
  Moon,
  FileText,
  User,
  CheckCircle,
  ChevronDown,
  PlusCircle
} from "lucide-react";
import Select from "react-select";
import Swal from "sweetalert2";

export default function JadwalPiket() {
  const navigate = useNavigate();
  const [shift, setShift] = useState("Pagi");
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [allMembersOptions, setAllMembersOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({
    Pagi: [],
    Sore: [],
  });

  // Define all days of the week - FIXED: Ubah "Jum'at" menjadi "Jumat"
  const allDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const fetchMembers = async () => {
    try {
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
        });
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/peserta-by-cabang`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const options = res.data.data.map((item) => ({
        value: item.id,
        label: item.nama,
      }));
      setAllMembersOptions(options);
      Swal.close();
    } catch (err) {
      console.error("Gagal mengambil data peserta:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/piket`, {
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

      // Format data agar lebih mudah digunakan
      const formattedSchedule = {
        Pagi: pagi.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama), // Nama peserta
        })),
        Sore: sore.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama), // Nama peserta
        })),
      };

      setScheduleData(formattedSchedule);
    } catch (error) {
      console.error("Gagal mengambil data jadwal:", error);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleEditClick = (day) => {
    if (day.id) {
      // Edit existing schedule
      setEditMode(true);
      setEditingScheduleId(day.id);
      // Normalize hari untuk display - pastikan format yang benar
      const normalizeHariForDisplay = (hari) => {
        const hariMap = {
          'senin': 'Senin',
          'selasa': 'Selasa',
          'rabu': 'Rabu',
          'kamis': 'Kamis',
          'jumat': 'Jumat',
          'sabtu': 'Sabtu' // handle jika dari API masih menggunakan jum'at
        };
        return hariMap[hari.toLowerCase()] || capitalize(hari);
      };
      
      setSelectedDay(normalizeHariForDisplay(day.hari));
      setShift(capitalize(day.shift));
      const matchedMembers = allMembersOptions.filter((opt) =>
        day.members.includes(opt.label)
      );
      setSelectedMembers(matchedMembers);
    } else {
      // Create new schedule for this day
      setEditMode(false);
      setEditingScheduleId(null);
      setSelectedDay(day.hari);
      setSelectedMembers([]);
    }
    setShowModal(true);
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Normalize hari untuk API - pastikan format lowercase yang benar
    const normalizeHariForAPI = (hari) => {
      const hariMap = {
        'senin': 'senin',
        'selasa': 'selasa',
        'rabu': 'rabu', 
        'kamis': 'kamis',
        'jumat': 'jumat',
        'sabtu': 'sabtu' // handle jika masih ada jum'at
      };
      return hariMap[hari.toLowerCase()] || hari.toLowerCase();
    };
    
    const data = {
      hari: normalizeHariForAPI(selectedDay),
      shift: shift.toLowerCase(),
      peserta: selectedMembers.map((m) => m.value),
    };

    // Debug: Log data yang dikirim
    console.log("Data yang dikirim ke API:", data);
    console.log("Selected Day:", selectedDay);

    try {
      if (editMode && editingScheduleId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/piket/${editingScheduleId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Jadwal piket berhasil diupdate'
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/piket`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Jadwal piket berhasil ditambahkan'
        });
      }

      await fetchSchedule();
      setShowModal(false);
      setSelectedDay(null);
      setSelectedMembers([]);
      setEditMode(false);
      setEditingScheduleId(null);
    } catch (err) {
      console.error("Gagal simpan jadwal:", err.response?.data || err.message);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Simpan!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan jadwal'
      });
    }
  };

  // Get schedule data for the current shift
  const scheduleByDay = {}; 
  const daysData = scheduleData[shift] || [];
  
  // Create a lookup object for existing schedules
  daysData.forEach(day => {
    scheduleByDay[day.hari.toLowerCase()] = day;
  });

  // Fungsi untuk mendapatkan warna berdasarkan hari (dengan background putih/jarak) - FIXED: Ubah "jum'at" menjadi "jumat"
  const getCardColor = (hari) => {
    const colors = {
      "senin": "bg-[#E0F3FF]",
      "selasa": "bg-[#FFE1CB]",
      "rabu": "bg-[#E2DBF9]", 
      "kamis": "bg-[#FFFED3]",
      "jumat": "bg-[#C3EDC0]",
      "sabtu": "bg-[#AAB99A]"
    };
    
    const day = hari.toLowerCase();
    return colors[day] || "bg-white";
  };
  
  // Fungsi untuk mendapatkan warna yang lebih gelap untuk kartu nama (style seperti gambar) - FIXED: Ubah "jum'at" menjadi "jumat"
  const getMemberCardColor = (hari) => {
    const colors = {
      "senin": "bg-[#C0E9FB]",
      "selasa": "bg-[#FFD2B7]",
      "rabu": "bg-[#D5C7FD]", 
      "kamis": "bg-[#FCDC94]",
      "jumat": "bg-[#9FD99B]",
      "sabtu": "bg-[#AAB99A]"
    };
    
    const day = hari.toLowerCase();
    return colors[day] || "bg-white";
  };

  // Render grid dengan layout khusus
  const renderDayCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(5).fill(0).map((_, idx) => (
              <div key={idx} className="bg-white animate-pulse rounded-lg h-64" />
            ))
          : allDays.map((dayName, index) => (
              <div
                key={index}
                className={
                  // Untuk baris kedua (Kamis & Jumat), sisipkan grid kosong di posisi ke-4 jika totalnya 5 hari
                  allDays.length === 5 && index === 3
                    ? "col-start-2"
                    : ""
                }
              >
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
      <div
        key={dayName}
        className="cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
        onClick={() => handleEditClick(hasData ? dayData : { hari: dayName, shift })}
      >
        <div className="rounded-xl shadow-md overflow-hidden bg-white p-3">
          <div className={`p-6 ${getCardColor(dayName)} h-64 relative rounded-lg`}>
            {hasData ? (
              // Show members if data exists
              <div className="space-y-4">
                {dayData.members && dayData.members.map((name, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-2xl  font-semibold text-black-800 transition-all hover:shadow-md mx-2 ${getMemberCardColor(dayName)}`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              // Show placeholder if no data
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-black-500 text-center mb-4 font-medium">
                  Piket belum dibuat untuk hari ini
                </p>
                <div className="p-4 bg-white rounded-full shadow-md">
                  <PlusCircle className="w-8 h-8 text-black-400" />
                </div>
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
        {/* Tombol shift dan tambah data */}
        <div className="flex justify-between mb-8">
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

        {/* Grid jadwal dengan layout khusus */}
        {renderDayCards()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editMode ? "Edit Data Piket" : "Tambah Data Piket"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hari
                </label>
                <div className="relative">
                  <select
                    value={selectedDay || ""}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Pilih Hari
                    </option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anggota
                </label>
                <Select
                  isMulti
                  name="members"
                  options={allMembersOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Pilih anggota piket..."
                  value={selectedMembers}
                  onChange={setSelectedMembers}
                  required
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        border: '1px solid #3b82f6',
                      }
                    })
                  }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift
                </label>
                <div className="mt-1 flex items-center">
                  <span className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 font-medium">
                    {shift === "Pagi" ? "Shift Pagi" : "Shift Sore"}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    Sesuai shift terpilih
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDay(null);
                    setSelectedMembers([]);
                  }}
                  className="px-6 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}