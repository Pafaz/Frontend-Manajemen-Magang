import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ModalTambahAdminCabang = ({ isOpen, onClose, branchToEdit, onSucces }) => {
  const isEditMode = Boolean(branchToEdit);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const [formData, setFormData] = useState({
    nama: "",
    password: "",
    branch: "",
    adminPhoto: null,
    headerPhoto: null,
    email: "",
    phoneNumber: "",
    id_cabang: 2,
  });

  const [adminPhotoName, setAdminPhotoName] = useState("No File Chosen");
  const [headerPhotoName, setHeaderPhotoName] = useState("No File Chosen");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isEditMode && branchToEdit) {
      setFormData({
        nama: branchToEdit.user?.nama || "",
        email: branchToEdit.user?.email || "",
        phoneNumber: branchToEdit.user?.telepon || "",
        password: "",
        adminPhoto: null,
        headerPhoto: null,
        id_cabang: branchToEdit.id_cabang || 2,
      });
    } else {
      setFormData({
        nama: "",
        password: "",
        branch: "",
        adminPhoto: null,
        headerPhoto: null,
        email: "",
        phoneNumber: "",
        id_cabang: 2,
      });
      setAdminPhotoName("No File Chosen");
      setHeaderPhotoName("No File Chosen");
    }
    // Reset errors and touched states when modal opens/closes or editing mode changes
    setErrors({});
    setTouched({});
  }, [branchToEdit, isEditMode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Clear error for this field when user makes changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ 
          ...prev, 
          [fieldName]: "Ukuran file tidak boleh lebih dari 2MB" 
        }));
        return;
      }
      
      // Validate file type (optional)
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ 
          ...prev, 
          [fieldName]: "Hanya file gambar yang diperbolehkan" 
        }));
        return;
      }
      
      // Clear error if file is valid
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      
      // Update form data with file
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
      
      // Update file name display
      if (fieldName === "adminPhoto") {
        setAdminPhotoName(file.name);
      } else if (fieldName === "headerPhoto") {
        setHeaderPhotoName(file.name);
      }
    }
    
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    if (!isEditMode && !formData.password) {
      newErrors.password = "Password wajib diisi";
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Nomor HP wajib diisi";
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Nomor HP hanya boleh berisi angka";
    }
    
    // Keep any existing file errors
    if (errors.adminPhoto) newErrors.adminPhoto = errors.adminPhoto;
    if (errors.headerPhoto) newErrors.headerPhoto = errors.headerPhoto;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Basic validation on blur
    if (name === "nama" && !formData.nama.trim()) {
      setErrors((prev) => ({ ...prev, nama: "Nama wajib diisi" }));
    } else if (name === "email") {
      if (!formData.email.trim()) {
        setErrors((prev) => ({ ...prev, email: "Email wajib diisi" }));
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors((prev) => ({ ...prev, email: "Format email tidak valid" }));
      }
    } else if (name === "password" && !isEditMode && !formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password wajib diisi" }));
    } else if (name === "phoneNumber") {
      if (!formData.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Nomor HP wajib diisi" }));
      } else if (!/^\d+$/.test(formData.phoneNumber)) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Nomor HP hanya boleh berisi angka" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ["nama", "email", "password", "phoneNumber", "adminPhoto", "headerPhoto"];
    const allTouched = {};
    allFields.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    // Show loading alert
    Swal.fire({
      title: 'Menyimpan...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("email", formData.email);
    formPayload.append("telepon", formData.phoneNumber);
    // formPayload.append("id_cabang", "2");
  
    if (formData.password) {
      formPayload.append("password", formData.password);
    }
  
    if (formData.adminPhoto) {
      formPayload.append("profile", formData.adminPhoto);
    }
  
    if (formData.headerPhoto) {
      formPayload.append("cover", formData.headerPhoto);
    }
  
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const url = isEditMode
        ? `/api/admin/${branchToEdit.id}?_method=PUT`
        : "/api/admin";
  
      const response = await axios.post(url, formPayload, { headers });
  
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Data admin berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          onClose();
          onSucces();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menyimpan data admin.',
        });
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan admin:", error);
      let errorMessage = "Terjadi kesalahan saat menyimpan data";
      
      // Handle specific API error messages if available
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: errorMessage,
      });
    }
  };  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg w-full max-w-md mx-4 relative z-10 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Edit Admin" : "Tambah Admin"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3" encType="multipart/form-data">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Masukkan Nama
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Masukkan Nama Disini"
              className={`w-full px-3 py-2 border ${
                errors.nama && touched.nama ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.nama && touched.nama && (
              <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Masukkan Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Masukkan Email"
              className={`w-full px-3 py-2 border ${
                errors.email && touched.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {isEditMode && <span className="text-xs text-gray-500">(Kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Masukkan Password Disini"
              className={`w-full px-3 py-2 border ${
                errors.password && touched.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Foto Admin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Admin
            </label>
            <div className="flex">
              <label className={`flex items-center justify-center px-4 py-2 bg-white border ${
                errors.adminPhoto ? "border-red-500" : "border-gray-300"
              } rounded-l-md text-sm text-gray-700 cursor-pointer hover:bg-gray-50`}>
                <span>Choose File</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "adminPhoto")}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <div className={`flex-1 px-3 py-2 border border-l-0 ${
                errors.adminPhoto ? "border-red-500" : "border-gray-300"
              } rounded-r-md bg-gray-50 text-gray-500 text-sm overflow-hidden text-ellipsis whitespace-nowrap`}>
                {adminPhotoName}
              </div>
            </div>
            {errors.adminPhoto && (
              <p className="text-red-500 text-xs mt-1">{errors.adminPhoto}</p>
            )}
          </div>

          {/* Foto Cover */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Cover
            </label>
            <div className="flex">
              <label className={`flex items-center justify-center px-4 py-2 bg-white border ${
                errors.headerPhoto ? "border-red-500" : "border-gray-300"
              } rounded-l-md text-sm text-gray-700 cursor-pointer hover:bg-gray-50`}>
                <span>Choose File</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "headerPhoto")}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <div className={`flex-1 px-3 py-2 border border-l-0 ${
                errors.headerPhoto ? "border-red-500" : "border-gray-300"
              } rounded-r-md bg-gray-50 text-gray-500 text-sm overflow-hidden text-ellipsis whitespace-nowrap`}>
                {headerPhotoName}
              </div>
            </div>
            {errors.headerPhoto && (
              <p className="text-red-500 text-xs mt-1">{errors.headerPhoto}</p>
            )}
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Masukkan Nomor HP
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Masukkan Nomor HP"
              className={`w-full px-3 py-2 border ${
                errors.phoneNumber && touched.phoneNumber ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahAdminCabang;