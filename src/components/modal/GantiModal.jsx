import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

// GantiModal Component
const GantiModal = ({ isOpen, onClose, onSimpan, data }) => {
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    divisi: ""
  });
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Mengambil daftar divisi dari API
  useEffect(() => {
    const fetchDivisiOptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiUrl}/divisi`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          setDivisiOptions(response.data.data);
        } else {
          console.error("Format data divisi tidak sesuai:", response.data);
          setError("Gagal memuat data divisi");
        }
      } catch (error) {
        console.error("Error saat mengambil data divisi:", error);
        setError("Gagal mengambil data divisi dari server");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDivisiOptions();
    }
  }, [isOpen, apiUrl, token]);
  
  // Memperbarui state ketika data berubah
  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id || "",
        nama: data.nama || "",
        divisi: data.divisi || ""
      });
    }
  }, [data]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pastikan ID ada sebelum mengirim data
    if (!formData.id) {
      console.error("ID tidak ditemukan");
      return;
    }
    
    // Kirim data untuk update
    onSimpan(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/40 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10 relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Ganti Divisi</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {/* Informasi Peserta (read-only) */}
          {/* ID tersembunyi */}
          <input type="hidden" value={formData.id} />
          
          {/* Pemilihan Divisi */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Pilih Divisi Baru
            </label>
            <div className="relative">
              {isLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-500">Memuat data divisi...</span>
                </div>
              ) : error ? (
                <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-700 text-sm">
                  {error}. Silakan tutup dan coba lagi.
                </div>
              ) : (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white"
                  value={formData.divisi}
                  onChange={(e) => setFormData({...formData, divisi: e.target.value})}
                  required
                >
                  <option value="" disabled>Pilih Divisi</option>
                  {divisiOptions.map((divisi) => (
                    <option key={divisi.id} value={divisi.kode || divisi.id}>
                      {divisi.nama}
                    </option>
                  ))}
                </select>
              )}
              
              {/* Indikator dropdown */}
              {!isLoading && !error && (
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 border border-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              disabled={isLoading || error}
            >
              {isLoading ? 'Memuat...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GantiModal;