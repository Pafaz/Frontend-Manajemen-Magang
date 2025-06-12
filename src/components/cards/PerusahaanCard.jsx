import { useState, useEffect } from "react";
import axios from "axios";

const CompanyCardWithModal = () => {
  const [dataCabang, setDataCabang] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCabangData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cabang-detail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const cabang = res.data.data[0]; // Ambil data pertama

      setDataCabang(cabang);

      const logo = cabang.foto.find((f) => f.type === "logo");
      const cover = cabang.foto.find((f) => f.type === "profil_cover");

      setLogoImage(logo ? `${import.meta.env.VITE_API_URL_FILE}/storage/${logo.path}` : null);
      setCoverImage(cover ? `${import.meta.env.VITE_API_URL_FILE}/storage/${cover.path}` : null);
    } catch (err) {
      console.error("Gagal fetch data cabang", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabangData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-60 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (!dataCabang) {
    return <div className="text-center text-sm text-red-500">Gagal memuat data cabang.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Gambar Header dengan fallback */}
      <img
        src={coverImage || "/assets/img/Cover.png"}
        alt="Cover"
        className="w-full h-60 object-cover"
      />

      {/* Info Perusahaan */}
      <div className="w-full px-6 pt-3 pb-4 flex justify-between items-start">
        {/* Logo dan info */}
        <div className="flex items-start gap-4">
          <img
            src={logoImage || "/assets/img/logoperusahaan.png"}
            alt="Logo"
            className="w-24 h-24 rounded-full border border-gray-200 object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-black-800 flex items-center gap-2 mb-2">
              {dataCabang.nama}
              <i className="bi bi-patch-check-fill" style={{ color: "#0069AB" }}></i>
            </h2>
            <p className="text-sm text-black-600">
              Cabang ini bergerak di bidang {dataCabang.bidang_usaha} untuk perkembangan industri.
            </p>
            <div className="text-xs text-black-500 flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1">
                <i className="bi bi-geo-alt"></i> {dataCabang.kota}, {dataCabang.provinsi}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCardWithModal;
