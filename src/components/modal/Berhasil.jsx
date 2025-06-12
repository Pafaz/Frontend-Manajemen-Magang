import React, { useEffect, useState } from "react";

const SuccessModal = ({ isOpen, onClose, onViewDetails }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      setShowModal(true);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setShowModal(false);
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-lg relative transform transition-all duration-300 text-center py-8 px-6 ${
          showModal ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Message */}
        <h3 className="text-xl font-bold mb-6">Presentasi berhasil dipilih, lihat detail presentasi</h3>
        
        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onViewDetails} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Lihat
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;