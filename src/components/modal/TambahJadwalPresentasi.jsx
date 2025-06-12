import React, { useState, useEffect } from "react";
import axios from "axios";

const AddEventModal = ({ show, onClose, onSubmit }) => {
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedTipe, setSelectedTipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    kuota: "",
    tanggal: "",
    waktu_mulai: "",
    waktu_selesai: "",
    link_zoom: "",
    lokasi: "",
  });

  // Apply animation effect when modal opens
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setAnimateModal(true);
      }, 10);
    } else {
      setAnimateModal(false);
    }
  }, [show]);

  // Reset form data when modal closes
  useEffect(() => {
    if (!show) {
      const resetTimer = setTimeout(() => {
        setFormData({
          kuota: "",
          tanggal: "",
          waktu_mulai: "",
          waktu_selesai: "",
          link_zoom: "",
          lokasi: "",
        });
        setSelectedTipe("");
        setErrors({});
      }, 300);
      
      return () => clearTimeout(resetTimer);
    }
  }, [show]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate kuota
    if (!formData.kuota || parseInt(formData.kuota) <= 0) {
      newErrors.kuota = "Kuota harus diisi dengan angka lebih dari 0";
    }
    
    // Validate tanggal
    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal harus diisi";
    } else {
      const selectedDate = new Date(formData.tanggal);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (selectedDate <= yesterday) {
        newErrors.tanggal = "Tanggal harus setelah hari kemarin";
      }
    }
    
    // Validate tipe
    if (!selectedTipe) {
      newErrors.tipe = "Tipe presentasi harus dipilih";
    }
    
    // Validate waktu_mulai
    if (!formData.waktu_mulai) {
      newErrors.waktu_mulai = "Waktu mulai harus diisi";
    }
    
    // Validate waktu_selesai
    if (!formData.waktu_selesai) {
      newErrors.waktu_selesai = "Waktu selesai harus diisi";
    }
    
    // Validate time logic
    if (formData.waktu_mulai && formData.waktu_selesai) {
      if (formData.waktu_mulai >= formData.waktu_selesai) {
        newErrors.waktu_selesai = "Waktu selesai harus lebih besar dari waktu mulai";
      }
    }
    
    // Validate conditional fields
    if (selectedTipe === "online" && !formData.link_zoom.trim()) {
      newErrors.link_zoom = "Link Zoom harus diisi untuk presentasi online";
    }
    
    if (selectedTipe === "offline" && !formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi harus diisi untuk presentasi offline";
    }
    
    // Validate Zoom Link format if provided
    if (selectedTipe === "online" && formData.link_zoom.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.link_zoom.trim())) {
        newErrors.link_zoom = "Format URL tidak valid";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleTipeChange = (e) => {
    const newTipe = e.target.value;
    setSelectedTipe(newTipe);
    
    // Clear conditional field errors
    if (errors.tipe) {
      setErrors(prev => ({
        ...prev,
        tipe: ""
      }));
    }
    
    // Clear conditional fields when switching tipe
    if (newTipe === "online") {
      setFormData(prev => ({ ...prev, lokasi: "" }));
      if (errors.lokasi) {
        setErrors(prev => ({ ...prev, lokasi: "" }));
      }
    } else if (newTipe === "offline") {
      setFormData(prev => ({ ...prev, link_zoom: "" }));
      if (errors.link_zoom) {
        setErrors(prev => ({ ...prev, link_zoom: "" }));
      }
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setAnimateModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Prepare data for API
      const submitData = {
        kuota: parseInt(formData.kuota),
        tanggal: formData.tanggal,
        waktu_mulai: formData.waktu_mulai,
        waktu_selesai: formData.waktu_selesai,
        tipe: selectedTipe, // Mengirim tipe presentasi (online/offline)
        ...(selectedTipe === "online" && { link_zoom: formData.link_zoom.trim() }),
        ...(selectedTipe === "offline" && { lokasi: formData.lokasi.trim() }),
      };

      console.log('Sending data:', submitData);

      // API call
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/jadwal-presentasi`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Call onSubmit callback with response data
      if (onSubmit) {
        onSubmit(res.data);
      }
      
      // Close modal after successful submission
      handleClose();
      
    } catch (error) {
      console.error('Error adding presentation schedule:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Terjadi kesalahan pada server';
        console.error('Server Error:', error.response.data);
        
        // Handle validation errors from server
        if (error.response.status === 422 && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          alert(`Server Error: ${errorMessage}`);
        }
      } else if (error.request) {
        // Network error (CORS, connection, etc.)
        console.error('Network Error:', error.request);
        alert('Network Error: Tidak dapat terhubung ke server. Periksa koneksi internet atau konfigurasi CORS server.');
      } else {
        // Other errors
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if modal is not shown
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className={`bg-white w-full max-w-3xl rounded-2xl p-6 transition-all duration-300 transform ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tambah Jadwal Presentasi</h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Kuota</label>
              <input 
                type="number" 
                name="kuota" 
                value={formData.kuota} 
                onChange={handleInputChange} 
                className={`w-full border rounded-lg p-2 ${errors.kuota ? 'border-red-500' : 'border-[#D5DBE7]'}`}
                placeholder="Masukkan Kuota"
                min="1"
                disabled={isLoading}
              />
              {errors.kuota && <p className="text-red-500 text-xs mt-1">{errors.kuota}</p>}
            </div>
            
            <div>
              <label className="block font-medium mb-1">Tanggal Presentasi</label>
              <input 
                type="date" 
                name="tanggal" 
                value={formData.tanggal} 
                onChange={handleInputChange} 
                className={`w-full border rounded-lg p-2 ${errors.tanggal ? 'border-red-500' : 'border-[#D5DBE7]'}`}
                disabled={isLoading}
              />
              {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Tipe Presentasi</label>
              <select 
                className={`w-full border rounded-lg p-2 ${errors.tipe ? 'border-red-500' : 'border-[#D5DBE7]'}`}
                onChange={handleTipeChange} 
                value={selectedTipe}
                disabled={isLoading}
              >
                <option value="">Pilih tipe presentasi</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              {errors.tipe && <p className="text-red-500 text-xs mt-1">{errors.tipe}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Jam Presentasi</label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <input 
                    type="time" 
                    name="waktu_mulai" 
                    value={formData.waktu_mulai} 
                    onChange={handleInputChange} 
                    className={`w-full border rounded-lg p-2 ${errors.waktu_mulai ? 'border-red-500' : 'border-[#D5DBE7]'}`}
                    disabled={isLoading}
                  />
                  {errors.waktu_mulai && <p className="text-red-500 text-xs mt-1">{errors.waktu_mulai}</p>}
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1">
                  <input 
                    type="time" 
                    name="waktu_selesai" 
                    value={formData.waktu_selesai} 
                    onChange={handleInputChange} 
                    className={`w-full border rounded-lg p-2 ${errors.waktu_selesai ? 'border-red-500' : 'border-[#D5DBE7]'}`}
                    disabled={isLoading}
                  />
                  {errors.waktu_selesai && <p className="text-red-500 text-xs mt-1">{errors.waktu_selesai}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional rendering based on selected tipe */}
          {(selectedTipe === "online" || selectedTipe === "offline") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedTipe === "online" && (
                <div>
                  <label className="block font-medium mb-1">Link Zoom</label>
                  <input 
                    type="url" 
                    name="link_zoom" 
                    value={formData.link_zoom} 
                    onChange={handleInputChange} 
                    className={`w-full border rounded-lg p-2 ${errors.link_zoom ? 'border-red-500' : 'border-[#D5DBE7]'}`}
                    placeholder="https://zoom.us/j/..."
                    disabled={isLoading}
                  />
                  {errors.link_zoom && <p className="text-red-500 text-xs mt-1">{errors.link_zoom}</p>}
                </div>
              )}

              {selectedTipe === "offline" && (
                <div>
                  <label className="block font-medium mb-1">Lokasi</label>
                  <input 
                    type="text" 
                    name="lokasi" 
                    value={formData.lokasi} 
                    onChange={handleInputChange} 
                    className={`w-full border rounded-lg p-2 ${errors.lokasi ? 'border-red-500' : 'border-[#D5DBE7]'}`}
                    placeholder="Masukkan Lokasi"
                    disabled={isLoading}
                  />
                  {errors.lokasi && <p className="text-red-500 text-xs mt-1">{errors.lokasi}</p>}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button 
              type="button" 
              onClick={handleClose} 
              className="px-4 py-2 text-sm rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;