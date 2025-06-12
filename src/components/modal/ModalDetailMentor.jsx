import React from "react";

export default function ModalDetailMentor({ isOpen, onClose, mentor }) {
  if (!isOpen || !mentor) return null;
  console.log(mentor);
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
          Detail Mentor
        </h2>
        <div className="flex flex-col items-center space-y-3">
          <img
          src={`${import.meta.env.VITE_API_URL_FILE}/storage/${mentor}`}
            alt={mentor.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-md"
          />
          <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
          <p className="text-sm text-blue-500">{mentor.division}</p>
          <p className="text-sm text-gray-600">{mentor.email}</p>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium px-6 py-2 rounded-full transition duration-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
