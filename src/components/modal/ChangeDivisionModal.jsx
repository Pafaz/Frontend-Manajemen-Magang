import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChangeDivisionModal = ({ isOpen, onClose, student, onSuccess }) => {
  const [divisions, setDivisions] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchDivisions();
      fetchAllMentors();
      setSelectedDivision('');
      setSelectedMentor('');
      setError(null);
    }
  }, [isOpen]);

  const fetchDivisions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/divisi`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.data) {
        setDivisions(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat data divisi:", error);
      setError("Gagal memuat daftar divisi");
    }
  };

  const fetchAllMentors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentor`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.data) {
        setAllMentors(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat data mentor:", error);
      setError("Gagal memuat daftar mentor");
    }
  };

  const filteredMentors = selectedDivision
    ? allMentors.filter(mentor => {
        if (mentor.divisi && mentor.divisi.id) {
          return String(mentor.divisi.id) === String(selectedDivision);
        }
        if (mentor.divisi_id) {
          return String(mentor.divisi_id) === String(selectedDivision);
        }
        return false;
      })
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Menggunakan format yang benar: id_divisi dan id_mentor
      await axios.put(
        `${import.meta.env.VITE_API_URL}/divisi/peserta/${student.id}`,
        {
          id_divisi: parseInt(selectedDivision),
          id_mentor: selectedMentor
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
        }
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal mengubah mentor dan divisi:", error);
      
      let errorMessage = "Gagal mengubah mentor dan divisi peserta";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join(', ');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl">Pindah Divisi</h3>
          <button
            onClick={onClose}
            className="text-black hover:bg-gray-100 rounded-full p-1"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-600 text-base font-medium mb-2">
              Pilih Divisi
            </label>
            <div className="relative">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedMentor(''); // reset mentor jika divisi berubah
                }}
                required
              >
                <option value="">Pilih Divisi</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.nama}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-600 text-base font-medium mb-2">
              Pilih Mentor
            </label>
            <div className="relative">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                required
                disabled={!selectedDivision}
              >
                <option value="">Pilih Mentor</option>
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.user?.nama || mentor.nama || 'Unnamed Mentor'}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Tidak ada mentor untuk divisi ini
                  </option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-6 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 w-28"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 w-28"
              disabled={loading || !selectedDivision || !selectedMentor}
            >
              {loading ? 'Proses...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeDivisionModal;