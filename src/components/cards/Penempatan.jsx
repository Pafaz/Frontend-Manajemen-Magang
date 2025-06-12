import React, { useState, useEffect } from 'react';
import { CalendarDays, Search, Download } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GantiModal from "../modal/GantiModal";
import { CSVLink } from "react-csv";
import axios from "axios";

// CustomButton Component untuk digunakan oleh DatePicker
const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
  <button
    className="flex items-center gap-2 bg-white border-gray-200 text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm"
    onClick={onClick}
    ref={ref}
    type="button"
  >
    <CalendarDays size={16} />
    {value
      ? new Date(value).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Pilih Tanggal"}
  </button>
));

export default function Surat() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dataPeserta, setDataPeserta] = useState([]);
  const [loading, setLoading] = useState(true);

  // State modal
  const [isGantiModalOpen, setIsGantiModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const fileUrl = import.meta.env.VITE_API_URL_FILE || apiUrl;
  const token = localStorage.getItem("token");

  // Mengambil data peserta magang dari API
  useEffect(() => {
    const fetchPesertaMagang = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/peserta-by-cabang`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          setDataPeserta(response.data.data);
        } else {
          console.error("Gagal mengambil data peserta:", response.data.message);
        }
      } catch (error) {
        console.error("Error saat fetching data peserta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPesertaMagang();
  }, [apiUrl, token]);

  // Fungsi untuk mengambil foto profil dari array foto
  const getProfilePhoto = (fotoArr) => {
    if (!fotoArr || !Array.isArray(fotoArr)) return "/default-avatar.png";
    
    const profile = fotoArr.find((f) => f && f.type === "profile");
    return profile
      ? `${fileUrl}/storage/${profile.path}`
      : "/default-avatar.png";
  };

  // Fungsi untuk menangani klik pada foto
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setPhotoModalOpen(true);
  };

  // Fungsi untuk membuka modal Ganti
  const handleChange = (item) => {
    setSelectedItem(item);
    setIsGantiModalOpen(true);
  };

  // Fungsi untuk menangani simpan data Ganti
  const handleSimpanGanti = async (formData) => {
    try {
      // Hanya mengirim data divisi yang diubah
      const payload = {
        divisi: formData.divisi
      };
      
      const response = await axios.put(
        `${apiUrl}/peserta/${formData.id}`, 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.status === "success") {
        // Refresh data setelah update berhasil
        const updatedData = dataPeserta.map(item => 
          item.id === formData.id ? {...item, divisi: formData.divisi} : item
        );
        setDataPeserta(updatedData);
        setIsGantiModalOpen(false);
        
        // Tampilkan notifikasi sukses (opsional)
        alert("Divisi berhasil diperbarui!");
      } else {
        console.error("Gagal menyimpan perubahan:", response.data.message);
        alert("Gagal menyimpan perubahan: " + (response.data.message || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    }
  };

  // Filter data berdasarkan pencarian dan tanggal
  const filteredData = dataPeserta.filter((item) => {
    const isMatchSearch =
      (item.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.sekolah?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.divisi?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const isMatchDate = selectedDate
      ? new Date(item.mulai_magang).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return isMatchSearch && isMatchDate;
  });

  // Handler untuk mereset filter tanggal
  const handleResetDate = () => {
    setSelectedDate(null);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header bagian */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1D2939]">Pendataan Admin</h2>
              <p className="text-[#667085] text-xs mt-1">Kelola pendataan dengan lebih fleksibel!</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Tanggal picker dengan tombol reset */}
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  customInput={<CustomButton value={selectedDate} />}
                  dateFormat="dd MMMM yyyy"
                  showPopperArrow={false}
                />
                {selectedDate && (
                  <button 
                    onClick={handleResetDate}
                    className="text-gray-500 hover:text-red-500 text-xs"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              {/* Export CSV */}
              <CSVLink
                data={filteredData}
                filename={`data_peserta_magang_${new Date().toLocaleDateString("id-ID")}.csv`}
                headers={[
                  { label: "Nama", key: "nama" },
                  { label: "Sekolah", key: "sekolah" },
                  { label: "Email", key: "email" },
                  { label: "Divisi", key: "divisi" },
                  { label: "Mulai Magang", key: "mulai_magang" },
                  { label: "Selesai Magang", key: "selesai_magang" },
                ]}
              >
                <button className="flex items-center gap-2 border border-gray-300 text-[#344054] px-4 py-2 rounded-lg text-xs hover:bg-[#0069AB] hover:text-white">
                  <Download size={16} />
                  Export
                </button>
              </CSVLink>
            </div>
          </div>

          <div className="border-b border-gray-200 my-5" />

          {/* Search bar */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari nama, sekolah, email atau divisi..."
                className="pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-lg w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Search size={16} />
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="ml-2">Memuat data...</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-xs">
              <thead className="bg-[#F9FAFB] text-[#667085] border-t border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-center font-medium" style={{ width: '50px' }}>No</th>
                  <th className="px-3 py-3 text-center font-medium" style={{ width: '200px' }}>Foto & Nama Lengkap</th>
                  <th className="px-3 py-3 text-center font-medium">Sekolah</th>
                  <th className="px-3 py-3 text-center font-medium" style={{ width: '120px' }}>Email</th>
                  <th className="px-3 py-3 text-center font-medium" style={{ width: '120px' }}>Divisi</th>
                  <th className="px-3 py-3 text-center font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id || index} className="border-t border-gray-200 hover:bg-gray-50 text-center">
                      <td className="px-3 py-3" style={{ width: '50px' }}>{index + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <img
                            src={getProfilePhoto(item.foto)}
                            alt={item.nama || "Peserta"}
                            className="w-8 h-8 rounded-full cursor-pointer object-cover"
                            onClick={() => handlePhotoClick(getProfilePhoto(item.foto))}
                            onError={(e) => {e.target.src = "/default-avatar.png"}}
                          />
                          <span>{item.nama || "-"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">{item.sekolah || "-"}</td>
                      <td className="px-3 py-3">{item.email || "-"}</td>
                      <td className="px-3 py-3">{item.divisi || "-"}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-center gap-3">                    
                          {/* Tombol Ganti */}
                          <button
                            onClick={() => handleChange(item)}
                            className="text-blue-500 hover:text-blue-700 py-1 px-3 border border-blue-500 rounded-md text-sm hover:bg-blue-50"
                          >
                            Ganti
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
                      Tidak ada data yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal Ganti */}
      <GantiModal
        isOpen={isGantiModalOpen}
        onClose={() => setIsGantiModalOpen(false)}
        onSimpan={handleSimpanGanti}
        data={selectedItem}
      />
      
      {/* Modal Preview Foto */}
      {photoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preview Foto</h3>
              <button 
                onClick={() => setPhotoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center">
              <img 
                src={selectedPhoto} 
                alt="Preview" 
                className="max-h-96 object-contain"
                onError={(e) => {e.target.src = "/default-avatar.png"}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}