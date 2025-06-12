import React from "react";

export default function TablePerusahaan({ data, searchTerm, selectedDate }) {
  // Fungsi untuk mendapatkan foto profil dummy
  const getProfilePhoto = (item) => {
    // Menggunakan gambar lokal dari public folder
    return item?.img || "/assets/img/Profil.png";
  };

  // Filter data berdasarkan pencarian dan tanggal
  const filteredData = data.filter((item) => {
    // Validasi struktur data
    if (!item || !item.nama) {
      return false;
    }

    const isMatchSearch = searchTerm ? 
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.lokasi?.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    const isMatchDate = selectedDate ? 
      item.tanggal_daftar && new Date(item.tanggal_daftar).toLocaleDateString() === selectedDate.toLocaleDateString() : true;

    return isMatchSearch && isMatchDate;
  });

  const handlePhotoClick = (itemId) => {
    console.log("Photo clicked for company:", itemId);
    // Untuk redirect ke detail perusahaan: window.location.href = `/detail-perusahaan/${itemId}`;
  };

  const handleDetailClick = (itemId) => {
    console.log("Detail clicked for company:", itemId);
    // Untuk redirect ke detail perusahaan: window.location.href = `/detail-perusahaan/${itemId}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-white text-[#667797] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-bold">No</th>
            <th className="px-3 py-3 text-center font-bold">Nama Perusahaan</th>
            <th className="px-3 py-3 text-center font-bold">Lokasi</th>
            <th className="px-3 py-3 text-center font-bold">Jumlah Cabang</th>
            <th className="px-3 py-3 text-center font-bold">Jumlah Peserta Magang</th>
            <th className="px-3 py-3 text-center font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-[#667797]">
          {filteredData.length > 0 ? (
            filteredData
              .map((item, index) => {
                if (!item.nama) {
                  return null;
                }

                return (
                  <tr key={item.id || index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-3 py-3 text-center">{index + 1}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProfilePhoto(item)}
                          alt={item.nama || "Company"}
                          className="w-10 h-10 rounded-full cursor-pointer object-cover flex-shrink-0 border-2 border-gray-200"
                          onClick={() => handlePhotoClick(item.id)}
                          onError={(e) => {
                            e.target.src = "/assets/img/Profil.png";
                          }}
                        />
                        <span className="font-medium">
                          {item.nama || "Nama tidak tersedia"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">{item.lokasi || "-"}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-medium">{item.jml_cabang || "0"}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-medium">{item.jml_peserta || "0"}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => handleDetailClick(item.id)}
                        className="bg-[#0069AB] text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#005a94] transition-colors"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                );
              })
              .filter(Boolean)
          ) : (
            <tr>
              <td colSpan="6" className="px-3 py-8 text-center text-gray-500">
                {data.length === 0 ? "Tidak ada data perusahaan" : "Tidak ada data yang sesuai dengan filter"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}