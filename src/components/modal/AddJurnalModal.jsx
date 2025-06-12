import React, { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AddJurnalModal = ({ isOpen, onClose, editMode, selectedJournal, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
  });
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Initialize form data for edit mode
    if (editMode && selectedJournal) {
      setFormData({ title: selectedJournal.judul });
      setDescription(selectedJournal.deskripsi);
      
      if (selectedJournal.bukti && selectedJournal.bukti.path) {
        const imageUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${selectedJournal.bukti.path}`;
        setPreviewUrl(imageUrl);
      }
    }
  }, [editMode, selectedJournal]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        bukti: "File harus berupa PNG atau JPEG.",
      }));
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, bukti: null }));
  };

  // Handler for clicking on the upload area
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handler for drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validTypes = ["image/png", "image/jpeg"];
      
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          bukti: "File harus berupa PNG atau JPEG.",
        }));
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, bukti: null }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    // Check if the click is outside the modal content
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Judul wajib diisi.";
    if (!selectedFile && !editMode) newErrors.bukti = "Bukti wajib diunggah."; // file tidak wajib saat edit
    if (!description?.trim()) {
      newErrors.description = "Deskripsi wajib diisi.";
    } else if (description.replace(/\s+/g, '').length < 150) {
      newErrors.description = "Deskripsi harus minimal 150 karakter.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const form = new FormData();
    form.append("judul", formData.title);
    form.append("deskripsi", description);
    if (selectedFile) form.append("bukti", selectedFile);

    // Edit: tambahkan method override
    if (editMode && selectedJournal) {
      form.append("_method", "PUT");
    }

    try {
      const token = localStorage.getItem("token");
      const url = editMode
        ? `${import.meta.env.VITE_API_URL}/jurnal/${selectedJournal.id}`
        : `${import.meta.env.VITE_API_URL}/jurnal`;

      await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset state and notify parent of success
      onSubmitSuccess();
      setIsSubmitting(false);
      
    } catch (error) {
      const backendErrors = error.response?.data?.meta;
      const statusCode = error.response?.status;

      // Tangani error 409 khusus (jurnal sudah diisi hari ini) dengan SweetAlert2
      if (statusCode === 409) {
        Swal.fire({
          title: 'Perhatian!',
          text: error.response.data.message,
          icon: 'warning',
          confirmButtonText: 'Mengerti',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'rounded-lg',
            confirmButton: 'px-4 py-2 rounded'
          }
        });
        return;
      }
      
      const parsedErrors = {};
      if (backendErrors?.judul) parsedErrors.title = backendErrors.judul[0];
      if (backendErrors?.deskripsi) parsedErrors.description = backendErrors.deskripsi[0];
      if (backendErrors?.bukti) parsedErrors.bukti = backendErrors.bukti[0];
      if (backendErrors?.tanggal) parsedErrors.tanggal = backendErrors.tanggal[0];
      
      setErrors(parsedErrors);
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] modal-overlay"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg">
        <div className="flex justify-between items-center p-6 pb-4 border-b">
          <div>
            <h2 className="text-xl font-bold">
              {editMode ? "Edit Jurnal" : "Buat Jurnal"}
            </h2>
            {!editMode && (
              <p className="text-gray-500 text-sm">
                Ayo Laporkan Kegiatanmu hari ini!
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
          encType="multipart/form-data"
        >
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Masukkan Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              placeholder="Masukkan Judul Disini"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Masukkan Bukti <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
              className="hidden"
            />

            {previewUrl ? (
              <div className="mb-2 relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                className="border border-gray-200 bg-blue-50 rounded flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="text-gray-700 mb-2">
                  <Upload size={32} />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span>Drag or </span>
                  <span className="text-blue-500">Browse</span>
                </div>
                <p className="text-gray-500 text-xs">
                  PNG, JPEG (max 2mb size)
                </p>
              </div>
            )}
            {errors.bukti && (
              <p className="text-red-500 text-sm mt-1">{errors.bukti}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full border rounded px-3 py-2 h-28 focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Minimal Karakter</span>
              <span className={description.replace(/\s+/g, '').length < 150 ? 'text-red-500' : 'text-green-500'}>
                {description.replace(/\s+/g, '').length}/150
              </span>
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-red-400 text-white font-medium hover:bg-red-500"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJurnalModal;