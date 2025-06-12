import React from "react";
import { Eye, Download, Trash } from "lucide-react";

export default function DataPeringatan({ data, searchTerm, selectedDate, onBuatSurat }) {
  // Filter data berdasarkan kriteria pencarian
  const filteredData = data.filter((item) => {
    // Filter berdasarkan searchTerm (dalam nama, sekolah, atau keterangan SP)
    const matchesSearch =
      searchTerm === "" ||
      item.peserta.user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.peserta.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.keterangan_surat && item.keterangan_surat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.alasan && item.alasan.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter berdasarkan tanggal yang dipilih
    const matchesDate = !selectedDate || new Date(item.created_at).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesDate;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sekolah</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status SP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={item.peserta.foto[0]?.path ? `${import.meta.env.VITE_API_URL_FILE}/storage/${item.peserta.foto[0].path}` : "/assets/img/default-avatar.png"} alt={item.peserta.user.nama} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.peserta.user.nama}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.peserta.sekolah}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.alasan}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`w-2/3 py-0.5 rounded-full text-xs font-medium text-center
                    ${item.keterangan_surat === "SP1" ? "bg-green-100 text-green-800" : item.keterangan_surat === "SP2" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                  >
                    {item.keterangan_surat}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button onClick={() => window.open(`${import.meta.env.VITE_API_URL_FILE}/storage/${item.file_path}`, "_blank")} className="text-[#0069AB] hover:text-blue-800 flex items-center gap-1">
                      <Download size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center">
                <div className="text-gray-500">Tidak ada data yang ditemukan</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
