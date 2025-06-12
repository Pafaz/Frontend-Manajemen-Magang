import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ModalTambahMentor = ({ isOpen, onClose, onSuccess, mode = "add", mentorData = null }) => {
  // Constants
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mentorPhoto: null,
    headerPhoto: null,
    branch: "",
    division: "",
    phoneNumber: "",
    password: "",
    id_cabang: "1",
  });
  
  // UI state
  const [divisions, setDivisions] = useState([]);
  const [editingMentor, setEditingMentor] = useState(null);
  const [fileNames, setFileNames] = useState({
    mentorPhoto: "No File Chosen",
    headerPhoto: "No File Chosen",
  });
  
  // Validation state
  const [fileErrors, setFileErrors] = useState({
    mentorPhoto: "",
    headerPhoto: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    division: ""
  });

  // Initialize modal data when opened
  useEffect(() => {
    if (isOpen) {
      fetchDivisions();
      resetForm();
      
      if (mode === "edit" && mentorData) {
        populateEditForm(mentorData);
      }
    }
  }, [isOpen, mode, mentorData]);

  // Fetch divisions from API
  const fetchDivisions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/divisi`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDivisions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data divisi',
      });
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      mentorPhoto: null,
      headerPhoto: null,
      branch: "",
      division: "",
      phoneNumber: "",
      password: "",
      id_cabang: "1",
    });
    
    setFileNames({
      mentorPhoto: "No File Chosen",
      headerPhoto: "No File Chosen",
    });
    
    setFileErrors({
      mentorPhoto: "",
      headerPhoto: "",
    });
    
    setFormErrors({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      division: ""
    });
    
    setEditingMentor(null);
  };

  // Populate form with mentor data for editing
  const populateEditForm = (mentor) => {
    setFormData({
      email: mentor.user.email || "",
      name: mentor.user.nama || "",
      mentorPhoto: null,
      headerPhoto: null,
      branch: mentor.branch || "",
      division: mentor.divisi?.id || "",
      phoneNumber: mentor.user.telepon || "",
      password: "",
      id_cabang: "1",
    });

    // Set file names if available from mentor data
    const mentorPhotoName = mentor.foto && mentor.foto[0]?.path 
      ? getFileNameFromPath(mentor.foto[0].path) 
      : "No File Chosen";

    const headerPhotoName = mentor.divisi.foto && mentor.divisi.foto[0]?.path 
      ? getFileNameFromPath(mentor.divisi.foto[0].path) 
      : "No File Chosen";

    setFileNames({
      mentorPhoto: mentorPhotoName,
      headerPhoto: headerPhotoName,
    });

    setEditingMentor(mentor);
  };

  // Extract filename from path
  const getFileNameFromPath = (path) => {
    if (!path) return "No File Chosen";
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error message when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate file size and type
  const validateFileSize = (file, fieldName) => {
    // No file provided
    if (!file) return true;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: `Ukuran file terlalu besar. Maksimal 2MB.`,
      }));
      return false;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: `Format file tidak didukung. Gunakan format JPG, PNG, atau GIF.`,
      }));
      return false;
    }
    
    // Validate image dimensions
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = function() {
        const width = this.width;
        const height = this.height;
        
        if (width < 100 || height < 100) {
          setFileErrors((prev) => ({
            ...prev,
            [fieldName]: `Ukuran gambar terlalu kecil. Minimal 100x100 piksel.`,
          }));
          resolve(false);
          return;
        }
        
        setFileErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
        resolve(true);
      };
      
      img.onerror = function() {
        setFileErrors((prev) => ({
          ...prev,
          [fieldName]: `Gambar tidak dapat diproses. Silakan coba gambar lain.`,
        }));
        resolve(false);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file input changes
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    
    setFileErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    
    if (files && files.length > 0) {
      const file = files[0];
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      try {
        const isValid = await validateFileSize(file, name);
        
        if (!isValid) {
          e.target.value = "";
          setFileNames((prev) => ({
            ...prev,
            [name]: "No File Chosen",
          }));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));

        setFileNames((prev) => ({
          ...prev,
          [name]: `${file.name} (${fileSizeMB} MB)`,
        }));
      } catch (error) {
        console.error("Error validating file:", error);
        e.target.value = "";
        setFileNames((prev) => ({
          ...prev,
          [name]: "No File Chosen",
        }));
        setFileErrors((prev) => ({
          ...prev,
          [name]: "Terjadi kesalahan saat memvalidasi file",
        }));
      }
    }
  };

  // Validate all form fields
  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      division: ""
    };
    let isValid = true;

    // Validate name
    if (!formData.name) {
      errors.name = "Nama wajib diisi";
      isValid = false;
    } else if (formData.name.length < 3) {
      errors.name = "Nama minimal 3 karakter";
      isValid = false;
    } else if (formData.name.length > 50) {
      errors.name = "Nama maksimal 50 karakter";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email wajib diisi";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Format email tidak valid";
      isValid = false;
    }

    // Validate phone number (12 digits)
    const phoneRegex = /^\d{12}$/;
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Nomor telepon wajib diisi";
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Nomor telepon harus terdiri dari 12 digit";
      isValid = false;
    }

    // Validate password (if required)
    if (mode === "add" || formData.password) {
      if (mode === "add" && !formData.password) {
        errors.password = "Password wajib diisi";
        isValid = false;
      } else if (formData.password && formData.password.length < 6) {
        errors.password = "Password minimal 6 karakter";
        isValid = false;
      }
    }

    // Validate division
    if (!formData.division) {
      errors.division = "Divisi wajib dipilih";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      return;
    }

    // Final validation for files
    try {
      let hasFileError = false;
      
      if (formData.mentorPhoto) {
        const mentorPhotoValid = await validateFileSize(formData.mentorPhoto, "mentorPhoto");
        if (!mentorPhotoValid) hasFileError = true;
      }
      
      if (formData.headerPhoto) {
        const headerPhotoValid = await validateFileSize(formData.headerPhoto, "headerPhoto");
        if (!headerPhotoValid) hasFileError = true;
      }
      
      if (hasFileError) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ada masalah dengan ukuran atau format file. Mohon periksa kembali.'
        });
        return;
      }
    } catch (error) {
      console.error("Error validating files:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat memvalidasi file. Mohon periksa kembali.'
      });
      return;
    }

    // Prepare form data
    const formPayload = new FormData();
    formPayload.append("nama", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("telepon", formData.phoneNumber);
    formPayload.append("id_divisi", formData.division);
    formPayload.append("id_cabang", "2");

    if (mode === "add" && formData.password) {
      formPayload.append("password", formData.password);
    }

    if (formData.mentorPhoto) {
      formPayload.append("profile", formData.mentorPhoto);
    }

    if (formData.headerPhoto) {
      formPayload.append("cover", formData.headerPhoto);
    }

    try {
      if (editingMentor) {
        // Edit existing mentor
        formPayload.append("_method", "PUT");

        await axios.post(
          `${import.meta.env.VITE_API_URL}/mentor/${editingMentor.id}`, 
          formPayload, 
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data mentor berhasil diperbarui',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Add new mentor
        await axios.post(
          `${import.meta.env.VITE_API_URL}/mentor`, 
          formPayload, 
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data mentor berhasil ditambahkan',
          timer: 1500,
          showConfirmButton: false
        });
      }
      
      onClose();
      onSuccess();
      setEditingMentor(null);
    } catch (error) {
      console.error("Error submitting mentor data:", error);
      
      // Display error message from server if available
      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal menyimpan data mentor. Silakan coba lagi.'
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center">
          <h3 className="font-bold text-lg text-black">
            {mode === "edit" ? "Edit Mentor" : "Tambah Mentor"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-2 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
            {/* Name Field */}
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-0.5 block">
                Masukkan Nama
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className={`w-full px-3 py-1.5 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
                placeholder="Masukkan Nama Disini" 
                maxLength={50}
              />
              {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-0.5 block">
                Masukkan Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className={`w-full px-3 py-1.5 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
                placeholder="Masukkan Email" 
              />
              {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-0.5 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
                placeholder={mode === "edit" ? "Kosongkan jika tidak ingin mengubah" : "Masukkan Password Disini"}
                minLength={mode === "add" ? 6 : undefined}
              />
              {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
            </div>

            {/* Division Field */}
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-0.5 block">
                Masukkan Divisi
              </label>
              <div className="relative">
                <select 
                  name="division" 
                  value={formData.division} 
                  onChange={handleChange} 
                  className={`w-full px-3 py-1.5 border ${formErrors.division ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none appearance-none`}
                >
                  <option value="" disabled>
                    Pilih Divisi
                  </option>
                  {divisions.length > 0 ? (
                    divisions.map((division) => (
                      <option key={division.id} value={division.id}>
                        {division.nama}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Tidak ada divisi
                    </option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-1/4 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {formErrors.division && <p className="text-red-500 text-xs">{formErrors.division}</p>}
            </div>

            {/* Phone Number Field */}
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700 mb-0.5 block">
                Masukkan Nomor HP
              </label>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                className={`w-full px-3 py-1.5 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
                placeholder="Masukkan Nomor HP" 
                maxLength={13}
              />
              {formErrors.phoneNumber && <p className="text-red-500 text-xs">{formErrors.phoneNumber}</p>}
            </div>

            {/* File Upload Fields */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Mentor Photo Upload */}
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Foto Mentor
                </label>
                <div className="flex w-full border rounded-lg overflow-hidden">
                  <label className="flex-none px-3 py-1.5 bg-gray-50 text-gray-600 text-sm border-r cursor-pointer hover:bg-gray-100 transition-colors">
                    Choose File
                    <input 
                      type="file" 
                      name="mentorPhoto" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/gif,image/jpg" 
                    />
                  </label>
                  <div className="flex-grow px-2.5 py-1.5 text-gray-500 text-sm truncate">
                    {fileNames.mentorPhoto}
                  </div>
                </div>
                {fileErrors.mentorPhoto && <p className="text-red-500 text-xs mt-0.5">{fileErrors.mentorPhoto}</p>}
              </div>

              {/* Cover Photo Upload */}
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Foto Cover
                </label>
                <div className="flex w-full border rounded-lg overflow-hidden">
                  <label className="flex-none px-3 py-1.5 bg-gray-50 text-gray-600 text-sm border-r cursor-pointer hover:bg-gray-100 transition-colors">
                    Choose File
                    <input 
                      type="file" 
                      name="headerPhoto" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/gif,image/jpg" 
                    />
                  </label>
                  <div className="flex-grow px-2.5 py-1.5 text-gray-500 text-sm truncate">
                    {fileNames.headerPhoto}
                  </div>
                </div>
                {fileErrors.headerPhoto && <p className="text-red-500 text-xs mt-0.5">{fileErrors.headerPhoto}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-1 pb-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-5 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalTambahMentor;