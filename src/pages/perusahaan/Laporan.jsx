import { useState } from "react";
import { Search, Calendar, ArrowDown, MoreVertical, Image } from "lucide-react";

export default function PendataanPiket() {
  // Data untuk tabel piket (dengan URL bukti yang disematkan)
  const allPiketData = [
    {
      id: 1,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 2 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/assets/img/Cover.png", // Dummy image
    },
    {
      id: 2,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 2 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Izin",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 3,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 2 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Sore",
      waktuInput: "17:30 WIB",
      status: "Tidak Piket",
      buktiLaporan: "/assets/img/Cover.png", // Dummy image
    },
    {
      id: 4,
      nama: "Budi Santoso",
      tanggal: "Selasa, 3 Desember 2024",
      hari: "Selasa",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/assets/img/Cover.png", // Dummy image
    },
    {
      id: 5,
      nama: "Citra Dewi",
      tanggal: "Selasa, 3 Desember 2024",
      hari: "Selasa",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 6,
      nama: "Deni Kurniawan",
      tanggal: "Rabu, 4 Desember 2024",
      hari: "Rabu",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 7,
      nama: "Eka Putri",
      tanggal: "Rabu, 4 Desember 2024",
      hari: "Rabu",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 8,
      nama: "Fajar Ramadhan",
      tanggal: "Kamis, 5 Desember 2024",
      hari: "Kamis",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 9,
      nama: "Gita Puspita",
      tanggal: "Kamis, 5 Desember 2024",
      hari: "Kamis",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Izin",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 10,
      nama: "Hadi Santoso",
      tanggal: "Jumat, 6 Desember 2024",
      hari: "Jumat",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Sore",
      waktuInput: "17:30 WIB",
      status: "Tidak Piket",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 11,
      nama: "Indah Permata",
      tanggal: "Jumat, 6 Desember 2024",
      hari: "Jumat",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 12,
      nama: "Aryo Prayoga",
      tanggal: "Senin, 9 Desember 2024",
      hari: "Senin",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 13,
      nama: "Budi Santoso",
      tanggal: "Selasa, 10 Desember 2024",
      hari: "Selasa",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Sore",
      waktuInput: "17:30 WIB",
      status: "Tidak Piket",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 14,
      nama: "Deni Kurniawan",
      tanggal: "Rabu, 11 Desember 2024",
      hari: "Rabu",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
    {
      id: 15,
      nama: "Eka Putri",
      tanggal: "Kamis, 12 Desember 2024",
      hari: "Kamis",
      kegiatan: "Membersihkan, Merapikan, Mengepel",
      waktuPlan: "Piket Pagi",
      waktuInput: "17:30 WIB",
      status: "Hadir",
      buktiLaporan: "/api/placeholder/80/80", // Dummy image
    },
  ];

  // Filter hari aktif
  const [activeDay, setActiveDay] = useState("Senin");

  // Filter data berdasarkan hari yang dipilih
  const filteredData = allPiketData.filter((item) => item.hari === activeDay);

  // Status badge dengan warna yang sesuai
  const getStatusBadge = (status) => {
    switch (status) {
      case "Hadir":
        return <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs">Hadir</span>;
      case "Izin":
        return <span className="bg-orange-100 text-orange-600 py-1 px-3 rounded-full text-xs">Izin</span>;
      case "Tidak Piket":
        return <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs">Tidak Piket</span>;
      default:
        return null;
    }
  };

  // Preview image modal state
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Function to open image preview
  const openImagePreview = (imageSrc) => {
    setPreviewImage(imageSrc);
    setShowPreview(true);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm max-w-7xl mx-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Pendataan Piket</h1>
              <p className="text-sm text-gray-500">Kelola pendataan dengan lebih fleksibel</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button className="flex items-center gap-2 bg-[#0069AB] text-white px-3 py-2 rounded-lg text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>25 Maret 2025</span>
              </button>
            </div>
          </div>

          {/* Menu bar hari tanpa counter */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
              <button key={day} className={`px-6 py-2 rounded-lg text-sm font-medium ${activeDay === day ? "bg-[#0069AB] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => setActiveDay(day)}>
                {day}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left text-[#667797] text-semibold border-b">
                  <th className="py-3 px-4 font-medium w-12"></th>
                  <th className="py-3 px-4 font-medium">Nama Petugas</th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Hari/Tanggal <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Kegiatan <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Waktu Plan <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Waktu Input <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-1">
                      Status Piket <ArrowDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-medium">Bukti</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-[#667797]">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#667797]">{item.nama}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#667797]">{item.tanggal}</td>
                    <td className="py-3 px-4 text-sm text-[#667797]">
                      {item.kegiatan.split(", ").map((task, idx) => (
                        <div key={idx}>{task}</div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#667797]">{item.waktuPlan}</td>
                    <td className="py-3 px-4 text-sm text-[#667797]">{item.waktuInput}</td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4">
                      {item.status !== "Tidak Piket" ? (
                        <div className="cursor-pointer" onClick={() => openImagePreview(item.buktiLaporan)}>
                          <img src={item.buktiLaporan} alt={`Bukti laporan ${item.nama}`} className="w-10 h-10 rounded object-cover border border-gray-200" />
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <Image className="h-4 w-4 mr-1" />
                          <span className="text-xs">Tidak ada bukti</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Image Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]" onClick={() => setShowPreview(false)}>
              <div className="bg-white p-2 rounded-lg max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end mb-2">
                  <button className="p-1 rounded-full hover:bg-gray-200" onClick={() => setShowPreview(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <img src={previewImage} alt="Preview bukti laporan" className="max-h-96 object-contain" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
