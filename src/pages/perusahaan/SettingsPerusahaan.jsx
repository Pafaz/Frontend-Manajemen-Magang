import { useState, useRef, useEffect } from "react";
import DataPerusahaan from "../../components/cards/DataPerusahaan";
import Password from "../../components/cards/Password";
import axios from "axios";
import Loading from "../../components/cards/Loading";
import Swal from "sweetalert2";

const CompanyCard = () => {
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const formattedDate = new Date(joinDate).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // File upload states - gambar aktif
  const [coverImage, setCoverImage] = useState("/assets/img/Cover.png");
  const [logoImage, setLogoImage] = useState("/assets/img/logoperusahaan.png");
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);

  // File input refs
  const coverInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // UI states
  const [animating, setAnimating] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Data Perusahaan");

  const dataProfile = async () => {
    try {
      // Show loading for initial load
      if (!companyName) {
        Swal.fire({
          title: 'Memuat data...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/edit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCompanyName(res.data.data.perusahaan.nama);
      const { kecamatan, kota, provinsi } = res.data.data.perusahaan;
      const locationParts = [kecamatan, kota, provinsi].filter(part => part && part.trim() !== '');
      const formattedLocation = locationParts.join(', ');
      setLocation(formattedLocation);
      setJoinDate(res.data.data.perusahaan.created_at);

      // Set gambar logo dan cover dari API
      const logo = res.data.data.foto.find((f) => f.type === "profile");
      const cover = res.data.data.foto.find((f) => f.type === "profil_cover");

      setLogoImage(logo ? `${import.meta.env.VITE_API_URL_FILE}/storage/${logo.path}` : "/assets/img/logoperusahaan.png");
      setCoverImage(cover ? `${import.meta.env.VITE_API_URL_FILE}/storage/${cover.path}` : "/assets/img/Cover.png");

      Swal.close();
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("Request data:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      
      // Show error alert
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat memperbarui data',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dataProfile();
  }, []); 

  const handleMenuClick = (menuName) => {
    if (menuName !== activeMenu) {
      setAnimating(true);
      setTimeout(() => {
        setActiveMenu(menuName);
        setTimeout(() => {
          setAnimating(false);
        }, 50);
      }, 300);
    }
  };

  // FUNGSI UPLOAD YANG SUDAH DIPERBAIKI
  const handleImageUploadAndSave = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (maksimal 2MB sesuai backend)
    if (file.size > 2 * 1024 * 1024) {
      await Swal.fire({
        icon: 'error',
        title: 'File Terlalu Besar!',
        text: 'Ukuran file maksimal 2MB',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      await Swal.fire({
        icon: 'error',
        title: 'Format File Tidak Didukung!',
        text: 'Silakan upload file dengan format JPG, JPEG, PNG, atau GIF',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsUploading(true);

    // Tampilkan loading
    Swal.fire({
      title: 'Mengupload gambar...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      
      // PERBAIKAN: Gunakan nama field yang sesuai dengan backend
      if (type === "cover") {
        formData.append("profil_cover", file);
      } else if (type === "logo") {
        // Ubah dari "profile" ke "logo" agar sesuai dengan CabangRequest
        formData.append("logo", file);
      }

      // Debug logging
      console.log("Type yang diupload:", type);
      console.log("Nama file:", file.name);
      console.log("Ukuran file:", (file.size / 1024 / 1024).toFixed(2) + " MB");
      
      // Debug: cek isi FormData
      console.log("FormData yang dikirim:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // Upload ke server
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/perusahaan/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response sukses:", response.data);

      // Update preview gambar langsung dengan URL dari file
      const previewUrl = URL.createObjectURL(file);
      if (type === "cover") {
        setCoverImage(previewUrl);
      } else if (type === "logo") {
        setLogoImage(previewUrl);
      }

      // Refresh data dari server untuk memastikan sinkronisasi
      setTimeout(async () => {
        await dataProfile();
      }, 1000);

      // Tampilkan notifikasi sukses
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${type === 'cover' ? 'Cover' : 'Logo'} berhasil diupload dan disimpan`,
        confirmButtonText: 'OK',
        timer: 2000
      });

    } catch (err) {
      console.error("Gagal upload gambar:", err);
      
      // Log detail error
      if (err.response) {
        console.error("Data response error:", err.response.data);
        console.error("Status error:", err.response.status);
        console.error("Headers error:", err.response.headers);
      } else if (err.request) {
        console.error("Request error:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Gagal Upload!',
        text: err.response?.data?.message || `Gagal upload ${type === 'cover' ? 'cover' : 'logo'}. Silakan coba lagi.`,
        confirmButtonText: 'OK'
      });
    } finally {
      setIsUploading(false);
      // Reset input file untuk memungkinkan upload ulang file yang sama
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Fungsi untuk trigger input file
  const handleImageUpload = (inputRef) => {
    if (!isUploading) {
      inputRef.current.click();
    }
  };

  if (loading) return <Loading />;

  const menuItems = [{ label: "Data Perusahaan" }, { label: "Password" }];

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative">
          <img 
            src={coverImage} 
            alt="Cover" 
            className="w-full h-60 object-cover" 
            onError={(e) => {
              e.target.src = "/assets/img/Cover.png";
            }}
          />
          <input
            type="file"
            ref={coverInputRef}
            onChange={(e) => handleImageUploadAndSave(e, "cover")}
            accept="image/jpeg,image/jpg,image/png,image/gif"
            className="hidden"
            disabled={isUploading}
          />
          <button
            className="absolute top-4 right-4 flex items-center gap-2 border border-gray-300 bg-white bg-opacity-80 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            onClick={() => handleImageUpload(coverInputRef)}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                Uploading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Cover
              </>
            )}
          </button>
        </div>

        <div className="w-full px-6 pt-4 pb-4 flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="relative group">
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-14 h-14 rounded-full border border-gray-200 object-cover" 
                onError={(e) => {
                  e.target.src = "/assets/img/logoperusahaan.png";
                }}
              />
              <input
                type="file"
                ref={logoInputRef}
                onChange={(e) => handleImageUploadAndSave(e, "logo")}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                className="hidden"
                disabled={isUploading}
              />
              <button
                className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={() => handleImageUpload(logoInputRef)}
                disabled={isUploading}
                title={isUploading ? "Sedang mengupload..." : "Edit logo"}
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-600"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                )}
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{companyName || 'Nama Perusahaan'}</h2>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-geo-alt-fill"></i> {location || 'Lokasi tidak tersedia'}
              </div>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-calendar-fill"></i> Bergabung {formattedDate || 'Tanggal tidak tersedia'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mt-2 mb-0 px-6">
          {menuItems.map((menu, index) => (
            <div
              key={index}
              className={`px-3 py-1.5 cursor-pointer rounded-t-lg transition-all duration-300 ease-in-out ${
                activeMenu === menu.label ? "bg-[#ECF2FE] text-[#0069AB] font-medium transform scale-105" : "bg-white-100 text-black-600 hover:bg-[#ECF2FE] hover:text-[#0069AB]"
              }`}
              onClick={() => handleMenuClick(menu.label)}
            >
              <span className="text-[13px] font-medium relative">
                {menu.label}
                {activeMenu === menu.label && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0069AB] rounded-full"></span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#ECF2FE] pt-4 pb-4 overflow-hidden relative">
        <div className={`transition-all duration-300 ease-in-out transform ${animating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0 animate-bounce-in"}`}>
          {activeMenu === "Data Perusahaan" && <DataPerusahaan />}
          {activeMenu === "Password" && <Password />}
        </div>
      </div>
    </>
  );
};

export default CompanyCard;