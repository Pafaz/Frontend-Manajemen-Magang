import React, { useState } from "react";

export default function ModalTambahLowongan({ isOpen, onClose }) {
  // Form state
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [cabang, setCabang] = useState("");
  const [divisi, setDivisi] = useState("");
  const [kuota, setKuota] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Sample data for dropdowns
  const cabangOptions = ["Jakarta", "Bandung", "Surabaya", "Medan"];
  const divisiOptions = ["IT", "HR", "Finance", "Marketing", "Operations"];
  
  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!tanggalMulai) newErrors.tanggalMulai = "Tanggal Mulai wajib diisi";
    if (!tanggalSelesai) newErrors.tanggalSelesai = "Tanggal Selesai wajib diisi";
    if (!cabang) newErrors.cabang = "Cabang wajib dipilih";
    if (!divisi) newErrors.divisi = "Divisi wajib dipilih";
    if (!kuota) newErrors.kuota = "Kuota wajib diisi";
    else if (parseInt(kuota) <= 0) newErrors.kuota = "Kuota harus lebih dari 0";
    if (!deskripsi) newErrors.deskripsi = "Deskripsi wajib diisi";
    
    // Date validation
    if (tanggalMulai && tanggalSelesai) {
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalSelesai);
      
      if (endDate < startDate) {
        newErrors.tanggalSelesai = "Tanggal Selesai harus setelah Tanggal Mulai";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      // Process form data
      const formData = {
        tanggalMulai,
        tanggalSelesai,
        cabang,
        divisi,
        kuota: parseInt(kuota),
        deskripsi
      };
      
      console.log("Form submitted:", formData);
      // Add API call here
      
      // Close modal
      onClose();
    }
  };
  
  // Reset form on close
  const handleClose = () => {
    setTanggalMulai("");
    setTanggalSelesai("");
    setCabang("");
    setDivisi("");
    setKuota("");
    setDeskripsi("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-lg text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Tambah Lowongan
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Tanggal Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tanggal Mulai <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tanggalMulai ? "border-red-500" : ""
                }`}
              />
              {errors.tanggalMulai && (
                <p className="text-red-500 text-xs mt-1">{errors.tanggalMulai}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Tanggal Selesai <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tanggalSelesai ? "border-red-500" : ""
                }`}
              />
              {errors.tanggalSelesai && (
                <p className="text-red-500 text-xs mt-1">{errors.tanggalSelesai}</p>
              )}
            </div>
          </div>

          {/* Cabang & Divisi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Cabang <span className="text-red-500">*</span></label>
              <select 
                value={cabang}
                onChange={(e) => setCabang(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                  errors.cabang ? "border-red-500" : ""
                }`}
              >
                <option value="">Pilih Cabang</option>
                {cabangOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.cabang && (
                <p className="text-red-500 text-xs mt-1">{errors.cabang}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Divisi <span className="text-red-500">*</span></label>
              <select 
                value={divisi}
                onChange={(e) => setDivisi(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                  errors.divisi ? "border-red-500" : ""
                }`}
              >
                <option value="">Pilih Divisi</option>
                {divisiOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.divisi && (
                <p className="text-red-500 text-xs mt-1">{errors.divisi}</p>
              )}
            </div>
          </div>

          {/* Jumlah Kuota */}
          <div>
            <label className="text-sm text-gray-600">Masukkan Jumlah Kuota <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={kuota}
              onChange={(e) => setKuota(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.kuota ? "border-red-500" : ""
              }`}
              placeholder="Masukkan Jumlah Kuota"
            />
            {errors.kuota && (
              <p className="text-red-500 text-xs mt-1">{errors.kuota}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm text-gray-600">Deskripsi Lowongan <span className="text-red-500">*</span></label>
            <textarea
              rows="3"
              maxLength="150"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Masukkan Deskripsi"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm resize-none ${
                errors.deskripsi ? "border-red-500" : ""
              }`}
            ></textarea>
            <div className="flex justify-between items-center mt-1">
              <div>
                {errors.deskripsi && (
                  <p className="text-red-500 text-xs">{errors.deskripsi}</p>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {deskripsi.length}/150
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}