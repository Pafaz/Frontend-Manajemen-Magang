import { useState, useRef, useEffect } from "react";
import axios from "axios";
import DataPeserta from "../../components/cards/DataPeserta";
import PasswordPeserta from "../../components/cards/PasswordPeserta";
// import ProjectCard from "../../components/cards/ProjectCard";

const CompanyCard = () => {
  const [dataPeserta, setDataPeserta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [coverImage, setCoverImage] = useState("/assets/img/Cover.png");
  const [profileImage, setProfileImage] = useState("/assets/img/Profil.png");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tempCoverImage, setTempCoverImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const [animating, setAnimating] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Data Peserta");

  // Fetch participant data from API
  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/peserta/detail`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("API Response:", response.data); // Debug log

        if (response.data.status === "success") {
          const data = response.data.data;
          
          // Transform data sesuai dengan struktur yang dibutuhkan
          const transformedData = {
            nama: data.nama || "N/A",
            divisi: data.divisi || "Belum tergabung dalam divisi",
            sekolah: data.sekolah || "N/A",
            jurusan: data.jurusan || "N/A",
            mulai_magang: data.mulai_magang || null,
            perusahaan: data.perusahaan || "Belum terdaftar magang di perusahaan",
            selesai_magang: data.selesai_magang || null,
            foto: data.foto || [],
            cover_image: data.cover_image || "/assets/img/Cover.png"
          };

          setDataPeserta(transformedData);

          // Set images from API datas
          const profilePhoto = data.foto?.find((f) => f.type === "profile");
          if (profilePhoto && profilePhoto.path) {
            setProfileImage(`${import.meta.env.VITE_API_URL_FILE}/storage/${profilePhoto.path}`);
          }

          const coverPhoto = data.foto?.find((f) => f.type === "cover");
          if (coverPhoto && coverPhoto.path) {
            setCoverImage(`${import.meta.env.VITE_API_URL_FILE}/storage/${coverPhoto.path}`);
          } else if (data.cover_image) {
            // Jika cover_image langsung ada di response
            setCoverImage(data.cover_image.startsWith('http') ? data.cover_image : `${import.meta.env.VITE_API_URL_FILE}/storage/${data.cover_image}`);
          }
          
        } else {
          setError("Gagal mengambil data peserta");
        }
      } catch (err) {
        console.error("Error fetching participant data:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data peserta");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipantData();
  }, []);

  const handleMenuClick = (menuName) => {
    if (menuName !== activeMenu) {
      setAnimating(true);
      setTimeout(() => {
        setActiveMenu(menuName);
        setTimeout(() => setAnimating(false), 50);
      }, 300);
    }
  };

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("File harus berupa gambar (JPG/PNG)");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === "cover") {
      setTempCoverImage({ file, preview: previewUrl });
    } else {
      setTempProfileImage({ file, preview: previewUrl });
    }
  };

  const handleOpenModal = () => {
    if (!tempCoverImage && coverImage) {
      setTempCoverImage({
        file: null,
        preview: coverImage,
      });
    }
    if (!tempProfileImage && profileImage) {
      setTempProfileImage({
        file: null,
        preview: profileImage,
      });
    }
    setShowUploadModal(true);
  };

  const handleSaveImages = async () => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      
      if (tempCoverImage?.file) {
        formData.append('cover_image', tempCoverImage.file);
      }
      
      if (tempProfileImage?.file) {
        formData.append('profile_image', tempProfileImage.file);
      }

      // API call to upload images
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/peserta/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === "success") {
        // Update images from API response
        if (response.data.data.cover_image) {
          setCoverImage(`${import.meta.env.VITE_API_URL}/storage/${response.data.data.cover_image}`);
        }
        
        if (response.data.data.profile_image) {
          setProfileImage(`${import.meta.env.VITE_API_URL}/storage/${response.data.data.profile_image}`);
        }

        setShowUploadModal(false);
        setTempCoverImage(null);
        setTempProfileImage(null);
        
        alert("Foto berhasil diupdate!");
      } else {
        throw new Error(response.data.message || "Gagal mengupload foto");
      }
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Gagal mengupload foto: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setTempCoverImage(null);
    setTempProfileImage(null);
  };

  const menuItems = [
    { label: "Data Peserta" }, 
    // { label: "Project" },
    { label: "Password" }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="w-full h-60 bg-gray-200 animate-pulse"></div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm p-6">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <i className="bi bi-exclamation-triangle text-4xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!dataPeserta) {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm p-6">
        <div className="text-center text-gray-500">
          <i className="bi bi-person-x text-4xl mb-2"></i>
          <p>Data peserta tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="relative">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-60 object-cover"
            onError={(e) => {
              e.target.src = "/assets/img/Cover.png";
            }}
          />
          <button
            className="absolute top-4 right-4 flex items-center gap-2 border border-gray-300 bg-white bg-opacity-80 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white transition-all duration-200"
            onClick={handleOpenModal}
          >
            <i className="bi bi-camera-fill"></i>
            Edit Foto
          </button>
        </div>

        <div className="w-full px-6 pt-4 pb-4 pl-5 flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="relative group">
              <img
                src={profileImage}
                alt="Profile"
                className="w-14 h-14 rounded-full border border-gray-200 object-cover"
                onError={(e) => {
                  e.target.src = "/assets/img/Profil.png";
                }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {dataPeserta.nama}
              </h2>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-laptop"></i> 
                {dataPeserta.divisi}
              </div>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-geo-alt"></i> 
                {dataPeserta.perusahaan}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mt-2 mb-0 px-6">
          {menuItems.map((menu, index) => (
            <div
              key={index}
              className={`px-3 py-1.5 cursor-pointer rounded-t-lg transition-all duration-300 ease-in-out ${
                activeMenu === menu.label
                  ? "bg-[#ECF2FE] text-[#0069AB] font-medium transform scale-105"
                  : "bg-white-100 text-black-600 hover:bg-[#ECF2FE] hover:text-[#0069AB]"
              }`}
              onClick={() => handleMenuClick(menu.label)}
            >
              <span className="text-[13px] font-medium relative">
                {menu.label}
                {activeMenu === menu.label && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0069AB] rounded-full"></span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#ECF2FE] pt-10 pb-10 pl-5 overflow-hidden relative">
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            animating
              ? "opacity-0 translate-y-8"
              : "opacity-100 translate-y-0"
          }`}
        >
          {activeMenu === "Data Peserta" && <DataPeserta dataPeserta={dataPeserta} />}
          {/* {activeMenu === "Project" && <ProjectCard />} */}
          {activeMenu === "Password" && <PasswordPeserta />}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Foto Profil</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Cover
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-200">
                  {tempCoverImage ? (
                    <div className="relative">
                      <img
                        src={tempCoverImage.preview}
                        alt="Preview Cover"
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        onClick={() => setTempCoverImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-image text-4xl text-gray-400"></i>
                      <p className="mt-2 text-sm text-gray-600">
                        Klik untuk upload foto cover
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Maksimal 2MB, format JPG/PNG
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={(e) => handleImageSelect(e, "cover")}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => coverInputRef.current.click()}
                    className="w-full mt-3 py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
                  >
                    Pilih Gambar
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Profil
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-200">
                  {tempProfileImage ? (
                    <div className="relative">
                      <img
                        src={tempProfileImage.preview}
                        alt="Preview Profile"
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        onClick={() => setTempProfileImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-person-circle text-4xl text-gray-400"></i>
                      <p className="mt-2 text-sm text-gray-600">
                        Klik untuk upload foto profil
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Maksimal 2MB, format JPG/PNG
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={profileInputRef}
                    onChange={(e) => handleImageSelect(e, "profile")}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => profileInputRef.current.click()}
                    className="w-full mt-3 py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
                  >
                    Pilih Gambar
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleSaveImages}
                disabled={
                  (!tempCoverImage?.file && !tempProfileImage?.file) || isUploading
                }
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  (!tempCoverImage?.file && !tempProfileImage?.file) || isUploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0069AB] text-white hover:bg-[#005689] hover:shadow-md"
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCard;