import { useState, useRef, useEffect } from "react";
import Dashboard from "../../pages/perusahaan/Dashboard";
import Cabang from "../../pages/superadmin/Cabang";
import Password from "../../components/cards/Password";
import Swal from "sweetalert2";
import { MapPin } from 'lucide-react';

const CompanyCard = () => {
  // Static data - no API fetching
  const [companyName, setCompanyName] = useState('PT. HUMMA TEKNOLOGI INDONESIA');
  const [location, setLocation] = useState('Malang, Jawa Timur');
  const [joinDate, setJoinDate] = useState('2024-01-15');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const formattedDate = new Date(joinDate).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // File upload states - gambar aktif
  const [logoImage, setLogoImage] = useState("/assets/img/logoperusahaan.png");
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);

  // File input refs
  const logoInputRef = useRef(null);

  // UI states
  const [animating, setAnimating] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

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

  // FUNGSI UPLOAD YANG SUDAH DISEDERHANAKAN (TANPA API)
  const handleImageUploadAndSave = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (maksimal 2MB)
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
      // Simulasi delay upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update preview gambar langsung dengan URL dari file
      const previewUrl = URL.createObjectURL(file);
      if (type === "cover") {
        setCoverImage(previewUrl);
      } else if (type === "logo") {
        setLogoImage(previewUrl);
      }

      // Tampilkan notifikasi sukses
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${type === 'cover' ? 'Cover' : 'Logo'} berhasil diupload`,
        confirmButtonText: 'OK',
        timer: 2000
      });

    } catch (err) {
      console.error("Gagal upload gambar:", err);
      
      await Swal.fire({
        icon: 'error',
        title: 'Gagal Upload!',
        text: `Gagal upload ${type === 'cover' ? 'cover' : 'logo'}. Silakan coba lagi.`,
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

  

  const menuItems = [{ label: "Dashboard" }, { label: "Cabang" },{ label: "Password" }];

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative">
          
          {/* <button
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
          </button> */}
        </div>

        <div className="w-full px-6 pt-4 pb-4 flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="relative group">
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-30 h-30 rounded-full border border-gray-200 object-cover mt-4" 
                onError={(e) => {
                  e.target.src = "/assets/img/logoperusahaan.png";
                }}
              />
              
              
            </div>
            <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 mt-6">
          Halo Pak Gojo! Selamat datang di
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <h3 className="text-2xl font-bold text-gray-900">
            {companyName}
          </h3>
          <i className="bi bi-patch-check-fill text-[#0069AB] text-xl"></i>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            {location}
          </span>
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
          {activeMenu === "Dashboard" && <Dashboard />}
          {activeMenu === "Cabang" && <Cabang />}
          {activeMenu === "Password" && <Password />}
        </div>
      </div>
    </>
  );
};

export default CompanyCard;