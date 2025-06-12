import { useState } from "react";

const InternCardWithModal = () => {
  // Static data instead of fetching from API
  const [dataIntern] = useState({
    nama: "Gojo Satoru",
    full_name: "Gojo Satoru",
    divisi: {
      nama: "Web Developer"
    },
    divisi_name: "Web Developer",
    cabang: {
      nama: "PT. HUMMA TECHNOLOGY INDONESIA",
      kota: "Malang",
      provinsi: "Jawa Timur"
    },
    company_name: "PT. HUMMA TECHNOLOGY INDONESIA",
    kota: "Malang",
    provinsi: "Jawa Timur",
    tanggal_mulai: "2025-02-12",
    tanggal_selesai: "2025-06-12",
    status: "aktif"
  });

  // Use static images instead of fetched ones
  const profileImage = "/assets/img/user-img.png";
  const coverImage = "/assets/img/Cover.png";
  
  // No loading state needed as we're using static data
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="w-full h-60 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (!dataIntern) {
    return <div className="text-center text-sm text-red-500">Gagal memuat data peserta magang.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Gambar Cover dengan fallback */}
      <img
        src={coverImage}
        alt="Cover Photo"
        className="w-full h-60 object-cover"
      />

      {/* Info Peserta Magang */}
      <div className="w-full px-6 pt-3 pb-4 flex justify-between items-start">
        {/* Profile photo dan info */}
        <div className="flex items-start gap-4">
          <img
            src={profileImage}
            alt="Profile Photo"
            className="w-24 h-24 rounded-full border border-gray-200 object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-black-800 flex items-center gap-2 mb-2">
              {dataIntern.nama || dataIntern.full_name || "Nama Tidak Tersedia"}
              <i className="bi bi-patch-check-fill" style={{ color: "#0069AB" }}></i>
            </h2>
            <p className="text-sm text-black-600">
              Sedang melakukan magang di divisi {dataIntern.divisi?.nama || dataIntern.divisi_name || "Divisi tidak tersedia"} 
              untuk pengembangan skill dan pengalaman kerja.
            </p>
            <div className="text-xs text-black-500 flex flex-col gap-1 mt-2">
              <span className="flex items-center gap-1">
                <i className="bi bi-building"></i> 
                {dataIntern.cabang?.nama || dataIntern.company_name || "Perusahaan tidak tersedia"}
              </span>
              <span className="flex items-center gap-1">
                <i className="bi bi-geo-alt"></i> 
                {dataIntern.cabang?.kota || dataIntern.kota || "Kota tidak tersedia"}, {dataIntern.cabang?.provinsi || dataIntern.provinsi || "Provinsi tidak tersedia"}
              </span>
              <span className="flex items-center gap-1">
                <i className="bi bi-calendar-check"></i> 
                Mulai: {dataIntern.tanggal_mulai ? new Date(dataIntern.tanggal_mulai).toLocaleDateString('id-ID') : "Tanggal tidak tersedia"}
              </span>
              {dataIntern.tanggal_selesai && (
                <span className="flex items-center gap-1">
                  <i className="bi bi-calendar-x"></i> 
                  Selesai: {new Date(dataIntern.tanggal_selesai).toLocaleDateString('id-ID')}
                </span>
              )}
              <span className="flex items-center gap-1">
                <i className="bi bi-award"></i> 
                Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dataIntern.status === 'aktif' ? 'bg-green-100 text-green-800' :
                  dataIntern.status === 'selesai' ? 'bg-blue-100 text-blue-800' :
                  dataIntern.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {dataIntern.status || 'Tidak diketahui'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternCardWithModal;