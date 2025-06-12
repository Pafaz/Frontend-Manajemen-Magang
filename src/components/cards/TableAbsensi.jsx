import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

const TableAbsensi = () => {
  const [data, setData] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  console.log(data);
  
  const fetchAbsensi = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/kehadiran`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Mengakses data dari struktur response
      const result = response.data.data;
      
      // Gabungkan data kehadiran dan absensi
      let combinedData = [];
      
      // Proses data kehadiran jika ada
      if (result.kehadiran && Array.isArray(result.kehadiran)) {
        const kehadiranData = Array.isArray(result.kehadiran.data) ? result.kehadiran.data : result.kehadiran;
        
        combinedData = kehadiranData.map(item => ({
          id: item.id,
          tanggal: item.tanggal,
          jam_masuk: item.jam_masuk || "-",
          jam_istirahat: item.jam_istirahat || "-",
          jam_kembali: item.jam_kembali || "-",
          jam_pulang: item.jam_pulang || "-",
          status: item.status_kehadiran === 0 ? "hadir" : "terlambat",
          status_kehadiran: item.status_kehadiran === 0 ? "hadir" : "terlambat"
        }));
      }
      
      // Proses dan tambahkan data absensi jika ada
      if (result.absensi && Array.isArray(result.absensi)) {
        const absensiData = result.absensi.map(item => ({
          id: item.id,
          tanggal: item.tanggal,
          jam_masuk: "-",
          jam_istirahat: "-",
          jam_kembali: "-",
          jam_pulang: "-",
          status: item.status,
          status_kehadiran: item.status
        }));
        
        // Gabungkan dengan data kehadiran
        combinedData = [...combinedData, ...absensiData];
      }
      
      // Urutkan data berdasarkan tanggal (terbaru di atas)
      combinedData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      
      setData(combinedData);
      
      // Set last page berdasarkan jumlah data yang digabungkan
      setLastPage(Math.ceil(combinedData.length / 10) || 1);
      
    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
      setData([]); // Ensure data is always an array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, [page]);

  const handleSort = () => {
    setSortAsc(!sortAsc);
    setData((prevData) =>
      [...prevData].sort((a, b) =>
        sortAsc
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      )
    );
  };

  // Helper function untuk menentukan warna berdasarkan status
  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case "telat":
        return "bg-orange-100 text-orange-600";
      case "hadir":
        return "bg-green-100 text-green-600";
      case "sakit":
        return "bg-red-100 text-red-600";
      case "izin":
        return "bg-blue-100 text-blue-600";
      case "alpha":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };
  
  // Paginate data untuk tampilan saat ini
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Card className="mt-5">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center py-10">Tidak ada data absensi</p>
        ) : (
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-white text-black font-bold text-sm">
              <tr>
                <th className="py-3 px-6">Tanggal</th>
                <th className="py-3 px-6">Masuk</th>
                <th className="py-3 px-6">Istirahat</th>
                <th className="py-3 px-6">Kembali</th>
                <th className="py-3 px-6">Pulang</th>
                <th
                  className="py-3 px-6 text-center cursor-pointer"
                  onClick={handleSort}
                >
                  <div className="flex items-center gap-2">
                    <span className="mr-1">Keterangan</span>
                    <div className="flex flex-col -space-y-1 leading-none">
                      <i
                        className={`bi bi-caret-up-fill text-xs ${
                          sortAsc ? "text-black" : "text-gray-400"
                        }`}
                      />
                      <i
                        className={`bi bi-caret-down-fill text-xs ${
                          !sortAsc ? "text-black" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {paginatedData.map((item) => (
                <tr
                  key={item.id + item.tanggal}
                  className="hover:bg-gray-50 transition-all duration-150 bg-[#F7F6FE]"
                >
                  <td className="py-3 px-6 ">{item.tanggal}</td>
                  <td className="py-3 px-6 ">{item.jam_masuk}</td>
                  <td className="py-3 px-6 ">{item.jam_istirahat}</td>
                  <td className="py-3 px-6 ">{item.jam_kembali}</td>
                  <td className="py-3 px-6 ">{item.jam_pulang}</td>
                  <td className="py-3 px-6 ">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold  ${
                        getStatusClass(item.status)
                      }`}
                    >
                      {item.status_kehadiran}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="flex justify-between items-center px-6 py-4">
        <button
          className="px-4 py-2 font-semibold border rounded-full text-sm text-gray-600 hover:bg-blue-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || data.length === 0}
        >
          ← Previous
        </button>
        <div className="flex items-center space-x-2 text-sm">
          {Array.from({ length: lastPage }, (_, i) => (
            <button
              key={i}
              className={`w-8 h-8 font-semibold rounded-lg border border-slate-400/[0.5] ${
                page === i + 1
                  ? "text-sky-500"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className="px-4 py-2 border rounded-full text-sm text-blue-600 font-semibold hover:bg-blue-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={page === lastPage || data.length === 0}
        >
          Next →
        </button>
      </div>
    </>
  );
};

export default TableAbsensi;