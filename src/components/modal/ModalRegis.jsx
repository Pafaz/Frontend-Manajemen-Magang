import React from "react";

export default function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 md:mx-0 overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Blue checkmark badge */}
          <div className="bg-blue-100 rounded-full p-3 mb-4">
            <div className="bg-blue-400 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          
          {/* Text content */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Data diri berhasil disimpan!
          </h2>
          <p className="text-gray-600 mb-6">
            Lanjutkan untuk melihat lowongan magang
          </p>
          
          {/* Button */}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}