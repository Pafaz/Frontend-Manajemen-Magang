import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const ModalApplyPresentation = ({ isOpen, onClose, data }) => {
  const [showModal, setShowModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
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
  
  // Define header background color based on status
  const headerBgColor = data?.status === "Selesai" ? "bg-white-100" : "bg-white-100";
  
  const handleApplyClick = async () => {
    try {
      setIsApplying(true);
      
      // Make API call to apply for presentation
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/riwayat-presentasi`,
        {
          id_jadwal_presentasi: data?.id || data?.id_jadwal_presentasi
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Check if the response is successful
      if (response.data.status === "success" || response.status === 200 || response.status === 201) {
        // Close the current modal first
        onClose();
        
        // Show SweetAlert success message
        Swal.fire({
          title: 'Presentasi berhasil dipilih',
          text: 'Lihat detail presentasi',
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Lihat',
          cancelButtonText: 'Tutup'
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to riwayat-presentasi page when "Lihat" is clicked
            window.location.href = '/peserta/riwayat-presentasi';
          }
        });
      } else {
        throw new Error(response.data.message || 'Gagal mendaftar presentasi');
      }
      
    } catch (error) {
      console.error('Error applying for presentation:', error);
      
      // Close the modal
      onClose();
      
      // Get error message from backend
      const errorMessage = error.response?.data?.message || error.message || '';
      
      if (errorMessage.toLowerCase().includes('sudah') || 
          errorMessage.toLowerCase().includes('already') ||
          errorMessage.toLowerCase().includes('duplicate')) {
        // Show already applied message
        Swal.fire({
          title: 'Sudah Mendaftar',
          text: 'Anda sudah mendaftar untuk presentasi ini sebelumnya.',
          icon: 'info',
          confirmButtonColor: '#0069AB',
          confirmButtonText: 'OK'
        });
      } else {
        // Show general error message
        Swal.fire({
          title: 'Gagal Mendaftar',
          text: errorMessage || 'Terjadi kesalahan saat mendaftar presentasi',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Tutup'
        });
      }
    } finally {
      setIsApplying(false);
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-lg relative transform transition-all duration-300 ${
          showModal ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        {/* HEADER */}
        <div className={`relative ${headerBgColor}`}>
          {/* title with high z-index to ensure visibility */}
          <div className="h-32 flex items-left justify-left relative z-20 mt-10 ml-5">
            <h2 className="text-3xl font-bold text-black">Presentasi { data?.tipe || "Presentasi Offline"}</h2>
          </div>
          
          {/* Background image at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <img 
              src={data?.status === "Selesai" ? "/assets/svg/Selesai (2).svg" : "/assets/svg/BackgroundPresentasi.svg"} 
              alt="Presentation background" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* CONTENT */}
        <div className="px-8 pb-6 pt-6">
          <div className="flex items-center mb-4">
            <div className={`${
              data?.status === "Selesai" 
                ? "bg-[#83FFB1] text-black" 
                : "bg-[#FFE0CB] text-black"
              } px-4 py-1 rounded-full mr-auto text-sm`}>
              {data?.status || "Dijadwalkan"}
            </div>
            <div className="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-base font-medium">{data?.applicants || 0} orang</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          <div className="flex flex-wrap mb-6">
            <div className="w-1/2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{data?.date || "Tanggal belum tersedia"}</span>
            </div>
            <div className="w-1/2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{data?.time || "Waktu belum tersedia"}</span>
            </div>
          </div>
          
          {/* Apply Button */}
          <button 
            onClick={handleApplyClick}
            disabled={isApplying}
            className={`w-full py-3 border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white transition-colors duration-200 rounded-lg ${
              isApplying ? 'opacity-50 cursor-not-allowed' : ''
            }`}  c
          >
            {isApplying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mendaftar...
              </div>
            ) : (
              'Apply Presentation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalApplyPresentation;