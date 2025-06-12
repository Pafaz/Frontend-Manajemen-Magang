import { useState } from "react";
import { X, Calendar, Upload } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function InternshipModal({ isOpen, onClose, jobData }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const idLowongan = jobData?.id;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File terlalu besar',
          text: 'Ukuran file maksimal 2MB',
          confirmButtonColor: '#3085d6'
        });
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const closeModal = () => {
    onClose();
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!startDate || !endDate || !file) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi semua data yang diperlukan',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append("id_lowongan", idLowongan);
    formData.append("mulai", startDate);
    formData.append("selesai", endDate);
    formData.append("surat_pernyataan_diri", file);

    try {
      // Show loading state
      Swal.fire({
        title: 'Sedang Memproses',
        html: 'Mohon tunggu sebentar...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/magang`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        // Close loading state
        Swal.close();
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Permohonan magang Anda telah berhasil diajukan',
          confirmButtonColor: '#3085d6'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/peserta/dashboard");
            onClose();
          }
        });
      }
      
    } catch (err) {
      console.error("Gagal:", err);
      
      // Close loading state
      Swal.close();
      
      // Check if this is the specific "complete your data first" error
      if (err.response && err.response.status === 403 && 
          err.response.data && err.response.data.message === "Silahkan lengkapi data diri terlebih dahulu") {
        
        Swal.fire({
          icon: 'warning',
          title: 'Perhatian',
          text: 'Silahkan lengkapi data diri terlebih dahulu sebelum mengajukan permohonan magang.',
          showCancelButton: true,
          confirmButtonText: 'Lengkapi Data',
          cancelButtonText: 'Tutup',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/peserta/dashboard");
          }
        });
        
      } else {
        // Show generic error message
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menyimpan. Periksa kembali input Anda.',
          confirmButtonColor: '#3085d6'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const DatePicker = ({ selectedDate, onChange, minDate }) => {
    const today = new Date();
    const initialDate =
      selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : today;

    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const nextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const renderCalendarDays = () => {
      const days = [];
      const blanks = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        blanks.push(<div key={`blank-${i}`} className="h-8 w-8"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isSelected =
          selectedDate &&
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear();

        const isDisabled = minDate && date < minDate;

        days.push(
          <div
            key={day}
            onClick={() => {
              if (!isDisabled) onChange(date);
            }}
            className={`h-8 w-8 flex items-center justify-center cursor-pointer rounded-full
              ${isSelected ? "bg-blue-600 text-white" : ""}
              ${
                isDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
          >
            {day}
          </div>
        );
      }

      return [...blanks, ...days];
    };

    return (
      <div className="w-64">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            &lt;
          </button>
          <div className="font-medium">
            {months[currentMonth]} {currentYear}
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div
              key={d}
              className="h-8 w-8 text-xs font-medium flex items-center justify-center"
            >
              {d}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Pemberkasan Magang</h2>
          <button
            onClick={() => {
              Swal.fire({
                title: 'Keluar dari form?',
                text: "Perubahan yang belum disimpan akan hilang",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, keluar',
                cancelButtonText: 'Batal'
              }).then((result) => {
                if (result.isConfirmed) {
                  closeModal();
                }
              });
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tanggal Mulai */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Mulai Magang
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="yyyy-mm-dd"
                value={startDate}
                onClick={() => setShowStartCalendar(!showStartCalendar)}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer"
              />
              <Calendar
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                size={18}
              />
              {showStartCalendar && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                  <DatePicker
                    selectedDate={startDate ? new Date(startDate) : new Date()}
                    minDate={new Date()}
                    onChange={(date) => {
                      setStartDate(formatDate(date));
                      setShowStartCalendar(false);
                      setEndDate(""); // reset end date
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tanggal Selesai */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Selesai Magang
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="yyyy-mm-dd"
                value={endDate}
                onClick={() => {
                  if (!startDate) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Perhatian',
                      text: 'Silahkan pilih tanggal mulai terlebih dahulu',
                      confirmButtonColor: '#3085d6'
                    });
                    return;
                  }
                  setShowEndCalendar(!showEndCalendar);
                }}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer"
              />
              <Calendar
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                size={18}
              />
              {showEndCalendar && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                  <DatePicker
                    selectedDate={endDate ? new Date(endDate) : new Date()}
                    minDate={startDate ? new Date(startDate) : new Date()}
                    onChange={(date) => {
                      setEndDate(formatDate(date));
                      setShowEndCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Upload Surat */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Surat Pernyataan Diri
            </label>
            <label className="flex flex-col">
              <div className="w-full border border-gray-300 rounded-md p-2 pl-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-500 truncate">
                  {fileName || "Choose File"}
                </span>
                <Upload size={18} className="text-gray-400" />
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-red-500 text-xs mt-1">
              *Format: pdf, doc, jpg, jpeg, png. Max 2MB
            </p>
            <button
              className="mt-2 text-blue-600 text-sm flex items-center hover:text-blue-800"
              onClick={() => {
                const templateUrl = "../berkas/Surat_Pernyataan_Diri.pdf";
                const link = document.createElement("a");
                link.href = templateUrl;
                link.download = "Surat_Pernyataan_Diri.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                Swal.fire({
                  icon: 'info',
                  title: 'Download Template',
                  text: 'Template surat pernyataan diri sedang diunduh',
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Template Surat Pernyataan Diri
            </button>
          </div>

          {/* Tombol Simpan */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-blue-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-blue-700 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Memproses..." : "Simpan"}
            </button>
            <button
              onClick={() => {
                if (startDate || endDate || file) {
                  Swal.fire({
                    title: 'Batalkan pengajuan?',
                    text: "Data yang telah diisi akan hilang",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ya, batalkan',
                    cancelButtonText: 'Kembali ke form'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      closeModal();
                    }
                  });
                } else {
                  closeModal();
                }
              }}
              className="bg-pink-100 text-pink-600 py-2 px-4 rounded-md flex-1 hover:bg-pink-200 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}