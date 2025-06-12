import React, { useEffect } from "react";

const ModalDetailAdminCabang = ({ isOpen, onClose, branch }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !branch) return null;

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 pt-4 pb-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="white"/>
                </pattern>
              </defs>
              <rect x="0" y="0" width="100" height="100" fill="url(#pattern)"/>
            </svg>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-3 border-white shadow-lg bg-white">
                <img
                  src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                    branch.foto?.find((f) => f.type === "profile")?.path ?? ""
                  }`}
                  alt={`${branch.user?.nama ?? "Admin"} Profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Name and Role */}
          <div className="text-center mt-3">
            <h2 className="text-lg font-bold text-white mb-1">
              {branch.user?.nama ?? "Nama Tidak Tersedia"}
            </h2>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></div>
              <span className="text-white/90 text-xs font-medium">Admin Cabang</span>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="px-4 py-3 space-y-2.5">
          {/* Email */}
          <div className="group">
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Email</p>
                <p className="text-xs text-gray-600 break-words">
                  {branch.user?.email ?? "Email tidak tersedia"}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="group">
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors duration-200">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">Nomor Telepon</p>
                <p className="text-xs text-gray-600">
                  {branch.user?.telepon ?? "Nomor tidak tersedia"}
                </p>
              </div>
            </div>
          </div>

          {/* ID Badge */}
          <div className="group">
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors duration-200">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">ID Admin</p>
                <p className="text-xs text-gray-600 font-mono">
                  #{branch.id ?? "ID tidak tersedia"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
              Status: Aktif
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailAdminCabang;