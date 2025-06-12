import React, { useEffect, useState } from "react";

export default function ModalTambahCabang({ isOpen, onClose, onSave, getFetchData }) {
  const [formData, setFormData] = useState({
    nama: "",
    logo: null,
    bidang_usaha: "",
    provinsi: "",
    kota: "",
    profil_cover: null,
  });
  const [isCustomBusinessField, setIsCustomBusinessField] = useState(false);
  const [logoFileName, setLogoFileName] = useState("No File Chosen");
  const [fotoCoverFileName, setFotoCoverFileName] = useState("No File Chosen");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Validation states
  const [errors, setErrors] = useState({
    nama: "",
    logo: "",
    bidang_usaha: "",
    provinsi: "",
    kota: "",
    profil_cover: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Reset form and errors when modal opens
      resetForm();
      setErrors({
        nama: "",
        logo: "",
        bidang_usaha: "",
        provinsi: "",
        kota: "",
        profil_cover: "",
      });
      setApiError("");
      
      // Fetch provinces data
      fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        .then((res) => res.json())
        .then(setProvinces)
        .catch((error) => {
          console.error("Error fetching provinces:", error);
          setApiError("Gagal memuat data provinsi. Silakan coba lagi.");
        });
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "nama":
        if (!value.trim()) {
          error = "Nama cabang tidak boleh kosong";
        } else if (value.trim().length < 3) {
          error = "Nama cabang minimal 3 karakter";
        } else if (value.trim().length > 50) {
          error = "Nama cabang maksimal 50 karakter";
        }
        break;
      
      case "logo":
        if (!value) {
          error = "Logo perusahaan harus diupload";
        } else {
          // Check file size (max 2MB)
          if (value.size > 2 * 1024 * 1024) {
            error = "Ukuran logo maksimal 2MB";
          }
          
          // Check file type
          const logoType = value.type;
          if (!logoType.startsWith("image/")) {
            error = "File harus berupa gambar";
          }
        }
        break;
        
      case "bidang_usaha":
        if (!value.trim()) {
          error = "Bidang usaha harus dipilih";
        } else if (isCustomBusinessField && value.trim().length > 50) {
          error = "Bidang usaha maksimal 50 karakter";
        }
        break;
        
      case "provinsi":
        if (!value) {
          error = "Provinsi harus dipilih";
        }
        break;
        
      case "kota":
        if (!value) {
          error = "Kota harus dipilih";
        }
        break;
        
      case "profil_cover":
        if (value) {
          // Check file size (max 5MB)
          if (value.size > 5 * 1024 * 1024) {
            error = "Ukuran file maksimal 5MB";
          }
          
          // Check file type
          const coverType = value.type;
          if (!coverType.startsWith("image/")) {
            error = "File harus berupa gambar";
          }
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate each field
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    // Special validation for kota - ensure it's available
    if (!formData.kota && formData.provinsi) {
      if (cities.length === 0) {
        newErrors.kota = "Gagal memuat data kota. Silakan pilih provinsi kembali.";
        isValid = false;
      } else {
        newErrors.kota = "Kota harus dipilih";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleProvinceChange = (e) => {
    const selected = provinces.find((p) => p.name === e.target.value);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      provinsi: selected.name,
      kota: "",
    }));
    
    // Clear province error
    setErrors((prev) => ({
      ...prev,
      provinsi: "",
    }));

    // Reset cities if province changes
    setCities([]);
    setErrors((prev) => ({
      ...prev,
      kota: "",
    }));

    // Fetch cities based on selected province
    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        if (data.length === 0) {
          setErrors((prev) => ({
            ...prev,
            kota: "Tidak ada data kota untuk provinsi ini",
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
        setErrors((prev) => ({
          ...prev,
          kota: "Gagal memuat data kota",
        }));
      });
  };

  const handleCityChange = (e) => {
    const selected = cities.find((c) => c.name === e.target.value);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      kota: selected.name,
    }));
    
    // Clear city error
    setErrors((prev) => ({
      ...prev,
      kota: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "bidang_usaha" && value === "lainnya") {
      setIsCustomBusinessField(true);
      setFormData((prevState) => ({
        ...prevState,
        bidang_usaha: "",
      }));
    } else if (name === "bidang_usaha" && isCustomBusinessField) {
      setIsCustomBusinessField(false);
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      
      // Clear error when typing
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Validate file before setting
      const fileError = validateField(name, file);
      if (fileError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fileError,
        }));
        return;
      }
      
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));

      if (name === "logo") {
        setLogoFileName(file.name);
        setErrors((prev) => ({ ...prev, logo: "" }));
      } else if (name === "profil_cover") {
        setFotoCoverFileName(file.name);
        setErrors((prev) => ({ ...prev, profil_cover: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset API error
    setApiError("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("nama", formData.nama);
      data.append("logo", formData.logo);
      data.append("bidang_usaha", formData.bidang_usaha || "");
      data.append("provinsi", formData.provinsi);
      data.append("kota", formData.kota);
      if (formData.profil_cover) {
        data.append("profil_cover", formData.profil_cover);
      }

      await onSave(data);
      resetForm();
      getFetchData();
      onClose();
    } catch (error) {
      console.error("Error saving branch:", error);
      
      // Handle API error responses
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // Handle general error message
        if (responseData.message) {
          setApiError(responseData.message);
        }
        
        // Handle field-specific errors
        if (responseData.errors) {
          const serverErrors = {};
          Object.keys(responseData.errors).forEach(key => {
            // Map API error fields to our form fields
            const formField = key === 'name' ? 'nama' : key;
            serverErrors[formField] = responseData.errors[key][0];
          });
          setErrors(prev => ({ ...prev, ...serverErrors }));
        }
      } else {
        setApiError("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      logo: null,
      bidang_usaha: "",
      provinsi: "",
      kota: "",
      profil_cover: null,
    });

    setIsCustomBusinessField(false);
    setLogoFileName("No File Chosen");
    setFotoCoverFileName("No File Chosen");
    setErrors({
      nama: "",
      logo: "",
      bidang_usaha: "",
      provinsi: "",
      kota: "",
      profil_cover: "",
    });
    setApiError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tambah Cabang Perusahaan</h2>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Nama Cabang<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan Nama Cabang Disini"
                className={`w-full p-2 border ${errors.nama ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                required
              />
              {errors.nama && (
                <p className="mt-1 text-red-500 text-xs">{errors.nama}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Logo Perusahaan<span className="text-red-500">*</span>
              </label>
              <div className={`flex ${errors.logo ? 'border border-red-500 rounded-md' : ''}`}>
                <button
                  type="button"
                  onClick={() => document.getElementById("logo-input").click()}
                  className={`px-4 py-2 bg-white border ${errors.logo ? 'border-red-500' : 'border-gray-300'} rounded-l-md hover:bg-gray-50`}
                >
                  Choose File
                </button>
                <div className={`flex-1 border border-l-0 ${errors.logo ? 'border-red-500' : 'border-gray-300'} rounded-r-md flex items-center px-3 text-gray-500 overflow-hidden`}>
                  {logoFileName}
                </div>
                <input
                  id="logo-input"
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
              </div>
              {errors.logo && (
                <p className="mt-1 text-red-500 text-xs">{errors.logo}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG, JPEG (Maks. 2MB)</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Bidang Usaha<span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                {isCustomBusinessField ? (
                  <input
                    type="text"
                    name="bidang_usaha"
                    value={formData.bidang_usaha}
                    onChange={handleChange}
                    placeholder="Masukkan Bidang Usaha"
                    className={`w-full p-2 border ${errors.bidang_usaha ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    required
                  />
                ) : (
                  <>
                    <select
                      name="bidang_usaha"
                      value={formData.bidang_usaha}
                      onChange={handleChange}
                      className={`w-full p-2 pr-10 border ${errors.bidang_usaha ? 'border-red-500' : 'border-gray-300'} rounded-md appearance-none bg-white`}
                      required
                    >
                      <option value="" disabled>
                        Pilih Bidang Usaha
                      </option>
                      <option value="teknologi">Teknologi</option>
                      <option value="manufaktur">Manufaktur</option>
                      <option value="jasa">Jasa</option>
                      <option value="perdagangan">Perdagangan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </>
                )}
              </div>
              {errors.bidang_usaha && (
                <p className="mt-1 text-red-500 text-xs">{errors.bidang_usaha}</p>
              )}
              {isCustomBusinessField && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomBusinessField(false);
                      setFormData((prev) => ({ ...prev, bidang_usaha: "" }));
                      setErrors((prev) => ({ ...prev, bidang_usaha: "" }));
                    }}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    Kembali ke Pilihan
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Foto Cover
              </label>
              <div className={`flex ${errors.profil_cover ? 'border border-red-500 rounded-md' : ''}`}>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("fotoCover-input").click()
                  }
                  className={`px-4 py-2 bg-white border ${errors.profil_cover ? 'border-red-500' : 'border-gray-300'} rounded-l-md hover:bg-gray-50`}
                >
                  Choose File
                </button>
                <div className={`flex-1 border border-l-0 ${errors.profil_cover ? 'border-red-500' : 'border-gray-300'} rounded-r-md flex items-center px-3 text-gray-500 overflow-hidden`}>
                  {fotoCoverFileName}
                </div>
                <input
                  id="fotoCover-input"
                  type="file"
                  name="profil_cover"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              {errors.profil_cover && (
                <p className="mt-1 text-red-500 text-xs">{errors.profil_cover}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG, JPEG (Maks. 5MB)</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Provinsi<span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <select
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleProvinceChange}
                  className={`w-full p-2 pr-10 border ${errors.provinsi ? 'border-red-500' : 'border-gray-300'} rounded-md appearance-none bg-white`}
                  required
                >
                  <option value="" disabled>
                    Pilih Provinsi
                  </option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              {errors.provinsi && (
                <p className="mt-1 text-red-500 text-xs">{errors.provinsi}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Kota<span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <select
                  name="kota"
                  value={formData.kota}
                  onChange={handleCityChange}
                  className={`w-full p-2 pr-10 border ${errors.kota ? 'border-red-500' : 'border-gray-300'} rounded-md appearance-none bg-white ${!formData.provinsi ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  required
                  disabled={!formData.provinsi || cities.length === 0}
                >
                  <option value="" disabled>
                    {!formData.provinsi 
                      ? "Pilih Provinsi Terlebih Dahulu" 
                      : cities.length === 0 
                        ? "Memuat data kota..." 
                        : "Pilih Kota"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              {errors.kota && (
                <p className="mt-1 text-red-500 text-xs">{errors.kota}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-6 py-2 bg-blue-500 text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}