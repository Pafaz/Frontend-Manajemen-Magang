import { useState, useEffect } from "react";
import axios from "axios";
import ModalApplyPresentation from "../../components/modal/ModalApplyPresentation";

// Component PresentationCard with image background instead of colored pattern
const PresentationCard = ({ item, buttonLabel = "Apply Presentation", onButtonClick }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
    {/* Header with image background - increased height to avoid cropping */}
    <div className="relative h-28 flex justify-between items-start">
      {/* Background image - no padding to ensure full coverage */}
      <img 
        src={item.backgroundImage} 
        alt="Presentation background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Content wrapper with padding - no overlay for cleaner look */}
      <div className="relative z-10 w-full p-4 flex justify-between items-start">
        <h3 className="text-lg font-semibold text-black"> Presentasi { item.tipe}
        </h3>
      </div>
    </div>

    {/* Status bar below image with border only at bottom */}
    {item.status && (
      <div className="py-2 px-4 border-b border-[#667797] flex justify-between items-center">
        <span className={`px-2 py-1 text-xs font-medium rounded text-black ${
          item.status === "Selesai" ? "bg-[#83FFB1]" : "bg-[#FFE0CB]"
        }`}>
          {item.status}
        </span>
        
      </div>
    )}

    {/* Content section */}
    <div className="p-4">
      {/* Date and time info on same line - with smaller than xs font */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-gray-600" style={{ fontSize: '0.65rem' }}>
          <div className="flex items-center">
            <i className="bi bi-calendar3 mr-1"></i>
            <span>{item.date}</span>
          </div>
          <div className="flex items-center">
            <i className="bi bi-clock mr-1"></i>
            <span>{item.time}</span>
          </div>
        </div>
      </div>

      {/* Apply button - more rounded - removed disabled state */}
      <button
        onClick={() => onButtonClick?.(item)}
        className={`w-full py-2 px-4 text-sm font-medium rounded-full ${
          item.status === "Selesai" 
            ? "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white transition-colors duration-200" 
            : "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white transition-colors duration-200"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  </div>
);

// Main Presentation component
const Presentasi = () => {
  const [presentations, setPresentations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  console.log(presentations);
  
  // Background images based on status
  const getBackgroundImage = (status) => {
    if (status === "Selesai") {
      return "/assets/svg/Selesai (2).svg";
    } else {
      return "/assets/svg/BackgroundPresentasi.svg";
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('id-ID', options);
  };

  // Format time function
  const formatTime = (startTime, endTime, duration) => {
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    if (startTime && duration) {
      return `${startTime} (${duration})`;
    }
    return startTime || "";
  };


  // Fetch presentations data from API
  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/presentasi`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.status === "success") {
          // Transform API data to match component expectations
          const transformedData = response.data.data.map((presentation, index) => ({
            id: presentation.id || index + 1,
            tipe: presentation.judul || presentation.tipe || "Presentasi Offline",
            date: formatDate(presentation.tanggal || presentation.date),
            time: formatTime(
              presentation.waktu_mulai || presentation.startTime,
              presentation.waktu_selesai || presentation.endTime,
              presentation.durasi || presentation.duration
            ),
            status: presentation.status || "Dijadwalkan",
            kuota: presentation.kuota || presentation.kuota || 30,
            applicants: presentation.jumlah_pendaftar || presentation.applicants || 0,
            backgroundImage: getBackgroundImage(presentation.status || "Dijadwalkan"),
            // Include original data for modal
            originalData: presentation
          }));

          setPresentations(transformedData);
        } else {
          setError("Failed to fetch presentation data");
        }
      } catch (err) {
        console.error("Error fetching presentations:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data presentasi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  const handleApplyClick = (item) => {
    setShowModal(true);
    setSelectedPresentation(item);
  };
  

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">Loading presentasi...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center p-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-lg">
      {/* Bootstrap Icons CSS Link */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-lg">
        <h1 className="text-xl font-semibold text-gray-900">Jadwal Presentasi</h1>
        {presentations.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Total {presentations.length} jadwal presentasi tersedia
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {presentations.length > 0 ? (
          /* Grid for presentation cards - 4 columns */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {presentations.map((item, index) => (
              <PresentationCard
                key={item.id || index}
                item={item}
                buttonLabel="Apply Presentation"
                onButtonClick={handleApplyClick}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-4">
              <i className="bi bi-calendar-x" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Jadwal Presentasi
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Saat ini belum ada jadwal presentasi yang tersedia. 
              Silakan cek kembali nanti atau hubungi admin untuk informasi lebih lanjut.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ModalApplyPresentation
          data={selectedPresentation}
          onClose={() => setShowModal(false)}
          isOpen={showModal}
        />
      )}
    </div>
  );
};

export default Presentasi;