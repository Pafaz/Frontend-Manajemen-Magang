import React from "react";
import { Eye,Download } from "lucide-react";

export default function DataPenerimaan({
  data,
  searchTerm,
  selectedDate,
  selectedJurusan,
}) {
  // Filter data berdasarkan kriteria pencarian
  const filteredData = data.filter((item) => {
    // Filter berdasarkan searchTerm (dalam nama, sekolah, atau jurusan)
    const matchesSearch =
      searchTerm === "" ||
      item.peserta.user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.peserta.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.peserta.jurusan.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter berdasarkan jurusan yang dipilih
    const matchesJurusan =
      selectedJurusan === "" || item.peserta.jurusan === selectedJurusan;

    // Filter berdasarkan tanggal yang dipilih (menyesuaikan untuk tanggal selesai magang)
    const matchesDate =
      !selectedDate ||
      new Date(item.peserta.magang.selesai).toDateString() ===
        selectedDate.toDateString();

    return matchesSearch && matchesJurusan && matchesDate;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sekolah
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jurusan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No. Surat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Selesai Magang
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.id}>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={
                          item.peserta.foto[0]?.path
                            ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                                item.peserta.foto[0].path
                              }`
                            : "/assets/img/default-avatar.png"
                        }
                        alt={item.peserta.user.nama}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-xs font-medium text-gray-900">
                        {item.peserta.user.nama}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-900">
                    {item.peserta.sekolah}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-900">
                        {item.peserta.jurusan.slice(0, 30)}{item.peserta.jurusan.length > 30 && "..."}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-900">
                    {item.no_surat}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm  text-gray-900">
                    {new Date(item.peserta.magang.selesai).toLocaleDateString("id-ID", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    
                    <button
                      onClick={() =>
                        window.open(
                          `${import.meta.env.VITE_API_URL_FILE}/storage/${item.file_path}`,
                          "_blank"
                        )
                      }
                      className="text-[#0069AB] hover:text-blue-800 flex items-center gap-1"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center">
                <div className="text-gray-500">
                  Tidak ada data yang ditemukan
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}