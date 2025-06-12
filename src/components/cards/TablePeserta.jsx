import dayjs from "dayjs";
import React from "react";

export default function TablePendaftaran({
  data,
  searchTerm,
  selectedDate,
  selectedDivisi,
  selectedStatus,
}) {
  
  // Akses foto dari item.foto (data sudah flat)
  const getProfilePhoto = (item) => {
    const fotoArr = item?.foto;
    const profile = fotoArr?.find((f) => f.type === "profile");
    return profile
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${profile.path}`
      : "/Cover.png";
  };
  
  // Fungsi bantu untuk status warna
  const getStatusColor = (status) => {
    switch (status) {
      case "Aktif":
        return "text-[#16A34A]";
      case "Alumni":
        return "text-[#0069AB]";
      case "Belum Aktif":
        return "text-[#F59E0B]";
      default:
        return "text-gray-700";
    }
  };

  const getStatusMagang = (mulai, selesai) => {
    // Validasi input terlebih dahulu
    if (!mulai || !selesai) return "Alumni";
    
    const today = dayjs();
    const mulaiDate = dayjs(mulai);
    const selesaiDate = dayjs(selesai);

    // Validasi apakah tanggal valid
    if (!mulaiDate.isValid() || !selesaiDate.isValid()) return "Alumni";

    // Jika belum sampai tanggal mulai magang
    if (today.isBefore(mulaiDate, 'day')) {
      return "Belum Aktif";
    }
    
    // Jika sudah melewati tanggal selesai magang
    if (today.isAfter(selesaiDate, 'day')) {
      return "Alumni";
    }
    
    // Jika dalam periode magang (mulai <= today <= selesai)
    return "Aktif";
  };

  // Render status badge dengan warna yang sesuai
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Aktif":
        return (
          <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded text-xs font-semibold">
            Aktif
          </span>
        );
      case "Belum Aktif":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded text-xs font-semibold">
            Belum Aktif
          </span>
        );
      case "Alumni":
        return (
          <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded text-xs font-semibold">
            Alumni
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  // Filter data - akses langsung dari item (BUKAN item.user)
  const filteredData = data.filter((item) => {
    // Validasi struktur data - properties langsung di item
    if (!item || !item.nama) {
      console.warn("Item tidak memiliki nama:", item);
      return false;
    }
    
    // Debug log untuk melihat nilai setiap filter
    console.log("Filtering item:", item.nama);
    console.log("searchTerm:", searchTerm);
    console.log("selectedDate:", selectedDate);
    console.log("selectedDivisi:", selectedDivisi);
    console.log("selectedStatus:", selectedStatus);
    
    const isMatchSearch = searchTerm
      ? (item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    const isMatchDate = selectedDate
      ? item.mulai_magang &&
        new Date(item.mulai_magang).toLocaleDateString() ===
          selectedDate.toLocaleDateString()
      : true;

    const isMatchDivisi = selectedDivisi
      ? item.divisi === selectedDivisi
      : true;

    const currentStatus = getStatusMagang(item.mulai_magang, item.selesai_magang);
    const isMatchStatus = selectedStatus
      ? currentStatus === selectedStatus
      : true;

    console.log("Filter results:", {
      isMatchSearch,
      isMatchDate,
      isMatchDivisi,
      isMatchStatus,
      currentStatus,
      selectedStatus
    });

    return isMatchSearch && isMatchDate && isMatchDivisi && isMatchStatus;
  });

  const handlePhotoClick = (itemId) => {
    if (itemId) {
      window.location.href = `/perusahaan/detail-siswa/${itemId}`;
    }
  };

  console.log("Data yang diterima di table:", data);
  console.log("Data setelah filter:", filteredData);
  console.log("Filter params:", { searchTerm, selectedDate, selectedDivisi, selectedStatus });

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
          <tr>
            <th className="px-3 py-3 text-center font-medium">No</th>
            <th className="px-3 py-3 text-left font-medium">Nama Lengkap</th>
            <th className="px-3 py-3 text-center font-medium">Email</th>
            <th className="px-3 py-3 text-center font-medium">Status Magang</th>
            <th className="px-3 py-3 text-center font-medium">Sekolah</th>
            <th className="px-3 py-3 text-center font-medium">Divisi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              // Validasi ulang untuk memastikan item memiliki nama
              if (!item.nama) {
                console.error("Item tidak memiliki nama:", item);
                return null;
              }
              
              const statusMagang = getStatusMagang(item.mulai_magang, item.selesai_magang);
              
              return (
                <tr
                  key={item.id || index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-3 py-3 text-center">{index + 1}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={getProfilePhoto(item)} 
                        alt={item.nama || "User"}
                        className="w-8 h-8 rounded-full cursor-pointer object-cover"
                        onClick={() => handlePhotoClick(item.id)}
                        onError={(e) => {
                          console.log("Error loading image:", e.target.src);
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <span>{item.nama || "Nama tidak tersedia"}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">{item.email || "-"}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm font-medium">
                      {renderStatusBadge(statusMagang)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">{item.sekolah || "-"}</td>
                  <td className="px-3 py-3 text-center">{item.divisi || "-"}</td>
                </tr>
              );
            }).filter(Boolean) // Hapus item null
          ) : (
            <tr>
              <td colSpan="6" className="px-3 py-6 text-center text-gray-500">
                {data.length === 0 
                  ? "Tidak ada data peserta" 
                  : "Tidak ada data yang sesuai dengan filter"
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}