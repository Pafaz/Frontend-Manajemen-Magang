import { useState, useRef, useEffect } from "react";
import axios from "axios";
import DataCabang from "../../components/cards/DataCabang";
import PasswordCabang from "../../components/cards/PasswordCabang";

const CompanyCard = () => {
  const [dataCabang, setDataCabang] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tempCoverImage, setTempCoverImage] = useState(null);
  const [tempLogoImage, setTempLogoImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const coverInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [animating, setAnimating] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Data Cabang");

  console.log(dataCabang);
  
  const fetchCabangData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cabang-detail`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const cabang = res.data.data[0];
      setDataCabang(cabang);

      if (cabang.logo) {
        setLogoImage(
          cabang.logo.startsWith("/") ? cabang.logo : `/storage/${cabang.logo}`
        );
      } else if (cabang.foto) {
        const logo = cabang.foto.find((f) => f.type === "logo");
        setLogoImage(logo ? `/storage/${logo.path}` : null);
      }

      if (cabang.profil_cover) {
        setCoverImage(
          cabang.profil_cover.startsWith("/")
            ? cabang.profil_cover
            : `/storage/${cabang.profil_cover}`
        );
      } else if (cabang.foto) {
        const cover = cabang.foto.find((f) => f.type === "profil_cover");
        setCoverImage(cover ? `/storage/${cover.path}` : null);
      }
    } catch (err) {
      console.error("Gagal fetch data cabang", err);
    }
  };

  useEffect(() => {
    fetchCabangData();
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
    const previewUrl = URL.createObjectURL(file);
    if (type === "cover") {
      setTempCoverImage({ file, preview: previewUrl });
    } else {
      setTempLogoImage({ file, preview: previewUrl });
    }
  };

  const handleOpenModal = () => {
    if (!tempCoverImage && coverImage) {
      setTempCoverImage({
        file: null,
        preview: `${import.meta.env.VITE_API_URL_FILE}${coverImage}`,
      });
    }
    if (!tempLogoImage && logoImage) {
      setTempLogoImage({
        file: null,
        preview: `${import.meta.env.VITE_API_URL_FILE}${logoImage}`,
      });
    }
    setShowUploadModal(true);
  };

  const handleSaveImages = async () => {
    setIsUploading(true);
    try {
      const uploadPromises = [];

      if (tempCoverImage?.file) {
        const coverFormData = new FormData();
        coverFormData.append("_method", "PUT");
        coverFormData.append("profil_cover", tempCoverImage.file);

        uploadPromises.push(
          axios.post(
            `${import.meta.env.VITE_API_URL}/cabang-update`,
            coverFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        );
      }

      if (tempLogoImage?.file) {
        const logoFormData = new FormData();
        logoFormData.append("_method", "PUT");
        logoFormData.append("logo", tempLogoImage.file);

        uploadPromises.push(
          axios.post(
            `${import.meta.env.VITE_API_URL}/cabang-update`,
            logoFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        );
      }

      await Promise.all(uploadPromises);

      if (tempCoverImage) setCoverImage(tempCoverImage.preview);
      if (tempLogoImage) setLogoImage(tempLogoImage.preview);

      setShowUploadModal(false);
      setTempCoverImage(null);
      setTempLogoImage(null);

      fetchCabangData();
    } catch (err) {
      console.error("Gagal upload gambar", err);
      alert("Gagal upload gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setTempCoverImage(null);
    setTempLogoImage(null);
  };

  const menuItems = [{ label: "Data Cabang" }, { label: "Password" }];

  if (!dataCabang) {
    return (
      <div className="w-full h-60 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={`${import.meta.env.VITE_API_URL_FILE}${coverImage}`}
            alt="Cover"
            className="w-full h-60 object-cover"
          />
          <button
            className="absolute top-4 right-4 flex items-center gap-2 border border-gray-300 bg-white bg-opacity-80 text-[#344054] px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#0069AB] hover:text-white"
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
                src={`${import.meta.env.VITE_API_URL_FILE}${logoImage}`}
                alt="Logo"
                className="w-14 h-14 rounded-full border border-gray-200 object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {dataCabang.nama}
              </h2>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-geo-alt-fill"></i> {dataCabang.kota},{" "}
                {dataCabang.provinsi}
              </div>
              <div className="text-[13px] text-gray-500 flex items-center gap-2 mt-1">
                <i className="bi bi-calendar-fill"></i>{" "}
                {new Date(dataCabang.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
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
              : "opacity-100 translate-y-0 animate-bounce-in"
          }`}
        >
          {activeMenu === "Data Cabang" && <DataCabang />}
          {activeMenu === "Password" && <PasswordCabang />}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Foto Profil</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Cover
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {tempCoverImage ? (
                    <div className="relative">
                      <img
                        src={tempCoverImage.preview}
                        alt="Preview Cover"
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        onClick={() => setTempCoverImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-image text-4xl text-gray-400"></i>
                      <p className="mt-2 text-sm text-gray-600">
                        Klik untuk upload
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
                    className="w-full mt-3 py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                  >
                    Pilih Gambar
                  </button>
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {tempLogoImage ? (
                    <div className="relative">
                      <img
                        src={tempLogoImage.preview}
                        alt="Preview Logo"
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        onClick={() => setTempLogoImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-building text-4xl text-gray-400"></i>
                      <p className="mt-2 text-sm text-gray-600">
                        Klik untuk upload
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={(e) => handleImageSelect(e, "logo")}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current.click()}
                    className="w-full mt-3 py-2 px-4 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                  >
                    Pilih Gambar
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleSaveImages}
                disabled={
                  (!tempCoverImage?.file && !tempLogoImage?.file) || isUploading
                }
                className={`px-4 py-2 rounded-md ${
                  (!tempCoverImage?.file && !tempLogoImage?.file) || isUploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0069AB] text-white hover:bg-[#005689]"
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
