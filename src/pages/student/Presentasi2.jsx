import { useState } from "react";
import ModalApplyPresentation from "../../components/modal/ModalApplyPresentation";

// Component PresentationCard tanpa gambar, menggunakan Bootstrap icon dan gradient biru
const PresentationCard = ({ item, buttonLabel = "Lihat Detail", onButtonClick }) => (
  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2">
    {/* Header dengan gradient biru dan icon */}
    <div className="relative h-32 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0069AB 0%, #0081CC 50%, #0099FF 100%)'
    }}>
      {/* Pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='m0 40 40-40h-40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Central icon menggunakan Bootstrap Icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <i className="bi bi-easel text-white text-3xl"></i>
        </div>
      </div>
      
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md border border-white/30 text-white
          ${item.status === 'Completed' 
            ? 'bg-green-500/80 border-green-400/50' 
            : 'bg-blue-500/80 border-blue-400/50'}`}>
          {item.status === 'Completed' ? '' : ''} {item.status}
        </span>
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-6 left-6 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-8 right-8 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-12 right-12 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
    </div>

    {/* Content section */}
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
        {item.title}
      </h3>
      
      {/* Info cards */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 rounded-xl border group-hover:shadow-md transition-all duration-200"
             style={{background: 'linear-gradient(135deg, rgba(0, 105, 171, 0.1) 0%, rgba(0, 129, 204, 0.1) 100%)', borderColor: 'rgba(0, 105, 171, 0.2)'}}>
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
               style={{background: 'linear-gradient(135deg, #0069AB 0%, #0081CC 100%)'}}>
            <i className="bi bi-calendar-event text-white text-lg"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{item.date}</p>
            <p className="text-xs text-gray-500">Tanggal Pelaksanaan</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-xl border group-hover:shadow-md transition-all duration-200"
             style={{background: 'linear-gradient(135deg, rgba(0, 105, 171, 0.1) 0%, rgba(0, 129, 204, 0.1) 100%)', borderColor: 'rgba(0, 105, 171, 0.2)'}}>
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
               style={{background: 'linear-gradient(135deg, #0069AB 0%, #0081CC 100%)'}}>
            <i className="bi bi-clock text-white text-lg"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{item.time}</p>
            <p className="text-xs text-gray-500">Durasi Presentasi</p>
          </div>
        </div>
      </div>

      {/* Call-to-action button */}
      <button
        onClick={() => onButtonClick?.(item)}
        className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl 
                   hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 
                   transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/50
                   relative overflow-hidden group/btn"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <i className="bi bi-pencil-square"></i>
          {buttonLabel}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
      </button>
    </div>

    {/* Decorative corner accent */}
    <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
      <div className="w-full h-full rounded-tl-full" style={{background: 'linear-gradient(135deg, #0069AB 0%, #0081CC 100%)'}}></div>
    </div>
  </div>
);

// Component utama Presentasi dengan design tanpa gambar
const Presentasi = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  const handleApplyClick = (item) => {
    setShowModal(true);
    setSelectedPresentation(item);
  };

  const basePresentations = [
    {
      status: "Scheduled",
      title: "Pengenalan React",
      date: "Senin, 25 Maret 2025",
      time: "14:00 - 16:00 (2 Jam)",
      statusColor: "text-blue-500 bg-blue-50",
    },
    {
      status: "Completed",
      title: "JavaScript Dasar",
      date: "Selasa, 26 Maret 2025",
      time: "09:00 - 11:00 (2 Jam)",
      statusColor: "text-green-500 bg-green-50",
    },
    {
      status: "Completed",
      title: "Pre Mini Project",
      date: "Rabu, 27 Maret 2025",
      time: "13:00 - 15:00 (2 Jam)",
      statusColor: "text-green-500 bg-green-50",
    },
  ];

  const count = 5;

  const presentations = Array(count)
    .fill(basePresentations)
    .flat()
    .map((item, index) => ({
      ...item,
      title: `${item.title} ${index + 1}`,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      {/* Bootstrap Icons CSS Link - Pastikan ini ada di head HTML */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      {/* Filter section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid untuk kartu presentasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {presentations.map((item, index) => (
            <PresentationCard
              key={index}
              item={item}
              buttonLabel="Apply Presentasi"
              onButtonClick={handleApplyClick}
            />
          ))}
        </div>
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